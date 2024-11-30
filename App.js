// App.js
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './screens/SplashScreen';
import Login from './screens/Login';
import Signup from './screens/Signup';
import WelcomeScreen from './screens/WelcomeScreen';
import HomeScreen from './screens/HomeScreen';
import ProfilePage from './screens/ProfilePage.js';
import AddPostScreen from './screens/AddPostScreen';
import { NightModeProvider } from './screens/NightModeContext'; // Import the provider
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Animated } from 'react-native';
import { useFonts } from 'expo-font';
import ProjectsSeniorPage from './screens/ProjectsSeniorPage.js'
import AddProjects from './screens/AddProjects';
const Stack = createStackNavigator();

export default function App() {
    let [fontsLoaded] = useFonts({
        'Updock-Regular': require('./compnent/fonts/Updock-Regular.ttf'),
        'Lato-Bold': require('./compnent/fonts/Lato-Bold.ttf'),
        'Lato-Regular': require('./compnent/fonts/Lato-Regular.ttf'),
    });

    // Early return if fonts are not loaded
    if (!fontsLoaded) {
        return <View><Text>Loading...</Text></View>;
    }
    return (
        // Wrap the entire NavigationContainer with NightModeProvider
        <NightModeProvider>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="SplashScreen">
                    <Stack.Screen
                        name="SplashScreen"
                        component={SplashScreen}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="AddPostScreen"
                        component={AddPostScreen}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="WelcomeScreen"
                        component={WelcomeScreen}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Login"
                        component={Login}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Signup"
                        component={Signup}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="HomeScreen"
                        component={HomeScreen}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="ProfilePage"
                        component={ProfilePage}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen 
                    name="ProjectsSeniorPage" 
                    component={ProjectsSeniorPage}
                    options={{ headerShown: false }}
                     />
                     <Stack.Screen 
                    name="AddProjects" 
                    component={AddProjects}
                    options={{ headerShown: false }}
                     />


                    </Stack.Navigator>
                
            </NavigationContainer>
        </NightModeProvider>
    );
}
