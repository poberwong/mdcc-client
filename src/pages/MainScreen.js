import React, {PropTypes} from 'react'
import TabNavigator from 'react-native-tab-navigator'
import MySchedules from './MySchedules'
import Schedules from './Schedules'

import {
	Image,
	StyleSheet
} from 'react-native'

export default class extends React.Component {
  static propTypes = {
    navigator: PropTypes.object,
    user: PropTypes.object
  };

  state={
    selectedTab: 'schedules'
  }

  render () {
    return (
      <TabNavigator>
        <TabNavigator.Item
          selected={this.state.selectedTab === 'schedules'}
          title='日程安排'
          selectedTitleStyle={{color: '#032250'}}
          renderIcon={() => <Image source={require('../assets/schedule.png')} style={styles.icon} />}
          renderSelectedIcon={() => <Image source={require('../assets/schedule-active.png')} style={styles.icon} />}
          onPress={() => this.setState({ selectedTab: 'schedules' })}>
          <Schedules navigator={this.props.navigator} />
        </TabNavigator.Item>
        <TabNavigator.Item
          selected={this.state.selectedTab === 'mySchedules'}
          title='我的订阅'
          selectedTitleStyle={{color: '#032250'}}
          renderIcon={() => <Image source={require('../assets/my-schedule.png')} style={styles.icon} />}
          renderSelectedIcon={() => <Image source={require('../assets/my-schedule-active.png')} style={styles.icon} />}
          onPress={() => this.setState({ selectedTab: 'mySchedules' })}>
          <MySchedules navigator={this.props.navigator} emptyOperation={this.goHome}/>
        </TabNavigator.Item>
      </TabNavigator>
    )
  }

  goHome = () => {
    this.setState({
      selectedTab: 'schedules'
    })
  }
}

const styles = StyleSheet.create({
  icon: {
    height: 27,
    width: 26
  }
})
