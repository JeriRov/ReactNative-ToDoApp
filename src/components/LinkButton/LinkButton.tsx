import React, { useCallback } from 'react'
import * as Linking from 'expo-linking'
import { Button } from 'native-base'
import { Props } from './linkButton.types'

const LinkButton = ({ href, ...props }: Props) => {
  const handlePress = useCallback(() => {
    Linking.openURL(href)
  }, [href])

  return <Button {...props} onPress={handlePress} />
}

export default LinkButton
