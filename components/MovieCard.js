import {StyleSheet, View, Text, Image, Button} from 'react-native';
import { useSelector } from 'react-redux'
import COLORS from '../data/colors';

import PrimaryButton from './PrimaryButton';

export default MovieCard = ({movie, movieIndex, showRank, onPress, buttonText}) => {
    // Get required elements from the redux store
    const genres = useSelector((state) => state.movies.genres)

    // Make an array of this movie's genres names
    const movieGenres = genres.filter(genre => movie.genre_ids.includes(genre.id)).map(genre => genre.name);

    return (
        <View style={styles.card}>
            <Image source={{uri: `https://image.tmdb.org/t/p/original${movie.poster_path}`}} style={styles.image} />
            <View style={styles.detailsContainer} >
                <Text style={styles.title} >{movie.title}</Text>
                <View style={styles.otherDetails} >
                    {showRank && <Text style={styles.text} >Rank: {movieIndex + 1}</Text>}
                    <Text style={styles.text} >Genres: {movieGenres.join(', ')}</Text>
                    <Text style={styles.text} >TMDB Rating: {movie.vote_average}</Text>
                    <Text style={styles.text} >Votes: {movie.vote_count}</Text>
                </View>
                <View style={styles.buttonContainer} >
                    <PrimaryButton
                        onPress={onPress}
                        text={buttonText}
                    />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        flexDirection: 'row',
        margin: 20,
        height: 150,
        borderRadius: 8,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
        shadowColor: 'black',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: COLORS.SECONDARY
    },
    image: {
        height: '100%',
        aspectRatio: 0.67,
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8
    },
    detailsContainer: {
        flex: 1,
        height: '100%',
        marginLeft: 5,
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        padding: 5
    },
    title: {
        justifyContent: 'center',
        width: '100%',
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.TITLE,
        marginBottom: 5
    },
    otherDetails: {
        flex: 1,
    },
    text: {
        color: COLORS.PRIMARY
    },
    buttonContainer: {
        width: "100%",
        justifyContent: "flex-end"
    },
    button: {

    }
})