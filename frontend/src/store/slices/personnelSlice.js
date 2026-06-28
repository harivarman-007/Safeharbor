import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as personnelService from '../../services/personnelService';

export const fetchPersonnel = createAsyncThunk(
  'personnel/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const data = await personnelService.getAllPersonnel(params);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deactivatePersonnel = createAsyncThunk(
  'personnel/deactivate',
  async (id, { rejectWithValue }) => {
    try {
      await personnelService.deactivatePersonnel(id);
      return id;
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

const personnelSlice = createSlice({
  name: 'personnel',
  initialState,
  reducers: {
    clearPersonnelError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchPersonnel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPersonnel.fulfilled, (state, action) => {
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
      .addCase(fetchPersonnel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Deactivate
      .addCase(deactivatePersonnel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deactivatePersonnel.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item.id === action.payload);
        if (index !== -1) {
          state.items[index].isActive = false;
        }
      })
      .addCase(deactivatePersonnel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearPersonnelError } = personnelSlice.actions;
export default personnelSlice.reducer;
