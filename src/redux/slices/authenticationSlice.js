import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  restaurantId: null,
  isAuthenticated: false,
  isFirstTime: false,
};

const authenticationSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    login(state, action) {
      state.restaurantId = action.payload;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.restaurantId = null;
      state.isAuthenticated = false;
    },
    updateRestaurant(state, action) {
      state.restaurantId.name = action.payload;
    },
  },
});

export const { login, logout, updateRestaurant } = authenticationSlice.actions;

export default authenticationSlice.reducer;


