import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { POST, GET } from '@/lib/api';
import { toast } from "react-toastify";

const initialState = {
    chat: {},
    chats: [],
};

export const createChat = createAsyncThunk(
    "chat/createChat",
    async ({ setLoading, parentId, title, participants }) => {
        try {
            setLoading(true);
            const { data } = await POST(`/parents/${parentId}/chats`, { title, participants });
            console.log(data.data);
            toast.success(data.message);
            return data.data;
        } catch (err) {
            toast.error(err.response?.data || "Creating Chat Failed")
            return rejectWithValue(err.response?.data || "Creating Chat Failed");
        } finally {
            setLoading(false);
        }
    }
);

export const getAllChats = createAsyncThunk(
    "chat/getAllChats",
    async ({ setLoading, parentId }) => {
        try {
            setLoading(true);
            const { data } = await GET(`/parents/${parentId}/chats`);
            console.log(data.data);
            return data.data;
        } catch (err) {
            toast.error(err.response?.data || "Fetching Chats Failed")
            return rejectWithValue(err.response?.data || "Fetching Chats Failed");
        } finally {
            setLoading(false);
        }
    }
);

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllChats.fulfilled, (state, action) => {
                state.chats = action.payload;
            })
    },
});

export default chatSlice.reducer;