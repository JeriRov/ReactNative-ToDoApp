import React, {useState} from 'react';
import { Button, View, TextInput, Text } from 'react-native';
import AppStyles from '../styles/AppStyles';
import { auth, db } from "../../firebase";
import { signOut, updatePassword, signInWithEmailAndPassword, deleteUser } from "firebase/auth";
import { collection, query, where, getDocs, writeBatch } from "firebase/firestore";

export default function ManageAccount({navigation} : any){
    let [newPassword, setNewPassword] = useState('')
    let [currentPassword, setCurrentPassword] = useState('')
    let [errorMessage, setErrorMesage] = useState('')
    let logout = () => {
        signOut(auth).then(() => {
            navigation.navigate('Login')
        }).catch((error) => {
            // An error happened.
        });
    }

    let updateUserPassword = () => {
        signInWithEmailAndPassword(auth, auth.currentUser!.email!, currentPassword)
            .then((userCredential) => {
                const user = userCredential.user;
                updatePassword(auth.currentUser!, newPassword).then(() => {
                    setNewPassword('')
                    setErrorMesage('')
                    setCurrentPassword('')
                }).catch((error) => {
                    setErrorMesage(error.message)
                });
            })
            .catch((error) => {
                setErrorMesage(error.message)
            });
    }

    let deleteUserAndToDos = () => {
        if(currentPassword === ""){
            setErrorMesage('Must enter current password to delete account!')
        } else {
            signInWithEmailAndPassword(auth, auth.currentUser!.email!, currentPassword)
            .then((userCredential) => {
                const user = userCredential.user;
                let batch = writeBatch(db);
                const q = query(collection(db, "todos"), where("userId", "==", user.uid));
                getDocs(q).then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                batch.delete(doc.ref);
                });
                batch.commit();
        
                deleteUser(user).then(() => {
                navigation.popToTop();
                }).catch((error) => {
                    setErrorMesage(error.message);
                });
            });
            })
            .catch((error) => {
                setErrorMesage(error.message)
            });

        }
    }

    return(
        <View style={AppStyles.container}>
            <Text style={AppStyles.validationError}>{errorMessage}</Text>
            <TextInput 
                style={[AppStyles.textInput, AppStyles.darkTextInput]} 
                placeholder='Current Password'
                secureTextEntry={true}
                value={currentPassword}
                onChangeText={setCurrentPassword} />
            <TextInput 
                style={[AppStyles.textInput, AppStyles.darkTextInput]} 
                placeholder='New Password'
                secureTextEntry={true}
                value={newPassword}
                onChangeText={setNewPassword} />
            <Button title='Update Password' onPress={updateUserPassword}/>
            <Button title='Delete User' onPress={deleteUserAndToDos} color='red'/>
            <Button title='Logout' onPress={logout}/>
            <Button title='Back to ToDos' onPress={() => navigation.pop()}/>
        </View>
    );
}