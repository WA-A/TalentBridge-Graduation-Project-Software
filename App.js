import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text } from 'react-native';
import { useFonts } from 'expo-font';
import { NightModeProvider } from './screens/NightModeContext'; // Import the provider
import SplashScreen from './screens/SplashScreen';
import Login from './screens/Login';
import Signup from './screens/Signup';
import WelcomeScreen from './screens/WelcomeScreen';
import HomeScreen from './screens/HomeScreen';
import ProfilePage from './screens/ProfilePage';
import AddPostScreen from './screens/AddPostScreen';
import ForgotPassword from './screens/ForgotPassword';
import ResetPassword from './screens/ResetPassword';
import EnterCode from './screens/EnterCode';
import ProjectsSeniorPage from './screens/ProjectsSeniorPage';
import ProjectsJuniorPage from './screens/ProjectsJuniorPage';
import AddProjectsPage from './screens/AddProjectsPage';
import SearchScreen from './screens/SearchScreen';
import ViewOtherProfile from './screens/ViewOtherProfile';
import CommentsModal from './screens/CommentsModal.js';
import * as Notifications from "expo-notifications";
import { NotificationProvider } from './contex/NotificationContext';
import Notification from './screens/Notification';
import PostFRomNotification from './screens/PostFRomNotification';
import { useNavigation } from '@react-navigation/native';
import ProjectPage from './screens/ProjectPage.js';
import RequestSeniorToAdminPage from './screens/RequestSeniorToAdminPage.js';



Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });



const Stack = createStackNavigator();

const linking = {
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
      Notifications:'Notifications',
      ProjectPage :'ProjectPage',
    },
  },
};

export default function App() {
  let [fontsLoaded] = useFonts({
    'Updock-Regular': require('./compnent/fonts/Updock-Regular.ttf'),
    'Lato-Bold': require('./compnent/fonts/Lato-Bold.ttf'),
    'Lato-Regular': require('./compnent/fonts/Lato-Regular.ttf'),
  });



  function NotificationHandler() {
    const navigation = useNavigation(); // استخدام useNavigation هنا داخل مكون فرعي
  
    useEffect(() => {
      const subscription = Notifications.addNotificationResponseReceivedListener(response => {
        const { postId } = response.notification.request.content.data;
        const {  commentId } = response.notification.request.content.data;
        const {  postd } = response.notification.request.content.data;

        if (postId) {
          navigation.navigate('PostFRomNotification', { post: postd ,commentIde:commentId,notificationType:null});
        }
      });
  
      return () => subscription.remove(); 
    }, [navigation]); // إضافة navigation في التبعيات
  
    return null; // لا تحتاج لإرجاع شيء هنا
  };




  
  // العودة المبكرة إذا لم تكن الخطوط محملة
  if (!fontsLoaded) {
    return <View><Text>Loading...</Text></View>;
  }


  return (
    <NotificationProvider>
    <NightModeProvider>
      <NavigationContainer linking={linking}>
      <NotificationHandler/> 
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
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPassword}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SearchScreen"
            component={SearchScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ViewOtherProfile"
            component={ViewOtherProfile}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="EnterCode"
            component={EnterCode}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ResetPassword"
            component={ResetPassword}
            options={{ headerShown: false }}
          />
           <Stack.Screen
            name="Notification"
            component={Notification}
            options={{ headerShown: false }}
          />
            <Stack.Screen
            name="PostFRomNotification"
            component={PostFRomNotification}
            options={{ headerShown: false }}
          />

             <Stack.Screen
            name="RequestSeniorToAdminPage"
            component={RequestSeniorToAdminPage}
            options={{ headerShown: false }}
          />
            <Stack.Screen
            name="ProjectPage"
            component={ProjectPage}
            options={{ headerShown: false }}
          />

        </Stack.Navigator>
      </NavigationContainer>
    </NightModeProvider></NotificationProvider>
  );
}
