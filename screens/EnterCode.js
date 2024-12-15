import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity, Animated, Alert,Platform,TextInput} from 'react-native';
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
import {
    FontAwesome
} from '@expo/vector-icons';
const { brand, darkLight, careysPink,black,fourhColor,primary, tertiary } = Colors;
export default function EnterCode({ navigation,route }) {
    const [code, setCode] = useState('');

    const handleVerifyCode = async () => {
        try {
            const { email } = route.params;  // الحصول على البريد الإلكتروني من المعلمات
            const dataToSend = { Email:email,code:code };  
           console.log(dataToSend);
            const baseUrl = Platform.OS === 'web' 
              ? 'http://localhost:3000' 
              : 'http://192.168.1.239:3000'; 
      
              const response = await fetch(`${baseUrl}/auth/forgotpassword`, {
              method: 'PATCH',
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
              console.log('Code enter successfully');
              navigation.navigate('ResetPassword', {email}); // الانتقال إلى صفحة إدخال الكود

          } catch (error) {
            console.error('Error Code Enter', error);  // يفضل طباعة الخطأ هنا
            Alert.alert('Error', 'Error Code Enter.');
                      }
    };


    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 18, marginBottom: 20 }}>Enter the code that was sent to your email</Text>
           
            <View style={{ position: 'relative', width: 300 }}>
  <StyledTextInput 
    style={{
      paddingLeft: 50, // توفير مساحة للأيقونة داخل الحقل
    }}
    placeholder="Code"
    value={code}
    onChangeText={(text) => setCode(text)}
  />
  <LeftIcon
    style={{
      position: 'absolute',
      left: 10, // المسافة من اليسار
      top: '35%', // لضمان أن تكون الأيقونة في المنتصف
      transform: [{ translateY: -12.5 }], // لضبط المحاذاة العمودية
    }}
  >
    <FontAwesome name="envelope-o" size={25} color={Colors.fifthColor} />
  </LeftIcon>
</View>
            <TouchableOpacity
                style={{
                    backgroundColor: brand,
                    padding: 15,
                    borderRadius: 8,
                    alignItems: 'center',width: 200,margin:20
                }}
                onPress={handleVerifyCode}>
                <Text style={{ color: '#fff' }}>Send</Text>
            </TouchableOpacity>
        </View>
    );
}
