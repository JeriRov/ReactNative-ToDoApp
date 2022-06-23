import React, { useCallback, useState } from 'react'
import { SafeAreaView } from 'react-native'
import AppStyles from '../styles/AppStyles'
import { auth, db } from '../../firebase'
import {
  updatePassword,
  signInWithEmailAndPassword,
  deleteUser
} from 'firebase/auth'
import {
  collection,
  query,
  where,
  getDocs,
  writeBatch,
  updateDoc,
  doc
} from 'firebase/firestore'
import {
  Avatar,
  Button,
  Input,
  useColorModeValue,
  VStack,
  Text,
  IconButton
} from 'native-base'
import AnimatedColorBox from '../components/AnimatedColorBox'
import Masthead from '../components/Masthead'
import NavBar from '../components/Navbar'
import { ScrollView } from 'react-native-gesture-handler'
import { useFocusEffect } from '@react-navigation/native'
import { storage } from '../../firebase'
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes
} from 'firebase/storage'
import * as ImagePicker from 'expo-image-picker'
import { Feather } from '@expo/vector-icons'

interface User {
  id: string
  username: string
  userId: string
}

export default function ManageAccount({ navigation }: any) {
  let [newPassword, setNewPassword] = useState('')
  let [currentPassword, setCurrentPassword] = useState('')
  let [errorMessage, setErrorMesage] = useState('')
  const [user, setUser] = useState({} as User)
  let [username, setUsername] = useState('')
  const [avatar, setAvatar] = useState('')

  const loadData = useCallback(async () => {
    if (avatar === '') {
      const avatar = ref(storage, `avatars/${auth.currentUser?.uid}`)
      getDownloadURL(avatar!).then(url => {
        setAvatar(url)
      })
    }
    const qUser = query(
      collection(db, 'user'),
      where('userId', '==', auth.currentUser!.uid)
    )
    const querySnapshotUser = await getDocs(qUser)
    querySnapshotUser.forEach(doc => {
      let userDoc = doc.data()
      user.id = doc.id
      user.userId = userDoc.userId
      user.username = userDoc.username
    })
    setUsername(user.username)
  }, [user])

  useFocusEffect(
    useCallback(() => {
      loadData()
    }, [loadData()])
  )

  let changeUsername = async (text: string) => {
    setUsername(text)
    const washingtonRef = doc(db, 'user', user.id)
    await updateDoc(washingtonRef, {
      username: text
    })
  }

  let updateUserPassword = () => {
    signInWithEmailAndPassword(auth, auth.currentUser!.email!, currentPassword)
      .then(() => {
        updatePassword(auth.currentUser!, newPassword)
          .then(() => {
            setNewPassword('')
            setErrorMesage('')
            setCurrentPassword('')
          })
          .catch(error => {
            setErrorMesage(error.message)
          })
      })
      .catch(error => {
        setErrorMesage(error.message)
      })
  }

  let deleteUserAndToDos = () => {
    if (currentPassword === '') {
      setErrorMesage('Must enter current password to delete account!')
    } else {
      signInWithEmailAndPassword(
        auth,
        auth.currentUser!.email!,
        currentPassword
      )
        .then(userCredential => {
          const user = userCredential.user
          let batch = writeBatch(db)
          const q = query(
            collection(db, 'todos'),
            where('userId', '==', user.uid)
          )
          getDocs(q).then(querySnapshot => {
            querySnapshot.forEach(doc => {
              batch.delete(doc.ref)
            })
            batch.commit()

            deleteUser(user)
              .then(() => {
                navigation.navigate('Login')
              })
              .catch(error => {
                setErrorMesage(error.message)
              })
          })
        })
        .catch(error => {
          setErrorMesage(error.message)
        })
    }
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    })
    console.log(result)

    if (!result.cancelled) {
      uploadToFirebase(result.uri)
    }
  }

  const uploadToFirebase = async (url: string) => {
    const blob: Blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      // on load
      xhr.onload = function () {
        resolve(xhr.response)
      }
      // on error
      xhr.onerror = function (e) {
        console.log(e)
        reject(new TypeError('Network request failed'))
      }
      // on complete
      xhr.responseType = 'blob'
      xhr.open('GET', url)
      xhr.send()
    })

    const fileRef = ref(storage, `avatars/${auth.currentUser?.uid}`)
    await uploadBytes(fileRef, blob).then(() => {
      setAvatar(url)
    })
  }

  return (
    <AnimatedColorBox
      flex={1}
      bg={useColorModeValue('warmGray.50', 'primary.900')}
      w="full"
    >
      <Masthead title={''} image={require('../assets/background.png')}>
        <Button
          onPress={pickImage}
          w="full"
          h="full"
          position={'absolute'}
          opacity={0}
        />
        <NavBar />
        <Avatar
          alignSelf="center"
          bottom={'-15%'}
          source={
            avatar != ''
              ? { uri: avatar }
              : require('../assets/profile-image.png')
          }
          size="2xl"
          borderRadius={100}
          borderColor="primary.50"
          borderWidth={3}
          zIndex={20}
        />
        <IconButton
          onPress={pickImage}
          borderRadius={100}
          zIndex={50}
          left={'80%'}
          variant={'solid'}
          width="10%"
          size={'sm'}
          bg={useColorModeValue('blue.500', 'blue.100')}
          _icon={{
            as: Feather,
            name: 'camera',
            size: 6,
            color: useColorModeValue('primary.50', 'primary.900')
          }}
        />
      </Masthead>
      <VStack
        flex={1}
        space={1}
        bg={useColorModeValue('warmGray.50', 'primary.900')}
        mt="-20px"
        borderTopLeftRadius="20px"
        borderTopRightRadius="20px"
        pt="20px"
      >
        <Input
          variant="unstyled"
          fontSize={25}
          px={1}
          py={0}
					selectionColor={'blue.500'}
          blurOnSubmit
          onChangeText={changeUsername}
          value={username}
          textAlign={'center'}
          top={'7%'}
          zIndex={5}
        />
        <ScrollView>
          <SafeAreaView style={AppStyles.container}>
            <Input
              variant="unstyled"
              fontSize={16}
              px={1}
              py={2}
              blurOnSubmit
              borderBottomWidth={2}
              placeholder="Current Password"
              secureTextEntry={true}
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />

            <Input
              variant="unstyled"
              fontSize={16}
              px={1}
              py={2}
              blurOnSubmit
              borderBottomWidth={2}
              placeholder="New Password"
              secureTextEntry={true}
              value={newPassword}
              onChangeText={setNewPassword}
            />

            <Text mt={1} style={AppStyles.validationError}>
              {errorMessage}
            </Text>
            <Button
              position={'relative'}
              renderInPortal={false}
              mt={'25%'}
              size={'lg'}
              rounded={15}
              onPress={updateUserPassword}
              colorScheme={useColorModeValue('blue', 'blue.600')}
              bg={useColorModeValue('blue.600', 'blue.500')}
            >
              Update Password
            </Button>

            <Button
              onPress={deleteUserAndToDos}
              size={'lg'}
              mt={'5%'}
              rounded={15}
              colorScheme={useColorModeValue('red', 'red.600')}
              bg={useColorModeValue('red.600', 'red.500')}
            >
              Delete User
            </Button>
          </SafeAreaView>
        </ScrollView>
      </VStack>
    </AnimatedColorBox>
  )
}
