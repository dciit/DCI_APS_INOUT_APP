import {combineReducers} from 'redux'
import exportDataInOut from './exportDataInOutReducer'
import remarkReducer from './remarkReducer'

const rootReducer = combineReducers({
    exportDataInOutStateReducer: exportDataInOut,
    remarkStateReducer:remarkReducer

})

export default rootReducer