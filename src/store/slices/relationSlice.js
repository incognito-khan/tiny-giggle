import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { POST, GET } from '@/lib/api';
import { toast } from "react-toastify";

const initialState = {
    relation: {},
    relations: [],
};

export const createRelation = createAsyncThunk(
    "relation/createRelation",
    async ({ setLoading, parentId, childId, formData }, { rejectWithValue }) => {
        try {
            setLoading(true);
            const { data } = await POST(`/parents/${parentId}/childs/${childId}/relations/create`, formData);
            console.log(data.data);
            toast.success(data.message);
            return data.data;
        } catch (err) {
            toast.error(err.response?.data || "Creating Relation Failed")
            return rejectWithValue(err.response?.data || "Creating Relation Failed");
        } finally {
            setLoading(false);
        }
    }
);

export const getAllRelations = createAsyncThunk(
    "relation/getAllRelations",
    async ({ setLoading, parentId, childId }, { rejectWithValue }) => {
        try {
            setLoading(true);
            const { data } = await GET(`/parents/${parentId}/childs/${childId}/relations`);
            console.log(data.data);
            return data.data;
        } catch (err) {
            toast.error(err.response?.data || "Fetching Relations Failed")
            return rejectWithValue(err.response?.data || "Fetching Relations Failed");
        } finally {
            setLoading(false);
        }
    }
);

const relationSlice = createSlice({
    name: "relation",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllRelations.fulfilled, (state, action) => {
                state.relations = action.payload;
            })
    },
});

export default relationSlice.reducer;