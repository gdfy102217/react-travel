import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface ShoppingCartState {
  items: any;
  loading: boolean;
  error: string | null;
}

const initialState : ShoppingCartState = {
  items: [],
  loading: true,
  error: null,
}

export const getShoppingCart = createAsyncThunk(
  "shoppingCart/getShoppingCart",
  async (jwt: string, thunkAPI) => {  
    const { data } = await axios.get(
      `http://82.157.43.234:8080/api/shoppingCart`,
      {
        headers: {
          Authorization: `bearer ${jwt}`
        }
      }
    );
    return data.shoppingCartItems;
  }
)

export const addShoppingCartItem = createAsyncThunk(
  "shoppingCart/addShoppingCartItem",
  async (parameters: {jwt: string, touristRouteId: string}, thunkAPI) => {  
    const { data } = await axios.post(
      `http://82.157.43.234:8080/api/shoppingCart/items`,
      {
        touristRouteId: parameters.touristRouteId
      },
      {
        headers: {
          Authorization: `bearer ${parameters.jwt}`
        }
      }
    );
    return data.shoppingCartItems;
  }
)

export const checkout = createAsyncThunk(
  "shoppingCart/checkout",
  async (jwt: string, thunkAPI) => {  
    const { data } = await axios.post(
      `http://82.157.43.234:8080/api/shoppingCart/checkout`,
      null,
      {
        headers: {
          Authorization: `bearer ${jwt}`
        }
      }
    );
    return data;
  }
)

export const clearShoppingCartItem = createAsyncThunk(
  "shoppingCart/clearShoppingCartItem",
  async (parameters: {jwt: string, itemIds: number[] }, thunkAPI) => {  
    return await axios.delete(
      `http://82.157.43.234:8080/api/shoppingCart/items/(${parameters.itemIds.join(',')})`,
      {
        headers: {
          Authorization: `bearer ${parameters.jwt}`
        }
      }
    );
  }
)

export const ShoppingCartSlice = createSlice({
  name: "shoppingCart",
  initialState,
  reducers: {
    
  },
  extraReducers: {
    [getShoppingCart.pending.type]: (state) => {
      state.loading = true;
    },
    [getShoppingCart.fulfilled.type]: (state, action: PayloadAction<any>) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    [getShoppingCart.rejected.type]: (state, action: PayloadAction<string | null>) => {
      state.loading = false;
      state.error = action.payload;
    },
    [addShoppingCartItem.pending.type]: (state) => {
      state.loading = true;
    },
    [addShoppingCartItem.fulfilled.type]: (state, action: PayloadAction<any>) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    [addShoppingCartItem.rejected.type]: (state, action: PayloadAction<string | null>) => {
      state.loading = false;
      state.error = action.payload;
    },
    [clearShoppingCartItem.pending.type]: (state) => {
      state.loading = true;
    },
    [clearShoppingCartItem.fulfilled.type]: (state) => {
      state.items = [];
      state.loading = false;
      state.error = null;
    },
    [clearShoppingCartItem.rejected.type]: (state, action: PayloadAction<string | null>) => {
      state.loading = false;
      state.error = action.payload;
    },
    [checkout.pending.type]: (state) => {
      state.loading = true;
    },
    [checkout.fulfilled.type]: (state, action: PayloadAction<any>) => {
      state.items = [];
      state.loading = false;
      state.error = null;
    },
    [checkout.rejected.type]: (state, action: PayloadAction<string | null>) => {
      state.loading = false;
      state.error = action.payload;
    },
  }
});
