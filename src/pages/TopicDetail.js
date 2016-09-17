import React, {Component, PropTypes} from 'react'
import Topic from './Topic'
import {connect} from 'react-redux'
import {subscribe, unsubscribe} from '../reducers/schedule'
import SubscribeButton from '../components/SubscribeButton'
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet
} from 'react-native'
const AWESOME_COLOR = ['red', 'orange', 'green', 'cyan', 'blue', 'purple']
export default class TopicDetail extends Component {
  static propTypes = {
    topic: PropTypes.object,
    subscribe: PropTypes.func,
    unsubscribe: PropTypes.func,
    isSubscribed: PropTypes.bool,
    style: View.propTypes.style
  }

  render () {
    const {topic, isSubscribed} = this.props
    const {time, time_start, time_end} = topic
    const duration = getDuration(time_start, time_end)
    const sessionColor = AWESOME_COLOR[topic.id % AWESOME_COLOR.length]
    return (
      <View style={[styles.container, this.props.style]}>
        <View style={styles.header}>
          <Text style={[styles.headerFont, {color: sessionColor}]}>{time}</Text>
          <Text style={styles.headerFont}> {duration} mins</Text>
        </View>
        <ScrollView style={styles.content}>
          <Topic topic={topic} style={{paddingLeft: 0, paddingRight: 0}} lineNumber={2}/>
          {this.renderContent()}
        </ScrollView>
        { !topic.is_rest &&
          <View style={styles.footer}>
            <SubscribeButton isSubscribed={isSubscribed} onPress={this.toggleAdded} />
          </View>
        }
      </View>
    )
  }

  toggleAdded = () => {
    if (this.props.isSubscribed) {
      this.props.unsubscribe()
    } else {
      this.props.subscribe()
    }
  };

  renderContent = () => {
    const {topic} = this.props
    if (topic.is_rest) {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 80}}>
          <Image source={require('../assets/rest-self.png')} style={{width: 96 * 0.7, height: 108 * 0.7}}/>
          <Image source={require('../assets/hacker-way.png')} style={{marginTop: 40}}/>
        </View>
        )
    } else {
      return <Text style={styles.description}>{convert(topic.session.session_intro)}</Text>
    }
  }
}

function convert (input) {
  return input.replace(/\\n/g, '\n')
}

function getDuration (start, end) {
  if (!(start && end)) { return }
  const parsedStart = start.split(':')
  const parsedEnd = end.split(':')
  return (parsedEnd[0] - parsedStart[0]) * 60 + (parsedEnd[1] - parsedStart[1])
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 30,
    borderBottomWidth: 1,
    borderColor: '#eee'
  },
  headerFont: {
    fontSize: 11,
    color: '#555555'
  },
  content: {
    padding: 10
  },
  description: {
    fontSize: 13,
    marginTop: 10,
    lineHeight: 20,
    color: '#555555'
  },
  footer: {
    borderTopWidth: 1,
    borderColor: '#eee'
  }
})

const mapStateToProps = (state, props) => ({
  loading: state.schedule.loading,
  error: state.schedule.error,
  isSubscribed: state.schedule.subscription.includes(props.topic.id)
})

const mapDispatchToProps = (dispatch, props) => {
  return {
    subscribe: () => dispatch(subscribe(props.topic.id)),
    unsubscribe: () => dispatch(unsubscribe(props.topic.id))
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(TopicDetail)
