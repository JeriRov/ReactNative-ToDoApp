import React, {useState} from 'react';
import { Text, View, ImageBackground, TextInput, Button, KeyboardAvoidingView } from 'react-native';
import AppStyles from '../styles/AppStyles';
import InlineTextButton from '../components/InlineTextButton';
import { auth, db } from '../../firebase';
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, sendEmailVerification} from "firebase/auth";

export default function SignUp({navigation}: any) {
  const backgroundImg = require('../assets/background.png')

  let [email, setEmail] = useState('')
  let [username, setUsername] = useState('')
  let [password, setPassword] = useState('')
  let [confirmPassword, setConfirmPassword] = useState('')
  let [validationMessage, setValidationMessage] = useState('')

  let validateAndSet = (value: string, valueToCompare: string, setValue: Function) =>{
    if(value !== valueToCompare) {
      setValidationMessage('Password do not match!')
    } else {
      setValidationMessage('')
    }
    setValue(value)
  }

  let saveUsername = async () => {
    let user = {
      id: '',
      username: username,
      userId: auth.currentUser!.uid,
    }
    const docRef = await addDoc(collection(db, "user"), user);
    const washingtonRef = doc(db, "user", docRef.id);
    await updateDoc(washingtonRef, {
      id: user.id
    });
  }

  let signUp = () => {
    if(password === confirmPassword){
      createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        saveUsername()
        sendEmailVerification(auth.currentUser!)
        navigation.navigate('Main', {user: userCredential.user})
      })
      .catch((error) => {
        setValidationMessage(error.message);
      });
    
    }
  }

  return (
    <ImageBackground style={AppStyles.imageContainer} source={backgroundImg}>
      <KeyboardAvoidingView style={AppStyles.backgroundCover}
      keyboardVerticalOffset={60}>
        <Text style={[AppStyles.lightText, AppStyles.header]}>Sign Up</Text>
        <Text style={[AppStyles.validationError]}>{validationMessage}</Text>

        <TextInput style={[AppStyles.textInput, AppStyles.lightText, AppStyles.lightTextInput]} 
        placeholder='Email'
        placeholderTextColor='#BEBEBE'
        value={email}
        onChangeText={setEmail}/>

        <TextInput style={[AppStyles.textInput, AppStyles.lightText, AppStyles.lightTextInput]} 
        placeholder='Username'
        placeholderTextColor='#BEBEBE'
        value={username}
        onChangeText={setUsername}/>

        <TextInput style={[AppStyles.textInput, AppStyles.lightText, AppStyles.lightTextInput]}
        placeholder='Password' 
        placeholderTextColor='#BEBEBE' 
        secureTextEntry={true}
        value={password}
        onChangeText={(value)=>validateAndSet(value, confirmPassword, setPassword)}/>

        <TextInput style={[AppStyles.textInput, AppStyles.lightText, AppStyles.lightTextInput]}
        placeholder='Confirm Password' 
        placeholderTextColor='#BEBEBE' 
        secureTextEntry={true}
        value={confirmPassword}
        onChangeText={(value)=>validateAndSet(value, password, setConfirmPassword)}/>

        <View style={[AppStyles.rowContainer, AppStyles.mb]}>
          <Text style={AppStyles.lightText}>Already have an account? </Text>
          <InlineTextButton text='Login' onPress={() => navigation.navigate('Login')} color='#9FBBCC'/>
        </View>

        <Button title='Sign Up' onPress={signUp} color='#9FBBCC'/>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
