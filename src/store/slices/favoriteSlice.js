import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { POST, GET } from '@/lib/api';
import { toast } from "react-toastify";

const initialState = {
    favoriteMusic: [],
    favoriteProduts: [],
};

export const toggleFavoriteMusic = createAsyncThunk(
    "favorite/toggleFavoriteMusic",
    async ({ parentId, musicId }) => {
        try {
            const { data } = await POST(`/parents/${parentId}/favorites`, { musicId });
            console.log(data.data);
            toast.success(data.message);
            return data.data;
        } catch (err) {
            toast.error(err.response?.data || "Toggling Favorite Failed")
            return rejectWithValue(err.response?.data || "Toggling Favorite Failed");
        }
    }
);

export const getMusicFavorites = createAsyncThunk(
    "favorite/getMusicFavorites",
    async ({ setLoading, parentId }) => {
        try {
            setLoading(true);
            const { data } = await GET(`/parents/${parentId}/favorites`);
            console.log(data.data);
            return data.data;
        } catch (err) {
            toast.error(err.response?.data || "Fetching Favorites Failed")
            return rejectWithValue(err.response?.data || "Fetching Favorites Failed");
        } finally {
            setLoading(false);
        }
    }
);

const favoriteSlice = createSlice({
    name: "favorite",
    initialState,
    reducers: {
        setMusicFavorites: (state, action) => {
            state.favoriteMusic = action.payload || [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(toggleFavoriteMusic.fulfilled, (state, action) => {
                const favorite = action.payload;

                if (favorite) {
                    const exists = state.favoriteMusic.find((f) => f.id === favorite.id);
                    if (!exists) {
                        state.favoriteMusic.push(favorite);
                    }
                } else {
                    const { musicId } = action.meta.arg;
                    state.favoriteMusic = state.favoriteMusic.filter(
                        (f) => f.musicId !== musicId
                    );
                }
            })
            .addCase(getMusicFavorites.fulfilled, (state, action) => {
                state.favoriteMusic = action.payload;
            })
    },
});

export const { setMusicFavorites } = favoriteSlice.actions;
export default favoriteSlice.reducer;