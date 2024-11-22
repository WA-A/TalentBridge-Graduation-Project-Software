import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Platform, ScrollView, StyleSheet } from 'react-native';
import DateTimePickerModal from '@react-native-community/datetimepicker';  // للموبايل
import { StatusBar } from 'expo-status-bar';
import { Formik } from 'formik';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker'
import { Colors, StyledContainer, InnerContainer, PageLogo, StyledFormArea, StyledButton, ButtonText, StyledTextInputSignUp, LeftIcon, labelStyle } from './../compnent/Style';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native'; 

// استيراد مكتبة DatePicker فقط للويب
let DatePicker;
if (Platform.OS === 'web') {
    DatePicker = require('react-datepicker').default;
    require('react-datepicker/dist/react-datepicker.css');  // استيراد أنماط الويب
    import('./../compnent/webStyles.css');  // استيراد الأنماط الخاصة بالويب
}

// الألوان
const { brand, darkLight, fifthColor, black, secondary, fourhColor, primary } = Colors;

export default function Signup({ navigation }) {
    const [userType, setUserType] = useState('Junior');
    const [gender, setGender] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState(new Date());
    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

    // التعامل مع التاريخ على الموبايل
    const handleDateConfirm = (event, date) => {
        setDateOfBirth(date || dateOfBirth);
        setIsDatePickerVisible(false);
    };
    const jobFields = [
        { label: 'Software Engineer', value: 'Software Engineer' },
        { label: 'Data Scientist', value: 'Data Scientist' },
        { label: 'Product Manager', value: 'Product Manager' },
        { label: 'UX/UI Designer', value: 'UX/UI Designer' },
        { label: 'Marketing Specialist', value: 'Marketing Specialist' },
        { label: 'Business Analyst', value: 'Business Analyst' },
        { label: 'DevOps Engineer', value: 'DevOps Engineer' },
        { label: 'QA Tester', value: 'QA Tester' },
        { label: 'IT', value: 'IT' },
        { label: 'Digital Marketing', value: 'Digital Marketing' },
        { label: 'Decor Design', value: 'Decor Design' },
        { label: 'Graphic Design', value: 'Graphic Design' }
    ];


    const [selectedJob, setSelectedJob] = useState('Software Engineer');

    const [values, setValues] = useState({
        fullName: '',
        userName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        address: '',
        birthDate: '',
        location: '',
        gender: '',
        yearsOfExperience: '', 
    });
    
    

    // Join Api With FrontPage

    const handleSignup = async (values) => {
        try {
          const response = await fetch('http://localhost:3000/auth/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
            credentials: 'include', 
          });
      
          if (!response.ok) {
            navigation.navigate('HomeScreen');  
          }
      
          const data = await response.json();
          console.log('Signup successful:', data);
        } catch (error) {
          console.error('Error during signup:', error);
        }
      };
      
    return (
        <StyledContainer>
            <StatusBar style="dark" />

            {/* العودة إلى صفحة الترحيب */}
            <TouchableOpacity
                onPress={() => navigation.navigate('WelcomeScreen')}
                style={{ position: 'absolute', top: 40, left: 20, zIndex: 10 }}
            >
                <Ionicons name="arrow-back" size={30} color={brand} />
            </TouchableOpacity>

            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
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
                        initialValues={{ fullName: '', email: '', password: '', confirmPassword: '', phoneNumber: '', location: '' }}
                        onSubmit={(values) => {
                            console.log({ userType,...values });
                          
                        }}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values }) => (
                            <StyledFormArea>
                                {/* إدخال الاسم الكامل */}
                                <Text style={labelStyle}>Full Name</Text>
                                <MyTextInput
                                    icon="user"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange('fullName')}
                                    onBlur={handleBlur('fullName')}
                                    value={values.fullName}
                                />

                                {/* إدخال البريد الإلكتروني */}
                                <Text style={labelStyle}>Email</Text>
                                <MyTextInput
                                    icon="envelope-o"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange('email')}
                                    onBlur={handleBlur('email')}
                                    value={values.email}
                                    keyboardType="email-address"
                                />

                                {/* إدخال كلمة المرور */}
                                <Text style={labelStyle}>Password</Text>
                                <MyTextInput
                                    icon="lock"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange('password')}
                                    onBlur={handleBlur('password')}
                                    value={values.password}
                                    secureTextEntry={true}
                                />

                                {/* إدخال تأكيد كلمة المرور */}
                                <Text style={labelStyle}>Confirm Password</Text>
                                <MyTextInput
                                    icon="lock"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange('confirmPassword')}
                                    onBlur={handleBlur('confirmPassword')}
                                    value={values.confirmPassword}
                                    secureTextEntry={true}
                                />

                                  
                                <Text style={labelStyle}>Phone Number</Text>
                                <MyTextInput
                                    icon="phone"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange('phoneNumber')}
                                    onBlur={handleBlur('phoneNumber')}
                                    value={values.phoneNumber}
                                />

                                <Text style={labelStyle}>Location</Text>
                                <MyTextInput
                                    icon="home"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange('location')}
                                    onBlur={handleBlur('location')}
                                    value={values.location}
                                />

                                {/* عرض حقل عدد سنوات الخبرة إذا كان المستخدم "Senior" */}
                         {userType === 'Senior' && (
                                  <>
                    <Text style={labelStyle}>Years of Experience</Text>
                    <MyTextInput
                        icon="briefcase"
                        placeholderTextColor={darkLight}
                        onChangeText={handleChange('yearsOfExperience')}
                        onBlur={handleBlur('yearsOfExperience')}
                        value={values.yearsOfExperience}
                        keyboardType="numeric"
                    />
                </>
            )}

                                {/* اختيار تاريخ الميلاد */}
                                <Text style={labelStyle}>Date of Birth</Text>
                                {Platform.OS === 'web' ? (
                                    <DatePicker
                                        selected={dateOfBirth}
                                        onChange={(date) => setDateOfBirth(date)}
                                        dateFormat="yyyy-MM-dd"
                                        className="date-picker"

                                    />
                                ) : (
                                    <TouchableOpacity
                                        onPress={() => setIsDatePickerVisible(true)}
                                        style={{
                                            border: 2,  /* الحدود */
                                            borderWidth: 1,
                                            borderColor: black,
                                            borderRadius: 30,
                                            padding: 15,
                                            marginBottom: 15,
                                            backgroundColor: secondary,

                                        }}
                                    >
                                        <Text style={{ color: black }}>{dateOfBirth.toDateString()}</Text>
                                    </TouchableOpacity>
                                )}

                                {isDatePickerVisible && (
                                    <DateTimePickerModal
                                        value={dateOfBirth}
                                        mode="date"
                                        display="default"
                                        onChange={handleDateConfirm}
                                        themeVariant="light"  // يمكنك تغيير الوضع هنا (light أو dark)
                                    />
                                )}

                                {/* اختيار الجنس */}
                                <Text style={labelStyle}>Gender</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 }}>
                                    <TouchableOpacity
                                        style={{
                                            borderWidth: gender === 'Male' ? 3 : 1,
                                            borderColor: gender === 'Male' ? fifthColor : black,
                                            backgroundColor: gender === 'Male' ? fifthColor : secondary,
                                            borderRadius: 30,
                                            padding: 10,
                                            width: '50%',
                                            marginRight: 5,

                                        }}
                                        onPress={() => setGender('Male')}
                                    >
                                        <Text style={{ color: gender === 'Male' ? primary : black, textAlign: 'center', fontWeight: 'bold' }}>Male</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{
                                            backgroundColor: secondary,
                                            borderWidth: gender === 'Female' ? 3 : 1,
                                            borderColor: gender === 'Female' ? brand : black,
                                            backgroundColor: gender === 'Female' ? brand : secondary,
                                            borderRadius: 30,
                                            padding: 10,
                                            width: '50%'
                                        }}
                                        onPress={() => setGender('Female')}
                                    >
                                        <Text style={{ color: gender === 'Female' ? primary : black, textAlign: 'center', fontWeight: 'bold' }}>Female</Text>
                                    </TouchableOpacity>
                                </View>





                                {/* اختيار المجال الوظيفي */}
                                <View style={{ marginBottom: 20 }}>
                                    <Text style={labelStyle}>Field</Text>
                                    <View style={styles.container}>
                                        <View style={styles.pickerWrapper}>
                                            {Platform.OS === 'web' ? (
                                                // ستايل مخصص للويب
                                                <Picker
                                                    selectedValue={selectedJob}
                                                    onValueChange={(itemValue) => setSelectedJob(itemValue)}
                                                    style={styles.pickerWeb}
                                                >
                                                    {jobFields.map((field, index) => (
                                                        <Picker.Item label={field.label} value={field.value} key={index} />
                                                    ))}
                                                </Picker>
                                            ) : (
                                                // ستايل مخصص للموبايل (أندرويد و iOS)
                                                <Picker
                                                    selectedValue={selectedJob}
                                                    onValueChange={(itemValue) => setSelectedJob(itemValue)}
                                                >
                                                    {jobFields.map((field, index) => (
                                                        <Picker.Item label={field.label} value={field.value} key={index} />
                                                    ))}
                                                </Picker>
                                            )}
                                        </View>
                                    </View>
                                </View>


                                {/* زر التسجيل */}
                                <StyledButton onPress={() => { console.log('Button Pressed'); handleSignup(values); }}>
                                    <ButtonText>Sign Up as {userType}</ButtonText>
                                    </StyledButton>




                                 {/* زر الانتقال لتسجيل الدخول */}
                         <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                         <Text style={{ color: fifthColor, textAlign: 'center', marginTop: 15 }}>Already have an account? Log In</Text>
                     </TouchableOpacity>

                            </StyledFormArea>
                        )}   
                    </Formik>
                </InnerContainer>
            </ScrollView>
        </StyledContainer>
    );
}

// مكون الإدخال الخاص
const MyTextInput = ({ icon, ...props }) => {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, justifyContent: 'center' }}>
            <LeftIcon>
                <FontAwesome name={icon} size={20} color={fifthColor} marginBottom={20} />
            </LeftIcon>
            <StyledTextInputSignUp {...props} style={{ width: '100%' }} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pickerWrapper: {
        width: '100%',
        borderWidth: 1,
        borderRadius: 30,
        backgroundColor: secondary,
    },
    pickerWeb: {
        width: '100%',
        height: 40,
        borderRadius: 30,
        backgroundColor: secondary,
        borderWidth: 1,
        paddingLeft: 10,
        fontSize: 16,
    },

});
