import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as shelterService from '../../services/shelterService';

export const fetchShelters = createAsyncThunk(
  'shelters/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const data = await shelterService.getShelters(params);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const registerShelter = createAsyncThunk(
  'shelters/register',
  async (data, { rejectWithValue }) => {
    try {
      const result = await shelterService.registerShelter(data);
      return result;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateOccupancy = createAsyncThunk(
  'shelters/updateOccupancy',
  async ({ id, intakeCount }, { rejectWithValue }) => {
    try {
      const result = await shelterService.adjustShelterOccupancy(id, intakeCount);
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

const shelterSlice = createSlice({
  name: 'shelters',
  initialState,
  reducers: {
    clearShelterError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchShelters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShelters.fulfilled, (state, action) => {
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
      .addCase(fetchShelters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(registerShelter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerShelter.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(registerShelter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Occupancy
      .addCase(updateOccupancy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOccupancy.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateOccupancy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearShelterError } = shelterSlice.actions;
export default shelterSlice.reducer;
