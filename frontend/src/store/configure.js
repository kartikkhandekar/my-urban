import cartReducer from '../reducers/cart-reducer'
import { createStore, combineReducers,applyMiddleware} from 'redux'
import {thunk} from 'redux-thunk'

const configureStore = () => { 
    const store = createStore(combineReducers({
        cart:cartReducer
    }),applyMiddleware(thunk))
    return store 
}

export default configureStore
