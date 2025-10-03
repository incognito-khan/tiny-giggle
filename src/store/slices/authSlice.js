import { createSlice, createEntityAdapter, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { setChilds, clearChilds } from "./childSlice";
import { setMusicFavorites } from "./favoriteSlice";
import { setFolders } from "./folderSlice";
// -------------------- Adapter --------------------
const usersAdapter = createEntityAdapter();

// Initial state
const initialState = {
    user: null,
    users: [],
    error: null,
    isUserLoggedIn: false,
};
// -------------------- Thunks --------------------

// Signup thunk
export const signupUser = createAsyncThunk(
    "auth/signupUser",
    async ({ body, router, setLoading }) => {
        try {
            setLoading(true);
            const { data } = await axios.post(`/api/v1/auth/signup`, body);
            toast.success(data?.message)
            router.push(`/otp?email=${body?.email}&type=SIGNUP`);
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Signup failed");
        } finally {
            setLoading(false);
        }
    }
);

// verify OTP thunk
export const verifyOTP = createAsyncThunk(
    "auth/verifyOTP",
    async ({ body, router, setLoading }) => {
        try {
            setLoading(true);
            const { data } = await axios.post(`/api/v1/auth/verify-otp`, body);
            if (data.success) {
                toast.success(data.message)
                if (body.type === 'SIGNUP') {
                    router.push('/auth?tab=login');
                } else {
                    router.push(`/forget-password?email=${body.email}`);
                }
            } else {
                toast.error(data.message || "OTP Verification Failed");
            }
            console.log(data);
            return data;
        } catch (err) {
            const error = err.response?.data;
            toast.error(error?.message || "OTP Verification Failed");
            return rejectWithValue(error || "OTP Verification Failed");
        } finally {
            setLoading(false);
        }
    }
);

// Login thunk
export const login = createAsyncThunk(
    "auth/login",
    async ({ body, router, setLoading }, { rejectWithValue, dispatch }) => {
        try {
            setLoading(true);
            const { data } = await axios.post(`/api/v1/auth/login`, body);
            if (data.success) {
                toast.success(data.message)
                dispatch(setChilds(data?.data?.user?.childs));
                dispatch(setMusicFavorites(data?.data?.user?.favoriteMusic))
                dispatch(setFolders(data?.data?.user?.folders))
                router.push('/');
            } else {
                toast.error(data.message || "Login Failed");
            }
            console.log(data);
            localStorage.setItem('user', JSON.stringify(data.data.user));
            localStorage.setItem('token', data.data.tokens.accessToken);
            return data.data;
        } catch (err) {
            const error = err.response?.data;
            toast.error(error?.message || "Login Failed");
            return rejectWithValue(error || "Login Failed");
        } finally {
            setLoading(false);
        }
    }
);

export const googleLogin = createAsyncThunk(
    "auth/googleLogin",
    async ({ token, router, setLoading }, { rejectWithValue, dispatch }) => {
        try {
            setLoading(true);
            const response = await axios.post(`/api/v1/auth/google`, { token });
            const resData = response.data;

            if (response.status === 200 && resData?.data?.user) {
                toast.success(resData.message);
                dispatch(setChilds(resData?.data?.user?.childs));
                dispatch(setMusicFavorites(resData?.data?.user?.favoriteMusic));
                dispatch(setFolders(resData?.data?.user?.folders));
                router.push("/");
            } else {
                toast.error(resData.message || "Login Failed");
                return rejectWithValue(resData.message || "Login Failed");
            }

            localStorage.setItem("user", JSON.stringify(resData.data.user));
            localStorage.setItem("token", resData.data.tokens.accessToken);

            return resData?.data;
        } catch (err) {
            const error = err.response?.data;
            toast.error(error.error || "Google Login Failed");
            return rejectWithValue(error || "Google Login Failed");
        } finally {
            setLoading(false);
        }
    }
);

// Logout thunk
export const logout = createAsyncThunk(
    "auth/logout",
    async ({ router }, { dispatch }) => {
        try {
            localStorage.removeItem('user');
            localStorage.removeItem("token");
            dispatch(clearChilds())
            router.push('/auth?tab=login')
            return
        } catch (err) {
            return console.error('Logout Failed!');
        }
    }
);

// Request Password Reset thunk
export const requestPasswordReset = createAsyncThunk(
    "auth/requestPasswordReset",
    async ({ body, router, setLoading }) => {
        try {
            setLoading(true);
            console.log(email, 'email')
            const { data } = await axios.post(`/api/v1/auth/forgot-password`, body);
            if (data.success) {
                toast.success(data.message)
                router.push(`/otp?email=${email}&type=PASSWORD_RESET`);
            } else {
                toast.error(data.message || "Error Sending Mail");
            }
            console.log(data);
            return data;
        } catch (err) {
            const error = err.response?.data;
            toast.error(error?.message || "Error Sending Mail");
            return rejectWithValue(error || "Error Sending Mail");
        } finally {
            setLoading(false);
        }
    }
);

// Change Password thunk
export const changePassword = createAsyncThunk(
    "auth/changePassword",
    async ({ body, router, setLoading }) => {
        try {
            setLoading(true);
            const { data } = await axios.post(`/api/v1/auth/change-password`, body);
            if (data.success) {
                toast.success(data.message)
                router.push(`/auth?tab=login`);
            } else {
                toast.error(data.message || "Error Changing Password");
            }
            console.log(data);
            return data;
        } catch (err) {
            const error = err.response?.data;
            toast.error(error?.message || "Error Changing Password");
            return rejectWithValue(error || "Error Changing Password");
        } finally {
            setLoading(false);
        }
    }
);


// -------------------- Slice --------------------
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state, action) => {
                state.user = action.payload?.user || {};
                state.isUserLoggedIn = true;
            })
            .addCase(googleLogin.fulfilled, (state, action) => {
                state.user = action.payload?.user || {};
                state.isUserLoggedIn = true;
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.user = {};
                state.isUserLoggedIn = false;
            })
    },
});

// -------------------- Selectors --------------------
export const authSelectors = usersAdapter.getSelectors((state) => state.auth);

export const selectCurrentUser = (state) =>
    state.auth.currentUserId
        ? state.auth.entities[state.auth.currentUserId]
        : null;

export default authSlice.reducer;
