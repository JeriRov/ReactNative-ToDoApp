import React, { useState } from 'react'
import { ImageBackground, TextInput, KeyboardAvoidingView } from 'react-native'
import LoginStyles from './login.styles'
import InlineTextButton from '../../components/InlineTextButton/InlineTextButton'
import { auth } from '../../../firebase'
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import { Modal, Text, Button, Spinner, View } from 'native-base'
import { Feather } from '@expo/vector-icons'

export default function Login({ navigation }: any) {
  const backgroundImg = require('../../assets/background.png')
  const [showModal, setShowModal] = useState(false)

  if (auth.currentUser) {
    navigation.navigate('Main')
  } else {
    onAuthStateChanged(auth, user => {
      if (user) {
        navigation.navigate('Main', { user: user })
        setShowModal(false)
      }
    })
  }
  let [validationMessage, setValidationMessage] = useState('')
  let [email, setEmail] = useState('')
  let [password, setPassword] = useState('')

  let login = () => {
    setShowModal(true)
    if (email !== '' && password !== '') {
      signInWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
          setValidationMessage('')
          setEmail('')
          setPassword('')
        })
        .catch(error => {
          setShowModal(false)
          setValidationMessage(error.message)
        })
    } else {
      setShowModal(false)
      setValidationMessage('Please enter an email and password')
    }
  }

  return (
    <ImageBackground style={LoginStyles.imageContainer} source={backgroundImg}>
      <KeyboardAvoidingView
        style={LoginStyles.backgroundCover}
        keyboardVerticalOffset={60}
      >
        <Text style={[LoginStyles.lightText, LoginStyles.header]}>Login</Text>
        <Text style={LoginStyles.validationError}>{validationMessage}</Text>
        <TextInput
          style={[
            LoginStyles.textInput,
            LoginStyles.lightText,
            LoginStyles.lightTextInput
          ]}
          placeholder="Email"
          placeholderTextColor="#BEBEBE"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={[
            LoginStyles.textInput,
            LoginStyles.lightText,
            LoginStyles.lightTextInput
          ]}
          placeholder="Password"
          placeholderTextColor="#BEBEBE"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
        <View style={[LoginStyles.rowContainer, LoginStyles.mb]}>
          <Text style={LoginStyles.lightText}>Don't have an account? </Text>
          <InlineTextButton
            text="Sign up"
            onPress={() => navigation.navigate('SignUp')}
            color="#9FBBCC"
          />
        </View>
        <View style={[LoginStyles.rowContainer, LoginStyles.mb]}>
          <Text style={LoginStyles.lightText}>Fogot your password? </Text>
          <InlineTextButton
            text="Reset"
            onPress={() => navigation.navigate('ResetPassword')}
            color="#9FBBCC"
          />
        </View>
        <Button onPress={login}>
          <Text color="white">LOGIN</Text>
        </Button>
        <Modal
          animationPreset="fade"
          w="full"
          isOpen={showModal}
          _backdrop="red"
        >
          <View justifyContent="center" alignItems="center">
            <Spinner size={'lg'} />
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </ImageBackground>
  )
}
