import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { POST, GET } from '@/lib/api';
import { toast } from "react-toastify";
import axios from "axios";

const initialState = {
    folder: {},
    folders: [],
    folderImages: []
};

export const createFolder = createAsyncThunk(
    "folder/createFolder",
    async ({ setLoading, parentId, ownerId, name }) => {
        try {
            setLoading(true);
            const { data } = await POST(`/parents/${ownerId}/folders`, { parentId, name });
            console.log(data.data);
            toast.success(data.message);
            return data.data;
        } catch (err) {
            toast.error(err.response?.data || "Creating Folder Failed")
            return rejectWithValue(err.response?.data || "Creating Folder Failed");
        } finally {
            setLoading(false);
        }
    }
);

export const uploadImageToFolder = createAsyncThunk(
    "folder/uploadImageToFolder",
    async ({ setLoading, ownerId, file, folderId }, { rejectWithValue }) => {
        try {
            setLoading(true);
            console.log(file, 'file from thunk')
            const formData = new FormData();
            formData.append("file", file)
            const token = localStorage.getItem("token");
            const { data } = await axios.post(`/api/v1/parents/${ownerId}/folders/${folderId}`, formData,
                {
                    headers: {
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                }
            );
            console.log(data.data);
            toast.success(data.message);
            return data.data;
        } catch (err) {
            toast.error(err.response?.data || "Uploading Image To Folder Failed")
            return rejectWithValue(err.response?.data || "Uploading Image To Folder Failed");
        } finally {
            setLoading(false);
        }
    }
);

export const getAllFolders = createAsyncThunk(
    "folder/getAllFolders",
    async ({ setLoading, ownerId }) => {
        try {
            setLoading(true);
            const { data } = await GET(`/parents/${ownerId}/folders`);
            console.log(data.data);
            return data.data;
        } catch (err) {
            toast.error(err.response?.data || "Fetching Folders Failed")
            return rejectWithValue(err.response?.data || "Fetching Folders Failed");
        } finally {
            setLoading(false);
        }
    }
);

export const getAllSubFoldersAndImages = createAsyncThunk(
    "folder/getAllSubFoldersAndImages",
    async ({ setLoading, ownerId, folderId }) => {
        try {
            setLoading(true);
            const { data } = await GET(`/parents/${ownerId}/folders/${folderId}`);
            console.log(data.data);
            return data.data;
        } catch (err) {
            toast.error(err.response?.data || "Fetching Folder Images Failed")
            return rejectWithValue(err.response?.data || "Fetching Folder Images Failed");
        } finally {
            setLoading(false);
        }
    }
);

const folderSlice = createSlice({
    name: "folder",
    initialState,
    reducers: {
        setFolders: (state, action) => {
            state.folders = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllFolders.fulfilled, (state, action) => {
                state.folders = action.payload;
            })
            .addCase(getAllSubFoldersAndImages.fulfilled, (state, action) => {
                state.folder = action.payload;
            })
    },
});

export const { setFolders } = folderSlice.actions;
export default folderSlice.reducer;