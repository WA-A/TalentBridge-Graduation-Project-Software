import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity, Animated, Alert,Platform} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AnimatedCircles, useLineEffect } from './../compnent/Animation'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
import {
    FontAwesome, Ionicons, AntDesign
    , FontAwesome6, MaterialCommunityIcons, FontAwesome5Brands
} from '@expo/vector-icons';

//formik
import { Formik } from 'formik';
import styled from 'styled-components/native';

//color
const { brand, darkLight, careysPink, firstColor, secColor, thirdColor, fourhColor, fifthColor, primary, tertiary } = Colors;

const TypingEffect = () => {
    const [text, setText] = useState('');
    const fullText = "Account Login"; // النص المراد كتابته
    const [index, setIndex] = useState(0);
    const animationValue = useRef(new Animated.Value(0)).current; // لإعداد الأنيميشن

    useEffect(() => {
        // عند بدء المؤثر
        const interval = setInterval(() => {
            if (index < fullText.length) {
                setText((prev) => prev + fullText[index]);
                setIndex((prev) => prev + 1);
            } else {
                clearInterval(interval); // إيقاف المؤثر عند نهاية النص

                // تشغيل أنيميشن اختفاء النص لليسار
                Animated.timing(animationValue, {
                    duration: 2000, // مدة الحركة بالمللي ثانية
                    useNativeDriver: true,
                }).start(() => {
                    // إعادة تعيين النص بعد انتهاء الأنيميشن
                    setText('');
                    setIndex(0);
                    animationValue.setValue(0); // إعادة موضع النص لبدء المؤثر من جديد
                });
            }
        }, 200); // فترة كتابة الحرف بالمللي ثانية

        return () => clearInterval(interval); // تنظيف المؤثر عند إلغاء المكون
    }, [index]);

    return (
        <Animated.View style={{ transform: [{ translateX: animationValue }] }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5 }}>
                {text}
            </Text>
        </Animated.View>
    );
};
export default function Login({ navigation }) {
    const lineWidth = useLineEffect(); // الحصول على القيمة المتحركة للعرض
    const [hidePassword, setHidePassword] = useState(true);
    const slideAnim = useRef(new Animated.Value(0)).current;

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
            throw new Error(errorData.message || 'Something went wrong');
          }
    
          const result = await response.json();
          console.log('User login successfully:', result);
          const userField = result.user.Field;
          console.log('Field:', userField);
    
          // حفظ التوكين في AsyncStorage
          if (result.Token) {
            await AsyncStorage.setItem('userToken', result.Token); // تخزين التوكين محليًا
            console.log('Token saved successfully');
            navigation.navigate('HomeScreen', { userField });
          } else {
            console.warn('No token found in response');
          }
    
        } catch (error) {
          console.error('Login error:', error);
          Alert.alert('Login Failed', error.message);
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
                                secureTextEntry={hidePassword}
                                isPassword={true}
                                hidePassword={hidePassword}
                                setHidePassword={setHidePassword}
                            />
                            <StyledButton onPress={handleSubmit}>
                                <ButtonText>Login</ButtonText>
                            </StyledButton>



                            <TouchableOpacity >
                                <Text style={{ color: brand, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, marginTop: 20 }}>
                                    Forgot Password?
                                </Text>
                            </TouchableOpacity>

                            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
                                <TouchableOpacity onPress={() => { /* تنفيذ تسجيل الدخول باستخدام Google */ }} style={{ alignItems: 'center' }}>
                                    <View style={styles.iconContainer}>
                                        <View style={styles.circleBackground}>
                                            <FontAwesome name="google" size={17} color={primary} />
                                        </View>
                                        <Text style={{ marginLeft: 12, fontSize: 15, color: brand, fontWeight: 'bold' }}>Google</Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => { /* تنفيذ تسجيل الدخول باستخدام Facebook */ }} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={styles.iconContainer}>
                                        <Ionicons name="logo-facebook" size={30} color="#4267B2" />
                                        <Text style={{ marginLeft: 10, fontSize: 15, color: '#4267B2', fontWeight: 'bold' }}>Facebook</Text>
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

                            <View>
                                <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
                                    <Text style={{ color: darkLight, margin: 20 }}>Home after login</Text>
                                </TouchableOpacity>
                            </View>
                        </StyledFormArea>
                    )}
                </Formik>
            </InnerContainer>
        </StyledContainer>
    )
};

const MyTextInput = ({ label, icon, isPassword, hidePassword, setHidePassword, ...props }) => {
    return (
        <View style={{ marginBottom: 15 }}>
            <LeftIcon>
                <FontAwesome name={icon} size={25} color={Colors.fifthColor} />
            </LeftIcon>
            {/*  <StyleInputLable>{label}</StyleInputLable> */}
            <StyledTextInput {...props} />
            {isPassword && (
                <RightIcon onPress={() => setHidePassword(!hidePassword)}>
                    <Ionicons name={hidePassword ? "eye-off" : "eye"} size={25} color={darkLight} />
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
};
