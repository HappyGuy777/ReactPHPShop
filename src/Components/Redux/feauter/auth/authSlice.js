// authSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// Define initial state
const initialState = {
    userInfo:[],
    isLoggedIn: false,
    loading: false,
    error: null,
};

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
    try {
        const response = await axios.post('http://endpointshop/api.php?action=login', credentials);
        if (response.data.errors) {
            return rejectWithValue(response.data.errors);
        } else {
            return response.data.data;
        }
    } catch (error) {
        throw error;
    }
});
export const getUser = createAsyncThunk('auth/getUser', async (userId, { rejectWithValue }) => {
    try {
        const response = await axios.get(`http://endpointshop/api.php?action=getUser&userId=${userId}`);
        if (response.data.errors) {
            return rejectWithValue(response.data.errors);
        } else {
            return response.data.data;
        }
    } catch (error) {
        throw error;
    }
});

// Define the authentication slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        resetAuthState() {
            return initialState;
        },
        logout(state) {
            state.isLoggedIn = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.isLoggedIn = true;
                state.error = null;
                const userInfo=action.payload;
                state.userInfo=userInfo;

            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload; 
            })
            .addCase(getUser.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = action.payload;
            })
            .addCase(getUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Export actions and reducer
export const { resetAuthState, logout } = authSlice.actions;
export default authSlice.reducer;