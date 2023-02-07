import { View, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import MoviesScreen from './../screens/Movies'
import WatchListScreen from './../screens/WatchList';
import Profile from '../screens/Profile';

import Ionicons from 'react-native-vector-icons/Ionicons';
import COLORS from '../data/colors';

const Tab = createBottomTabNavigator();

export default function TabNavigation () {

    const tabOptions = {
        headerTintColor: COLORS.HEADER,
        headerTitleAlign: 'center',
        headerBackground: () => {
            return Platform.OS == 'ios'
                ? (<View style={styles.headerBackgroundStyle} >
                    <LinearGradient colors={[COLORS.DARK_GRADIENT, COLORS.LIGHT_GRADIENT]} locations={[0, 0.7]} start={{ x: 0.5, y: 0.8}} style={styles.headerBackgroundStyle}></LinearGradient>
                </View>)
                : <LinearGradient colors={[COLORS.DARK_GRADIENT, COLORS.LIGHT_GRADIENT]} locations={[0, 0.7]} start={{ x: 0.5, y: 0.8}} style={styles.headerBackgroundStyle}></LinearGradient>
        }
    }

    /**
     * Bottom Tab Navigator consisting of 3 tabs - Movies, WatchList and Profile
     */
    return (
        <NavigationContainer>
            <Tab.Navigator 
                screenOptions={({route}) => ({
                    tabBarIcon: ({focused, color, size}) => {
                        let iconName;

                        if(route.name === "Movies") iconName = focused ? "videocam" : "videocam-outline"
                        else if(route.name === "WatchList") iconName = focused ? "bookmark" : "bookmark-outline"
                        else if(route.name === "Profile") iconName = focused ? "person" : "person-outline"

                        return <Ionicons name={iconName} size={size} color={color} />
                    },
                    tabBarBackground: () => {
                        return Platform.OS == 'ios'
                            ? (<View style={styles.headerBackgroundStyle} >
                                <LinearGradient colors={[COLORS.LIGHT_GRADIENT, COLORS.DARK_GRADIENT]} locations={[0, 0.2]} start={{ x: 0.5, y: 0.1}} style={styles.headerBackgroundStyle}></LinearGradient>
                            </View>)
                            : <LinearGradient colors={[COLORS.LIGHT_GRADIENT, COLORS.DARK_GRADIENT]} locations={[0, 0.2]} start={{ x: 0.5, y: 0.1}} style={styles.headerBackgroundStyle}></LinearGradient>
                    },
                    tabBarActiveTintColor: COLORS.HEADER,
                    tabBarInactiveTintColor: COLORS.HEADER, 
                    tabBarStyle: { borderTopWidth: 0 }
                })}
            >
                <Tab.Screen 
                    name="Movies" 
                    component={MoviesScreen} 
                    options={tabOptions}
                />
                <Tab.Screen 
                    name="WatchList" 
                    component={WatchListScreen}
                    options={{...tabOptions, ...{
                        title: "Watch List"
                    }}}
                />
                <Tab.Screen 
                    name="Profile"
                    component={Profile}
                    options={tabOptions}
                />
            </Tab.Navigator>
        </NavigationContainer>
    )
}

const styles = StyleSheet.create({
    headerBackgroundStyle: {
        width: "100%", 
        height: "100%", 
        elevation: 20, 
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        shadowColor:"black",
        backgroundColor: "white",
    },
})