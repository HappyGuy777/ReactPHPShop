// // features/user/userSlice.js
// import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import axios from 'axios';
//
// // Define the initial state
// const initialState = {
//     userInfo: null,
//     loading: false,
//     error: null,
// };
//
// // Define the asynchronous thunk for fetching user data
// export const fetchUser = createAsyncThunk('user/fetchUser', async () => {
//     try {
//         const response = await axios.get('http://endpointshop/api.php?action=getUser');
//         return response.data;
//     } catch (error) {
//         throw error;
//     }
// });
//
// // Create a slice for user authentication
// const userSlice = createSlice({
//     name: 'user',
//     initialState,
//     reducers: {
//         resetUserState(state) {
//             // Reset state to its initial values
//             return initialState;
//         },
//         updateUser(state, action) {
//             state.userInfo = action.payload;
//         },
//         deleteUser(state) {
//             state.userInfo = null;
//         },
//     },
//     extraReducers: (builder) => {
//         builder
//             .addCase(fetchUser.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(fetchUser.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.userInfo = action.payload;
//             })
//             .addCase(fetchUser.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.error.message;
//             });
//     },
// });
//
// // Export action creators
// export const {resetUserState, updateUser, deleteUser } = userSlice.actions;
//
// // Export reducer
// export default userSlice.reducer;
