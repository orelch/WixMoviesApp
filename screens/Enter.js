import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';

import PrimaryButton from '../components/PrimaryButton';

import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { useState, useEffect } from 'react';

import { APIKEY } from '../data/data';
import COLORS from '../data/colors';

import { useSelector, useDispatch } from 'react-redux';
import { setSessionId, setToken } from './../store/session';

// Create a prefix to the app to later link back to the app
const prefix = Linking.createURL('/');

export default function EnterScreen() {
    // Get required state elements from the redux store
    const token = useSelector((state) => state.session.token)

    // Create loading session state to render loading indicator while setting up the session
    const [ isLoadingSession, setIsLoadingSession ] = useState(false)

    // Initialize the redux dispatch hook to dispatch actions later on
    const dispatch = useDispatch();

    /**
     * Request TMDB to open a new session if the token was approved, 
     * if the token was approved save the session id in the redux store, 
     * if the token was not approved, delete the token from the redux store
     */
    useEffect(() => {
        if(token) {
            // Request TMDB to open a new session using the token
            fetch(`https://api.themoviedb.org/3/authentication/session/new?api_key=${APIKEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({"request_token": token}),
            })
            .then(result => result.json())
            .then(data => {
                if(data.success) {
                    // if the token was approved and the session was created successfully, save session id to the redux store
                    dispatch(setSessionId({sessionId: data.session_id}))
                } else {
                    // if the token was not approved and the session was not created, delete the token from the redux store
                    dispatch(setToken({token: false}))
                }
                // Set loading session state to false
                setIsLoadingSession(false)
            })
        }
    }, [token])

    /**
     * Get an Authentication Token from TMDB and send the user to a TMDB authentication page 
     * with the token received to give the app permission to use the user's details.
     * Afterwards, save the token to the redux store.
     */
    const verifyToken = async () => {
        // Fetch an Authentication Token from TMDB
        fetch(`https://api.themoviedb.org/3/authentication/token/new?api_key=${APIKEY}`)
        .then(response => response.json())
        .then(async data => {
            // Set loading session state to true
            setIsLoadingSession(true)

            // Send user to the TMDB authentication page with the token received to grant the app permission to use user's details and then send the user back to the app
            await WebBrowser.openAuthSessionAsync(`https://www.themoviedb.org/authenticate/${data.request_token}?redirect_to=${prefix}`)

            // Save token to the redux store
            dispatch(setToken({token: data.request_token}))
        })
        .catch((error) => {
            console.error(error)
        })
    }

    // While loading session show the loading indicator, otherwise show the login screen
    return (
        <View style={{width: "100%", height:"100%"}}>
            {
                isLoadingSession 
                    ? <View style={styles.enterContainer}>
                        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
                    </View>
                    : <View style={styles.enterContainer}>
                        <Text style={styles.title} >
                            Hello
                        </Text>
                        <Text style={styles.userMessage} >
                            Log in to start searching for popular movies in your country and make your own watch list !
                        </Text>
                        <View style={styles.buttonContainer} >
                            <PrimaryButton 
                                text="Log in"
                                textStyle={styles.buttonText}
                                onPress={verifyToken}
                            />
                        </View>
                    </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    enterContainer: {
        flex: 1,
        backgroundColor: COLORS.SECONDARY,
        justifyContent: 'center', 
        alignItems: 'center'
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: COLORS.TITLE,
        marginBottom: 15, 
        marginTop: 10
    },
    userMessage: {
        width: "80%",
        textAlign: 'center',
        fontSize: 20, 
        color: COLORS.PRIMARY,
        marginBottom: 20
    },
    buttonContainer: {

    },
    buttonText: {
        fontSize: 16
    }
})