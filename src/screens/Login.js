import React, { useState, useEffect, useContext } from 'react'
import * as WebBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { StatusBar } from 'expo-status-bar'
import { ActivityIndicator, Text, View } from 'react-native'
import { BASE_URL } from '../config'

//Formik
import { Formik } from 'formik'

//Colors and Styles
const { darkLight, primary } = Colors

import {
  StyledContainer,
  InnerContainer,
  StyledFormArea,
  StyledInputLabel,
  StyledTextInput,
  StyledButton,
  ButtonText,
  Colors,
  MsgBox,
  Line,
} from '../components/styles'

//Google
WebBrowser.maybeCompleteAuthSession()

//Main Function
const Login = ({ navigation }) => {
  const [message, setMessage] = useState()
  const [messageType, setMessageType] = useState()
  const [googleSubmitting, setGoogleSubmitting] = useState(false)

  //Beto Google Signin
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId:
      '811337509251-0jandrvqj0vml275j6gskdbmubacfss3.apps.googleusercontent.com',
    androidClientId:
      '811337509251-j72j6pgj5859fa66b06vmgv7br2u2jqf.apps.googleusercontent.com',
    prompt: 'select_account',
  })

  const handleMessage = (message, type = 'FAILED') => {
    setMessage(message)
    setMessageType(type)
  }

  //GoogleSign in
  const handleGoogleSignIn = async () => {
    setGoogleSubmitting(true)
    try {
      const result = await promptAsync()
      if (result.type === 'success') {
        const response = await axios.get(
          'https://www.googleapis.com/userinfo/v2/me',
          {
            headers: {
              Authorization: `Bearer ${result.authentication.accessToken}`,
            },
          },
        )
        const user = response.data

        if (user === null) {
          handleMessage('No data, Please Try Again', 'Fails')
        } else {
          handleMessage('Loading', 'SUCCESS')

          fetch(`${BASE_URL}/api/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: user.name,
              email: user.email,
              google_id: user.id,
              avatar: user.picture,
            }),
          })
            .then((response) => {
              if (response.status === 200) {
                response.json().then((data) => {
                  setGoogleSubmitting(false)
                  handleMessage('User created successfully', 'SUCCESS')
                  setTimeout(
                    () => navigation.navigate('Welcome', { data }),
                    1000,
                  )
                })
              } else if (response.status === 409) {
                response.json().then((data) => {
                  setGoogleSubmitting(false)
                  handleMessage(
                    'User already registered with this google_id',
                    'ERROR',
                  )
                  setTimeout(
                    () => navigation.navigate('Welcome', { data }),
                    1000,
                  )
                })
              }
            })
            .catch((error) => {
              console.error('Error:', error)
              handleMessage('An error occured')
            })
        }
      } else if (result.type === 'cancel') {
        handleMessage('Google signin was cancelled')
        setGoogleSubmitting(false)
      } else {
        handleMessage(
          `An error occured: ${result.errorCode} - ${result.errorMessage}`,
        )
        setGoogleSubmitting(false)
      }
    } catch (error) {
      console.log(error)
      handleMessage('An error occured')
      setGoogleSubmitting(false)
    }
  }

  const handleLogin = (email, password) => {
    axios
      .post(`${BASE_URL}/api/login`, {
        email,
        password,
      })
      .then((res) => {
        let data = res.data
        AsyncStorage.setItem('data', JSON.stringify(data))

        navigation.navigate('Welcome', { data })
      })
      .catch((e) => {
        console.log(`login error ${e}`)
      })
  }

  return (
    <StyledContainer>
      <InnerContainer>
        <Text>Open up App.js to start working on your app!</Text>
        <StatusBar style="auto" />

        <Formik
          initialValues={{ email: '', password: '' }}
          onSubmit={(values) => {
            handleLogin(values.email, values.password)
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <StyledFormArea>
              <MyTestInput
                label="Email Address"
                placeholder="horu@gmail.com"
                placeholderTextColor={darkLight}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                keyboardType="email-address"
              />

              <MyTestInput
                label="Password"
                placeholder=" * * * * * *"
                placeholderTextColor={darkLight}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                secureTextEntry={true}
              />
              <MsgBox type={messageType}>{message}</MsgBox>
              <StyledButton onPress={handleSubmit}>
                <ButtonText>Login</ButtonText>
              </StyledButton>
              <Line />

              {!googleSubmitting && (
                <StyledButton google={true} onPress={handleGoogleSignIn}>
                  <ButtonText google={true}>Sign in with Google</ButtonText>
                </StyledButton>
              )}

              {googleSubmitting && (
                <StyledButton google={true} disabled={true}>
                  <ActivityIndicator
                    size="large"
                    color={primary}
                  ></ActivityIndicator>
                </StyledButton>
              )}
            </StyledFormArea>
          )}
        </Formik>
      </InnerContainer>
    </StyledContainer>
  )
}

const MyTestInput = ({ label, ...props }) => {
  return (
    <View>
      <StyledInputLabel>{label}</StyledInputLabel>
      <StyledTextInput {...props}></StyledTextInput>
    </View>
  )
}

export default Login
