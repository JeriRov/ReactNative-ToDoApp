import React from 'react'
import { Text, HStack, Switch, useColorMode } from 'native-base'
import { setUserColorMode } from '../../user'

export default function ThemeToggle() {
  const { colorMode, toggleColorMode } = useColorMode()
  const changeTheme = async () => {
    toggleColorMode()
    if (colorMode === 'dark') {
      setUserColorMode('light')
    } else {
      setUserColorMode('dark')
    }
  }

  return (
    <HStack space={2} alignItems="center">
      <Text>Dark</Text>
      <Switch isChecked={colorMode === 'light'} onToggle={changeTheme}></Switch>
      <Text>Light</Text>
    </HStack>
  )
}
