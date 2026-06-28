import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import incidentReducer from './slices/incidentSlice';
import inventoryReducer from './slices/inventorySlice';
import dispatchReducer from './slices/dispatchSlice';
import shelterReducer from './slices/shelterSlice';
import personnelReducer from './slices/personnelSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    incidents: incidentReducer,
    inventory: inventoryReducer,
    dispatches: dispatchReducer,
    shelters: shelterReducer,
    personnel: personnelReducer,
  },
});
