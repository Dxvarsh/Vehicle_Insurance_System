import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import notificationService from '../../services/notificationService';

export const fetchAllNotifications = createAsyncThunk(
  'notification/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await notificationService.getNotifications(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications');
    }
  }
);

export const fetchMyNotifications = createAsyncThunk(
  'notification/fetchMy',
  async (params, { rejectWithValue }) => {
    try {
      const response = await notificationService.getMyNotifications(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch your notifications');
    }
  }
);

export const fetchUnreadCount = createAsyncThunk(
  'notification/fetchUnreadCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificationService.getUnreadCount();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch unread count');
    }
  }
);

export const markAsRead = createAsyncThunk(
  'notification/markAsRead',
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const response = await notificationService.markAsRead(id);
      dispatch(fetchUnreadCount());
      return { id, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark notification as read');
    }
  }
);

export const markAllAsRead = createAsyncThunk(
  'notification/markAllAsRead',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await notificationService.markAllAsRead();
      dispatch(fetchUnreadCount());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark all as read');
    }
  }
);

export const deleteNotification = createAsyncThunk(
  'notification/delete',
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const response = await notificationService.deleteNotification(id);
      dispatch(fetchUnreadCount());
      return { id, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete notification');
    }
  }
);

export const sendBroadcast = createAsyncThunk(
  'notification/sendBroadcast',
  async (data, { rejectWithValue }) => {
    try {
      const response = await notificationService.sendCustomNotification(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send broadcast');
    }
  }
);

const initialState = {
  notifications: [],
  myNotifications: [],
  unreadCount: 0,
  loading: false,
  btnLoading: false,
  error: null,
  success: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    clearNotificationStatus: (state) => {
      state.error = null;
      state.success = null;
    },
    resetNotificationState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch All (Admin)
      .addCase(fetchAllNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAllNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch My (Customer)
      .addCase(fetchMyNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.myNotifications = action.payload.data;
        state.pagination = action.payload.pagination;
        state.unreadCount = action.payload.unreadCount || state.unreadCount;
      })
      .addCase(fetchMyNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Unread Count
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload.data.unreadCount;
      })

      // Mark as Read
      .addCase(markAsRead.fulfilled, (state, action) => {
        const index = state.myNotifications.findIndex((n) => n._id === action.payload.id);
        if (index !== -1) {
          state.myNotifications[index].isRead = true;
        }
      })

      // Mark All as Read
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.myNotifications = state.myNotifications.map((n) => ({ ...n, isRead: true }));
        state.unreadCount = 0;
      })

      // Delete
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.myNotifications = state.myNotifications.filter((n) => n._id !== action.payload.id);
        state.notifications = state.notifications.filter((n) => n._id !== action.payload.id);
      })

      // Send Broadcast
      .addCase(sendBroadcast.pending, (state) => {
        state.btnLoading = true;
      })
      .addCase(sendBroadcast.fulfilled, (state, action) => {
        state.btnLoading = false;
        state.success = action.payload.message;
      })
      .addCase(sendBroadcast.rejected, (state, action) => {
        state.btnLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearNotificationStatus, resetNotificationState } = notificationSlice.actions;
export default notificationSlice.reducer;
