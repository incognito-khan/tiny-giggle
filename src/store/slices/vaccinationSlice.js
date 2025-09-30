import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { POST, GET } from '@/lib/api';
import { toast } from "react-toastify";

const initialState = {
    vaccination: {},
    vaccinations: []
};


export const createVaccination = createAsyncThunk(
    "vaccination/createVaccination",
    async ({ formData, parentId, childId, setLoading }) => {
        try {
            setLoading(true);
            const { data } = await POST(`/parents/${parentId}/childs/${childId}/vaccinations`, formData);
            if (data.success) {
                toast.success(data?.message)
            } else {
                toast.error(data.message)
            }
            return data;
        } catch (err) {
            toast.error(err.response?.data || "Creating Vaccination Failed")
            return rejectWithValue(err.response?.data || "Creating Vaccination Failed");
        } finally {
            setLoading(false);
        }
    }
);

export const getAllVaccinations = createAsyncThunk(
    "vaccination/getAllVaccinations",
    async ({ parentId, childId, setLoading }) => {
        try {
            setLoading(true);
            const { data } = await GET(`/parents/${parentId}/childs/${childId}/vaccinations`);
            return data.data;
        } catch (err) {
            toast.error(err.response?.data || "Fetching Vaccination Failed")
            return rejectWithValue(err.response?.data || "Fetching Vaccination Failed");
        } finally {
            setLoading(false);
        }
    }
);

const vaccinationSlice = createSlice({
    name: "vaccination",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllVaccinations.fulfilled, (state, action) => {
                state.vaccinations = action.payload;
            })
    },
});

export default vaccinationSlice.reducer;