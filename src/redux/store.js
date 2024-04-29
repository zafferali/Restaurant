import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './slices/uiSlice';
import authenticationReducer from './slices/authenticationSlice';
import ordersReducer from './slices/ordersSlice';

const store = configureStore({
  reducer: {
    authentication: authenticationReducer,
    ui: uiReducer,
    orders: ordersReducer,
  },
});

export default store;
