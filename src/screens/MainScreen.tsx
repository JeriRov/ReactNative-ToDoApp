import React, { useCallback, useState } from 'react'
import { Icon, VStack, useColorModeValue, Fab } from 'native-base'
import { AntDesign } from '@expo/vector-icons'
import AnimatedColorBox from '../components/AnimatedColorBox'
import TaskList from '../components/TaskList'
import Masthead from '../components/Masthead'
import NavBar from '../components/Navbar'
import { auth, db } from "../../firebase";
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, updateDoc, orderBy } from "firebase/firestore";
import { useFocusEffect } from '@react-navigation/native'

interface TaskItem {
  id: string;
  subject: string;
  done: boolean;
  userId: string;
  position: number;
}

interface User {
  id: string;
  username: string;
  userId: string;
}

export default function MainScreen() {
  const initialData: TaskItem[] = []
  const [data, setData] = useState(initialData)
  
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  let [isLoading, setIsLoading] = useState(true)
  let [isRefreshing, setIsRefreshing] = useState(false)

  const [user, setUser] = useState({} as User)
  const loadUserData = useCallback(async () => {
    const q = query(collection(db, "user"), where("userId", "==", auth.currentUser!.uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
    let userDoc = doc.data()
    user.id = doc.id
    user.userId = userDoc.userId
    user.username = userDoc.username
})
}, [user])
useFocusEffect(
  useCallback(() => {
    loadUserData()
}, [loadUserData()]))

  const loadData = async () => {
    const q = query(collection(db, "todos"), where("userId", "==", auth.currentUser!.uid), orderBy('position', 'desc'));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let toDo = doc.data()
      toDo.id = doc.id
      initialData.push({
        id: toDo.id,
        subject: toDo.subject,
        done: toDo.done,
        userId: toDo.userId,
        position: toDo.position
      })
    })
    setData(initialData)
    setIsLoading(false)
    setIsRefreshing(false)
  }

  if(isLoading){
    loadData()
  }

  const update = async (newData: TaskItem[], index: number) => {
    const washingtonRef = doc(db, "todos", newData[index].id);
    await updateDoc(washingtonRef, {
      id: newData[index].id,
      done: newData[index].done,
      subject: newData[index].subject
    });
  }
  const remove = async (item: TaskItem) => {
    await deleteDoc(doc(db, "todos", item.id));
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
        title={"What's up " + user.username + "!"}
        image={require('../assets/background.png')}
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
          <TaskList
          data={data}
          onToggleItem={handleToggleTaskItem}
          onChangeSubject={handleChangeTaskItemSubject}
          onFinishEditing={handleFinishEditingTaskItem}
          onPressLabel={handlePressTaskItemLabel}
          onRemoveItem={handleRemoveItem}
          editingItemId={editingItemId}
          refreshing={isRefreshing}
          onRefreshing={() => {
            loadData()
            setIsRefreshing(true);
          }}
        />
      </VStack>
      <Fab
        position="absolute"
        renderInPortal={false}
        size="sm"
        icon={<Icon color="white" as={<AntDesign name="plus" />} size="sm" />}
        colorScheme={useColorModeValue('blue', 'darkBlue')}
        bg={useColorModeValue('blue.500', 'blue.400')}
        onPress={async () => {
          let toDoSave = {
            id: '',
            subject: '',
            done: false,
            userId: auth.currentUser!.uid,
            position: data.length+1
          }
          const docRef = await addDoc(collection(db, "todos"), toDoSave);
          toDoSave.id = docRef.id
          setData([
            toDoSave,
            ...data
          ])
          setEditingItemId(toDoSave.id)
        }}
      />
    </AnimatedColorBox>
  )
}
