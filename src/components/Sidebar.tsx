import React, { useCallback, useState } from 'react'
import {
  HStack,
  VStack,
  Center,
  Avatar,
  Heading,
  IconButton,
  useColorModeValue,
  View,
  Spinner
} from 'native-base'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import AnimatedColorBox from './AnimatedColorBox'
import ThemeToggle from './ThemeToggle'
import { Feather } from '@expo/vector-icons'
import MenuButton from './MenuButton'
import { signOut } from 'firebase/auth'
import { useFocusEffect } from '@react-navigation/native'
import { auth, db } from '../../firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { getAvatar, getUser } from '../user'

interface User {
  id: string
  username: string
  userId: string
}

const Sidebar = (props: DrawerContentComponentProps) => {
  const { state, navigation } = props
  const currentRoute = state.routeNames[state.index]
  const [user, setUser] = useState({} as User)
  const [avatar, setAvatar] = useState('')

  const loadData = useCallback(async () => {
    let userData = await getUser()
    user.id = userData.id
    user.username = userData.username
    setAvatar(await getAvatar())
  }, [user])
  useFocusEffect(
    useCallback(() => {
      loadData()
    }, [loadData()])
  )

  const handlePressBackButton = useCallback(() => {
    navigation.closeDrawer()
  }, [navigation])
  const handlePressMenuMain = useCallback(() => {
    navigation.navigate('Main')
  }, [navigation])
  const handlePressMenuAbout = useCallback(() => {
    navigation.navigate('About')
  }, [navigation])
  const logout = useCallback(() => {
    signOut(auth).then(() => {
      navigation.navigate('Login')
    })
  }, [navigation])

  const handlePressAccountButton = useCallback(() => {
    navigation.navigate('ManageAccount')
  }, [navigation])

  return (
    <AnimatedColorBox
      safeArea
      flex={1}
      bg={useColorModeValue('blue.50', 'darkBlue.800')}
      p={7}
    >
      <VStack flex={1} space={2}>
        <HStack
          justifyContent="flex-end"
          flexDirection={'column'}
          alignItems={'flex-end'}
        >
          <IconButton
            onPress={handlePressBackButton}
            borderRadius={100}
            variant="outline"
            borderColor={useColorModeValue('blue.300', 'darkBlue.700')}
            _icon={{
              as: Feather,
              name: 'chevron-left',
              size: 6,
              color: useColorModeValue('blue.800', 'darkBlue.500')
            }}
          />
        </HStack>
        <Avatar
          source={
            avatar != ''
              ? { uri: avatar }
              : require('../assets/profile-image.png')
          }
          size="xl"
          borderRadius={100}
          mb={6}
          borderColor="secondary.500"
          borderWidth={3}
        />
        <Heading mb={4} size="xl">
          {user.username}
        </Heading>
        <MenuButton
          active={currentRoute === 'ManageAccount'}
          onPress={handlePressAccountButton}
          icon="user"
        >
          Account
        </MenuButton>
        <MenuButton
          active={currentRoute === 'Main'}
          onPress={handlePressMenuMain}
          icon="inbox"
        >
          Tasks
        </MenuButton>
        <MenuButton
          active={currentRoute === 'About'}
          onPress={handlePressMenuAbout}
          icon="info"
        >
          About
        </MenuButton>
        <MenuButton
          active={currentRoute === 'Login'}
          onPress={logout}
          icon="log-out"
        >
          Sign out
        </MenuButton>
      </VStack>
      <Center>
        <ThemeToggle />
      </Center>
    </AnimatedColorBox>
  )
}

export default Sidebar
