import React from 'react'
import { StyleSheet, View, Image } from 'react-native'



/**
 * Main Logo of the app
 * 
 * @returns Logo
 */
function Logo() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.png')}
      />
    </View>
  )
}

export default Logo
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    marginTop: 60,
    paddingBottom: 0,
  },

})