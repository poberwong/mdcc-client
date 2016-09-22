import React, { Component, PropTypes } from 'react'
import PureListView from '../components/PureListView'
import {connect} from 'react-redux'
import TopicsCarousel from './TopicsCarousel'
import Topic from './Topic'
import {genSubscribedData} from '../helper/dataHelper'
import AboutPage from './AboutPage'
import SubscribeButton from '../components/SubscribeButton'
import ListContainer from '../components/ListContainer'
import {EMPTY_CELL_HEIGHT} from '../components/ListContainer'
import {
  View,
  Text,
  StyleSheet,
  Navigator,
  Platform,
  Image,
  TouchableOpacity
} from 'react-native'

const EmptyPadding = Platform.OS === 'ios' ? EMPTY_CELL_HEIGHT : 0
class MySchedules extends Component {
  static propTypes = {
    navigator: PropTypes.object,
    days: PropTypes.array.isRequired,
    topics: PropTypes.object,
    updateTime: PropTypes.string,
    emptyOperation: PropTypes.func
  };

  render () {
    let profilePicture = (
      <Image source={require('../assets/personal.png')}
        style={{height: 90, width: 90, borderRadius: 45}}
      />
    )
    return (
      <ListContainer
        title='我的订阅'
        actionName='关于'
        androidTitle='我的订阅'
        actionFunc={this.goToAbout}
        parallaxContent={profilePicture}
        backgroundImage={require('../assets/my-g8-background.png')}
        backgroundColor='#A8D769'>
        <PureListView data={this.props.topics}
          enableEmptySections
          renderSectionHeader={this.renderSectionHeader}
          renderRow={this.renderRow}
          renderEmptyView={this.renderEmptyView}/>
      </ListContainer>
    )
  }

  renderEmptyView = () => {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: EmptyPadding}}>
        <Image source={require('../assets/no-topics-added.png')} />
        <Text style={styles.message}>您订阅的主题将会{'\n'}展现于此</Text>
        <SubscribeButton style={{width: 220, marginTop: 15}} onPress={this.props.emptyOperation}/>
      </View>
    )
  }

  renderRow = (item, index, renderSeparator) => {
    return (
      <TouchableOpacity onPress={() => this.goToCarousel(item)}>
        <Topic topic={item} isSubscribed/>
      </TouchableOpacity>
    )
  }

  goToAbout = () => {
    this.props.navigator.push({
      component: AboutPage,
      scene: Navigator.SceneConfigs.PushFromRight,
      updateTime: this.props.updateTime
    })
  }

  goToCarousel = (item) => {
    this.props.navigator.push({
      component: TopicsCarousel,
      day: this.props.days[item.dayId],
      topic: item
    })
  }

  renderSectionHeader = (dayData, dayName) => {
    if (dayData.length === 0) {
      return null
    }
    return (
      <View key={dayName} style={{backgroundColor: '#eeeeee'}}>
        <Text style={[{margin: 6, marginLeft: 8}, styles.font]}>{dayName}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  font: {
    fontSize: 12.5,
    color: '#555555'
  },
  message: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 22,
    color: '#7a8698'
  }
})

const mapStateToProps = state => ({
  days: state.data.days,
  updateTime: state.data.updateTime,
  topics: genSubscribedData(state.data.days, state.schedule.subscription)
})

module.exports = connect(mapStateToProps)(MySchedules)
