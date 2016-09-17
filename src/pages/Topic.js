import React, { Component, PropTypes } from 'react'

import {
  View,
  Text,
  StyleSheet,
  Image
} from 'react-native'

export default class extends Component {
  static propTypes = {
    topic: PropTypes.object,
    style: View.propTypes.style,
    isSubscribed: PropTypes.bool,
    lineNumber: PropTypes.number
  };

  static defaultProps = {
    isSubscribed: false,
    lineNumber: 1
  }

  render () {
    const {topic, style, isSubscribed, lineNumber} = this.props
    const avatarUri = {uri: topic.speaker_avatar} || require('../assets/default_avatar.png')
    return (
      <View style={[{padding: 14}, style]}>
        <Text style={{fontSize: 16, color: '#6199b1'}} numberOfLines={lineNumber}>{topic.title}</Text>
        {!topic.is_rest &&
        <View style={{flexDirection: 'row', paddingLeft: 5, marginTop: 15}}>
          <Image style={{height: 35, width: 35, borderRadius: 17.5, marginLeft: -5}} source={avatarUri}/>
          <View style={{marginLeft: 10, justifyContent: 'center', flex: 1}}>
            <Text numberOfLines={1} style={styles.font}>{topic.speaker_name}</Text>
            <Text numberOfLines={1} style={{marginTop: 5, color: '#777777', fontSize: 11}}>
              {topic.speaker_title}
            </Text>
          </View>
        </View>
        }
        {isSubscribed &&
          <Image style={styles.subscribedLabel} source={require('../assets/added-cell.png')} />
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  font: {
    fontSize: 12.5,
    color: '#555555'
  },
  subscribedLabel: {
    height: 30,
    width: 30,
    position: 'absolute',
    top: 0,
    right: 0
  }
})
