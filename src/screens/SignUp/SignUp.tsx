import React, { useState } from 'react'
import { ImageBackground, TextInput, KeyboardAvoidingView } from 'react-native'
import SignUpStyles from './signUp.styles'
import InlineTextButton from '../../components/InlineTextButton/InlineTextButton'
import { auth, db } from '../../../firebase'
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { Modal, Text, Button, Spinner, View } from 'native-base'

export default function SignUp({ navigation }: any) {
  const backgroundImg = require('../../assets/background.png')
  let [email, setEmail] = useState('')
  let [username, setUsername] = useState('')
  let [password, setPassword] = useState('')
  let [confirmPassword, setConfirmPassword] = useState('')
  let [validationMessage, setValidationMessage] = useState('')
  const [showModal, setShowModal] = useState(false)

  let validateAndSet = (
    value: string,
    valueToCompare: string,
    setValue: Function
  ) => {
    if (value !== valueToCompare) {
      setValidationMessage('Password do not match!')
    } else {
      setValidationMessage('')
    }
    setValue(value)
  }

  let saveUsername = async () => {
    let user = {
      id: '',
      theme: 'light',
      username: username,
      userId: auth.currentUser!.uid
    }
    const docRef = await addDoc(collection(db, 'user'), user)
    const userRef = doc(db, 'user', docRef.id)
    user.id = userRef.id
    await updateDoc(userRef, {
      id: user.id
    })
    console.log('USER OOOID: ', user.id)
  }

  let signUp = () => {
    if (password === confirmPassword) {
      setShowModal(true)
      createUserWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
          saveUsername()
          setUsername('')
          setEmail('')
          setPassword('')
          setConfirmPassword('')
          navigation.navigate('Main', { user: userCredential.user })
          setShowModal(false)
        })
        .catch(error => {
          setShowModal(false)
          setValidationMessage(error.message)
        })
    }
  }

  return (
    <ImageBackground style={SignUpStyles.imageContainer} source={backgroundImg}>
      <KeyboardAvoidingView
        style={SignUpStyles.backgroundCover}
        keyboardVerticalOffset={60}
      >
        <Text style={[SignUpStyles.lightText, SignUpStyles.header]}>
          Sign Up
        </Text>
        <Text style={[SignUpStyles.validationError]}>{validationMessage}</Text>

        <TextInput
          style={[
            SignUpStyles.textInput,
            SignUpStyles.lightText,
            SignUpStyles.lightTextInput
          ]}
          placeholder="Email"
          placeholderTextColor="#BEBEBE"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={[
            SignUpStyles.textInput,
            SignUpStyles.lightText,
            SignUpStyles.lightTextInput
          ]}
          placeholder="Username"
          placeholderTextColor="#BEBEBE"
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          style={[
            SignUpStyles.textInput,
            SignUpStyles.lightText,
            SignUpStyles.lightTextInput
          ]}
          placeholder="Password"
          placeholderTextColor="#BEBEBE"
          secureTextEntry={true}
          value={password}
          onChangeText={value =>
            validateAndSet(value, confirmPassword, setPassword)
          }
        />

        <TextInput
          style={[
            SignUpStyles.textInput,
            SignUpStyles.lightText,
            SignUpStyles.lightTextInput
          ]}
          placeholder="Confirm Password"
          placeholderTextColor="#BEBEBE"
          secureTextEntry={true}
          value={confirmPassword}
          onChangeText={value =>
            validateAndSet(value, password, setConfirmPassword)
          }
        />

        <View style={[SignUpStyles.rowContainer, SignUpStyles.mb]}>
          <Text style={SignUpStyles.lightText}>Already have an account? </Text>
          <InlineTextButton
            text="Login"
            onPress={() => navigation.navigate('Login')}
            color="#9FBBCC"
          />
        </View>

        <Button onPress={signUp}>
          <Text color={'white'}>SIGN UP</Text>
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
