import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  restaurantId: null,
  isAuthenticated: false,
  userId: null,
  role: null,
  numRestaurants: 0, 
};

const authenticationSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    login(state, action) {
      state.userId = action.payload.userId;
      state.restaurantId = action.payload.restaurantId;
      state.role = action.payload.role;
      state.isAuthenticated = true;
      state.numRestaurants = action.payload.numRestaurants;
    },
    logout(state) {
      state.restaurantId = null;
      state.isAuthenticated = false;
      state.userId = null;
      state.role = null;
      state.numRestaurants = 0;
    },
    updateRestaurant(state, action) {
      state.restaurantId = action.payload;
    },
  },
});

export const { login, logout, updateRestaurant } = authenticationSlice.actions;

export default authenticationSlice.reducer;
