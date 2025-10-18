import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { POST, GET, PATCH, DELETE } from '@/lib/api';
import { toast } from "react-toastify";

const initialState = {
    supplier: {},
    suppliers: [],
};

export const createSupplier = createAsyncThunk(
    "supplier/createSupplier",
    async ({ setLoading, adminId, formData }, { rejectWithValue }) => {
        try {
            setLoading(true);
            const { data } = await POST(`/admin/${adminId}/suppliers`, formData);
            console.log(data.data);
            toast.success(data.message);
            return data.data;
        } catch (err) {
            toast.error(err.response?.data || "Creating Supplier Failed")
            return rejectWithValue(err.response?.data || "Creating Supplier Failed");
        } finally {
            setLoading(false);
        }
    }
);

export const getAllSuppliers = createAsyncThunk(
    "supplier/getAllSuppliers",
    async ({ setLoading, adminId, search }, { rejectWithValue }) => {
        try {
            setLoading(true);
            const { data } = await GET(`/admin/${adminId}/suppliers?search=${search || ""}`);
            console.log(data.data);
            return data.data;
        } catch (err) {
            toast.error(err.response?.data || "Fetching Suppliers Failed")
            return rejectWithValue(err.response?.data || "Fetching Suppliers Failed");
        } finally {
            setLoading(false);
        }
    }
);

export const updateSupplier = createAsyncThunk(
    "supplier/updateSupplier",
    async ({ setLoading, adminId, supplierId, formData }, { rejectWithValue }) => {
        try {
            setLoading(true);
            const { data } = await PATCH(`/admin/${adminId}/suppliers/${supplierId}`, formData);
            toast.success(data.message)
            return data.data;
        } catch (err) {
            toast.error(err.response?.data || "Updating Supplier Failed")
            return rejectWithValue(err.response?.data || "Updating Supplier Failed");
        } finally {
            setLoading(false);
        }
    }
);

export const deleteSupplier = createAsyncThunk(
    "supplier/deleteSupplier",
    async ({ setLoading, adminId, supplierId }, { rejectWithValue }) => {
        try {
            setLoading(true);
            const { data } = await DELETE(`/admin/${adminId}/suppliers/${supplierId}`);
            toast.success(data.message)
            return data.data;
        } catch (err) {
            toast.error(err.response?.data || "Deleting Supplier Failed")
            return rejectWithValue(err.response?.data || "Deleting Supplier Failed");
        } finally {
            setLoading(false);
        }
    }
);

const supplierSlice = createSlice({
    name: "supplier",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createSupplier.fulfilled, (state, action) => {
                state.suppliers.unshift(action.payload);
            })
            .addCase(getAllSuppliers.fulfilled, (state, action) => {
                state.suppliers = action.payload;
            })
            .addCase(updateSupplier.fulfilled, (state, action) => {
                const index = state.suppliers.findIndex((supplier) => supplier.id === action?.payload?.id)
                if (index !== -1) {
                    state.suppliers[index] = action.payload
                }
            })
            .addCase(deleteSupplier.fulfilled, (state, action) => {
                state.suppliers = state.suppliers.filter((supplier) => supplier.id !== action?.payload);
            })
    },
});

export default supplierSlice.reducer;