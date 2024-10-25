import { createSlice } from "@reduxjs/toolkit";



export const userSlice = createSlice({
    name:'user',
    initialState:"",
    reducers:{
     setUserId: (state,action) => {
       return action.payload
     }
    }
})

export const {setUserId} = userSlice.actions
export default userSlice.reducer;