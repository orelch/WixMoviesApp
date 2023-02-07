import { StyleSheet, TouchableOpacity, Text } from 'react-native'
import COLORS from '../data/colors'

export default PrimaryButton = ({text, onPress, viewStyle, textStyle}) => {
    return (
        <TouchableOpacity onPress={onPress} style={{...styles.buttonContainer, ...viewStyle}} >
            <Text style={{...styles.buttonText, ...textStyle}} >{text}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
        backgroundColor: COLORS.PRIMARY,
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 12,
        alignSelf: "flex-end"
    },
    buttonText: {
        fontSize: 10,
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    }
})