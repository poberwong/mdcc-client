import React, { Component } from 'react'
import reducers from './reducers'
import thunk from 'redux-thunk'
import {Provider} from 'react-redux'
import {persistStore, autoRehydrate} from 'redux-persist'
import {createStore, applyMiddleware} from 'redux'
import {AsyncStorage} from 'react-native'
import codePush from 'react-native-code-push'
import apiRequest from './helper/apiRequestMiddleware'
import Home from './pages/MainScreen'

const createStoreWithMiddleware = applyMiddleware(thunk, apiRequest)(createStore)

const store = autoRehydrate()(createStoreWithMiddleware)(reducers)
persistStore(store, {storage: AsyncStorage})
import {
  Platform,
  StatusBar,
  BackAndroid,
  View,
  Navigator
} from 'react-native'

export const STATUS_BAR_HEIGHT = (Platform.OS === 'ios' ? 20 : 25)
export const NAV_BAR_HEIGHT = (Platform.OS === 'ios' ? 44 : 56)
export const ABOVE_LOLIPOP = Platform.Version && Platform.Version > 19

export default class extends Component {
  /*
   * IMMEDIATE(0) // 更新完毕，立即生效
   * ON_NEXT_RESTART(1) // 下次启动生效
   * ON_NEXT_RESUME(2) // 切到后台，重新回来生效
   */
  componentDidMount () {
    codePush.sync({
      updateDialog: {
        optionalIgnoreButtonLabel: '稍后',
        optionalInstallButtonLabel: '更新',
        mandatoryUpdateMessage: '',
        optionalUpdateMessage: '',
        appendReleaseDescription: true,
        descriptionPrefix: '有新版本，是否下载？\n\n ===更新内容===\n',
        title: '更新提示'
      },
      installMode: codePush.InstallMode.ON_NEXT_RESUME
    })
    BackAndroid.addEventListener('hardwareBackPress', this.handleBack)
  }

  componentWillUnmount () {
    BackAndroid.removeEventListener('hardwareBackPress', this.handleBack)
  }

  handleBack = () => {
    const navigator = this.refs.navigator
    if (navigator && navigator.getCurrentRoutes().length > 1) {
      navigator.pop()
      return true
    }
    return false
  };

  render () {
    return (
      <Provider store={store}>
        <View style={{flex: 1}}>
          <StatusBar
            barStyle='light-content'
            backgroundColor='transparent'
            style={{height: STATUS_BAR_HEIGHT}}
            translucent={ABOVE_LOLIPOP}
          />
          <Navigator
            ref='navigator'
            initialRoute={{
              component: Home
            }}
            configureScene={this.configureScene}
            renderScene={(route, navigator) => {
              return <route.component navigator={navigator} {...route} {...route.passProps}/>
            }}/>
        </View>
      </Provider>
    )
  }

  configureScene (route) {
    return route.scene || Navigator.SceneConfigs.FloatFromBottom
  }
}
