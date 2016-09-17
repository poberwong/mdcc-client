import { combineReducers } from 'redux'
import schedule from './schedule'
import data from './data'

export default combineReducers({
  schedule,
  data
})
