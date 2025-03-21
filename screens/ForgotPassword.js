import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity, Animated, Alert,Platform,TextInput} from 'react-native';
import axios from 'axios';
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
/////////////////////chart  
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";
import { Dimensions } from "react-native";
//////////////////

import {
    FontAwesome
} from '@expo/vector-icons';
const { brand} = Colors;

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



{/* <Text>Bezier Line Chart</Text>
  <LineChart
    data={{
      labels: ["January", "February", "March", "April", "May", "June"],
      datasets: [
        {
          data: [
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100
          ]
        }
      ]
    }}
    width={Dimensions.get("window").width} // from react-native
    height={220}
    yAxisLabel="$"
    yAxisSuffix="k"
    yAxisInterval={1} // optional, defaults to 1
    chartConfig={{
      backgroundColor: "#e26a00",
      backgroundGradientFrom: "#fb8c00",
      backgroundGradientTo: "#ffa726",
      decimalPlaces: 2, // optional, defaults to 2dp
      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      style: {
        borderRadius: 16
      },
      propsForDots: {
        r: "6",
        strokeWidth: "2",
        stroke: "#ffa726"
      }
    }}
    bezier
    style={{
      marginVertical: 8,
      borderRadius: 16
    }}
  /> */}

                <Text style={{ fontSize: 18, marginBottom: 20 }}>Enter you'r email address: </Text>
                <View style={{ position: 'relative', width: 300 }}>
  <StyledTextInput 
    style={{
      paddingLeft: 50, // توفير مساحة للأيقونة داخل الحقل
    }}
    placeholder="Email"
    value={email}
    onChangeText={(text) => setEmail(text)}
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
                onPress={handleSendCode}>
                <Text style={{ color: '#fff' }}>Send Code</Text>
            </TouchableOpacity>
        </View>
    );
}
