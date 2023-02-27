import React, { useState } from 'react'
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native'
import * as Location from 'expo-location'
import MapView, { Callout, Marker } from 'react-native-maps'

export default function MapScreen() {
  const [location, setLocation] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [markerCoord, setMarkerCoord] = useState(null)

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync()
    if (status === 'granted') {
      try {
        let location = await Location.getCurrentPositionAsync({})
        setLocation(location)
        setMarkerCoord({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        })
      } catch (error) {
        setErrorMessage(error)
      }
    } else {
      Alert.alert(
        'Permission to access location was denied',
        'Please go to settings and grant permission to access location services',
        [{ text: 'OK' }],
        { cancelable: false },
      )
    }
  }

  const closeMap = () => {
    const test = location
    setLocation(null)
    console.log(test)
  }

  return (
    <View style={styles.container}>
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
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '90%',
  },
})
