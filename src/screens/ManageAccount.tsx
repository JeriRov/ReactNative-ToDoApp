import React, { useCallback, useState } from 'react'
import { RefreshControl, SafeAreaView, _Text } from 'react-native'
import AppStyles from '../styles/AppStyles'
import {
  Avatar,
  Button,
  Input,
  useColorModeValue,
  VStack,
  Text,
  IconButton,
  Modal,
  Icon,
  View,
  Spinner
} from 'native-base'
import AnimatedColorBox from '../components/AnimatedColorBox'
import Masthead from '../components/Masthead'
import NavBar from '../components/Navbar'
import { ScrollView } from 'react-native-gesture-handler'
import { useFocusEffect } from '@react-navigation/native'
import { Feather } from '@expo/vector-icons'
import {
  changeAvatar,
  changeBackground,
  deleteFullUser,
  getAvatar,
  getBackground,
  getUser,
  setUserUsername,
  updateUserPassword
} from '../user'

interface User {
  id: string
  theme: string
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
  const [background, setBackground] = useState('')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [isBackgroundLoading, setIsBackgroundLoading] = useState(true)
  const [isAvatarLoading, setIsAvatarLoading] = useState(true)

  const loadData = useCallback(async () => {
    let userData = await getUser()
    user.username = userData.username
    setUsername(user.username)
    setAvatar(await getAvatar())
    setIsAvatarLoading(false)
    setBackground(await getBackground())
    setIsBackgroundLoading(false)
    user.id = userData.id
    setIsRefreshing(false)
  }, [])

  useFocusEffect(
    useCallback(() => {
      loadData()
    }, [loadData()])
  )

  let changeUsername = async (text: string) => {
    setUsername(text)
    await setUserUsername(text, user.id)
  }

  let updatePassword = () => {
    updateUserPassword(
      currentPassword,
      setCurrentPassword,
      newPassword,
      setNewPassword,
      setErrorMesage
    )
  }

  let deleteUser = () => {
    deleteFullUser(currentPassword, setErrorMesage, navigation)
  }

  const pickBackground = async () => {
    setShowModal(false)
    changeBackground(loadData)
  }

  const pickAvatar = async () => {
    setShowModal(false)
    changeAvatar(loadData)
  }

  return (
    <AnimatedColorBox
      flex={1}
      bg={useColorModeValue('warmGray.50', 'primary.900')}
      w="full"
    >
      <Masthead
        title={''}
        image={
          background != ''
            ? { uri: background }
            : require('../assets/background.png')
        }
      >
        <Button
          onLongPress={() => setShowModal(true)}
          w="full"
          h="full"
          position={'absolute'}
          opacity={0}
        />
        <NavBar />
        {isBackgroundLoading ? (
          <View position={'absolute'} alignSelf="center" mt={'35%'}>
            <Spinner size={'lg'} />
          </View>
        ) : (
          <></>
        )}
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
        {isAvatarLoading ? (
          <View
            position={'absolute'}
            alignSelf="center"
            zIndex={100}
            mt={'64%'}
          >
            <Spinner size={'lg'} />
          </View>
        ) : (
          <></>
        )}
        <Button
          onPress={() => setShowModal(true)}
          h={'45%'}
          w={'33%'}
          opacity={0}
          borderRadius={100}
          alignSelf={'center'}
          bottom={'-10%'}
          zIndex={30}
          position={'absolute'}
          bgColor={'red.900'}
        />

        <IconButton
          onPress={pickAvatar}
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
        <Modal
          animationPreset="slide"
          w="full"
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          _backdrop="red"
        >
          <Modal.Content
            bgColor={useColorModeValue('primary.50', 'primary.700')}
            color={'white'}
            w="full"
            mb={0}
            mt="auto"
          >
            <Button.Group flexDirection={'column'} w="full">
              <Button
                onPress={pickAvatar}
                variant={'ghost'}
                w="full"
                leftIcon={
                  <Icon
                    as={Feather}
                    name="camera"
                    size="2xl"
                    color={useColorModeValue('gray.700', 'white')}
                  />
                }
              >
                <Text fontWeight={'bold'} fontSize={16}>
                  Change avatar
                </Text>
              </Button>

              <Button
                onPress={pickBackground}
                variant={'ghost'}
                w="full"
                leftIcon={
                  <Icon
                    as={Feather}
                    name="image"
                    size="2xl"
                    color={useColorModeValue('gray.700', 'white')}
                  />
                }
              >
                <Text fontWeight={'bold'} fontSize={16}>
                  Change background
                </Text>
              </Button>

              <Button
                variant={'ghost'}
                w="full"
                leftIcon={
                  <Icon
                    as={Feather}
                    name="trash-2"
                    size="2xl"
                    color={useColorModeValue('gray.700', 'white')}
                  />
                }
              >
                <Text fontWeight={'bold'} fontSize={16}>
                  Delete avatar
                </Text>
              </Button>
            </Button.Group>
          </Modal.Content>
        </Modal>
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
          zIndex={50}
        />
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => {
                setIsRefreshing(true)
                loadData()
              }}
            />
          }
        >
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
              onPress={updatePassword}
              colorScheme={useColorModeValue('blue', 'blue.600')}
              bg={useColorModeValue('blue.600', 'blue.500')}
            >
              Update Password
            </Button>

            <Button
              onPress={deleteUser}
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
