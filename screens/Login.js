import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity, Animated, Alert,Platform,Linking, Button,SafeAreaView, StatusBar} from 'react-native';
import { AnimatedCircles, useLineEffect } from './../compnent/Animation'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedText } from "./../components/ThemedText";
import { ThemedView } from "./../components/ThemedView";
import { useNotification } from "./../contex/NotificationContext";
import useThemeColor from './../hooks/useThemeColor';  // المسار النسبي
import DOMCoolCode from "./../components/DOMCoolCode";
import * as Updates from "expo-updates";
import {
    StyledContainer,
    InnerContainer,
    PageLogo,
    PageTitle,
    StatusBarHeight,
    StyledFormArea,
    SubTitle,
    LeftIcon,   
    ButtonText,
    StyledButton,
    StyleInputLable,
    StyledTextInput,
    Colors,
    RightIcon,
    Circle,
    Rectangle,
    StyledLine,
    Circle1,
    Circle2,

} from './../compnent/Style';
//icon 

import { FontAwesome,Ionicons }  from '@expo/vector-icons';

//formik
import { Formik } from 'formik';

//color
const { brand, darkLight, careysPink,black,fourhColor,primary, tertiary } = Colors;

export default function Login({ navigation }) {
const [pushNotToken,setpushNotToken]=useState('');

    const [isMenuVisible, setMenuVisible] = useState(false); // For the menu visibility
    const [errorMessage3, setErrorMessage3] = useState('');
    const lineWidth = useLineEffect(); // الحصول على القيمة المتحركة للعرض
    const [hidePassword1, setHidePassword1] = useState(true);
    const slideAnim = useRef(new Animated.Value(0)).current;
    ////////////////////////////////////////////not///////////////////////////

    const { notification, expoPushToken, error } = useNotification();
    const { currentlyRunning, isUpdateAvailable, isUpdatePending } =
      Updates.useUpdates();
  
    const [dummyState, setDummyState] = useState(0);
  
    if (error) {
      return <ThemedText>Error: {error.message}</ThemedText>;
    }
  
    useEffect(() => {
      if (isUpdatePending) {
        // Update has successfully downloaded; apply it now
        // Updates.reloadAsync();
        // setDummyState(dummyState + 1);
        // Alert.alert("Update downloaded and applied");
  
        dummyFunction();
      }
    }, [isUpdatePending]);
  
    const dummyFunction = async () => {
      try {
        await Updates.reloadAsync();
      } catch (e) {
        Alert.alert("Error");
      }
  
      // UNCOMMENT TO REPRODUCE EAS UPDATE ERROR
      // } finally {
      //   setDummyState(dummyState + 1);
      //   console.log("dummyFunction");
      // }
    };
  
    // If true, we show the button to download and run the update
    const showDownloadButton = isUpdateAvailable;
  
    // Show whether or not we are running embedded code or an update
    const runTypeMessage = currentlyRunning.isEmbeddedLaunch
      ? "This app is running from built-in code"
      : "This app is running an update";
  
    //////////////////////////////////////////////////////////////////////


    useEffect(() => {
        const slideInOut = () => {
            Animated.sequence([
                Animated.timing(slideAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ]).start(() => slideInOut());
        };
        slideInOut();
    }, [slideAnim]);

    const translateX = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [300, 0], // 300 تعني بداية الحركة من خارج الشاشة
    });
    
    
    const handleLogin = async (values) => {
        try {
          const dataToSend = {
            ...values,
          };
          console.log('Sending login Data:', dataToSend);
      
          // تحديد عنوان الخادم بناءً على المنصة
          const baseUrl = Platform.OS === 'web' 
            ? 'http://localhost:3000' 
            : 'http://192.168.1.239:3000'; // عنوان IP الشبكة المحلية للجوال
      
          const response = await fetch(`${baseUrl}/auth/signin`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend),
          });
      
          if (!response.ok) {
            const errorData = await response.json();
            setErrorMessage3(errorData.message);

          //  console.error('Error response:', errorData);
         //   throw new Error(errorData.message || 'Something went wrong');
          }
      
          const result = await response.json();
          console.log('User login successfully:', result);
      
          // التحقق من وجود التوكين
          if (result.token) {
            await AsyncStorage.setItem('userToken', result.token); // تخزين التوكين محليًا
            console.log('Token saved successfully');
      
            // الوصول إلى الدور داخل الكائن user
            if (result.user && result.user.Role) {
              console.log('User role:', result.user.Role);
      
              if (result.user.Role === 'Admin') {
                console.log('Navigating to AdminHome');
                navigation.navigate('AdminHomePage');
              } else {
                console.log('Navigating to HomeScreen');
                navigation.navigate('HomeScreen');
              }
            } else {
              console.warn('Role is not defined or user object is missing in the response');
            }
          } else {
            console.warn('No token found in response');
          }
      
          // حفظ expoPushToken إذا كان موجودًا
          if (expoPushToken) {
            try {
              await AsyncStorage.setItem('expoPushToken', expoPushToken); // Save the token in AsyncStorage
              console.log('Push token saved successfully after login');
            } catch (error) {
              console.error('Error saving push token:', error);
            }
          }
      
        } catch (error) {
      //    console.error('Login Error:', error);
          setMenuVisible(true);
         // setErrorMessage3(error.message);
        }
      };
      

    return (
      
        <StyledContainer>
            <StatusBar style="dark" />
            <Rectangle top="0px" left="0px" />
            <TouchableOpacity
                onPress={() => navigation.navigate('WelcomeScreen')}
                style={{ position: 'absolute', top: 40, left: 20, zIndex: 10 }}
            >
                <Ionicons name="arrow-back" size={30} color={brand} />
            </TouchableOpacity>

            <InnerContainer>
                <PageLogo resizeMode="cover" source={require('./../assets/Talent_Bridge_logo_with_black_border3.png')} />
                <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5 }}>Account Login</Text>
                <Formik
                    initialValues={{ Email: '', Password: '' }}
                    onSubmit={handleLogin}
                >
                    {({ handleChange, handleBlur, handleSubmit, values }) => (
                        <StyledFormArea>
                            <MyTextInput
                                icon="envelope-o"
                                placeholder="Email"
                                placeholderTextColor={darkLight}
                                onChangeText={handleChange('Email')}
                                onBlur={handleBlur('Email')}
                                value={values.Email}
                                keyboardType="Email-address"
                            />
                            <MyTextInput
                                icon="lock"
                                placeholder="Password"
                                placeholderTextColor={darkLight}
                                onChangeText={handleChange('Password')}
                                onBlur={handleBlur('Password')}
                                value={values.Password}
                                secureTextEntry={hidePassword1}
                                isPassword1={true}
                                hidePassword1={hidePassword1}
                                setHidePassword1={setHidePassword1}
                            />
                            
                            {isMenuVisible && (
                                            <View style={[
                                                Platform.OS === 'web' ? styles.webStyle : styles.mobileStyle
                                            ]}>
                                                <View>
                                                    <Text style={{
                                                        fontSize: 20,
                                                        fontWeight: 'bold',
                                                        color: primary
                                                    }} >
                                                        {errorMessage3 ? errorMessage3 : "You should Enter Valid Data to sign up!"}
                                                    </Text>


                                                    <View style={{
                                                        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'

                                                    }}>
                                                        <TouchableOpacity style={{ color: careysPink }} onPress={() => setMenuVisible(false)}>
                                                            <Text style={[Platform.OS === 'web' ? styles.textWp : styles.textMopile]}>Cancel</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            </View>
                                        )}
                            <StyledButton onPress={handleSubmit}>
                                <ButtonText>Login</ButtonText>
                            </StyledButton>

                           

                            <TouchableOpacity  onPress={() => navigation.navigate('ForgotPassword')}>
                                <Text style={{ color: brand, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, marginTop: 20 }}>
                                    Forgot Password?
                                </Text>
                            </TouchableOpacity>

                            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
                                <TouchableOpacity  style={{ alignItems: 'center' }}>  
                                    <View style={styles.iconContainer}>
                                        <View style={styles.circleBackground}>
                                            <FontAwesome name="google" size={17} color={primary} />
                                        </View>
                                        <Text style={{ marginLeft: 12, fontSize: 15, color: brand, fontWeight: 'bold' }}>Google</Text>
                                    </View>
                                </TouchableOpacity>

                                
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
                                <Text style={{ color: darkLight }}>
                                    You do not have an account?
                                </Text>
                                <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                                    <Text style={{ color: brand, fontWeight: 'bold', marginLeft: 5 }}>
                                        Please sign up.
                                    </Text>
                                </TouchableOpacity>
                            </View>

                           
                        </StyledFormArea>
                    )}
                </Formik>
            </InnerContainer>
        </StyledContainer>



    )
};

