import React, { useCallback, useState } from 'react'
import { auth, db } from '../firebase'
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
import { storage } from '../firebase'
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes
} from 'firebase/storage'
import * as ImagePicker from 'expo-image-picker'
import { useColorMode } from 'native-base'

interface User {
  id: string
  theme: string
  username: string
  userId: string
}

const getAvatar = async () => {
  const avatar = ref(storage, `avatars/${auth.currentUser?.uid}`)
  return await getDownloadURL(avatar!)
    .then(url => {
      return url
    })
    .catch(error => {
      return ''
    })
}

const getBackground = async () => {
  const background = ref(storage, `backgrounds/${auth.currentUser?.uid}`)
  return await getDownloadURL(background!)
    .then(url => {
      return url
    })
    .catch(error => {
      return ''
    })
}

const getUser = async () => {
  let user = {} as User
  const q = query(
    collection(db, 'user'),
    where('userId', '==', auth.currentUser!.uid)
  )
  const querySnapshot = await getDocs(q)
  querySnapshot.forEach(doc => {
    let userDoc = doc.data()
    user.id = doc.id
    user.theme = userDoc.theme
    user.userId = userDoc.userId
    user.username = userDoc.username
  })
  return user
}

const getColorMode = async () => {
  return (await getUser()).theme
}

const setUserUsername = async (username: string, userId: string) => {
  const userRef = doc(db, 'user', userId)
  await updateDoc(userRef, {
    username: username
  })
}

const setUserColorMode = async (theme: string) => {
  getUser().then(async user => {
    const userRef = doc(db, 'user', user.id)
    await updateDoc(userRef, {
      theme: theme
    })
  })
}

const uploadToFirebase = async (folder: string, url: string) => {
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

  const fileRef = ref(storage, `${folder}/${auth.currentUser?.uid}`)
  await uploadBytes(fileRef, blob)
}

const changeBackground = async (load: Function) => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1
  })
  console.log(result)

  if (!result.cancelled) {
    uploadToFirebase('backgrounds', result.uri).then(() => load())
  }
}

const changeAvatar = async (load: Function) => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1
  })
  console.log(result)

  if (!result.cancelled) {
    uploadToFirebase('avatars', result.uri).then(() => load())
  }
}

let deleteFullUser = (
  currentPassword: string,
  setErrorMesage: Function,
  navigation: any
) => {
  if (currentPassword === '') {
    setErrorMesage('Must enter current password to delete account!')
  } else {
    signInWithEmailAndPassword(auth, auth.currentUser!.email!, currentPassword)
      .then(userCredential => {
        const user = userCredential.user
        let batch = writeBatch(db)
        const todoQ = query(
          collection(db, 'todos'),
          where('userId', '==', user.uid)
        )
        const userQ = query(
          collection(db, 'user'),
          where('userId', '==', user.uid)
        )
        const avatarRef = ref(storage, `avatars/${auth.currentUser?.uid}`)
        const backgroundRef = ref(
          storage,
          `backgrounds/${auth.currentUser?.uid}`
        )
        getDocs(userQ).then(querySnapshot => {
          querySnapshot.forEach(doc => {
            batch.delete(doc.ref)
          })
        })

        getDocs(todoQ).then(querySnapshot => {
          querySnapshot.forEach(doc => {
            batch.delete(doc.ref)
          })

          batch.commit()

          deleteObject(avatarRef).catch(error => {
            setErrorMesage(error.message)
          })
          deleteObject(backgroundRef).catch(error => {
            setErrorMesage(error.message)
          })
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

const updateUserPassword = (
  currentPassword: string,
  setCurrentPassword: Function,
  newPassword: string,
  setNewPassword: Function,
  setErrorMesage: Function
) => {
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

export {
  getAvatar,
  getBackground,
  getUser,
  setUserUsername,
  changeBackground,
  changeAvatar,
  deleteFullUser,
  updateUserPassword,
  setUserColorMode,
  getColorMode
}
