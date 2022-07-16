import React from 'react'
import AppContainer from './src/components/AppContainer/AppContainer'
import Navigator from './src/'
import registerNNPushToken from 'native-notify'

export default function App() {
  
  registerNNPushToken(3201, 'wPKVIbQaKIZIlx1SVL0fur')
  return (
    <AppContainer>
      <Navigator />
    </AppContainer>
  )
}
