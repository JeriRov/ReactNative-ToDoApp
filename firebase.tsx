import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'
import { enableIndexedDbPersistence } from 'firebase/firestore'
import { initializeFirestore, CACHE_SIZE_UNLIMITED } from 'firebase/firestore'
const firebaseConfig = {
  apiKey: 'AIzaSyC4zTH7bgFGf4uJudMZwzGlCf7GGHpo_v4',
  authDomain: 'todoapp-497cc.firebaseapp.com',
  projectId: 'todoapp-497cc',
  storageBucket: 'todoapp-497cc.appspot.com',
  messagingSenderId: '34735464817',
  appId: '1:34735464817:web:2e06340ea744b837ba96d0',
  measurementId: 'G-RYV3RRR401'
}

const app = initializeApp(firebaseConfig)
const storage = getStorage()
const auth = getAuth()
const db = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED
})


enableIndexedDbPersistence(db).catch(err => {
  if (err.code == 'failed-precondition') {
    // Multiple tabs open, persistence can only be enabled
    // in one tab at a a time.
    // ...
    console.log(err.code)
  } else if (err.code == 'unimplemented') {
    // The current browser does not support all of the
    // features required to enable persistence
    // ...
    console.log(err.code)
  }
})

export { storage, auth, db }
