import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';

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
    StyledLine
} from './../compnent/Style';
//icon 
import { FontAwesome, Ionicons, AntDesign, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';

//formik
import { Formik } from 'formik';

//color
const { brand, darkLight } = Colors;
//line animation :
const LineEffect = () => {
    const width = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const loopAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(width, {
                    toValue: 30, // العرض النهائي
                    duration: 2000, // مدة الظهور
                    useNativeDriver: false,
                }),
                Animated.timing(width, {
                    toValue: 0, // إرجاع العرض إلى 0 (لإخفاء الخط)
                    duration: 3000, // مدة الاختفاء
                    useNativeDriver: false,
                }),
                Animated.delay(2000),
            ])
        );
        loopAnimation.start();
       
        // تنظيف عند إلغاء المكون
        return () => loopAnimation.stop();
    }, [width]);

    return (
        <Animated.View style={{ width, height: 2, backgroundColor: 'red' }} />
    );
};

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
                    toValue: -300, // المسافة التي سينزلق فيها النص لليسار
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
    const [hidePassword, setHidePassword] = useState(true);
    const slideAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const slideInOut = () => {
            // إعدادات الحركة
            Animated.sequence([
                Animated.timing(slideAnim, {
                    toValue: 1, // إظهار العبارة
                    duration: 1000, // زمن الحركة
                    useNativeDriver: true,
                }),

            ]).start(() => slideInOut()); // إعادة تشغيل الحركة بعد الانتهاء
        };

        slideInOut(); // بدء الحركة
    }, [slideAnim]);

    // تحويل القيمة المتحركة إلى موضع أفقي
    const translateX = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [300, 0], // 300 تعني بداية الحركة من خارج الشاشة
    });

    return (
        <StyledContainer>
            <StatusBar style="dark" />

            {/* دوائر ملونة على الأطراف */}
            <Rectangle top="px" left="px" />
            {/*<Circle top="100px" right="20px" />
<Circle bottom="50px" left="150px" />*/}
            <InnerContainer>
                <PageLogo resizeMode="cover" source={require('./../assets/Talent_Bridge_logo_with_black_border3.png')} />
                {/*<Text>StatusBarHeight: {StatusBarHeight}px</Text>*/}
                <Animated.Text style={{ transform: [{ translateX }], fontSize: 17, fontWeight: 'bold', marginBottom: 5, letterSpacing: 1 }}>
                    TALENT BRIDGE
                </Animated.Text>
                <SubTitle>Account Login</SubTitle>
                <SubTitle></SubTitle>
                <TypingEffect></TypingEffect>
                <LineEffect></LineEffect>
                <StyledLine></StyledLine>
                
                <Formik

                    initialValues={{ email: '', password: '' }}
                    onSubmit={(values) => {
                        console.log(values);
                        // يمكنك إضافة التنقل هنا بعد تسجيل الدخول الناجح
                        // navigation.navigate('Home');
                    }}
                >
                    {({ handleChange, handleBlur, handleSubmit, values }) => (
                        <StyledFormArea>
                            <MyTextInput
                                icon="envelope-o"
                                placeholder="Email"
                                placeholderTextColor={darkLight}
                                onChangeText={handleChange('email')}
                                onBlur={handleBlur('email')}
                                value={values.email}
                                keyboardType="email-address"
                            />
                            <MyTextInput
                                icon="lock"
                                placeholder="Password"
                                placeholderTextColor={darkLight}
                                onChangeText={handleChange('password')}
                                onBlur={handleBlur('password')}
                                value={values.password}
                                secureTextEntry={hidePassword}  // جعل الإدخال كنقاط
                                isPassword={true}
                                hidePassword={hidePassword}
                                setHidePassword={setHidePassword}
                            />

                            {/* Forgot Password Section */}
                            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                                <Text style={{ color: brand, textAlign: 'right', marginBottom: 20 }}>
                                    Forgot Password?
                                </Text>
                            </TouchableOpacity>

                            <StyledButton onPress={handleSubmit}>
                                <ButtonText>Login</ButtonText>
                            </StyledButton>
                        </StyledFormArea>
                    )}
                </Formik>
            </InnerContainer>
        </StyledContainer>
    );
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
