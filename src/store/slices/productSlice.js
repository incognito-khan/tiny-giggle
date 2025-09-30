import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { POST, GET } from '@/lib/api';
import { toast } from "react-toastify";

const initialState = {
    product: {},
    products: []
};

export const getAllProducts = createAsyncThunk(
    "product/getAllProducts",
    async ({ setLoading }) => {
        try {
            setLoading(true);
            const { data } = await GET(`/products`);
            return data.data;
        } catch (err) {
            toast.error(err.response?.data || "Fetching Products Failed")
            return rejectWithValue(err.response?.data || "Fetching Products Failed");
        } finally {
            setLoading(false);
        }
    }
);

const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllProducts.fulfilled, (state, action) => {
                state.products = action.payload;
            })
    },
});

export default productSlice.reducer;