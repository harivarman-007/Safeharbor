import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as inventoryService from '../../services/inventoryService';

export const fetchInventory = createAsyncThunk(
  'inventory/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const data = await inventoryService.getInventory(params);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const addInventoryItem = createAsyncThunk(
  'inventory/addItem',
  async (data, { rejectWithValue }) => {
    try {
      const result = await inventoryService.addInventoryItem(data);
      return result;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateStock = createAsyncThunk(
  'inventory/updateStock',
  async ({ id, quantity }, { rejectWithValue }) => {
    try {
      const result = await inventoryService.updateInventoryStock(id, quantity);
      return result;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const initialState = {
  items: [],
  shortages: [],
  loading: false,
  error: null,
  pagination: null,
};

const updateShortages = (items) => {
  return items.filter(item => item.availableQuantity <= item.criticalThreshold);
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    clearInventoryError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.content !== undefined) {
          state.items = action.payload.content;
          state.pagination = {
            pageNumber: action.payload.number,
            totalPages: action.payload.totalPages,
            totalElements: action.payload.totalElements,
            size: action.payload.size,
          };
        } else {
          state.items = action.payload || [];
          state.pagination = null;
        }
        state.shortages = updateShortages(state.items);
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Item
      .addCase(addInventoryItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addInventoryItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
        state.shortages = updateShortages(state.items);
      })
      .addCase(addInventoryItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Stock
      .addCase(updateStock.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStock.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.shortages = updateShortages(state.items);
      })
      .addCase(updateStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearInventoryError } = inventorySlice.actions;
export default inventorySlice.reducer;
