import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as incidentService from '../../services/incidentService';

export const fetchIncidents = createAsyncThunk(
  'incidents/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const data = await incidentService.getIncidents(params);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const reportIncident = createAsyncThunk(
  'incidents/report',
  async (data, { rejectWithValue }) => {
    try {
      const result = await incidentService.reportIncident(data);
      return result;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const changeIncidentStatus = createAsyncThunk(
  'incidents/changeStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const result = await incidentService.updateIncidentStatus(id, status);
      return { id, status, result };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const removeIncident = createAsyncThunk(
  'incidents/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await incidentService.deleteIncident(id);
      return { id, response };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const modifyIncident = createAsyncThunk(
  'incidents/modify',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const result = await incidentService.updateIncident(id, data);
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
  currentIncident: null,
  filterStatus: 'ALL',
  pagination: null,
};

const incidentSlice = createSlice({
  name: 'incidents',
  initialState,
  reducers: {
    selectIncident: (state, action) => {
      state.currentIncident = action.payload;
    },
    setFilterStatus: (state, action) => {
      state.filterStatus = action.payload;
    },
    clearIncidentError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchIncidents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIncidents.fulfilled, (state, action) => {
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
      .addCase(fetchIncidents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Report
      .addCase(reportIncident.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reportIncident.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(reportIncident.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Change status
      .addCase(changeIncidentStatus.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index].status = action.payload.status;
        }
      })
      .addCase(changeIncidentStatus.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Delete
      .addCase(removeIncident.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload.id);
      })
      .addCase(removeIncident.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Modify
      .addCase(modifyIncident.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(modifyIncident.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { selectIncident, setFilterStatus, clearIncidentError } = incidentSlice.actions;
export default incidentSlice.reducer;
