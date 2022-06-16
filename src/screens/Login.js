import {React, useState} from 'react';
import { Text, View, ImageBackground, TextInput, Button, KeyboardAvoidingView, Platform} from 'react-native';
import AppStyles from '../styles/AppStyles';
import InlineTextButton from '../components/InlineTextButton';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

export default function Login({navigation}) {
  const backgroundImg = require('../assets/background.png')

  if(auth.currentUser){
    navigation.navigate('Main')
  } else {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigation.navigate('Main')
      }
    });
  }

  let [validationMessage, setValidationMessage] = useState('')
  let [email, setEmail] = useState('')
  let [password, setPassword] = useState('')

  let login = () => {
    if(email !== '' && password !== ''){
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                setValidationMessage('')
                setEmail('')
                setPassword('')
            })
            .catch((error) => {
                setValidationMessage(error.message)
            });
    } else {
        setValidationMessage('Please enter an email and password')
    }
  } 

  return (
    <ImageBackground style={AppStyles.imageContainer} source={backgroundImg}>
      <KeyboardAvoidingView style={AppStyles.backgroundCover} behavior={Platform.OS === "ios" ? "padding" : null}
      keyboardVerticalOffset={60}>
        <Text style={[AppStyles.lightText, AppStyles.header]}>Login</Text>
        <Text style={AppStyles.validationError}>{validationMessage}</Text>
        <TextInput style={[AppStyles.textInput, AppStyles.lightText, AppStyles.lightTextInput]} 
        placeholder='Email'
        placeholderTextColor='#BEBEBE'
        value={email}
        onChangeText={setEmail}/>

        <TextInput style={[AppStyles.textInput, AppStyles.lightText, AppStyles.lightTextInput]}
        placeholder='Password' 
        placeholderTextColor='#BEBEBE' 
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}/>
        <View style={[AppStyles.rowContainer, AppStyles.mb]}>
          <Text style={AppStyles.lightText}>Don't have an account? </Text>
          <InlineTextButton text="Sign up" onPress={() => navigation.navigate('SignUp')} color='#9FBBCC'/>
        </View>
        <View style={[AppStyles.rowContainer, AppStyles.mb]}>
          <Text style={AppStyles.lightText}>Fogot your password? </Text>
          <InlineTextButton text="Reset" onPress={() => navigation.navigate('ResetPassword')} color='#9FBBCC'/>
        </View>
        <Button title='Login' onPress={login} color='#9FBBCC'/>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
