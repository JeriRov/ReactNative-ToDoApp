import * as BackgroundFetch from 'expo-background-fetch'
import * as TaskManager from 'expo-task-manager'
import { auth, db } from '../../firebase'
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc
} from 'firebase/firestore'
const REFRESH_TASK = 'REFRESH_TASK'

TaskManager.defineTask(REFRESH_TASK, async () => {
  const date = new Date()
  let tasksIsRefresh = false
  if (date.getHours() == 0 && date.getMinutes() == 0) {
    const q = query(
      collection(db, 'todos'),
      where('userId', '==', auth.currentUser?.uid)
    )
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach(async document => {
      if (document.data().refreshing) {
        tasksIsRefresh = true
        const washingtonRef = doc(db, 'todos', document.id)
        await updateDoc(washingtonRef, {
          done: false
        })
      }
    })
    if(!tasksIsRefresh){
      unregister()
    }
    console.log(`Refreshing Done`)
  } 
  return BackgroundFetch.BackgroundFetchResult.NewData
})

export const register = () => {
  console.log('register: ', REFRESH_TASK)

  return BackgroundFetch.registerTaskAsync(REFRESH_TASK, {
    minimumInterval: 1,
    stopOnTerminate: false,
    startOnBoot: true
  })
}

export const unregister = () => {
  console.log('unregister: ', REFRESH_TASK)

  return BackgroundFetch.unregisterTaskAsync(REFRESH_TASK)
}

export const checkStatus = async () => {
  const status = await BackgroundFetch.getStatusAsync()
  const isRegistered = await TaskManager.isTaskRegisteredAsync(REFRESH_TASK)
  return { status, isRegistered }
}
