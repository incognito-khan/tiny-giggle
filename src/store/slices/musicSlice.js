import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { POST, GET, DELETE, PATCH } from '@/lib/api';
import { toast } from "react-toastify";

const initialState = {
    music: {},
    musics: []
};


export const createMusic = createAsyncThunk(
    "music/createMusic",
    async ({ formData, setLoading, categoryId, subCategoryId }) => {
        try {
            setLoading(true);
            const { data } = await POST(`categories/${categoryId}/music/${subCategoryId}`, formData);
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
    async ({ setLoading, search }) => {
        try {
            setLoading(true);
            const { data } = await GET(`categories/music?search=${search || ""}`);
            return data.data;
        } catch (err) {
            toast.error(err.response?.data || "Fetching Musics Failed")
            return rejectWithValue(err.response?.data || "Fetching Musics Failed");
        } finally {
            setLoading(false);
        }
    }
);

export const getAllArtistMusics = createAsyncThunk(
    "music/getAllArtistMusics",
    async ({ setLoading, search, adminId }) => {
        try {
            setLoading(true);
            const { data } = await GET(`admin/${adminId}/artists/music?search=${search || ""}`);
            return data.data;
        } catch (err) {
            toast.error(err.response?.data || "Fetching Musics Failed")
            return rejectWithValue(err.response?.data || "Fetching Musics Failed");
        } finally {
            setLoading(false);
        }
    }
);

export const updateMusic = createAsyncThunk(
    "music/updateMusic",
    async ({ setLoading, musicId, body }) => {
        try {
            setLoading(true);
            const { data } = await PATCH(`categories/music/${musicId}`, body);
            if (data.success) {
                toast.success(data?.message)
            }
            return data.data;
        } catch (err) {
            toast.error(err.response?.data || "Updating Music Failed")
            return rejectWithValue(err.response?.data || "Updating Music Failed");
        } finally {
            setLoading(false);
        }
    }
);

export const delMusic = createAsyncThunk(
    "music/delMusic",
    async ({ setLoading, musicId }) => {
        try {
            setLoading(true);
            const { data } = await DELETE(`categories/music/${musicId}`);
            if (data.success) {
                toast.success(data?.message)
            }
            return data.data;
        } catch (err) {
            toast.error(err.response?.data || "Deleting Music Failed")
            return rejectWithValue(err.response?.data || "Deleting Music Failed");
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
            .addCase(getAllArtistMusics.fulfilled, (state, action) => {
                state.musics = action.payload;
            })
            .addCase(updateMusic.fulfilled, (state, action) => {
                if (action.payload?.id) {
                    state.musics = state.musics.map(music => music.id === action.payload.id ? action.payload : music);
                }
            })
            .addCase(delMusic.fulfilled, (state, action) => {
                if (action.payload) {
                    state.musics = state.musics.filter(music => music.id !== action.payload);
                }
            })
            .addCase(getMusicById.fulfilled, (state, action) => {
                state.music = action.payload;
            })
    },
});

export default musicSlice.reducer;