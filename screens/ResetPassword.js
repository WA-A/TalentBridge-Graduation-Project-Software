import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Platform, ScrollView, StyleSheet,Alert } from 'react-native';
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
    Colors,
    RightIcon,
    RightIcon2,
  labelStyle,StyledTextInputSignUp

} from './../compnent/Style';
//icon 
import {
    FontAwesome, Ionicons, AntDesign
    , FontAwesome6, MaterialCommunityIcons, FontAwesome5Brands,Feather
} from '@expo/vector-icons';

//formik
import { Formik } from 'formik';
import styled from 'styled-components/native';

//color
const { brand, darkLight, careysPink,black,fourhColor,primary, tertiary,fifthColor } = Colors;

export default function ResetPassword({ route, navigation }) {

    const [password, setpassword] = useState('');
    const [ConfirmPassword, setConfirmPassword] = useState('');
    const [hidePassword, setHidePassword] = useState(true);
    const [passwordVerfy, setPasswordVerfy] = useState(false);
    const [confirmpasswordVerfy, setConfirmPasswordVerfy] = useState(false);
    const [errorMessage2, setErrorMessage2] = useState('');
    const [successMassage2, setSuccessMassage2] = useState('');
    const [successMassage, setSuccessMassage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [hideConfirmPassword, setHideConfirmPassword] = useState(true);
    const [isMenuVisible, setMenuVisible] = useState(false); // For the menu visibility
    const [errorMessage3, setErrorMessage3] = useState('');

    function handleCinfirmPassword(e) {
        const ConfirmPassVar = e.nativeEvent.text;
        setConfirmPassword(ConfirmPassVar);
        setConfirmPasswordVerfy(false);
        if (password !== ConfirmPassVar) {
            setErrorMessage2('Passwords do not match.');

        } if (password === ConfirmPassVar) {
            setErrorMessage2('');
            setConfirmPasswordVerfy(true);
            setSuccessMassage2('Passwords match!');
        }

    };
    function handlePassword(e) {
        const passVar = e.nativeEvent.text;
        setpassword(passVar);
        setPasswordVerfy(false);
        if (passVar.length > 0) {
            setErrorMessage2('');
            setSuccessMassage2('');
        }
        if (!/[A-Z]/.test([passVar])) {
            setErrorMessage('The password must contain at least one uppercase letter.');
        } else if (!/\d/.test(passVar)) {
            setErrorMessage('The password must contain at least one number.');
        } else if (passVar.length <= 6) {
            setErrorMessage('The password must be longer than 6 characters.');
        } else {
            setErrorMessage(''); // إذا كانت كلمة المرور صحيحة، قم بإزالة الرسالة
            setpassword(passVar)
            setPasswordVerfy(true);
            setSuccessMassage('Password Valid!')
        }

    }
    const handleResetPassword = async () => {
        if (password !== ConfirmPassword) {
            Alert.alert('Error', 'Passwords do not match.');
            return;
        }
            try {
                const { email } = route.params;  // الحصول على البريد الإلكتروني من المعلمات
                const dataToSend = { Email:email,NewPassword:password, ConfirmNewPassword:ConfirmPassword };  
               console.log(dataToSend);
                const baseUrl = Platform.OS === 'web' 
                  ? 'http://localhost:3000' 
                  : 'http://192.168.1.239:3000'; 
          
                  const response = await fetch(`${baseUrl}/auth/changepassword`, {
                  method: 'patch',
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
                  console.log('change password successfully');
                  navigation.navigate('Login'); // الانتقال إلى صفحة إدخال الكود
    
              } catch (error) {
                console.error('Error Code Enter', error);  // يفضل طباعة الخطأ هنا
                Alert.alert('Error', 'not change password.');
                          }
    };

    return (
        <StyledContainer>
        <InnerContainer>
                <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 40,marginTop:100 }}>Reset Password</Text>
                <Formik initialValues={{Password: '', ConfirmPassword: ''}}

                 onSubmit={handleResetPassword}>
                    {({ handleChange, handleBlur, handleSubmit, values }) => (
                        <StyledFormArea>

                        <Text style={labelStyle}>Password</Text>
                                <MyTextInput
                                    icon="lock"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange('Password')}
                                    onBlur={handleBlur('Password')}
                                    secureTextEntry={hidePassword}
                                    placeholder="password"
                                    isPassword={true}
                                    hidePassword={hidePassword}
                                    setHidePassword={setHidePassword}
                                    onChange={e => handlePassword(e)}
                                    value={values.Password}
                                   
                                        />
                                {errorMessage ? (
                                    <Text style={styles.error}>{errorMessage}</Text>
                                ) : (
                                    <Text style={styles.success}>{successMassage}</Text>
                                )}
                            
                                {/* إدخال تأكيد كلمة المرور */}
                                <Text style={labelStyle}>Confirm Password</Text>
                                <MyTextInput
                                    icon="lock"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange('ConfirmPassword')}
                                    onBlur={handleBlur('ConfirmPassword')}
                                    secureTextEntry={hideConfirmPassword}
                                    placeholder="confirm Password"
                                    isConfirmPassword={true}
                                    hideConfirmPassword={hideConfirmPassword}
                                    setHideConfirmPassword={setHideConfirmPassword}
                                    onChange={e => handleCinfirmPassword(e)}
                                    value={values.ConfirmPassword}

                                />
                                 {errorMessage2 ? (
                                    <Text style={styles.error}>{errorMessage2}</Text>
                                ) : (
                                    <Text style={styles.success}>{successMassage2}</Text>
                                )}
                            {isMenuVisible && (
                                            <View style={[
                                                Platform.OS === 'web' ? styles.webStyle : styles.mobileStyle
                                            ]}>
                                                <View>
                                                    <Text style={{
                                                        fontSize: 17,
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

                                        <StyledButton
  onPress={() => {
    // التحقق من الحقول المطلوبة
    if (!values.Password || !values.ConfirmPassword) {
      setErrorMessage3('Both fields are required!');
      setMenuVisible(true);
      return;
    }

    // التحقق من صحة المدخلات
    if (!passwordVerfy || !confirmpasswordVerfy) {
      setErrorMessage3('Passwords do not match or are invalid!');
      setMenuVisible(true);
      return;
    }

    // إذا كان كل شيء صحيحًا
    setErrorMessage3(''); // مسح رسالة الخطأ
    setMenuVisible(false);

    // استدعاء handleSubmit
    handleSubmit();
  }}
>
  <ButtonText>Reset Password</ButtonText>
</StyledButton>
                        

                        </StyledFormArea>
                    )} 
                </Formik>
                </InnerContainer>
        </StyledContainer>
 );

}






const MyTextInput = ({ icon, rightIcon22, isPassword, hidePassword, setHidePassword, isConfirmPassword, hideConfirmPassword, setHideConfirmPassword, ...props }) => {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, justifyContent: 'center' }}>
            <LeftIcon>
                <FontAwesome name={icon} size={20} color={fifthColor} style={{ marginBottom: Platform.OS === 'web' ? 10 : 20 }}
                />
            </LeftIcon>
            <StyledTextInputSignUp {...props} style={{ width: '100%' }} />
            {rightIcon22}

            {isPassword && (
                <RightIcon onPress={() => {
                    console.log("Password visibility toggled:", !hidePassword); // Debugging line
                    setHidePassword(!hidePassword);
                }}>
                    {Platform.OS === 'web' ? (''
                    ) : (
                        <Ionicons name={hidePassword ? "eye-off" : "eye"} size={25} color="black" />
                    )}
                </RightIcon>
            )}
            {isConfirmPassword && (
                <RightIcon onPress={() => {
                    console.log("Password visibility toggled:", !hideConfirmPassword); // Debugging line
                    setHideConfirmPassword(!hideConfirmPassword);
                }}>
                    {Platform.OS === 'web' ? (''
                    ) : (
                        <Ionicons name={hideConfirmPassword ? "eye-off" : "eye"} size={25} color={darkLight} />
                    )}
                </RightIcon>
            )}

        </View>
    )
};





const styles = StyleSheet.create({
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
        width: '100%',
        padding: 10,
        backgroundColor: black,
        borderRadius: 5,
        zIndex: 20,
        borderColor: fourhColor, // استبدل 'yourColor' باللون الذي تريده
        borderWidth: 3,
        height: '50%',
        marginTop:200, 
    },
    textWp: {
        fontSize: 20, marginTop: 60, marginLeft: 350, color: primary
    },
    textMopile: {
        fontSize: 20, marginTop: 50, marginLeft: 220, color: primary
    },error: {
        color: 'red',
        fontSize: 12,
        marginLeft: 20, marginTop: -15, marginBottom: 10, fontWeight: 'bold'
    },
    success: {
        color: 'green',
        fontSize: 12, marginLeft: 20, marginTop: -15, marginBottom: 10, fontWeight: 'bold'
    },
        
    });
