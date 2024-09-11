import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: []
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    updateOrder(state, action) {
        const index = state.orders.findIndex(order => order.id === action.payload);
        if (index !== -1) {
          state.orders[index].status = 'ready';
        }
      },
    removeOrder(state, action) {
      state.orders = state.orders.filter(order => order.id !== action.payload);
    }
  }
});

export const { updateOrder, removeOrder } = ordersSlice.actions;

export default ordersSlice.reducer;
