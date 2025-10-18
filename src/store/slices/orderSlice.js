import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { POST, GET, DELETE, PATCH } from '@/lib/api';
import { toast } from "react-toastify";

const initialState = {
    order: {},
    orders: []
};

export const createOrder = createAsyncThunk(
    "order/createOrder",
    async ({ setLoading, parentId, body }) => {
        try {
            setLoading(true);
            const { data } = await POST(`/parents/${parentId}/orders/create`, body);
            toast.success(data.message || "Order Placed Successfully");
            return data.data;
        } catch (err) {
            toast.error(err.response?.data || "Creating Order Failed")
            return rejectWithValue(err.response?.data || "Creating Order Failed");
        } finally {
            setLoading(false);
        }
    }
);

export const getAllOrders = createAsyncThunk(
    "order/getAllOrders",
    async ({ setLoading, adminId, search }) => {
        try {
            setLoading(true);
            const { data } = await GET(`/admin/${adminId}/orders?search=${search || ""}`);
            return data.data;
        } catch (err) {
            toast.error(err.response?.data || "Fetching Orders Failed")
            return rejectWithValue(err.response?.data || "Fetching Orders Failed");
        } finally {
            setLoading(false);
        }
    }
);

export const getAllSupplierOrders = createAsyncThunk(
    "order/getAllSupplierOrders",
    async ({ setLoading, adminId, search }) => {
        try {
            setLoading(true);
            const { data } = await GET(`/admin/${adminId}/orders/suppliers?search=${search || ""}`);
            return data.data;
        } catch (err) {
            toast.error(err.response?.data || "Fetching Orders Failed")
            return rejectWithValue(err.response?.data || "Fetching Orders Failed");
        } finally {
            setLoading(false);
        }
    }
);

export const getAllParentOrders = createAsyncThunk(
    "order/getAllParentOrders",
    async ({ setLoading, parentId }) => {
        try {
            setLoading(true);
            const { data } = await GET(`/parents/${parentId}/orders`);
            return data.data;
        } catch (err) {
            toast.error(err.response?.data || "Fetching Orders Failed")
            return rejectWithValue(err.response?.data || "Fetching Orders Failed");
        } finally {
            setLoading(false);
        }
    }
);

export const updateOrder = createAsyncThunk(
    "order/updateOrder",
    async ({ setLoading, adminId, orderId, formData }) => {
        try {
            setLoading(true);
            const { data } = await PATCH(`/admin/${adminId}/orders/${orderId}`, formData);
            toast.success(data.message);
            return data.data;
        } catch (err) {
            toast.error(err.response?.data || "Updating Order Failed")
            return rejectWithValue(err.response?.data || "Updating Order Failed");
        } finally {
            setLoading(false);
        }
    }
);

export const delOrder = createAsyncThunk(
    "order/delOrder",
    async ({ setLoading, adminId, orderId }) => {
        try {
            setLoading(true);
            const { data } = await DELETE(`/admin/${adminId}/orders/${orderId}`);
            toast.success(data.message);
            return data.data;
        } catch (err) {
            toast.error(err.response?.data || "Deleting Order Failed")
            return rejectWithValue(err.response?.data || "Deleting Order Failed");
        } finally {
            setLoading(false);
        }
    }
);

const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllOrders.fulfilled, (state, action) => {
                state.orders = action.payload;
            })
            .addCase(getAllSupplierOrders.fulfilled, (state, action) => {
                state.orders = action.payload;
            })
            .addCase(getAllParentOrders.fulfilled, (state, action) => {
                state.orders = action.payload;
            })
            .addCase(updateOrder.fulfilled, (state, action) => {
                const index = state.orders.findIndex((order) => order.id === action?.payload?.id)
                if (index !== -1) {
                    state.orders[index] = action.payload;
                }
            })
            .addCase(delOrder.fulfilled, (state, action) => {
                state.orders = state.orders.filter((order) => order.id !== action.payload);
            })
    }
});

export default orderSlice.reducer;