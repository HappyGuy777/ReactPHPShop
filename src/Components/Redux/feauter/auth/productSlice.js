import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  products: [],
  loading: false,
  error: null,
};
// Fetch all products thunk
export const getAllProducts = createAsyncThunk('products/getAllProducts',
  async () => {
    try {
      const response = await axios.get('http://endpointshop/api.php?action=getAllProducts');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

// Fetch user products thunk
export const getUserProducts = createAsyncThunk('products/getUserProducts',
  async (userId) => {
    try {
      const response = await axios.get(`http://endpointshop/api.php?action=getUserProducts&userId=${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

// ProductSlice
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    resetProductState(state) {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear previous error when starting request
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getUserProducts.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear previous error when starting request
      })
      .addCase(getUserProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(getUserProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default productSlice.reducer;
export const { resetProductState } = productSlice.actions;
