import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './slices/uiSlice';
import authenticationReducer from './slices/authenticationSlice';
import ordersReducer from './slices/ordersSlice';
import userReducer from './slices/userSlice';

const store = configureStore({
  reducer: {
    authentication: authenticationReducer,
    ui: uiReducer,
    orders: ordersReducer,
    user: userReducer,
  },
});

export default store;
