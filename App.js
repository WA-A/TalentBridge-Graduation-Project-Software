// App.js
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './screens/SplashScreen';
import Login from './screens/Login';
import Signup from './screens/Signup';
import WelcomeScreen from './screens/WelcomeScreen';
import HomeScreen from './screens/HomeScreen';
import AddPostScreen from './screens/AddPostScreen';
import { NightModeProvider } from './screens/NightModeContext'; // Import the provider
import ProjectsSeniorPage from './screens/ProjectsSeniorPage.js'
const Stack = createStackNavigator();

export default function App() {
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
                    name="ProjectsSeniorPage" 
                    component={ProjectsSeniorPage} />
                    </Stack.Navigator>
                
            </NavigationContainer>
        </NightModeProvider>
    );
}
