import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { POST, GET, PATCH, DELETE } from '@/lib/api';
import { toast } from "react-toastify";

const initialState = {
    vaccination: {},
    vaccinations: []
};


export const createVaccination = createAsyncThunk(
    "vaccination/createVaccination",
    async ({ formData, adminId, setLoading }) => {
        try {
            setLoading(true);
            const { data } = await POST(`/admin/${adminId}/vaccinations`, formData);
            if (data.success) {
                toast.success(data?.message)
            } else {
                toast.error(data.message)
            }
            return data?.data;
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
    async ({ adminId, setLoading }) => {
        try {
            setLoading(true);
            const { data } = await GET(`/admin/${adminId}/vaccinations`);
            return data.data;
        } catch (err) {
            toast.error(err.response?.data || "Fetching Vaccination Failed")
            return rejectWithValue(err.response?.data || "Fetching Vaccination Failed");
        } finally {
            setLoading(false);
        }
    }
);

export const updateVaccination = createAsyncThunk(
    "vaccination/updateVaccination",
    async ({ formData, adminId, setLoading, vaccinationId }) => {
        try {
            setLoading(true);
            const { data } = await PATCH(`/admin/${adminId}/vaccinations/${vaccinationId}`, formData);
            if (data.success) {
                toast.success(data?.message)
            } else {
                toast.error(data.message)
            }
            return data?.data;
        } catch (err) {
            toast.error(err.response?.data || "Updating Vaccination Failed")
            return rejectWithValue(err.response?.data || "Updating Vaccination Failed");
        } finally {
            setLoading(false);
        }
    }
);

export const deleteVaccination = createAsyncThunk(
    "vaccination/deleteVaccination",
    async ({ adminId, setLoading, vaccinationId }) => {
        try {
            setLoading(true);
            const { data } = await DELETE(`/admin/${adminId}/vaccinations/${vaccinationId}`);
            if (data.success) {
                toast.success(data?.message)
            } else {
                toast.error(data.message)
            }
            console.log(data?.data, 'data')
            return data?.data;
        } catch (err) {
            toast.error(err.response?.data || "Deleting Vaccination Failed")
            return rejectWithValue(err.response?.data || "Deleting Vaccination Failed");
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
            .addCase(createVaccination.fulfilled, (state, action) => {
                state.vaccinations.push(action.payload)
            })
            .addCase(getAllVaccinations.fulfilled, (state, action) => {
                state.vaccinations = action.payload;
            })
            .addCase(updateVaccination.fulfilled, (state, action) => {
                const index = state.vaccinations.findIndex((vac) => vac.id === action?.payload?.id)
                if (index !== -1) {
                    state.vaccinations[index] = action.payload;
                }
            })
            .addCase(deleteVaccination.fulfilled, (state, action) => {
                console.log(state.vaccinations.map(v => v.id))
                console.log(action.payload)
                state.vaccinations = state.vaccinations.filter((vac) => vac.id !== action.payload)
            })
    },
});

export default vaccinationSlice.reducer;