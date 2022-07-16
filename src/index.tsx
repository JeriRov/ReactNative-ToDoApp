import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import MainScreen from './screens/MainScreen/MainScreen'
import AboutScreen from './screens/AboutScreen/AboutScreen'
import Sidebar from './components/Sidebar/Sidebar'
import Login from './screens/Login/Login'
import SignUp from './screens/SignUp/SignUp'
import ResetPassword from './screens/ResetPassword/ResetPassword'
import ManageAccount from './screens/ManageAccount/ManageAccount'

const Drawer = createDrawerNavigator()

const App = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Login"
      drawerContent={props => <Sidebar {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'back',
        overlayColor: '#00000000'
      }}
    >
      
      <Drawer.Screen name="Login" component={Login} />
      <Drawer.Screen name="SignUp" component={SignUp} />
      <Drawer.Screen name="ResetPassword" component={ResetPassword} />
      <Drawer.Screen name="Main" component={MainScreen} />
      <Drawer.Screen name="About" component={AboutScreen} />
      <Drawer.Screen name="ManageAccount" component={ManageAccount} />
    </Drawer.Navigator>
  )
}

export default App
