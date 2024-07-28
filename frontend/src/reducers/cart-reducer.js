import { REMOVE_ITEM,ADD_ITEM} from "../actions/cart-actions"

const initialState = {
    data: [],
}

const cartReducer = (state = initialState, action) => {

    switch(action.type) {
        case REMOVE_ITEM:{
            return {...state ,data:state.data.filter(ele=> ele._id !== action.payload)}
        }
        case ADD_ITEM:{
            return{...state,data:[...state.data,action.payload]}
        }
        default: {
            return {...state}
        }
    }
}

export default cartReducer