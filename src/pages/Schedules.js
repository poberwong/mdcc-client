import React, { Component, PropTypes } from 'react'
import PureListView from '../components/PureListView'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {combineData} from '../helper/dataHelper'
import {loadData} from '../reducers/data'
import ListContainer from '../components/ListContainer'
import TopicsCarousel from './TopicsCarousel'
import Topic from './Topic'
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity
} from 'react-native'
const API = 'http://android-gems.com/api/mdcc'
class Schedules extends Component {
  static propTypes = {
    navigator: PropTypes.object,
    loadData: PropTypes.func,
    loading: PropTypes.bool.isRequired,
    days: PropTypes.array.isRequired
  };

  render () {
    const {loading, days} = this.props
    if (loading || days.length === 0) {
      return (
        <View style={[styles.container, styles.center]} >
          <Text>Loading...</Text>
        </View>
      )
    }

    let parallaxContent = (
      <View style={[styles.center]}>
        <Image source={{uri: 'http://img.bss.csdn.net/201607071756148167.png'}} resizeMode='contain' style={{height: 50, width: 250}}/>
        <Text style={{color: 'white', fontSize: 29, marginTop: 15}}>中国移动开发者大会</Text>
        <Text style={{color: 'rgba(255, 255, 255, 0.7)', fontSize: 11, marginTop: 3}}>9月23日 - 24日/北京 · 国家会议中心</Text>
      </View>
    )
    return (
      <ListContainer
        title='中国移动开发者大会'
        needTransitionTitle
        parallaxContent={parallaxContent}
        backgroundImage={require('../assets/schedule-background.png')}>
        <PureListView data={days[0].topics}
          title={days[0].name}
          renderRow={this.renderRow}
          enableEmptySections
          renderSectionHeader={this.renderSectionHeader} />
        <PureListView data={days[1].topics}
          title={days[1].name}
          renderRow={this.renderRow}
          enableEmptySections
          renderSectionHeader={this.renderSectionHeader} />
      </ListContainer>
    )
  }

  renderRow = (item, index) => {
    if (item.is_rest) {
      return <Topic topic={item} isSubscribed={item.isSubscribed}/>
    }
    return (
      <TouchableOpacity onPress={() => this.goToCarousel(item)}>
        <Topic topic={item} isSubscribed={item.isSubscribed}/>
      </TouchableOpacity>
    )
  }

  goToCarousel = (item) => {
    this.props.navigator.push({
      component: TopicsCarousel,
      day: this.props.days[item.dayId],
      topic: item
    })
  }

  renderSectionHeader = (sessionData, sessionTitle) => {
    return (
      <View key={sessionTitle + (Math.random() * 10).toFixed()} style={{backgroundColor: '#eeeeee'}}>
        <Text style={[{margin: 6, marginLeft: 8}, styles.font]}>{sessionTitle}</Text>
      </View>
    )
  }

  componentDidMount () {
    this.props.loadData(API)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  font: {
    fontSize: 12.5,
    color: '#555555'
  }
})

const mapStateToProps = state => ({
  loading: state.data.loading,
  error: state.data.error,
  days: combineData(state.data.days, state.schedule.subscription)
})

const mapDispatchToProps = dispatch =>
  bindActionCreators({loadData}, dispatch)

module.exports = connect(mapStateToProps, mapDispatchToProps)(Schedules)
