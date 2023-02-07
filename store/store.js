import { configureStore } from '@reduxjs/toolkit';

import sessionReducer from './session';
import accountReducer from './account';
import moviesReducer from './movies';

export const store = configureStore({
    reducer: {
        session: sessionReducer,
        account: accountReducer,
        movies: moviesReducer
    }
});