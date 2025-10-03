import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { POST, GET, DELETE, PATCH } from '@/lib/api';
import { toast } from "react-toastify";

const initialState = {
    category: {},
    categories: []
};

export const createCategory = createAsyncThunk(
    "category/createCategory",
    async ({ setLoading, formData }, { rejectWithValue }) => {
        try {
            setLoading(true);
            const { data } = await POST(`/categories`, formData);
            console.log(data)
            toast.success(data.message || 'Category created successfully');
            return data.data;
        } catch (err) {
            toast.error(err.response?.data || "Creating Category Failed")
            return rejectWithValue(err.response?.data || "Creating Category Failed");
        } finally {
            setLoading(false);
        }
    }
);

export const getAllCategories = createAsyncThunk(
    "category/getAllCategories",
    async ({ setLoading }) => {
        try {
            setLoading(true);
            const { data } = await GET(`/categories`);
            return data.data;
        } catch (err) {
            toast.error(err.response?.data || "Fetching Categories Failed")
            return rejectWithValue(err.response?.data || "Fetching Categories Failed");
        } finally {
            setLoading(false);
        }
    }
);

export const updateCategory = createAsyncThunk(
    "category/updateCategory",
    async ({ setLoading, categoryId, formData }) => {
        try {
            setLoading(true);
            const { data } = await PATCH(`/categories/${categoryId}`, formData);
            toast.success("Category Updated Successfully");
            return data.data;
        } catch (err) {
            toast.error(err.response?.data || "Updating Category Failed")
            return rejectWithValue(err.response?.data || "Updating Category Failed");
        } finally {
            setLoading(false);
        }
    }
);

export const delCategory = createAsyncThunk(
    "category/delCategory",
    async ({ setLoading, categoryId }) => {
        try {
            setLoading(true);
            const { data } = await DELETE(`/categories/${categoryId}`);
            toast.success("Category Deleted Successfully");
            return data.data;
        } catch (err) {
            toast.error(err.response?.data || "Deleting Category Failed")
            return rejectWithValue(err.response?.data || "Deleting Category Failed");
        } finally {
            setLoading(false);
        }
    }
);

export const addMusicCategory = createAsyncThunk(
    "category/addMusicCategory",
    async ({ setLoading, formData }, { rejectWithValue }) => {
        try {
            setLoading(true);
            const { data } = await POST(`/categories/music`, formData);
            return data.data;
        } catch (err) {
            toast.error(err.response?.data || "Creating Music Category Failed")
            return rejectWithValue(err.response?.data || "Creating Music Category Failed");
        } finally {
            setLoading(false);
        }
    }
);

export const getAllMusicCategories = createAsyncThunk(
    "category/getAllMusicCategories",
    async ({ setLoading }) => {
        try {
            setLoading(true);
            const { data } = await GET(`/categories/music/music-categories`);
            return data.data;
        } catch (err) {
            toast.error(err.response?.data || "Fetching Music Categories Failed")
            return rejectWithValue(err.response?.data || "Fetching Music Categories Failed");
        } finally {
            setLoading(false);
        }
    }
);

const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createCategory.fulfilled, (state, action) => {
                state.categories.unshift(action.payload);
            })
            .addCase(addMusicCategory.fulfilled, (state, action) => {
                state.categories.unshift(action.payload);
            })
            .addCase(getAllCategories.fulfilled, (state, action) => {
                state.categories = action.payload;
            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                if (action.payload) {
                    const index = state.categories.findIndex(category => category.id === action.payload.id);
                    if (index !== -1) {
                        state.categories[index] = action.payload;
                    }
                }
            })
            .addCase(delCategory.fulfilled, (state, action) => {
                if (action.payload) {
                    state.categories = state.categories.filter(category => category.id !== action.payload);
                }
            })
            .addCase(getAllMusicCategories.fulfilled, (state, action) => {
                state.categories = action.payload;
            })
    },
});

export default categorySlice.reducer;