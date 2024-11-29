    import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
    import axios from 'axios';

    // Define initial state
    const initialState = {
        userInfo: [],
        isLoggedIn: false,
        loading: false,        
        error: null,
    };

    // Async thunk to fetch user data
    export const getOtherProfile = createAsyncThunk(
        'otherProfile/getOtherProfile',
        async ({ userId, requestorID }, { rejectWithValue }) => { // Destructure userId and requestorID
            try {
                const response = await axios.get(`http://endpointshop/api.php?action=getUser&userId=${userId}&requestorID=${requestorID}`);
                if (response.data.errors) {
                    return rejectWithValue(response.data.errors);
                } else {
                    console.log(response.data);
                    return response.data.data;
                }
            } catch (error) {
                if (error.response && error.response.data) {
                    return rejectWithValue(error.response.data);
                } else {
                    return rejectWithValue(error.message);
                }
            }
        }
    );
    

    const otherProfileSlice = createSlice({
        name: 'otherProfile',
        initialState,
        reducers: {
            resetOtherProfileState() {
                return initialState;
            },
        },
        extraReducers: (builder) => {
            builder
                .addCase(getOtherProfile.pending, (state) => {
                    state.loading = true;
                    state.error = null;
                })
                .addCase(getOtherProfile.fulfilled, (state, action) => {
                    state.loading = false;
                    state.userInfo = action.payload;
                })
                .addCase(getOtherProfile.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload || 'Failed to fetch user data';
                });
        },
    });

    // Export actions and reducer
    export const { resetOtherProfileState } = otherProfileSlice.actions;
    export default otherProfileSlice.reducer;
