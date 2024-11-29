import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  products: [],
  currentProduct:[],
  currentUser:[],
  loading: false,
  error: null,
};
// Fetch all products thunk
export const getAllProducts = createAsyncThunk('products/getAllProducts',
  async (requestorID) => {
    console.log('adsasadas');
    try {
      const response = await axios.get(`http://endpointshop/api.php?action=getAllProducts&requestorID=${requestorID}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

// Fetch user products thunk
export const getUserProducts = createAsyncThunk('products/getUserProducts',
  async ({ userId, requestorID }) => {  // Use destructuring to access the IDs
    
    try {
      const response = await axios.get(`http://endpointshop/api.php?action=getUserProducts&userId=${userId}&requestor_id=${requestorID}`);  
      return response.data;
      
    } catch (error) {
      throw error;
    }
  }
);

export const getCurrentProduct = createAsyncThunk('products/getCurrentProduct',
    async ({ product_id, user_id ,requestorID}) => {
      
        try {
            const response = await axios.get(`http://endpointshop/api.php?action=getCurrentProduct&product_id=${product_id}&user_id=${user_id}&requestor_id=${requestorID}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
);
export const statusToggle = createAsyncThunk('products/statusToggle',
  async (product_id) => {
    
      try {
          const response = await axios.get(`http://endpointshop/api.php?action=statusToggle&product_id=${product_id}`);
          console.log(response.data);
          
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
        //get All products
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
        //get current product
      .addCase(getCurrentProduct.pending, (state, action) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getCurrentProduct.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message;;
        })
      .addCase(getCurrentProduct.fulfilled, (state, action) => {
          state.loading = false;
          state.currentProduct = action.payload;
        })
        //get user products
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
      })
      .addCase(statusToggle.pending, (state) => {
        state.loading = true;
        state.error = null; 
      })
      .addCase(statusToggle.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(statusToggle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default productSlice.reducer;
export const { resetProductState } = productSlice.actions;
