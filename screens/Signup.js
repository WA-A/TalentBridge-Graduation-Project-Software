import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
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
    pickerStyle,
    labelStyle
} from './../compnent/Style';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { Formik } from 'formik';

// Colors
const { brand, darkLight, fifthColor } = Colors;

export default function Signup({ navigation }) {
    const [userType, setUserType] = useState('Junior');
    const [gender, setGender] = useState(''); // State for gender
    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [fieldOfInterest, setFieldOfInterest] = useState('');
    const [location, setLocation] = useState('');
    const [yearsOfExperience, setYearsOfExperience] = useState('');

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
    const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

    const fieldsOfInterest = ['IT', 'Digital Marketing', 'Decor Design', 'Graphic Design'];

    return (
        <StyledContainer>
            <StatusBar style="dark" />

            {/* Back to WelcomeScreen */}
            <TouchableOpacity
                onPress={() => navigation.navigate('WelcomeScreen')}
                style={{ position: 'absolute', top: 40, left: 20, zIndex: 10 }}
            >
                <Ionicons name="arrow-back" size={30} color={brand} />
            </TouchableOpacity>

            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                <InnerContainer>
                    <PageLogo resizeMode="cover" source={require('./../assets/Talent_Bridge_logo_with_black_border3.png')} />

                    {/* Toggle between Junior and Senior */}
                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 20 }}>
                        <TouchableOpacity
                            style={{
                                borderBottomWidth: userType === 'Junior' ? 2 : 0,
                                borderBottomColor: brand,
                                marginHorizontal: 20
                            }}
                            onPress={() => setUserType('Junior')}
                        >
                            <Text style={{ color: userType === 'Junior' ? brand : darkLight, fontSize: 18, fontWeight: 'bold' }}>Junior</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                borderBottomWidth: userType === 'Senior' ? 2 : 0,
                                borderBottomColor: brand,
                                marginHorizontal: 20
                            }}
                            onPress={() => setUserType('Senior')}
                        >
                            <Text style={{ color: userType === 'Senior' ? brand : darkLight, fontSize: 18, fontWeight: 'bold' }}>Senior</Text>
                        </TouchableOpacity>
                    </View>

                    <Formik
                        initialValues={{ email: '', password: '', confirmPassword: '', fullName: '', dateOfBirth: '', phoneNumber: '', location: '', username: '', address: '' }} // Add address to initialValues
                        onSubmit={(values) => {
                            console.log({ userType, gender, fieldOfInterest, yearsOfExperience, ...values });
                        }}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values }) => (
                            <StyledFormArea>
                                 {/* Full Name */}
                                 <MyTextInput
                                    icon="user"
                                    placeholder="Full Name"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange('fullName')}
                                    onBlur={handleBlur('fullName')}
                                    value={values.fullName}
                                />
                                {/* Username */}
                                <MyTextInput
                                    icon="user"
                                    placeholder="Username"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange('username')}
                                    onBlur={handleBlur('username')}
                                    value={values.username}
                                />
                                {/* Email */}
                                <MyTextInput
                                    icon="envelope-o"
                                    placeholder="Email"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange('email')}
                                    onBlur={handleBlur('email')}
                                    value={values.email}
                                    keyboardType="email-address"
                                />

                                {/* Password */}
                                <MyTextInput
                                    icon="lock"
                                    placeholder="Password"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange('password')}
                                    onBlur={handleBlur('password')}
                                    value={values.password}
                                    secureTextEntry={true}
                                />

                                {/* Confirm Password */}
                                <MyTextInput
                                    icon="lock"
                                    placeholder="Confirm Password"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange('confirmPassword')}
                                    onBlur={handleBlur('confirmPassword')}
                                    value={values.confirmPassword}
                                    secureTextEntry={true}
                                />

                                {/* Gender */}
                                <Text style={labelStyle}>Gender</Text>
                                <Picker
                                    selectedValue={gender}
                                    style={pickerStyle}
                                    onValueChange={(itemValue) => setGender(itemValue)}
                                >
                                    <Picker.Item label="Select Gender" value="" />
                                    <Picker.Item label="Male" value="Male" />
                                    <Picker.Item label="Female" value="Female" />
                                    <Picker.Item label="Other" value="Other" />
                                </Picker>

                                {/* Date of Birth */}
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

                                {/* Phone Number */}
                                <MyTextInput
                                    icon="phone"
                                    placeholder="Phone Number"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange('phoneNumber')}
                                    onBlur={handleBlur('phoneNumber')}
                                    value={values.phoneNumber}
                                    keyboardType="phone-pad"
                                />

                                {/* Location */}
                                <MyTextInput
                                    icon="map-marker"
                                    placeholder="Location"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange('location')}
                                    onBlur={handleBlur('location')}
                                    value={values.location}
                                />

                                {/* Address */}
                                <MyTextInput
                                    icon="address-card" // You can change the icon as per your design
                                    placeholder="Address"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange('address')}
                                    onBlur={handleBlur('address')}
                                    value={values.address}
                                />

                                {/* Years of Experience (Senior Only) */}
                                {userType === 'Senior' && (
                                    <MyTextInput
                                        icon="briefcase"
                                        placeholder="Years of Experience"
                                        placeholderTextColor={darkLight}
                                        onChangeText={handleChange('yearsOfExperience')}
                                        onBlur={handleBlur('yearsOfExperience')}
                                        value={yearsOfExperience}
                                        keyboardType="numeric"
                                    />
                                )}

                                <StyledButton onPress={handleSubmit}>
                                    <ButtonText>Sign Up as {userType}</ButtonText>
                                </StyledButton>

                                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
                                    <Text style={{ color: darkLight }}>Already have an account? </Text>
                                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                        <Text style={{ color: brand, fontWeight: 'bold' }}>Login</Text>
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

// Create a custom text input component
const MyTextInput = ({ icon, ...props }) => {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
            <LeftIcon>
                <FontAwesome name={icon} size={30} color={fifthColor} />
            </LeftIcon>
            <StyledTextInput {...props} />
        </View>
    );
};
