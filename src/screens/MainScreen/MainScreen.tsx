import React, { useCallback, useState } from 'react'
import {
  useColorMode,
  useColorModeValue,
  Icon,
  VStack,
  Fab,
  Spinner,
  View
} from 'native-base'
import { AntDesign } from '@expo/vector-icons'
import AnimatedColorBox from '../../components/AnimatedColorBox/AnimatedColorBox'
import TaskList from '../../components/TaskList/TaskList'
import Masthead from '../../components/Masthead/Masthead'
import NavBar from '../../components/Navbar/Navbar'
import { auth, db } from '../../../firebase'
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  orderBy
} from 'firebase/firestore'
import { useFocusEffect, useIsFocused } from '@react-navigation/native'
import { getBackground, getUser } from '../../user'
import shortid from 'shortid'
import { User, TaskItem } from './mainScreen.types'

export default function MainScreen() {
  const initialData: TaskItem[] = []
  const [data, setData] = useState([] as TaskItem[])
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [isUserLoading, setIsUserLoading] = useState(true)
  const [isDataLoading, setIsDataLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [user, setUser] = useState({} as User)
  const [background, setBackground] = useState('')
  const { setColorMode } = useColorMode()
  const [dragble, setDragble] = useState(false)

  const loadData = async () => {
    const q = query(
      collection(db, 'todos'),
      where('userId', '==', auth.currentUser!.uid),
      orderBy('position', 'desc')
    )
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach(doc => {
      let toDo = doc.data()
      toDo.id = doc.id
      initialData.push({
        id: toDo.id,
        subject: toDo.subject,
        done: toDo.done,
        refreshing: toDo.refreshing,
        userId: toDo.userId,
        position: toDo.position
      })
    })
    setData(initialData)
    setIsRefreshing(false)
  }

  const loadUserData = async () => {
    let userData = await getUser()
    user.id = userData.id
    user.username = userData.username
    user.userId = auth.currentUser?.uid ?? 'non'
    setBackground(await getBackground())
  }

  useFocusEffect(
    useCallback(() => {
      if (!!data.length) {
        if (data[0].userId != auth.currentUser?.uid) {
          loadData()
        }
      }
      loadUserData()
    }, [loadUserData()])
  )
  if (isDataLoading) {
    getUser().then(user => {
      setColorMode(user.theme)
    })
    loadUserData().then(() => setIsUserLoading(false))
    loadData()
    setIsDataLoading(false)
  }

  const update = async (newData: TaskItem[], index: number) => {
    const washingtonRef = doc(db, 'todos', newData[index].id)
    await updateDoc(washingtonRef, {
      id: newData[index].id,
      done: newData[index].done,
      refreshing: newData[index].refreshing,
      subject: newData[index].subject
    })
  }
  const remove = async (item: TaskItem) => {
    await deleteDoc(doc(db, 'todos', item.id))
  }

  const handleToggleTaskItem = useCallback(item => {
    setData(prevData => {
      const newData = [...prevData]
      const index = prevData.indexOf(item)
      newData[index] = {
        ...item,
        done: !item.done
      }
      update(newData, index)
      return newData
    })
  }, [])
  const handleToggleRefreshTaskItem = useCallback(item => {
    setData(prevData => {
      const newData = [...prevData]
      const index = prevData.indexOf(item)
      newData[index] = {
        ...item,
        refreshing: !item.refreshing
      }
      update(newData, index)
      return newData
    })
  }, [])
  const handleChangeTaskItemSubject = useCallback((item, newSubject) => {
    setData(prevData => {
      const newData = [...prevData]
      const index = prevData.indexOf(item)
      newData[index] = {
        ...item,
        subject: newSubject
      }
      update(newData, index)
      return newData
    })
  }, [])
  const handleFinishEditingTaskItem = useCallback(_item => {
    setEditingItemId(null)
  }, [])
  const handlePressTaskItemLabel = useCallback(item => {
    setEditingItemId(item.id)
  }, [])
  const handleRemoveItem = useCallback(item => {
    setData(prevData => {
      const newData = prevData.filter(i => i !== item)
      remove(item)
      return newData
    })
  }, [])

  return (
    <AnimatedColorBox
      flex={1}
      bg={useColorModeValue('warmGray.50', 'primary.900')}
      w="full"
    >
      <Masthead
        title={`What's up, ${
          user.username != undefined ? user.username + '!' : '!'
        }`}
        image={
          background != ''
            ? { uri: background }
            : require('../../assets/background.png')
        }
      >
        <NavBar />
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
        {isDataLoading || isUserLoading ? (
          <View justifyContent="center" alignItems="center" mt={'50%'}>
            <Spinner size={'lg'} />
          </View>
        ) : (
          <TaskList
            data={data}
            onToggleItem={handleToggleTaskItem}
            onToggleRefreshTask={handleToggleRefreshTaskItem}
            dragble={dragble}
            setDragble={(value: boolean) => setDragble(value)}
            onChangeSubject={handleChangeTaskItemSubject}
            onFinishEditing={handleFinishEditingTaskItem}
            onPressLabel={handlePressTaskItemLabel}
            onRemoveItem={handleRemoveItem}
            editingItemId={editingItemId}
            refreshing={isRefreshing}
            onRefreshing={() => {
              setIsRefreshing(true)
              loadData()
            }}
          />
        )}
      </VStack>
      <Fab
        position="absolute"
        renderInPortal={false}
        size="sm"
        icon={<Icon color="white" as={<AntDesign name="plus" />} size="sm" />}
        bg={useColorModeValue('blue.500', 'blue.400')}
        onPress={() => {
          let toDoSave = {
            id: shortid.generate(),
            subject: '',
            done: false,
            refreshing: false,
            userId: auth.currentUser!.uid,
            position: Math.max(...data.map(item => item.position)) + 1
          }
          setData([toDoSave, ...data])
          addDoc(collection(db, 'todos'), toDoSave).then(doc => {
            toDoSave.id = doc.id
            setEditingItemId(toDoSave.id)
          })
        }}
      />
    </AnimatedColorBox>
  )
}
