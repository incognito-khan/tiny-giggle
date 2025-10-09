import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { POST, GET } from '@/lib/api';
import { toast } from "react-toastify";

const initialState = {
    cart: [],
};

export const addToCart = createAsyncThunk(
    "cart/addToCart",
    async ({ parentId, productId, quantity }) => {
        try {
            const { data } = await POST(`/parents/${parentId}/cart/${productId}`, { quantity });
            console.log(data.data);
            toast.success(data.message);
            return data.data;
        } catch (err) {
            toast.error(err.response?.data || "Adding Item To Cart Failed")
            return rejectWithValue(err.response?.data || "Adding Item To Cart Failed");
        }
    }
);

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        setCart: (state, action) => {
            state.cart = action.payload || [];
        },
    },
    extraReducers: (builder) => {
        builder
    },
});

export const { setCart } = cartSlice.actions;
export default cartSlice.reducer;