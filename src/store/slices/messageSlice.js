import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { POST, GET } from '@/lib/api';
import { toast } from "react-toastify";

const initialState = {
    message: {},
    messages: [],
};

export const createMessage = createAsyncThunk(
    "message/createMessage",
    async ({ parentId, chatId, senderId, content }) => {
        try {
            const { data } = await POST(`/parents/${parentId}/chats/${chatId}`, { senderId, content });
            console.log(data.data);
            toast.success(data.message);
            return data.data;
        } catch (err) {
            toast.error(err.response?.data || "Creating Message Failed")
            return rejectWithValue(err.response?.data || "Creating Message Failed");
        }
    }
);

export const getAllMessages = createAsyncThunk(
    "message/getAllMessages",
    async ({ setLoading, parentId, chatId }) => {
        try {
            setLoading(true);
            const { data } = await GET(`/parents/${parentId}/chats/${chatId}`);
            console.log(data.data);
            return data.data;
        } catch (err) {
            toast.error(err.response?.data || "Fetching Messages Failed")
            return rejectWithValue(err.response?.data || "Fetching Messages Failed");
        } finally {
            setLoading(false);
        }
    }
);

const messageSlice = createSlice({
    name: "message",
    initialState,
    reducers: {
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getAllMessages.fulfilled, (state, action) => {
            state.messages = action.payload;
        })
    },
});

export const { addMessage } = messageSlice.actions;
export default messageSlice.reducer;