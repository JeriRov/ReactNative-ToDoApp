import React, { useCallback } from 'react'
import {
  PanGestureHandlerProps
} from 'react-native-gesture-handler'
import { NativeSyntheticEvent, TextInputChangeEventData } from 'react-native'
import {
  Pressable,
  Box,
  HStack,
  useColorModeValue,
  Icon,
  Input,
  useToken,
  Menu,
  View,
  Text
} from 'native-base'
import AnimatedCheckbox from 'react-native-checkbox-reanimated'
import AnimatedTaskLabel from '../AnimatedTaskLabel/AnimatedTaskLabel'
import SwipableView from '../SwipableView/SwipableView'
import { Feather, Entypo } from '@expo/vector-icons'
import { Props } from './taskItem.types'

const TaskItem = (props: Props) => {
  const {
    isEditing,
    isDone,
    isRefreshing,
    onToggleCheckbox,
    onToggleRefreshTask,
    subject,
    onPressLabel,
    onRemove,
    onChangeSubject,
    onFinishEditing,
    simultaneousHandlers
  } = props

  const highlightColor = useToken(
    'colors',
    useColorModeValue('blue.500', 'blue.400')
  )
  const boxStroke = useToken(
    'colors',
    useColorModeValue('muted.300', 'muted.500')
  )

  const checkmarkColor = useToken('colors', useColorModeValue('white', 'white'))

  const activeTextColor = useToken(
    'colors',
    useColorModeValue('darkText', 'lightText')
  )
  const doneTextColor = useToken(
    'colors',
    useColorModeValue('muted.400', 'muted.600')
  )

  const handleChangeSubject = useCallback(
    (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
      onChangeSubject && onChangeSubject(e.nativeEvent.text)
    },
    [onChangeSubject]
  )

  return (
    <SwipableView
      simultaneousHandlers={simultaneousHandlers}
      onSwipeLeft={onRemove}
      backView={
        <Box
          w="full"
          h="full"
          bg="red.500"
          alignItems="flex-end"
          justifyContent="center"
          pr={4}
        >
          <Icon color="white" as={<Feather name="trash-2" />} size="sm" />
        </Box>
      }
    >
      <HStack
        alignItems="center"
        w="full"
        px={4}
        py={2}
        pr={'20%'}
        my={-0.1}
        bg={useColorModeValue('warmGray.50', 'primary.900')}
      >
        <Box width={30} height={30} mr={2}>
          <Pressable onPress={onToggleCheckbox}>
            <AnimatedCheckbox
              highlightColor={highlightColor}
              checkmarkColor={checkmarkColor}
              boxOutlineColor={boxStroke}
              checked={isDone}
            />
          </Pressable>
        </Box>
        {isEditing ? (
          <Input
            placeholder="Task"
            value={subject}
            variant="unstyled"
            selectionColor={'blue.500'}
            fontSize={19}
            px={1}
            py={0}
            autoFocus
            blurOnSubmit
            onChange={handleChangeSubject}
            onBlur={onFinishEditing}
          />
        ) : (
          <AnimatedTaskLabel
            textColor={activeTextColor}
            inactiveTextColor={doneTextColor}
            strikethrough={isDone}
            onPress={onPressLabel}
          >
            {subject}
          </AnimatedTaskLabel>
        )}
      </HStack>
      <View
        h={'100%'}
        w={'9%'}
        justifyContent={'center'}
        alignItems={'center'}
        position={'absolute'}
        right={'3%'}
      >
        <Menu
          rounded={20}
          trigger={triggerProps => {
            return (
              <Pressable
                accessibilityLabel="More options menu"
                {...triggerProps}
              >
                <Icon
                  color="white"
                  as={<Entypo name="dots-three-vertical" />}
                  size="sm"
                />
              </Pressable>
            )
          }}
        >
          <Menu.Item
            alignItems={'center'}
            flexDirection={'row'}
            onPress={() => console.log('DWDWD')}
          >
            <Box width={30} height={30} mr={2}>
              <Pressable onPress={onToggleRefreshTask}>
                <AnimatedCheckbox
                  highlightColor={highlightColor}
                  checkmarkColor={checkmarkColor}
                  boxOutlineColor={boxStroke}
                  checked={isRefreshing}
                />
              </Pressable>
            </Box>
            <Text fontSize={14}>Refreshing Task</Text>
          </Menu.Item>
        </Menu>
      </View>
    </SwipableView>
  )
}

export default TaskItem
