import React, {Component, PropTypes} from 'react'
import TopicDetail from './TopicDetail'
import Carousel from '../components/Carousel'
import F8PageControl from '../components/F8PageControl'
import {
  View,
  Text,
  Image,
  Platform,
  TouchableOpacity,
  StyleSheet
} from 'react-native'
const ABOVE_LOLIPOP = Platform.Version && Platform.Version > 19
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 20 : (ABOVE_LOLIPOP ? 25 : 0)
const NAV_BAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56
export default class extends Component {

  static propTypes = {
    day: PropTypes.object,
    topic: PropTypes.object,
    navigator: PropTypes.object
  };

  constructor (props) {
    super(props)
    let flatTopicsList = []
    let contexts = []
    const allTopics = this.props.day.topics
    for (let sessionTitle in allTopics) {
      const sessionLength = allTopics[sessionTitle].length

      let rowIndex = 0
      allTopics[sessionTitle].forEach(topic => {
        flatTopicsList.push(topic)
        contexts.push({
          rowIndex,
          sessionLength,
          sessionTitle: topic.session.session_title
        })
        rowIndex++
      })
    }

    const selectedIndex = flatTopicsList.findIndex(s => s.id === this.props.topic.id)

    this.state = {
      count: flatTopicsList.length,
      selectedIndex,
      flatTopicsList,
      contexts
    }
  }

  render () {
    const {rowIndex, sessionLength, sessionTitle} = this.state.contexts[this.state.selectedIndex]
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerLeft} onPress={this.dismiss}>
            <Image source={require('../assets/x-white.png')} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.title} numberOfLines={2}>
              <Text style={styles.day}>{this.props.day.name}</Text>
              {'\n'}
              <Text style={styles.time}>{sessionTitle}</Text>
            </Text>
            <F8PageControl
              count={sessionLength}
              selectedIndex={rowIndex}
            />
          </View>
          <View style={{flex: 1}}/>
        </View>
        <Carousel
          count={this.state.count}
          selectedIndex={this.state.selectedIndex}
          onSelectedIndexChange={this.handleIndexChange}
          renderCard={this.renderCard}
        />
      </View>
    )
  }

  renderCard = (index) => {
    return (
      <TopicDetail
        key={index}
        style={styles.card}
        topic={this.state.flatTopicsList[index]}
      />
    )
  }

  handleIndexChange = (selectedIndex) => {
    this.setState({ selectedIndex })
  }

  dismiss = () => {
    this.props.navigator.pop()
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6ec0df'
  },
  header: {
    paddingTop: STATUS_BAR_HEIGHT,
    flexDirection: 'row'
  },
  headerLeft: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 10
  },
  headerContent: {
    flex: 3,
    height: NAV_BAR_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center'
  },
  day: {
    fontWeight: 'bold'
  },
  card: {
    borderRadius: 2,
    marginHorizontal: 3
  }
})
