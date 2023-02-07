import { createSlice } from '@reduxjs/toolkit';

const sessionSlice = createSlice({
    name: 'session',
    initialState: {
        token: false,
        sessionId: false
    }, 
    reducers: {
        setToken: (state, action) => {
            // Save token
            state.token = action.payload.token;
        },
        setSessionId: (state, action) => {
            // Save session id
            state.sessionId = action.payload.sessionId;
        },
        logoutSession: (state, action) => {
            // Reset state on logout
            state.token = false;
            state.sessionId = false
        }
    }
});

export const logoutSession = sessionSlice.actions.logoutSession;
export const setToken = sessionSlice.actions.setToken;
export const setSessionId = sessionSlice.actions.setSessionId;
export default sessionSlice.reducer;