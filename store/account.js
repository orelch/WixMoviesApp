import { createSlice } from '@reduxjs/toolkit';

const accountSlice = createSlice({
    name: 'account',
    initialState: {
        account: {},
        watchList: [],
        totalWatchListLength: 0,
        watchListPage: 1,
        syncNum: 0,
        isFetchingWatchList: true
    }, 
    reducers: {
        setAccount: (state, action) => {
            // Set account details
            state.account = action.payload.accountDetails;
        },
        setWatchList: (state, action) => {
            // Set watch list
            state.watchList = action.payload.watchList

            // Save the TMDB watch list length (Total number of movies in the list)
            state.totalWatchListLength = action.payload.totalWatchListLength
        }, 
        addToWatchList: (state, action) => {
            // Check if the movie is not already in the watch list
            if(!state.watchList.some(movie => movie.id == action.payload.movie.id)) {
                // Add movie to the top of the watch list
                state.watchList.unshift(action.payload.movie)

                // Increase TMDB watch list length by 1
                state.totalWatchListLength += 1

                // Increase syncNum by 1
                state.syncNum+=1
            }
        }, 
        removeFromWatchList: (state, action) => {
            // Remove movie from the watch list
            state.watchList = state.watchList.filter(movie => movie.id != action.payload.movie.id)

            // Decrease TMDB watch list length by 1
            state.totalWatchListLength -= 1

            // Decrease syncNum by 1
            state.syncNum-=1
        },
        loadWatchListMovies: (state, action) => {
            // Add movies to the watch list starting at index startIndex
            state.watchList.push(...action.payload.movies.slice(action.payload.startIndex))

            // Save the TMDB watch list length (Total number of movies in the list)
            state.totalWatchListLength = action.payload.totalWatchListLength
        },
        flipWatchListPageBy: (state, action) => {
            // Flip multiple pages
            state.watchListPage+=action.payload.num
        },
        flipWatchListPage: (state, action) => {
            // Flip page forward by 1
            state.watchListPage+=1
        },
        setSyncNum: (state, action) => {
            // Set syncNum
            state.syncNum = action.payload.num
        },
        logoutAccount: (state, action) => {
            // Reset state on logout
            state.account = {};
            state.watchList = [];
            state.totalWatchListLength = 0;
            state.watchListPage = 1;
            state.syncNum = 0;
            state.isFetchingWatchList = true;
        }, 
        setIsFetchingWatchList: (state, action) => {
            // Set isFetchingWatchList flag
            state.isFetchingWatchList = action.payload.loading
        }
    }
});

export const setIsFetchingWatchList = accountSlice.actions.setIsFetchingWatchList;
export const logoutAccount = accountSlice.actions.logoutAccount;
export const setSyncNum = accountSlice.actions.setSyncNum;
export const flipWatchListPageBy = accountSlice.actions.flipWatchListPageBy;
export const loadWatchListMovies = accountSlice.actions.loadWatchListMovies;
export const flipWatchListPage = accountSlice.actions.flipWatchListPage;
export const setAccount = accountSlice.actions.setAccount;
export const setWatchList = accountSlice.actions.setWatchList;
export const addToWatchList = accountSlice.actions.addToWatchList;
export const removeFromWatchList = accountSlice.actions.removeFromWatchList;
export default accountSlice.reducer;