const MyTextInput = ({ label, icon, isPassword1, hidePassword1, setHidePassword1, ...props }) => {
    return (
        <View style={{ marginBottom: 15 }}>
            <LeftIcon>
                <FontAwesome name={icon} size={25} color={Colors.fifthColor} />
            </LeftIcon>
            {/* Ensure StyledTextInput is only rendered for password field */}
            <StyledTextInput {...props} />
            
            {/* Conditionally render the eye icon for password fields */}
            {isPassword1 && (
                <RightIcon style={{ marginTop: 5 }} onPress={() => {
    setHidePassword1(!hidePassword1);
}}>
  {Platform.OS === 'web' ? (''
      ) : (
        <Ionicons name={hidePassword1 ? "eye-off" : "eye"} size={25} color="black" />
      )}
</RightIcon>

            )}
        </View>
    );
};

const styles = {
    iconContainer: {
        width: 150,
        height: 50,
        borderRadius: 15,
        marginHorizontal: 5, // تباعد بين الأيقونات
        alignItems: 'center', // محاذاة الأيقونة في الوسط
        justifyContent: 'center', // محاذاة الأيقونة في الوسط
        shadowColor: "#000", // إضافة تأثير الظل
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        borderWidth: 1, // سماكة الحدود
        borderColor: '#e0e0e0', // لون الحدود الخفيف جداً
        backgroundColor: 'transparent', // خلفية شفافة (من نفس لون الشاشة)
        flexDirection: 'row'

    },
    circleBackground: {
        width: 27, // العرض والارتفاع لجعل الدائرة متساوية
        height: 27,
        borderRadius: 35, // نصف العرض أو الارتفاع لجعل الشكل دائري
        backgroundColor: brand, // لون الخلفية للدائرة
        alignItems: 'center', // محاذاة الأيقونة في الوسط
        justifyContent: 'center', // محاذاة الأيقونة في الوسط
    },
    webStyle: {
        position: 'fixed',   // العنصر سيبقى مثبتًا في مكانه بالنسبة للشاشة
        top: '50%',  // على سبيل المثال
        left: '50%',         // تحديد العنصر ليكون في منتصف الشاشة أفقيًا
        transform: 'translate(-50%, -50%)', // تحريك العنصر بشكل دقيق للمنتصف
        width: '30%',        // تحديد عرض العنصر
        height: '20%',       // تحديد ارتفاع العنصر
        backgroundColor: black, // تعيين اللون الخلفي
        borderRadius: 5,     // إضافة حدود مدورة
        zIndex: 9999,        // التأكد من أن العنصر فوق باقي العناصر
        borderColor: fourhColor, // استبدال هذا باللون الذي تريده
        borderWidth: 3,      // تحديد عرض الحدود
        display: 'flex',     // تمكين Flexbox داخل العنصر
        justifyContent: 'center', // محاذاة المحتوى عموديًا
        alignItems: 'center' // محاذاة المحتوى أفقيًا
    }
    ,
    mobileStyle: {
        position: 'absolute', // إذا كان الجوال، سيكون موضعه مطلقًا
        bottom: 200,
        width: '100%',
        padding: 10,
        backgroundColor: black,
        borderRadius: 5,
        zIndex: 20,
        borderColor: fourhColor, // استبدل 'yourColor' باللون الذي تريده
        borderWidth: 3,
        height: '32%',
    },
    textWp: {
        fontSize: 20, marginTop: 60, marginLeft: 350, color: primary
    },
    textMopile: {
        fontSize: 20, marginTop: 50, marginLeft: 220, color: primary
        
    }
};
