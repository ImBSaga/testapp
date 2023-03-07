import React, { useState, useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  ActivityIndicator,
} from 'react-native'
import {
  StyledFormArea,
  StyledButton,
  ButtonText,
  MsgBox,
  Line,
  Avatar,
} from '../components/styles'
import { BASE_URL } from '../config'
import axios from 'axios'
import * as ImagePicker from 'expo-image-picker'

//Maps
import * as Location from 'expo-location'
import MapView, { Marker } from 'react-native-maps'

const Welcome = ({ route, navigation }) => {
  //Maps
  const [location, setLocation] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [markerCoord, setMarkerCoord] = useState(null)

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
        const {
          status,
        } = await ImagePicker.requestMediaLibraryPermissionsAsync()
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

  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status === 'granted') {
        let location = await Location.getCurrentPositionAsync({})
        setLocation(location)

        // //Getting Address
        // let address = await Location.reverseGeocodeAsync(location.coords)
        // console.log(address)
        setMarkerCoord({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        })
      } else {
        Alert.alert(
          'Permission to access location was denied',
          'Please go to settings and grant permission to access location services',
          [{ text: 'OK' }],
          { cancelable: false },
        )
      }
    } catch (error) {
      setErrorMessage(error)
    }
  }

  const closeMap = () => {
    const test = location
    setLocation(null)
    console.log(test)
  }

  const handleLogOut = async () => {
    navigation.navigate('Login')
  }

  return (
    <View style={styles.container}>
      {userDetailData ? (
        <>
          {!location && (
            <View style={styles.container}>
              <Text> You are Logged in !</Text>
              <StatusBar style="auto" />

              <StyledFormArea>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('UserDetail', { data })
                  }}
                >
                  <Avatar source={AvatarImg}></Avatar>
                </TouchableOpacity>

                <MsgBox>. . .</MsgBox>
                <StyledButton onPress={handleLogOut}>
                  <ButtonText>Log out</ButtonText>
                </StyledButton>

                <StyledButton
                  onPress={() => {
                    navigation.navigate('Template', { data })
                  }}
                >
                  <ButtonText>Template</ButtonText>
                </StyledButton>
                <Line />
              </StyledFormArea>
            </View>
          )}

          {/* Maps */}
          <Button title="Get Current Location" onPress={getCurrentLocation} />
          {location && (
            <TouchableOpacity onPress={closeMap}>
              <Text>Return</Text>
            </TouchableOpacity>
          )}
          {location && (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              onPress={(e) => setMarkerCoord(e.nativeEvent.coordinate)}
            >
              {markerCoord && (
                <Marker
                  coordinate={markerCoord}
                  title="Current Location"
                  description="This is your current location"
                />
              )}
            </MapView>
          )}
          {errorMessage && <Text>Error: {errorMessage.toString()}</Text>}
        </>
      ) : (
        <ActivityIndicator />
      )}
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
  map: {
    width: '100%',
    height: '90%',
  },
})

export default Welcome
