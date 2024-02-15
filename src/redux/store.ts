import { createStore, applyMiddleware } from "redux";
import languageReducer from "./language/languageReducer";
import recommendProductsReducer from "./recommendProducts/recommendProductsReducer";
import thunk from "redux-thunk";
import { actionLog } from "./middlewares/actionLog";
import { ProductDetailSlice } from "./productDetail/slice";
import { ProductSearchSlice } from "./productSearch/slice";
import { combineReducers, configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { UserSlice } from "./user/slice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { ShoppingCartSlice } from "./shoppingCart/slice";
import { OrderSlice } from "./order/slice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"]
}

const rootReducer = combineReducers({
  language: languageReducer,
  recommendProducts: recommendProductsReducer,
  productDetail: ProductDetailSlice.reducer,
  productSearch: ProductSearchSlice.reducer,
  user: UserSlice.reducer,
  shoppingCart: ShoppingCartSlice.reducer,
  order: OrderSlice.reducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer);

// const store = createStore(rootReducer, applyMiddleware(thunk, actionLog));
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(actionLog),
  devTools: true,
});

const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

export default { store, persistor };