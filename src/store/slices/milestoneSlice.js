import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { POST, GET, PATCH, DELETE } from '@/lib/api';
import { toast } from "react-toastify";

const initialState = {
    milestone: {},
    milestones: []
};


export const createMilestone = createAsyncThunk(
    "milestone/createMilestone",
    async ({ formData, adminId, setLoading }) => {
        try {
            setLoading(true);
            const { data } = await POST(`/admin/${adminId}/milestones`, formData);
            if (data.success) {
                toast.success(data?.message)
            } else {
                toast.error(data.message)
            }
            return data?.data;
        } catch (err) {
            toast.error(err.response?.data || "Creating Milestone Failed")
            return rejectWithValue(err.response?.data || "Creating Milestone Failed");
        } finally {
            setLoading(false);
        }
    }
);

export const getAllMilestonesWithSub = createAsyncThunk(
    "milestone/getAllMilestonesWithSub",
    async ({ adminId, setLoading }) => {
        try {
            setLoading(true);
            const { data } = await GET(`/admin/${adminId}/milestones`);
            return data.data;
        } catch (err) {
            toast.error(err.response?.data || "Fetching Milestones Failed")
            return rejectWithValue(err.response?.data || "Fetching Milestones Failed");
        } finally {
            setLoading(false);
        }
    }
);

export const updateMilestone = createAsyncThunk(
    "milestone/updateMilestone",
    async ({ adminId, setLoading, milestoneId, body }) => {
        try {
            setLoading(true);
            const { data } = await PATCH(`/admin/${adminId}/milestones/${milestoneId}`, body);
            toast.success(data.message)
            return data.data;
        } catch (err) {
            toast.error(err.response?.data || "Updating Milestones Failed")
            return rejectWithValue(err.response?.data || "Fetching Updating Failed");
        } finally {
            setLoading(false);
        }
    }
);

export const deleteMilestone = createAsyncThunk(
    "milestone/deleteMilestone",
    async ({ adminId, setLoading, milestoneId }) => {
        try {
            setLoading(true);
            const { data } = await DELETE(`/admin/${adminId}/milestones/${milestoneId}`);
            toast.success(data.message)
            return data.data;
        } catch (err) {
            toast.error(err.response?.data || "Deleting Milestones Failed")
            return rejectWithValue(err.response?.data || "Deleting Updating Failed");
        } finally {
            setLoading(false);
        }
    }
);

export const createSubMilestone = createAsyncThunk(
    "milestone/createSubMilestone",
    async ({ formData, adminId, setLoading, milestoneId }) => {
        try {
            setLoading(true);
            const { data } = await POST(`/admin/${adminId}/milestones/${milestoneId}/sub`, formData);
            if (data.success) {
                toast.success(data?.message)
            } else {
                toast.error(data.message)
            }
            return data?.data;
        } catch (err) {
            toast.error(err.response?.data || "Creating Sub Milestone Failed")
            return rejectWithValue(err.response?.data || "Creating Sub Milestone Failed");
        } finally {
            setLoading(false);
        }
    }
);

export const updateSubMilestone = createAsyncThunk(
    "milestone/updateSubMilestone",
    async ({ body, adminId, setLoading, milestoneId, subId }) => {
        try {
            setLoading(true);
            const { data } = await PATCH(`/admin/${adminId}/milestones/${milestoneId}/sub/${subId}`, body);
            if (data.success) {
                toast.success(data?.message)
            } else {
                toast.error(data.message)
            }
            return data?.data;
        } catch (err) {
            toast.error(err.response?.data || "Updating Sub Milestone Failed")
            return rejectWithValue(err.response?.data || "Updating Sub Milestone Failed");
        } finally {
            setLoading(false);
        }
    }
);

export const deleteSubMilestone = createAsyncThunk(
    "milestone/deleteSubMilestone",
    async ({ adminId, setLoading, milestoneId, subId }) => {
        try {
            setLoading(true);
            const { data } = await DELETE(`/admin/${adminId}/milestones/${milestoneId}/sub/${subId}`);
            if (data.success) {
                toast.success(data?.message)
            } else {
                toast.error(data.message)
            }
            return data?.data;
        } catch (err) {
            toast.error(err.response?.data || "Deleting Sub Milestone Failed")
            return rejectWithValue(err.response?.data || "Deleting Sub Milestone Failed");
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
            .addCase(createMilestone.fulfilled, (state, action) => {
                state.milestones.unshift(action.payload);
            })
            .addCase(getAllMilestonesWithSub.fulfilled, (state, action) => {
                state.milestones = action.payload;
            })
            .addCase(updateMilestone.fulfilled, (state, action) => {
                const index = state.milestones.findIndex((mile) => mile.id === action?.payload?.id)
                if (index !== -1) {
                    state.milestones[index] = action.payload;
                }
            })
            .addCase(deleteMilestone.fulfilled, (state, action) => {
                state.milestones = state.milestones.filter((mile) => mile.id !== action.payload)
            })
            .addCase(createSubMilestone.fulfilled, (state, action) => {
                const milestone = state.milestones.find((m) => m.id === action.payload.milestoneId)
                milestone.subMilestones.unshift(action.payload)
            })
            .addCase(updateSubMilestone.fulfilled, (state, action) => {
                const milestone = state.milestones.find((m) => m.id === action.payload.milestoneId)
                const subMilestoneIndex = milestone.subMilestones.findIndex((sub) => sub.id === action?.payload?.id)
                if (subMilestoneIndex !== -1) {
                    milestone.subMilestones[subMilestoneIndex] = action.payload;
                }
            })
            .addCase(deleteSubMilestone.fulfilled, (state, action) => {
                const milestone = state.milestones.find((m) =>
                    m.subMilestones.some((sub) => sub.id === action.payload)
                );

                if (milestone) {
                    milestone.subMilestones = milestone.subMilestones.filter(
                        (sub) => sub.id !== action.payload
                    );
                }
            })
    },
});

export default milestoneSlice.reducer;