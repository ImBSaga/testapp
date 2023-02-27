import React, { useState, useEffect } from 'react'
import { BASE_URL } from '../config'
import { StackActions } from '@react-navigation/native'

import { StatusBar } from 'expo-status-bar'
import {
  Text,
  View,
  Image,
  Button,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import * as Location from 'expo-location'
import DateTimePicker from '@react-native-community/datetimepicker'
import PickerSelect from 'react-native-picker-select'
import axios from 'axios'

import {
  StyledContainer,
  InnerContainer,
  StyledFormArea,
  StyledButton,
  ButtonText,
  MsgBox,
  Line,
  Avatar,
} from '../components/styles'

//   const access_tokenGoogle = route.params.data.token
//   const token = access_token ? access_token : access_tokenGoogle
//Main Function
const ProfileEdit = ({ route, navigation }) => {
  const [avatar, setAvatar] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [address, setAddress] = useState('')
  const [nik, setNik] = useState('')
  const [location, setLocation] = useState(null)
  const [date, setDate] = useState(new Date())
  const [show, setShow] = useState(false)
  const [textDate, setTextDate] = useState('')
  const [gender, setGender] = useState('')

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
  const userDetailId = userDetailData.id

  const access_token = route.params.data.access_token

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
    if (userDetailData && !phoneNumber) {
      setPhoneNumber(userDetailData.phone)
    }
    if (userDetailData && !address) {
      setAddress(userDetailData.address)
    }
    if (userDetailData && !nik) {
      setNik(userDetailData.nik)
    }
    if (userDetailData && !gender) {
      setGender(userDetailData.jk)
    }

    if (userDetailData && !textDate) {
      setTextDate(userDetailData.dob)
    }
  }, [userDetailData, avatar])

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date
    setShow(Platform.OS === 'ios')
    setDate(currentDate)

    let tempDate = new Date(currentDate)
    let fDate =
      tempDate.getFullYear() +
      '-' +
      (tempDate.getMonth() + 1) +
      '-' +
      tempDate.getDate()
    setTextDate(fDate)
  }

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status === 'granted') {
        const coordinates = await Location.getCurrentPositionAsync()
        setLocation(coordinates)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (status === 'granted') {
      try {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        })
        if (!result.didCancel) {
          setAvatar(result.assets[0].uri)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  const handleSubmit = () => {
    if (!phoneNumber) {
      Alert.alert('Phone number is required')
      return
    }
    if (!address) {
      Alert.alert('Address is required')
      return
    }
    if (!nik) {
      Alert.alert('NIK is required')
      return
    }
    if (!location) {
      Alert.alert(
        'Location is required, please press the "Get Current Location" button',
      )
      return
    }
    if (!date) {
      Alert.alert('Date of birth is required')
      return
    }
    if (!gender) {
      Alert.alert('Gender is required')
      return
    }

    const lat = location.coords.latitude
    const long = location.coords.longitude
    const ymd =
      date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()

    const config = {
      headers: { Authorization: `Bearer ${access_token}` },
    }

    axios
      .put(
        `${BASE_URL}/api/profiles/${userDetailId}`,
        {
          avatar: avatar,
          phone: phoneNumber,
          address: address,
          users_id: userId,
          lat: lat,
          long: long,
          dob: ymd,
          nik: nik,
          jk: gender,
        },
        config,
      )
      .then((response) => {
        if (response.status === 200) {
          Alert.alert(
            'Profile Updated successfully',
            ' Updated ',
            [
              {
                text: 'OK',
                onPress: () => {
                  navigation.reset({
                    index: 1,
                    routes: [
                      {
                        name: 'Welcome',
                        params: { data },
                      },
                    ],
                  })
                },
              },
            ],
            { cancelable: false },
          )
        }
      })
      .catch((error) => {
        console.error('Error:' + error)
        Alert.alert(
          'Network Request Failed',
          'There was an error connecting to the server. Please try again later.',
          [{ text: 'OK' }],
          { cancelable: false },
        )
      })
  }

  return (
    <StyledContainer>
      <InnerContainer>
        <StyledFormArea>
          {userDetailData ? (
            <>
              <Text>Open up App.js to start working on your app!</Text>
              <StatusBar style="auto" />
              <Text>Pick Image</Text>
              <TouchableOpacity onPress={pickImage}>
                <Avatar source={AvatarImg}></Avatar>
              </TouchableOpacity>
              <View>
                <TextInput
                  placeholder="Phone Number"
                  keyboardType="number-pad"
                  onChangeText={(text) => setPhoneNumber(text)}
                  value={phoneNumber}
                />
                <TextInput
                  placeholder="Address"
                  onChangeText={(text) => setAddress(text)}
                  value={address}
                />
                <TextInput
                  placeholder="NIK"
                  keyboardType="number-pad"
                  onChangeText={(text) => setNik(text)}
                  value={nik}
                />
              </View>
              <View>
                <Button title="Get Current Location" onPress={getLocation} />
                {location && (
                  <View>
                    <Text>Latitude</Text>
                    <TextInput
                      placeholder="Latitude, Longitude"
                      value={`${location.coords.latitude}`}
                      editable={false}
                    />
                  </View>
                )}
                {location && (
                  <View>
                    <Text>Longitude</Text>
                    <TextInput
                      placeholder="Latitude, Longitude"
                      value={`${location.coords.longitude}`}
                      editable={false}
                    />
                  </View>
                )}

                <TouchableOpacity onPress={() => setShow(true)}>
                  <Text>Date of Birth</Text>
                </TouchableOpacity>
                {show && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    onChange={onChange}
                  />
                )}

                <View>
                  <Text>{textDate}</Text>
                </View>

                <View>
                  <Text>Gender: </Text>
                  <PickerSelect
                    value={gender}
                    onValueChange={(value) => setGender(value)}
                    items={[
                      { label: 'M', value: 'M' },
                      { label: 'F', value: 'F' },
                      { label: 'N', value: 'N' },
                    ]}
                  />
                </View>
              </View>
              <StyledButton onPress={handleSubmit}>
                <ButtonText>Update</ButtonText>
              </StyledButton>
            </>
          ) : (
            <ActivityIndicator />
          )}
        </StyledFormArea>
      </InnerContainer>
    </StyledContainer>
  )
}

export default ProfileEdit
