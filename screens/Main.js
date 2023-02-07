import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { APIKEY } from './../data/data';

import EnterScreen from './Enter';
import TabNavigation from './../navigation/TabNavigation';

import { useSelector, useDispatch } from 'react-redux';

import { setAccount, setIsFetchingWatchList, setWatchList } from '../store/account';
import { setGenres, setMovies, setIsFetchingMovies } from '../store/movies';

export default function Main() {
    // Get required state elements from the redux store
    const sessionId = useSelector((state) => state.session.sessionId)
    const account = useSelector((state) => state.account.account)

    // Initialize the redux dispatch hook to dispatch actions later on
    const dispatch = useDispatch();

    // Get user details after the session was created 
    useEffect(() => {
        sessionId && getAccountDetails(sessionId)
    }, [sessionId])

    // Get popular movies by country after the account's country is set or changed
    useEffect(() => {
        account.countryCode && getPopMoviesbyCountry(account.countryCode)
    }, [account.countryCode])

    // Get user's watch list after account id is set or changed
    useEffect(() => {
        account.id && getUserWatchList(account.id, sessionId)
    }, [account.id])

    /**
     * Get account details from TMDB using the session id and save them into the redux store
     * 
     * Notice the country code variable (iso_3166_1) is being translated 
     * and split into 2 properties - countryCode and countryName
     */
    const getAccountDetails = (sessId) => {
        // send account details request to TMDB API
        fetch(`https://api.themoviedb.org/3/account?api_key=${APIKEY}&session_id=${sessId}`)
        .then(response => response.json())
        .then(async data => {
            // Get a list of country Objects of countries used throughout TMDB containing, country codes and names.
            const countries = await getCountries()

            // Translate country code to country name
            const userCountry = countries.filter(country => country.iso_3166_1 == data.iso_3166_1).map(country => country.english_name)[0]

            // dispatch action to update account details in the redux store
            dispatch(setAccount({accountDetails: {...data, countryCode: data.iso_3166_1, countryName: userCountry}}))
        })
        .catch((error) => {
            console.error(error)
        })
    }

    /**
     * Fetch and return Array of country Objects of countries used throughout TMDB, 
     * containing country codes and names.
     * 
     * @returns {Array[Object]}
     */
    const getCountries = async () => {
        let data = []

        try{
            // Fetch countries from TMDB
            const response = await fetch(`https://api.themoviedb.org/3/configuration/countries?api_key=${APIKEY}`)
            data = await response.json()
        } catch(error) {
            console.error(error)
        }

        return data
    }

    /**
     * Get a list of the first 20 popular movies based on the country of the user 
     * and a list of genres used in TMDB and their id and save them into the redux store
     * 
     * Note that the TMDB database is split to pages and so here we recieve 
     * the first 20 movies in the list (page 1). In addition, we also save 
     * the total number of movies in the TMDB list
     */
    const getPopMoviesbyCountry = (country) => {
        // Fetch popular movies by country from TMDB
        fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${APIKEY}&region=${country}`)
        .then(response => response.json())
        .then(data => {
            // Save movies fetched and total number of movies in the TMDB list to the redux store
            dispatch(setMovies({movies: data.results, totalMoviesLength: data.total_results}))

            // Set loading movies flag to false in the redux store
            dispatch(setIsFetchingMovies({loading: false}))
        })
        .catch((error) => {
            console.error(error)
        })

        // Fetch genres used in TMDB and their ids
        fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${APIKEY}`)
        .then(response => response.json())
        .then(data => {
            // Save genres list to the redux store
            dispatch(setGenres({genres: data.genres}))
        })
        .catch((error) => {
            console.error(error)
        })
    }

    /**
     * Get a list of the first 20 movies in the user's TMDB watch list.
     * 
     * Note that the TMDB database is split to pages and so here we recieve 
     * the first 20 movies in the list (page 1). In addition, we also save 
     * the total number of movies in the TMDB list
     */
    const getUserWatchList = (accountId, sessId) => {
        // Fetch movies from user's TMDB watch list
        fetch(`https://api.themoviedb.org/3/account/${accountId}/watchlist/movies?api_key=${APIKEY}&session_id=${sessId}&sort_by=created_at.desc`)
        .then(response => response.json())
        .then(data => {
            // Save movies fetched and total number of movies in the TMDB list to the redux store
            dispatch(setWatchList({watchList: data.results, totalWatchListLength: data.total_results}))

            // Set loading watch list flag to false in the redux store
            dispatch(setIsFetchingWatchList({loading: false}))
        })
        .catch((error) => {
            console.error(error)
        })
    }

    /**
     * If the session is set render the main app navigation component (TabNavigation), 
     * else return to the login screen (EnterScreen)
     */
    return (
        <View style={styles.appContainer}>
            {sessionId 
                ? <TabNavigation />
                : <EnterScreen />
            }
        </View>
    )
}

const styles = StyleSheet.create({
    appContainer: {
        flex: 1
    }
})