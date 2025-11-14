import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import cartReducer from "./reducers/cart";
import userReducer from "./reducers/user";

//COMBINING ALL REDUCERS
const reducer = {
  cart: cartReducer,
  user: userReducer,
};

const rootReducer = combineReducers({
  cart: cartReducer,
  user: userReducer,
});

const makeStore = (context: any) => {
  const isServer = typeof window === 'undefined';
  
  if (isServer) {
    //If it's on server side, create a store
    return configureStore({
      reducer,
    });
  } else {
    //If it's on client side, create a store which will persist
    const persistConfig = {
      key: "shoppingcart",
      whitelist: ["cart", "user"], // only counter will be persisted, add other reducers if needed
      storage, // if needed, use a safer storage
    };

    const persistedReducer = persistReducer(persistConfig, rootReducer); // Create a new reducer with our existing reducer

    const store: any = configureStore({
      reducer: persistedReducer,
    }); // Creating the store again

    store.__persistor = persistStore(store); // This creates a persistor object & push that persisted object to .__persistor, so that we can avail the persistability feature

    return store;
  }
};

// export an assembled wrapper
export const wrapper = createWrapper(makeStore, { debug: false });

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof rootReducer>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = ReturnType<typeof makeStore>["dispatch"];