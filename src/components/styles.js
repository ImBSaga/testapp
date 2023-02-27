import styled from 'styled-components'
import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native'

export const Colors = {
  primary: '#ffffff',
  secondary: '#E5E7EB',
  tertiary: '#1F2937',
  brand: '#6D28D9',
  darkLight: '#9CA3AF',
  green: '#32CD32',
}

const { primary, secondary, tertiary, brand, darkLight, green } = Colors

export const StyledContainer = styled.View`
  flex: 1;
  padding: 25px;
  background-color: ${primary};
`
export const InnerContainer = styled.View`
  flex: 1;
  width: 100%;
  align-items: center;
`

export const StyledFormArea = styled.View`
  width: 90%;
`

export const StyledTextInput = styled.TextInput`
  background-color: ${secondary};
  padding: 15px;
  padding-left: 55px;
  padding-right: 55px;
  border-radius: 5px;
  font-size: 16px;
  height: 60px;
  margin-vertical: 3px;
  margin-bottom: 10px;
  color: ${tertiary};
`

export const StyledInputLabel = styled.Text`
  color: ${tertiary};
  font-size: 13px;
  text-align: left;
`

export const StyledButton = styled.TouchableOpacity`
  padding: 15px;
  background-color: ${brand};
  justify-content: center;
  border-radius: 5px;
  align-items: center;
  margin-vertical: 5px;
  height: 60px;

  ${(props) =>
    props.google == true &&
    `
    background-color: ${green};
    flex-direction: row;
    justify-context: center;
  `};
`
export const ButtonText = styled.Text`
  color: ${primary};
  font-size: 16px;
`
export const MsgBox = styled.Text`
  text-align: center;
  font-size: 13px;
`

export const Line = styled.View`
  height: 1px;
  width: 100%;
  background-color: ${darkLight};
  margin-vertical: 10px;
`
export const WeclomeContainer = styled(InnerContainer)`
  padding: 25px;
  padding-top: 10px;
  justify-content: center;
`
export const Avatar = styled.Image`
  width: 100px;
  height: 100px;
  margin: auto;
  border-radius: 50px;
  border-width: 2px;
  border-color: ${secondary};
  margin-bottom: 10px;
  margin-top: 10px;
`

export const WelcomeImage = styled.Image`
  height: 50%;
  min-width: 100%;
`
