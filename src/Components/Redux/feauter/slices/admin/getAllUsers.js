import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  categories: [],
  loading: false,
  error: null,
};

export const getAllCategories = createAsyncThunk('categories/getAllCategories', async () => {
  const response = await axios.get('http://endpointshop/api.php?action=getAllUsers');
  return response.data.data; // Access the data property directly
});

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    resetCategoriesState(state) {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllCategories.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear previous error when starting request
      })
      .addCase(getAllCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(getAllCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default categoriesSlice.reducer;
export const { resetCategoriesState } = categoriesSlice.actions;
