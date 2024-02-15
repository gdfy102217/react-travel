import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface UserState {
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState : UserState = {
  token: null,
  loading: false,
  error: null,
}

export const signIn = createAsyncThunk(
  "user/signIn",
  async (parameters: {
    email: string,
    password: string,
  }, thunkAPI) => {  
    const { data } = await axios.post(
      `http://82.157.43.234:8080/auth/login`, {
        email: parameters.email,
        password: parameters.password,
      }
    );
    return data.token;
  }
)

export const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logOut: (state) => {
      state.token = null;
      state.error = null;
      state.loading = false;
    }
  },
  extraReducers: {
    [signIn.pending.type]: (state) => {
      state.loading = true;
    },
    [signIn.fulfilled.type]: (state, action: PayloadAction<any>) => {
      state.token = action.payload;
      state.loading = false;
      state.error = null;
    },
    [signIn.rejected.type]: (state, action: PayloadAction<string | null>) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
});
