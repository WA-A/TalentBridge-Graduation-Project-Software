import React, { useState, useEffect, useRef } from 'react';
import { Picker } from '@react-native-picker/picker';

import { View, Text, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useLineEffect } from './../compnent/Animation';
import {
    StyledContainer,
    InnerContainer,
    PageLogo,
    StyledFormArea,
    StyledButton,
    ButtonText,
    StyledTextInput,
    Colors,
    LeftIcon,
    RightIcon,
    Bridg,
    pickerStyle
    ,
    labelStyle
    
} from './../compnent/Style';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { Formik } from 'formik';

// Colors
const { brand, darkLight, fifthColor } = Colors;

export default function Signup({ navigation }) {
    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');

    // إعداد قائمة الأيام، الأشهر، والسنوات
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const months = [
        { label: 'January', value: '01' },
        { label: 'February', value: '02' },
        { label: 'March', value: '03' },
        { label: 'April', value: '04' },
        { label: 'May', value: '05' },
        { label: 'June', value: '06' },
        { label: 'July', value: '07' },
        { label: 'August', value: '08' },
        { label: 'September', value: '09' },
        { label: 'October', value: '10' },
        { label: 'November', value: '11' },
        { label: 'December', value: '12' },
    ];
    const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i); // سنوات من 0 إلى 99
    const lineWidth = useLineEffect(); // استخدام تأثير الحركة

    const [hidePassword, setHidePassword] = useState(true);
    const slideAnim = useRef(new Animated.Value(0)).current;
/////
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
        outputRange: [300, 0],
    });

    return (
        <StyledContainer>
            <StatusBar style="dark" />
            <TouchableOpacity
    onPress={() => navigation.navigate('WelcomeScreen')}
    style={{ position: 'absolute', top: 40, left: 20, zIndex: 10 }}
>
    <Ionicons name="arrow-back" size={30} color={brand} />
</TouchableOpacity>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled"
             showsVerticalScrollIndicator={false} // تعطيل التأشير العمودي
             showsHorizontalScrollIndicator={false} >
           
                <InnerContainer>
                    <PageLogo resizeMode="cover" source={require('./../assets/Talent_Bridge_logo_with_black_border3.png')} />

                    <Formik
                        initialValues={{ email: '', password: '', fullName: '', dateOfBirth: '', phoneNumber: '' }}
                        onSubmit={(values) => {
                            console.log(values);
                        }}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values }) => (
                            <StyledFormArea>
                                <MyTextInput
                                    icon="user"
                                    placeholder="Full Name"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange('fullName')}
                                    onBlur={handleBlur('fullName')}
                                    value={values.fullName}
                                />

                                <MyTextInput
                                    icon="envelope-o"
                                    placeholder="Email"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange('email')}
                                    onBlur={handleBlur('email')}
                                    value={values.email}
                                    keyboardType="email-address"
                                />

<Text style={labelStyle}>Date of Birth</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Picker
                                selectedValue={day}
                                style={pickerStyle}
                                onValueChange={(itemValue) => setDay(itemValue)}
                            >
                                <Picker.Item label="Day" value="" />
                                {days.map((d) => (
                                    <Picker.Item key={d} label={String(d)} value={String(d)} />
                                ))}
                            </Picker>

                            <Picker
                                selectedValue={month}
                                style={pickerStyle}
                                onValueChange={(itemValue) => setMonth(itemValue)}
                            >
                                <Picker.Item label="Month" value="" />
                                {months.map((m) => (
                                    <Picker.Item key={m.value} label={m.label} value={m.value} />
                                ))}
                            </Picker>

                            <Picker
                                selectedValue={year}
                                style={pickerStyle}
                                onValueChange={(itemValue) => setYear(itemValue)}
                            >
                                <Picker.Item label="Year" value="" />
                                {years.map((y) => (
                                    <Picker.Item key={y} label={String(y)} value={String(y)} />
                                ))}
                            </Picker>
                        </View>
                                <MyTextInput
                                    icon="phone"
                                    placeholder="Phone Number"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange('phoneNumber')}
                                    onBlur={handleBlur('phoneNumber')}
                                    value={values.phoneNumber}
                                    keyboardType="phone-pad"
                                />

                                <MyTextInput
                                    icon="lock"
                                    placeholder="Password"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange('password')}
                                    onBlur={handleBlur('password')}
                                    value={values.password}
                                    secureTextEntry={hidePassword}
                                    isPassword={true}
                                    hidePassword={hidePassword}
                                    setHidePassword={setHidePassword}
                                />
                                <StyledButton onPress={handleSubmit}>
                                    <ButtonText>Sign Up</ButtonText>
                                </StyledButton>

                                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
                                    <Text style={{ color: darkLight }}>
                                        Already have an account?
                                    </Text>
                                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                        <Text style={{ color: brand, fontWeight: 'bold', marginLeft: 5 }}>
                                            Login
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </StyledFormArea>
                        )}
                    </Formik>
                </InnerContainer>
            </ScrollView>
        </StyledContainer>
    );
}

// Custom Input Component
const MyTextInput = ({ icon, isPassword, hidePassword, setHidePassword, ...props }) => {
    return (
        <View style={{ marginBottom: 15 }}>
            <LeftIcon>
                <FontAwesome name={icon} size={25} color={Colors.fifthColor} />
            </LeftIcon>
            <StyledTextInput {...props} />
            {isPassword && (
                <RightIcon onPress={() => setHidePassword(!hidePassword)}>
                    <Ionicons name={hidePassword ? "eye-off" : "eye"} size={25} color={darkLight} />
                </RightIcon>
            )}
        </View>
    );
};
