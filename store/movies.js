import { createSlice } from '@reduxjs/toolkit';

const moviesSlice = createSlice({
    name: 'movies',
    initialState: {
        movies: [],
        totalMoviesLength: 0,
        page: 1,
        genres: [],
        isFetchingMovies: true
    }, 
    reducers: {
        setMovies: (state, action) => {
            // Set the movies list
            state.movies = action.payload.movies;

            // Save the TMDB movies list length (Total number of movies in the list)
            state.totalMoviesLength = action.payload.totalMoviesLength
        },
        loadMovies: (state, action) => {
            // Add movies to the movies list
            state.movies.push(...action.payload.movies)

            // Save the TMDB movies list length (Total number of movies in the list)
            state.totalWatchListLength = action.payload.totalWatchListLength
        },
        flipPage: (state, action) => {
            // Flip page forward by 1
            state.page+=1
        },
        setGenres: (state, action) => {
            // Set the genres object array
            state.genres = action.payload.genres
        },
        logoutMovies: (state, action) => {
            // Reset state on logout
            state.movies = [];
            state.totalMoviesLength = 0;
            state.page = 1;
            state.genres = [];
            state.isFetchingMovies = true;
        },
        setIsFetchingMovies: (state, action) => {
            // Set isFetchingMovies flag
            state.isFetchingMovies = action.payload.loading
        }
    }
});

export const setIsFetchingMovies = moviesSlice.actions.setIsFetchingMovies;
export const logoutMovies = moviesSlice.actions.logoutMovies;
export const setGenres = moviesSlice.actions.setGenres;
export const loadMovies = moviesSlice.actions.loadMovies;
export const flipPage = moviesSlice.actions.flipPage;
export const setMovies = moviesSlice.actions.setMovies;
export default moviesSlice.reducer;