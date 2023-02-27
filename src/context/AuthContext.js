import React, { createContext, useState } from 'react'
import axios from 'axios'
import { BASE_URL } from '../config'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  //Create Data?
  const [userInfo, setUserInfo] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  //Create Function
  const register = (name, email, password) => {
    axios
      .post(`${BASE_URL}/register`, {
        name,
        email,
        password,
      })
      .then((res) => {
        let userInfo = res.data
        setUserInfo(userInfo)
        AsyncStorage.setItem('userInfo', JSON.stringify(userInfo))
        console.log(userInfo)
      })
      .catch((e) => {
        console.log(`register error ${e}`)
      })
  }

  const login = (email, password) => {
    axios
      .post(`${BASE_URL}/api/login`, {
        email,
        password,
      })
      .then((res) => {
        let userInfo = res.data
        setUserInfo(userInfo)
        AsyncStorage.setItem('userInfo', JSON.stringify(userInfo))
      })
      .catch((e) => {
        console.log(`login error ${e}`)
      })
  }

  //Call Function
  return (
    <AuthContext.Provider value={{ register, login, isLoading, userInfo }}>
      {children}
    </AuthContext.Provider>
  )
}
