import React, { useEffect, useState } from 'react'
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native'
import { BASE_URL } from '../config'
import axios from 'axios'

import {
  StyledFormArea,
  MsgBox,
  Line,
  Avatar,
  StyledButton,
  ButtonText,
} from '../components/styles'

const UserDetail = ({ route, navigation }) => {
  //Data
  const data = route.params.data

  //UserData is User
  const [userData, setUserData] = useState('')
  const [userDataGoogle, setUserDataGoogle] = useState('')

  //UserData Id
  const userDataId = userData.id
  const userDataGoogleId = userDataGoogle.id
  const userId = userDataId ? userDataId : userDataGoogleId

  //UserDetailData is Profile
  const [userDetail, setUserDetail] = useState('')
  const [userDetailGoogle, setUserDetailGoogle] = useState('')
  const userDetailData = userDetail ? userDetail : userDetailGoogle

  const access_token = route.params.data.access_token

  const [avatar, setAvatar] = useState('')
  const AvatarImg = avatar ? { uri: avatar } : require('./../assets/icon.png')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/user`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        })
        setUserData(response.data)
      } catch {
        const response = route.params.data.user
        setUserDataGoogle(response)
      }
    }
    fetchData()

    if (userId) {
      const fetchUserDetail = async () => {
        try {
          const response = await axios.get(
            `${BASE_URL}/api/profiles/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${access_token}`,
              },
            },
          )
          setUserDetail(response.data)
        } catch (e) {
          console.log(e)
        }
      }
      fetchUserDetail()
      setAvatar(userDetailData.avatar)
    }
  }, [access_token, userId])

  useEffect(() => {
    if (userDetailData && !avatar) {
      setAvatar(userDetailData.avatar)
    }
  }, [userDetailData, avatar])

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        {userDetailData ? (
          <>
            <Text> Phones: {userDetailData.phone} </Text>
            <Text> Address: {userDetailData.address} </Text>
            <Text> Date of Birth: {userDetailData.dob} </Text>
            <Text> Nik: {userDetailData.nik} </Text>
            <Text> Jenis Kelamin: {userDetailData.jk} </Text>
            <StyledFormArea>
              <Avatar source={AvatarImg}></Avatar>
              <MsgBox>. . .</MsgBox>
              <Line />
            </StyledFormArea>

            <StyledButton
              onPress={() => {
                navigation.navigate('ProfileEdit', { data })
              }}
            >
              <ButtonText>Edit</ButtonText>
            </StyledButton>
          </>
        ) : (
          <ActivityIndicator />
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default UserDetail
