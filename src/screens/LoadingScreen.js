import React, { Component } from 'react'
import { Text, View } from 'react-native'
import Logo from '../components/Logo'

/**
 * Loading screen when starting the app. It show the logo component
 */
class LoadingScreen extends Component {
  render() {
    return (
      <View>
        <Logo />
      </View>
    )
  }
}

export default LoadingScreen
