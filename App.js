import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './screens/SplashScreen'; // صفحة البداية
import Login from './screens/Login'; // صفحة تسجيل الدخول
//import SignUp from './screens/Signup';
import Signup from './screens/Signup';

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="SplashScreen">
                {/* مكون SplashScreen */}
                <Stack.Screen
                    name="SplashScreen"
                    component={SplashScreen}
                    options={{ headerShown: false }}
                />
                {/* مكون Login */}
                <Stack.Screen
                    name="Login"
                    component={Login}
                    options={{ headerShown: false }}
                />

                {/* مكون SignUp *ههههه
                <Stack.Screen
                    name="SignUp"
                    component={SignUp}
                    options={{ headerShown: false }}
                />*/}
                <Stack.Screen
                name = "Signup"
                component={Signup}
                options={{ headerShown: false }}
/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}
