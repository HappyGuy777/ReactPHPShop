import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  cart: [], // Static product data from the backend
  userChanges: [], // User-specific data like quantity and availability
  loading: false,
  error: null,
};

// Fetch latest product data thunk
export const fetchLatestProductData = createAsyncThunk(
  'cart/fetchLatestProductData',
  async (productIds, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://endpointshop/api.php?action=getLatestProductData', { productIds });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// cartSlice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingChange = state.userChanges.find(item => item.id === action.payload.id);
      if (existingChange) {
        existingChange.quantity += action.payload.quantity;
      } else {
        state.userChanges.push({ id: action.payload.id, quantity: action.payload.quantity, available: true });
      }
    },
    removeFromCart: (state, action) => {
      state.userChanges = state.userChanges.filter(item => item.id !== action.payload.id);
    },
    updateQuantity: (state, action) => {
      const productChange = state.userChanges.find(item => item.id === action.payload.id);
      if (productChange) {
        productChange.quantity = action.payload.quantity;
      }
    },
    resetCart: (state) => {
      state.cart = [];
      state.userChanges = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLatestProductData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLatestProductData.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload.data;
      })
      .addCase(fetchLatestProductData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch product data';
      });
  },
});

export const { addToCart, removeFromCart, updateQuantity, resetProductState,resetCart } = cartSlice.actions;
export default cartSlice.reducer;
