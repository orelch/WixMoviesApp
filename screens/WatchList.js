import { useState } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator } from 'react-native';


import MovieCard from '../components/MovieCard';

import { useSelector, useDispatch } from 'react-redux'

import { removeFromWatchList, loadWatchListMovies, flipWatchListPage, flipWatchListPageBy, setSyncNum } from '../store/account';

import { APIKEY } from '../data/data';
import COLORS from '../data/colors';

export default function MoviesScreen() {
    // A state element indicating whether we are currently loading the next page of movies
    const [isLoading, setIsLoading] = useState(false)

    // Get required elements from the redux store
    const watchList = useSelector((state) => state.account.watchList)
    const sessionId = useSelector((state) => state.session.sessionId)
    const account = useSelector((state) => state.account.account)
    const watchListPage = useSelector((state) => state.account.watchListPage);
    const syncNum = useSelector((state) => state.account.syncNum);
    const totalWatchListLength = useSelector((state) => state.account.totalWatchListLength);
    const isFetchingWatchList = useSelector((state) => state.account.isFetchingWatchList)

    // A variable indicating whether the user is currently scrolling
    let isScrolling = false;

    // Initialize the useDispatch hook to later send actions
    const dispatch = useDispatch()

    /**
     * A function that will be called when the user reaches the end of the list.
     * 
     * Retrieve the next page of movies from TMDB and update the page number in the redux store.
     * 
     * Notice that since we can modify this TMDB wish list (add or remove movies) 
     * and we can only load a page (20 movies) at a time, we need to first sync our 
     * list and the page we are in to the TMDB list that was modified.
     * 
     * For example - if we had 20 movies in our list, and we removed 1 movie (syncNum = -1), 
     * we now have 19 movies, and so we first need to load the last movie of the 
     * first page before we continue to the next page.
     * So startIndex = 19, and pageOffSet = -1 in this example, so we go back 
     * 1 page (to the first page) and load the elements from index 19, which is the 20th movie (starting at 0).
     * 
     * @param {Number} syncNumber = (Added movies count - Removed movies count)
     */
    const loadNextWatchListPage = (accId, sessId, pageNum, syncNumber) => {
        // The starting index of the movies we want to save from the page
        let startIndex = (20 + (syncNumber%20)) % 20;

        // The page offset in order to sync our list with the TMDB list
        let pageOffSet = Math.floor(syncNumber/20);

        // Set loading to true
        setIsLoading(true)

        // Request the required page of the TMDB wish list
        fetch(`https://api.themoviedb.org/3/account/${accId}/watchlist/movies?api_key=${APIKEY}&session_id=${sessId}&page=${pageNum+pageOffSet+1}&sort_by=created_at.desc`)
        .then(response => response.json())
        .then(data => {
            if(data.results.length) {
                // Add  required movies to the watch list array in the redux store
                dispatch(loadWatchListMovies({movies: data.results, startIndex, totalWatchListLength: data.total_results}))

                // Update our page to match the TMDB page we are in
                dispatch(flipWatchListPageBy({num: pageOffSet+1}))

                // Reset the Sync Number
                dispatch(setSyncNum({num: 0}))
            }

            // Set loading to false
            setIsLoading(false)
        })
        .catch((error) => {
            console.error(error)
        })
    }

    /**
     * A function that will be called whenever the user clicks the "REMOVE FROM WATCH LIST" button.
     * 
     * The function removes the movie from the TMDB watch list and if it was removed successfully, 
     * it will then be removed from the watchlist array in the redux store.
     */
    const onRemoveFromWatchList = (movie, sessId, accId) => {
        // Remove the movie from the TMDB watch list
        fetch(`https://api.themoviedb.org/3/account/${accId}/watchlist?api_key=${APIKEY}&session_id=${sessId}`, {
            method: 'POST',
            body: JSON.stringify({
                "media_type": "movie",
                "media_id": movie.id,
                "watchlist": false
            }), 
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            }
        })
        .then(response => response.json())
        .then(data => {
            // If the movie was removed from the TMDB watch list successfully, remove the movie from the watch list array in the redux store.
            data.success && dispatch(removeFromWatchList({movie}))
        })
        .catch((error) => {
            console.error(error)
        })
    }

    /**
     * If the watch list array is not empty show a list of the movies on the watch list, 
     * if it is empty, show a default screen saying there are no movies in the watch list, 
     * and if the movies are still loading, render a loading indicator.
     * 
     * In addition, when reaching the end of the list, fetch the next page 
     * of movies from TMDB and while fetching, show a loading indicator at 
     * the bottom of the list.
     */
    return (
        <View style={styles.moviesContainer}>
            {
                watchList.length 
                    ? (
                        <FlatList
                            onScrollBeginDrag={() => isScrolling = true}
                            onScroll={() => isScrolling = true}
                            onScrollEndDrag={() => isScrolling = false}
                            onMomentumScrollEnd= {() => isScrolling = false}
                            onEndReachedThreshold={0.1}
                            onEndReached={(event) => {
                                /**
                                 * When reaching the end of the list, if we haven't loaded all movies from TMDB 
                                 * and we are not currently loading movies and the user is trying to scroll, 
                                 * load the next page of movies from TMDB
                                 */
                                watchList.length!=totalWatchListLength && isScrolling && !isLoading && loadNextWatchListPage(account.id, sessionId, watchListPage, syncNum)
                            }}
                            keyExtractor={item => item.id}
                            data={watchList}
                            renderItem={({ item }) => (
                                <MovieCard 
                                    showRank={false}
                                    movie={item}
                                    onPress={() => onRemoveFromWatchList(item, sessionId, account.id)}
                                    buttonText="REMOVE FROM WATCH LIST"
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
                        isFetchingWatchList 
                            ? <View style={styles.loadingContainer} >
                                <ActivityIndicator size="large" color={COLORS.SECONDARY} />
                            </View>
                            : <View style={styles.noMoviesContainer}>
                                <Text style={styles.noMoviesTitle}>
                                    Watch List is empty
                                </Text>
                                <Text style={styles.noMoviesText} >
                                    Go to Movies Tab to start adding movies to your watch list !
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
  noMoviesTitle: {
    color: COLORS.PRIMARY,
    fontSize: 32,
    textAlign: "center",
    width: "80%",
    fontWeight: "bold"
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