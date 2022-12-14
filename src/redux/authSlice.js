import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    loading: false,
    user: {},
    userToken: null,
    error: null,
    isLogin: false,
    currentuser: {},
}

const setSession = (accessToken, refreshToken) => {
    if (accessToken && refreshToken) {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    } else {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        delete axios.defaults.headers.common.Authorization;
    }
}


const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        starLoading(state) {
            state.loading = true;
        },
        stopLoading(state) {
            state.loading = false;
        },
        getInitialState(state, action) {
            state.loading = false;
            state.isLogin = action.payload.isLogin;
        },
        loginSucess(state, action) {
            state.loading = false;
            state.isLogin = true;
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refrestate.refreshToken;
            state.currentuser = action.payload.refrestate.currentuser;
        },
        // userData(state, action) {
        //     state.loading = false;
        //     state.isLogin = true;
        //     state.currentuser = action.payload.currentuser;
        //     console.log('DEBUG 2 =====> ', JSON.stringify(state));
        // },
        // userData(state) => state.currentUser = action.payload,
        logoutUser(state) {
            state.isLogin = false;
            state.currentuser = null;
        },
    }
})


export function login({ email, password }) {

    return async dispatch => {
        dispatch(userSlice.actions.starLoading);
        try {
            const response = await axios.post('https://api-wiiwtnrtuq-uc.a.run.app//api/token/', {
                username: email,
                password
            });
            const { refresh, access } = response.data;
            setSession(refresh, access);
            dispatch(userSlice.actions.stopLoading);
            dispatch(userSlice.actions.loginSucess({
                currentUser: { email },
                accessToken: access,
                refreshToken: refresh
            }))

        } catch (error) {
            console.log(error);
            dispatch(userSlice.actions.stopLoading);
        }
    }
}
// export const { onUserStateChanged } = userSlice.actions;
// selectors
export const selectUser = (state) => state.currentuser;
// export const selectCount = (state: RootState) => state.counter.value;


export default userSlice.reducer;