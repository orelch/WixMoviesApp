import { useState } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator, Alert } from 'react-native';

import MovieCard from '../components/MovieCard';

import { useSelector, useDispatch } from 'react-redux'

import { addToWatchList } from '../store/account';
import { loadMovies, flipPage } from '../store/movies';

import { APIKEY } from '../data/data';
import COLORS from '../data/colors';

export default function MoviesScreen() {
    // A state element indicating whether we are currently loading the next page of movies
    const [isLoading, setIsLoading] = useState(false)

    // Get required elements from the redux store
    const movies = useSelector((state) => state.movies.movies)
    const sessionId = useSelector((state) => state.session.sessionId)
    const account = useSelector((state) => state.account.account)
    const page = useSelector((state) => state.movies.page);
    const totalMoviesLength = useSelector((state => state.movies.totalMoviesLength));
    const isFetchingMovies = useSelector((state) => state.movies.isFetchingMovies)

    // Initialize the useDispatch hook to later send actions
    const dispatch = useDispatch();

    /**
     * A function that will be called when the user reaches the end of the list.
     * 
     * Retrieve the next page of movies from TMDB and update the page number in the redux store
     */
    const loadNextPage = (country, pageNum) => {
        // Set loading to true
        setIsLoading(true)

        // Request the next page of movies from TMDB
        fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${APIKEY}&page=${pageNum+1}&region=${country}`)
        .then(response => response.json())
        .then(data => {
            // Set loading to false
            setIsLoading(false)

            // Add retrieved movies to the redux store
            dispatch(loadMovies({movies: data.results, totalMoviesLength: data.total_results}))
            dispatch(flipPage())
        })
        .catch((error) => {
            console.error(error)
        })
    }

    /**
     * A function that will be called whenever the user clicks the "ADD TO WATCH LIST" button.
     * 
     * First of all, the function checks whether the movie is already in the user's TMDB watch list.
     * If the movie is already in the user's TMDB watch list the function will render an alert on the screen 
     * notifying the user that the movie is already in his watchlist.
     * If the movie is not in the user's TMDB watch list the function will add the movie to the TMDB 
     * watch list and save the movie to the watch list array in the redux store
     */
    const onAddToWatchList = async (movie, sessId, accId) => {
        let isMovieInWatchList = false

        try{
            // Request the movie's account state
            let response = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/account_states?api_key=${APIKEY}&session_id=${sessId}`)
            const movieAccountStatus = await response.json()

            // Set a variable that checks whether the movie is in the user's TMDB watch list
            isMovieInWatchList = movieAccountStatus.watchlist
        } catch (error) {
            console.error(error)
        }

        // Check whether the movie is in the user's TMDB watch list
        if(!isMovieInWatchList) {
            // Add the movie to the TMDB watch list
            fetch(`https://api.themoviedb.org/3/account/${accId}/watchlist?api_key=${APIKEY}&session_id=${sessId}`, {
                method: 'POST',
                body: JSON.stringify({
                    "media_type": "movie",
                    "media_id": movie.id,
                    "watchlist": true
                }), 
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                }
            })
            .then(response => response.json())
            .then(data => {
                // If the movie was added to the TMDB watch list successfully, add the movie to the watch list array in the redux store.
                data.success && dispatch(addToWatchList({movie}))
            })
            .catch((error) => {
                console.error(error)
            })
        } else {
            // If the movie is already in the user's TMDB watch list, render an alert on the screen notifying the user that the movie is already in his watch list.
            Alert.alert('Action Denied', 'The movie is already in your watch list', [{text: 'OK'}])
        }
    }

    /**
     * If the movies array is not empty show a list of the movies, 
     * if it is empty, show a default screen saying there are no movies, 
     * and if the movies are still loading, render a loading indicator.
     * 
     * In addition, when reaching the end of the list, fetch the next page 
     * of movies from TMDB and while fetching, show a loading indicator at 
     * the bottom of the list.
     */
    return (
        <View style={styles.moviesContainer}>
            {
                movies.length 
                    ? (
                        <FlatList
                            onEndReachedThreshold={0.1}
                            onEndReached={() => {
                                /**
                                 * When reaching the end of the list, if we haven't loaded all movies from TMDB 
                                 * and we are not currently loading movies, load the next page of movies from TMDB
                                 */
                                movies.length!=totalMoviesLength && !isLoading && loadNextPage(account.countryCode, page)
                            }}
                            keyExtractor={item => item.id}
                            data={movies}
                            renderItem={({ item, index }) => (
                                <MovieCard 
                                    showRank={true}
                                    movieIndex={index}
                                    movie={item}
                                    onPress={() => onAddToWatchList(item, sessionId, account.id)}
                                    buttonText="ADD TO WATCH LIST"
                                />
                            )}
                            ListFooterComponent={() => {
                                // While fetching the next page of movies, show a loading indicator
                                if(isLoading) return (
                                    <View style={{width: '100%', paddingBottom: 20}}>
                                        <ActivityIndicator size="large" color={COLORS.SECONDARY} />
                                    </View>
                                )
                            }}
                        />
                    )
                    : (
                        /**
                         * While fetching the first set of movies show a loading indicator, 
                         * and if there are no movies show a default screen saying there are no movies
                         */
                        isFetchingMovies
                            ? <View style={styles.loadingContainer} >
                                <ActivityIndicator size="large" color={COLORS.SECONDARY} />
                            </View>
                            : <View style={styles.noMoviesContainer}>
                                <Text style={styles.noMoviesText} >
                                    No movies available in your country
                                </Text>
                            </View>
                    )
            }
        </View>
  );
}

const styles = StyleSheet.create({
  moviesContainer: {
    backgroundColor: COLORS.PRIMARY,
    height: "100%"
  },
  noMoviesContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.SECONDARY, 
    justifyContent:"center",
    alignItems: "center"
  }, 
  noMoviesText: {
    color: COLORS.PRIMARY,
    fontSize: 26,
    textAlign: "center",
    width: "80%"
  },
  loadingContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.PRIMARY, 
    justifyContent:"center",
    alignItems: "center"
  }
});