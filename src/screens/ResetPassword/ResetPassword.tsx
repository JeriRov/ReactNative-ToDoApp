import React, { useState } from 'react'
import { ImageBackground, TextInput, KeyboardAvoidingView } from 'react-native'
import RessetPasswordStyles from './resetPassword.styles'
import InlineTextButton from '../../components/InlineTextButton/InlineTextButton'
import { auth } from '../../../firebase'
import { sendPasswordResetEmail } from 'firebase/auth'
import { Modal, Text, Button, Spinner, View } from 'native-base'
export default function ResetPassword({ navigation }: any) {
  const backgroundImg = require('../../assets/background.png')

  let [email, setEmail] = useState('')
  let [validationMessage, setValidationMessage] = useState('')
  const [showModal, setShowModal] = useState(false)

  let resetPassword = () => {
    setShowModal(true)
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setEmail('')
        setValidationMessage('')
        navigation.navigate('Login')
        setShowModal(false)
      })
      .catch(error => {
        setShowModal(false)
        setValidationMessage(error.message)
      })
  }

  return (
    <ImageBackground style={RessetPasswordStyles.imageContainer} source={backgroundImg}>
      <KeyboardAvoidingView
        style={RessetPasswordStyles.backgroundCover}
        keyboardVerticalOffset={60}
      >
        <Text style={[RessetPasswordStyles.lightText, RessetPasswordStyles.header]}>
          Reset Password
        </Text>
        <Text style={RessetPasswordStyles.validationError}>{validationMessage}</Text>

        <TextInput
          style={[
            RessetPasswordStyles.textInput,
            RessetPasswordStyles.lightText,
            RessetPasswordStyles.lightTextInput
          ]}
          placeholder="Email"
          placeholderTextColor="#BEBEBE"
          value={email}
          onChangeText={setEmail}
        />

        <View style={[RessetPasswordStyles.rowContainer, RessetPasswordStyles.mb]}>
          <Text style={RessetPasswordStyles.lightText}>Don't have an account? </Text>
          <InlineTextButton
            text="Sign up"
            onPress={() => navigation.navigate('SignUp')}
            color="#9FBBCC"
          />
        </View>

        <Button onPress={resetPassword} color="#9FBBCC">
          RESET
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
