import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { POST, GET } from '@/lib/api';
import { toast } from "react-toastify";

const initialState = {
    music: {},
    musics: []
};


export const createMusic = createAsyncThunk(
    "music/createMusic",
    async ({ formData, setLoading, categoryId }) => {
        try {
            setLoading(true);
            const { data } = await POST(`categories/${categoryId}/music`, formData);
            if (data.success) {
                toast.success(data?.message)
            } else {
                toast.error(data.message)
            }
            return data?.data;
        } catch (err) {
            toast.error(err.response?.data || "Creating Music Failed")
            return rejectWithValue(err.response?.data || "Creating Music Failed");
        } finally {
            setLoading(false);
        }
    }
);

export const getAllMusics = createAsyncThunk(
    "music/getAllMusics",
    async ({ setLoading }) => {
        try {
            setLoading(true);
            const { data } = await GET(`categories/music`);
            return data.data;
        } catch (err) {
            toast.error(err.response?.data || "Fetching Musics Failed")
            return rejectWithValue(err.response?.data || "Fetching Musics Failed");
        } finally {
            setLoading(false);
        }
    }
);

export const getMusicById = createAsyncThunk(
    "music/getMusicById",
    async ({ setLoading, musicId }) => {
        try {
            setLoading(true);
            const { data } = await GET(`categories/music/${musicId}`);
            return data.data;
        } catch (err) {
            toast.error(err.response?.data || "Fetching Music Failed")
            return rejectWithValue(err.response?.data || "Fetching Music Failed");
        } finally {
            setLoading(false);
        }
    }
);

const musicSlice = createSlice({
    name: "music",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createMusic.fulfilled, (state, action) => {
                state.musics.unshift(action.payload);
            })
            .addCase(getAllMusics.fulfilled, (state, action) => {
                state.musics = action.payload;
            })
            .addCase(getMusicById.fulfilled, (state, action) => {
                state.music = action.payload;
            })
    },
});

export default musicSlice.reducer;