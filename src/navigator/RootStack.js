import React, { useState } from 'react'
import { NavigationContainer, StackActions } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Login from '../screens/Login'
import Welcome from '../screens/Welcome'
import Template from '../screens/Template'
import Charts from '../screens/Charts'
import UserDetail from '../screens/UserDetail'
import ProfileEdit from '../screens/ProfileEdit'

const Stack = createNativeStackNavigator()

const RootStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" backBehavior="initialRoute">
        <Stack.Screen name="Login" component={Login}></Stack.Screen>
        <Stack.Screen name="Welcome" component={Welcome}></Stack.Screen>
        <Stack.Screen name="Template" component={Template}></Stack.Screen>
        <Stack.Screen name="Charts" component={Charts}></Stack.Screen>
        <Stack.Screen name="UserDetail" component={UserDetail}></Stack.Screen>
        <Stack.Screen name="ProfileEdit" component={ProfileEdit}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default RootStack
