import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as dispatchService from '../../services/dispatchService';

export const fetchDispatches = createAsyncThunk(
  'dispatches/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const data = await dispatchService.getDispatches(params);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const requestDispatch = createAsyncThunk(
  'dispatches/request',
  async (data, { rejectWithValue }) => {
    try {
      const result = await dispatchService.requestDispatch(data);
      return result;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fulfillDispatch = createAsyncThunk(
  'dispatches/fulfill',
  async (id, { rejectWithValue }) => {
    try {
      const result = await dispatchService.fulfillDispatch(id);
      return result;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
  pagination: null,
};

const dispatchSlice = createSlice({
  name: 'dispatches',
  initialState,
  reducers: {
    clearDispatchError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchDispatches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDispatches.fulfilled, (state, action) => {
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
      })
      .addCase(fetchDispatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Request
      .addCase(requestDispatch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestDispatch.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(requestDispatch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fulfill
      .addCase(fulfillDispatch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fulfillDispatch.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(fulfillDispatch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearDispatchError } = dispatchSlice.actions;
export default dispatchSlice.reducer;
