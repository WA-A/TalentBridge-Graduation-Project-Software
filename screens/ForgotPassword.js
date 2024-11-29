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

export default function ForgotPassword({ navigation }) {
    const [email, setEmail] = useState('');

    const handleSendCode = async () => {
        try {
            const dataToSend = { Email: email };  
           console.log(dataToSend);
            const baseUrl = Platform.OS === 'web' 
              ? 'http://localhost:3000' 
              : 'http://192.168.1.239:3000'; 
      
              const response = await fetch(`${baseUrl}/auth/sendcode`, {
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
            Alert.alert('Success', 'A reset code has been sent to your email.');
            const result = await response.json();      
              console.log('Code sent successfully');
              navigation.navigate('EnterCode', { email }); // الانتقال إلى صفحة إدخال الكود

          } catch (error) {
            console.error('Error during password reset process:', error);  // يفضل طباعة الخطأ هنا
            Alert.alert('Error', 'Failed to reset password. Please try again.');
                      }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 18, marginBottom: 20 }}>Enter you'r email address: </Text>
           
         <View> <StyledTextInput 
           style={{
                  width: 300
                }}
                placeholder="Email"
                value={email}
                onChangeText={(text) => setEmail(text)}
            />
              <LeftIcon>
                <FontAwesome name="envelope-o" size={25} color={Colors.fifthColor} />
            </LeftIcon></View>  
            <TouchableOpacity
                style={{
                    backgroundColor: brand,
                    padding: 15,
                    borderRadius: 8,
                    alignItems: 'center',width: 200,margin:20
                }}
                onPress={handleSendCode}>
                <Text style={{ color: '#fff' }}>Send Code</Text>
            </TouchableOpacity>
        </View>
    );
}
