import {React, useState} from 'react';
import { Text, View, ImageBackground, TextInput, Button, KeyboardAvoidingView, Platform} from 'react-native';
import AppStyles from '../styles/AppStyles';
import InlineTextButton from '../components/InlineTextButton';
import { auth } from '../../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

export default function ResetPassword({navigation}) {
  const backgroundImg = require('../assets/background.png')

  let [email, setEmail] = useState('')
  let [validationMessage, setValidationMessage] = useState('')

  let resetPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        navigation.popToTop()
      })
      .catch((error) => {
        setValidationMessage(error.message)
      });
  }

  return (
    <ImageBackground style={AppStyles.imageContainer} source={backgroundImg}>
      <KeyboardAvoidingView style={AppStyles.backgroundCover} behavior={Platform.OS === "ios" ? "padding" : null}
      keyboardVerticalOffset={60}>
        <Text style={[AppStyles.lightText, AppStyles.header]}>Reset Password</Text>
        <Text style={AppStyles.validationError}>{validationMessage}</Text>

        <TextInput style={[AppStyles.textInput, AppStyles.lightText, AppStyles.lightTextInput]} 
        placeholder='Email'
        placeholderTextColor='#BEBEBE'
        value={email}
        onChangeText={setEmail}/>

        <View style={[AppStyles.rowContainer, AppStyles.mb]}>
          <Text style={AppStyles.lightText}>Don't have an account? </Text>
          <InlineTextButton text="Sign up" onPress={() => navigation.navigate('SignUp')} color='#9FBBCC'/>
        </View>

        <Button title='Reset' onPress={resetPassword} color='#9FBBCC'/>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
