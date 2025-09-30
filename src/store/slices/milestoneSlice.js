import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { POST, GET } from '@/lib/api';
import { toast } from "react-toastify";

const initialState = {
    milestone: {},
    milestones: []
};


export const createMilestone = createAsyncThunk(
    "milestone/createMilestone",
    async ({ formData, parentId, childId, setLoading }) => {
        try {
            setLoading(true);
            const { data } = await POST(`/parents/${parentId}/childs/${childId}/milestones`, formData);
            if (data.success) {
                toast.success(data?.message)
            } else {
                toast.error(data.message)
            }
            return data;
        } catch (err) {
            toast.error(err.response?.data || "Creating Milestone Failed")
            return rejectWithValue(err.response?.data || "Creating Milestone Failed");
        } finally {
            setLoading(false);
        }
    }
);

export const getAllMilestones = createAsyncThunk(
    "milestone/getAllMilestones",
    async ({ parentId, childId, setLoading }) => {
        try {
            setLoading(true);
            const { data } = await GET(`/parents/${parentId}/childs/${childId}/milestones`);
            return data.data;
        } catch (err) {
            toast.error(err.response?.data || "Fetching Vaccination Failed")
            return rejectWithValue(err.response?.data || "Fetching Vaccination Failed");
        } finally {
            setLoading(false);
        }
    }
);

const milestoneSlice = createSlice({
    name: "milestone",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllMilestones.fulfilled, (state, action) => {
                state.milestones = action.payload;
            })
    },
});

export default milestoneSlice.reducer;