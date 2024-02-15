import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface ProductSearchState {
  data: any;
  loading: boolean;
  error: string | null;
  pagination: any;
}

const initialState : ProductSearchState = {
  data: null,
  loading: true,
  error: null,
  pagination: null,
}

export const searchProduct = createAsyncThunk(
  "productSearch/searchProduct",
  async (parameters: {
    keywords: string,
    nextPage: number | string,
    pageSize: number | string,
  }, thunkAPI) => {
    let url = `http://82.157.43.234:8080/api/touristRoutes?pageNumber=${parameters.nextPage}&pageSize=${parameters.pageSize}`;
    if (parameters.keywords) {
      url += `&keywords=${parameters.keywords}`
    }
    const response = await axios.get(url);
    return {
      data: response.data,
      pagination: JSON.parse(response.headers["x-pagination"])
    };
  }
)

export const ProductSearchSlice = createSlice({
  name: "productSearch",
  initialState,
  reducers: {
    
  },
  extraReducers: {
    [searchProduct.pending.type]: (state) => {
      state.loading = true;
    },
    [searchProduct.fulfilled.type]: (state, action: PayloadAction<any>) => {
      state.data = action.payload.data;
      state.pagination = action.payload.pagination;
      state.loading = false;
      state.error = null;
    },
    [searchProduct.rejected.type]: (state, action: PayloadAction<string | null>) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
});
