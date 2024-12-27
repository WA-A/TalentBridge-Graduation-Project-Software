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
import ForgotPassword from './screens/ForgotPassword.js';
import ResetPassword from './screens/ResetPassword.js';
import EnterCode from './screens/EnterCode.js';
import {Platform } from 'react-native';
import { NightModeProvider } from './screens/NightModeContext'; // Import the provider
import { View, Text } from 'react-native';
import { useFonts } from 'expo-font';
import ProjectsSeniorPage from './screens/ProjectsSeniorPage.js'
import ProjectsJuniorPage from './screens/ProjectsJuniorPage.js'
import AddProjectsPage from './screens/AddProjectsPage';
import SearchScreen from './screens/SearchScreen.js';
import ViewOtherProfile from './screens/ViewOtherProfile';
import CommentsModal from './screens/CommentsModal.js';
const Stack = createStackNavigator();

const linking = Platform.OS === 'web' ? {
    prefixes: ['http://localhost:8081'], // أو عنوان السيرفر الخاص بك
    config: {
        screens: {
            SplashScreen: '',
            Login: 'auth/signin',
            HomeScreen: 'home',
            ProfilePage: 'profile',
            AddPostScreen: 'add-post',
            ForgotPassword: 'forgot-password',
            ResetPassword: 'reset-password',
            EnterCode: 'enter-code',
            WelcomeScreen: 'WelcomeScreen', 
          },
      
    },
  } : {};

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
            <NavigationContainer linking={linking}>
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
                    component={AddProjectsPage}
                    options={{ headerShown: false }}
                     />
                      <Stack.Screen 
                    name="ProjectsJuniorPage" 
                    component={ProjectsJuniorPage}
                    options={{ headerShown: false }}
                     />
                     <Stack.Screen name="ForgotPassword" 
                      component={ForgotPassword}                     
                      options={{ headerShown: false }}
                       />
                  <Stack.Screen name="SearchScreen"
                   component={SearchScreen}
                  options={{ headerShown: false }}
                      />
     <Stack.Screen name="ViewOtherProfile"
                   component={ViewOtherProfile
                   }
                  options={{ headerShown: false }}
                      />
<Stack.Screen name="EnterCode"
 component={EnterCode}                     
options={{ headerShown: false }}
 />
<Stack.Screen name="ResetPassword" 
component={ResetPassword}                    
 options={{ headerShown: false }}
 />

<Stack.Screen name="CommentsModal" 
component={CommentsModal}                    
 options={{ headerShown: false }}
 />


                    </Stack.Navigator>
                
            </NavigationContainer>
        </NightModeProvider>
    );
}
