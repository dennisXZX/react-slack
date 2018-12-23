import { combineReducers } from 'redux'
import userReducer from './userReducer'
import channelReducer from './channelReducer'
import colorsReducer from './colorsReducer'

const rootReducer = combineReducers({
  user: userReducer,
  channel: channelReducer,
  colors: colorsReducer
})

export default rootReducer