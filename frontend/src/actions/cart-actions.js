import axios from '../config/axios'
export const REMOVE_ITEM='REMOVE_ITEM'
export const ADD_ITEM='ADD_ITRM'



export const startAddItem=(id)=>{
       return async(dispatch)=>{
          try{
            console.log(id)
             const response =await axios.get(`http://localhost:7777/service/${id}`,{
                headers:{
                    Authorization:localStorage.getItem('token')
                }
             })
             console.log(response.data)
             dispatch(addItem(response.data))
          }catch(err){
                alert(err)
          }
       }
}

const addItem=(data)=>{
     return {type:ADD_ITEM,payload:data}
}