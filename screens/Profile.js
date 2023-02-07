import { StyleSheet, View, Text } from 'react-native';

import PrimaryButton from '../components/PrimaryButton';

import { useSelector, useDispatch } from 'react-redux'

import { logoutMovies } from '../store/movies';
import { logoutAccount } from '../store/account';
import { logoutSession } from '../store/session';

import COLORS from '../data/colors';

export default function Profile() {
    const account = useSelector((state) => state.account.account);
    const dispatch = useDispatch();

    const onLogOut = () => {
        dispatch(logoutMovies())
        dispatch(logoutAccount())
        dispatch(logoutSession())
    }

    return (
        <View style={styles.profileContainer}>
            <Text style={styles.title} >
                Hello {account.name ? account.name : account.username}
            </Text>
            <Text style={styles.userMessage} >
                Check out popular movies in {account.countryName} on the Movies Tab
                and make your own Watch List !
            </Text>
            <View style={styles.buttonContainer} >
                <PrimaryButton 
                    text="Log out"
                    viewStyle={{backgroundColor: COLORS.EXIT}}
                    textStyle={styles.buttonText}
                    onPress={() => onLogOut()}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    profileContainer: {
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