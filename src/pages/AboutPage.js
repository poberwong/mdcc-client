import React, {PropTypes, Component} from 'react'
import NavBar from 'react-native-navigationbar'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Linking,
  StatusBar,
  Image
} from 'react-native'

const avatarIndex = Platform.OS === 'ios' ? -1 : 1
export default class extends Component {
  static propTypes = {
    updateTime: PropTypes.string,
    navigator: PropTypes.object
  };

  render () {
    const {navigator, updateTime} = this.props
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <StatusBar barStyle='default'/>
        <Image source={require('../assets/location.jpg')}
          style={{width: null, height: 264}}/>
        <View style={{padding: 15, flex: 1, alignItems: 'center'}}>
          <Text style={{fontSize: 23, fontWeight: 'bold', lineHeight: 25, color: '#555', textAlign: 'center'}}>Thanks for contribution from
            liaohuqiu and poberwong</Text>
          <Text style={{fontSize: 13, lineHeight: 18, color: '#888', textAlign: 'center', marginTop: 25}}>
            This application based on react-native-cx is {'\n'}  made for mdcc conference.
            You can find {'\n'} it on github from bottom address.
          </Text>
          <View style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
            <Image source={require('../assets/avatar.png')} style={[styles.avatar, {backgroundColor: 'white'}]}/>
            <Image source={require('../assets/liaohuqiu.jpeg')} style={[styles.avatar, {marginLeft: -15, zIndex: avatarIndex}]}/>
          </View>
          <TouchableOpacity
            style={styles.bottom}
            onPress={() => Linking.openURL('https://github.com/Bob1993/mdcc-client')}>
            <Text style={[styles.bottomText, {marginBottom: 5}]}>latest_update: {updateTime}</Text>
            <View style={[{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}]}>
              <Image
                style={styles.github}
                source={{uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Octicons-mark-github.svg/1200px-Octicons-mark-github.svg.png'}} />
              <Text style={styles.bottomText}>https://github.com/Bob1993/mdcc-client</Text>
            </View>
          </TouchableOpacity>
        </View>
        <NavBar
          backColor='white'
          title=''
          barTintColor='transparent'
          barWrapperStyle={styles.barStyle}
          barBottomThickness={0}
          backFunc={() => navigator.pop()}
         />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30
  },
  github: {
    width: 15,
    height: 15,
    marginRight: 8
  },
  bottom: {
    position: 'absolute',
    right: 0,
    left: 0,
    bottom: 0,
    height: 45,
    alignItems: 'center'
  },
  barStyle: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0
  },
  bottomText: {
    fontSize: 11,
    color: '#555',
    textAlign: 'center'
  }
})
