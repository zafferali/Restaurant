import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  restaurantId: null,
  isAuthenticated: false,
  userId: null,
  role: null,
  numRestaurants: 0,
  loading: true
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
    setAuthenticated(state, action) {
      state.userId = action.payload.userId;
      state.restaurantId = action.payload.restaurantId;
      state.role = action.payload.role;
      state.numRestaurants = action.payload.numRestaurants;
      state.isAuthenticated = action.payload.isAuthenticated;
      state.loading = false;
    },
  },
});

export const { login, logout, updateRestaurant, setAuthenticated } = authenticationSlice.actions;

export default authenticationSlice.reducer;
