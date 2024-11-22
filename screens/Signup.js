import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Platform, ScrollView, StyleSheet } from 'react-native';
import DateTimePickerModal from '@react-native-community/datetimepicker';  // للموبايل
import { StatusBar } from 'expo-status-bar';
import { Formik } from 'formik';
import { Feather, FontAwesome, Ionicons, Error } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker'
import { Colors, StyledContainer, InnerContainer, PageLogo, StyledFormArea, StyledButton, ButtonText, StyledTextInputSignUp, LeftIcon, labelStyle, RightIcon, RightIcon2 } from './../compnent/Style';
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
    

    const [hidePassword, setHidePassword] = useState(true);
    const [hideConfirmPassword, setHideConfirmPassword] = useState(true);

    const [errorMessage, setErrorMessage] = useState('');
    const [errorMessage2, setErrorMessage2] = useState('');

    const [successMassage, setSuccessMassage] = useState('');
    const [successMassage2, setSuccessMassage2] = useState('');
    //verify
    const [name, setName] = useState('');
    const [nameVerfy, setNameVerfy] = useState(false);
    const [email, setEmail] = useState('');
    const [emailVerfy, setemailVerfy] = useState(false);
    const [password, setpassword] = useState('');
    const [passwordVerfy, setPasswordVerfy] = useState(false);
    const [confirmpasswordVerfy, setConfirmPasswordVerfy] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');

    function handleName(e) {
        const nameVar = e.nativeEvent.text;
        setName(nameVar);
        setNameVerfy(false);

        if (nameVar.length > 1) {
            setName(nameVar);
            setNameVerfy(true);
        }

    }

    function handleemail(e) {
        const emailVar = e.nativeEvent.text;
        setEmail(emailVar);
        setemailVerfy(false);

        if (/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{3,}$/.test(emailVar)) {
            setEmail(emailVar)
            setemailVerfy(true);
        }
    }

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

    function handleCinfirmPassword(e) {
        console.log("password:", password);
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

    // Join Api With FrontPage

    const handleSignup = async (data) => {
        try {
            console.log('Sending Signup Data:', data);
            const response = await fetch('http://localhost:3000/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Something went wrong');
            }

            const result = await response.json();
            console.log('User registered successfully:', result);
            navigation.navigate('HomeScreen');

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
                            console.log({ userType, ...values });

                        }}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values }) => (
                            <StyledFormArea>
                                {/* إدخال الاسم الكامل */}
                                <Text style={labelStyle}>Full Name</Text>
                                <MyTextInput
                                    icon="user"
                                    placeholder="Name"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange('fullName')}
                                    onBlur={handleBlur('fullName')}
                                    value={values.fullName}
                                    onChange={e => handleName(e)}
                                    rightIcon22={
                                        name.length < 1 ? null : nameVerfy ? (
                                            <RightIcon2 style={{ top: 6 }} >
                                                <Feather name="check-circle" color="green" size={20} />
                                            </RightIcon2>
                                        ) : (
                                            <RightIcon2 style={{ top: 6 }} >
                                                <Feather name="x-circle" color="red" size={20} />
                                            </RightIcon2>
                                        )}
                                />

                                {
                                    name.length < 1 ? null : nameVerfy ? null :
                                        <Text style={{ marginLeft: 20, marginTop: -20, marginBottom: 10, color: 'red', }}>
                                            Name should be more then 1 characters.</Text>
                                }

                                {/* إدخال البريد الإلكتروني */}

                                <Text style={labelStyle}>Email</Text>
                                <MyTextInput
                                    icon="envelope-o"
                                    placeholder="example12@gmail.com"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange('email')}
                                    onBlur={handleBlur('email')}
                                    value={values.email}
                                    keyboardType="email-address"
                                    onChange={e => handleemail(e)}
                                    rightIcon22={
                                        email.length < 1 ? null : emailVerfy ? (
                                            <RightIcon2 style={{ top: 6 }} >
                                                <Feather name="check-circle" color="green" size={20} />
                                            </RightIcon2>
                                        ) : (
                                            <RightIcon2 style={{ top: 6 }} >
                                                <Feather name="x-circle" color="red" size={20} />
                                            </RightIcon2>
                                        )}

                                />
                                {
                                    email.length < 1 ? null : emailVerfy ? null :
                                        <Text style={{ marginLeft: 20, marginTop: -20, marginBottom: 10, color: 'red', fontWeight: 'bold' }}>
                                            Enter Proper Email Address.</Text>
                                }



                                {/* إدخال كلمة المرور */}
                                <Text style={labelStyle}>Password</Text>
                                <MyTextInput
                                    icon="lock"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange('password')}
                                    onBlur={handleBlur('password')}
                                    value={values.password}
                                    secureTextEntry={hidePassword}
                                    placeholder="password"
                                    isPassword={true}
                                    hidePassword={hidePassword}
                                    setHidePassword={setHidePassword}

                                    onChange={e => handlePassword(e)}
                                    rightIcon22={
                                        password.length < 1 ? null : passwordVerfy ? (
                                            <RightIcon2 style={{ top: 6, right: 40 }} >
                                                <Feather name="check-circle" color="green" size={20} />
                                            </RightIcon2>
                                        ) : (
                                            <RightIcon2 style={{ top: 6, right: 40 }} >
                                                <Feather name="x-circle" color="red" size={20} />
                                            </RightIcon2>
                                        )}

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
                                    onChangeText={handleChange('confirmPassword')}
                                    onBlur={handleBlur('confirmPassword')}
                                    value={values.confirmPassword}
                                    secureTextEntry={hideConfirmPassword}
                                    placeholder="confirm Password"
                                    isConfirmPassword={true}
                                    hideConfirmPassword={hideConfirmPassword}
                                    setHideConfirmPassword={setHideConfirmPassword}
                                    onChange={e => handleCinfirmPassword(e)}

                                    rightIcon22={
                                        confirmPassword.length < 1 ? null : confirmpasswordVerfy ? (
                                            <RightIcon2 style={{ top: 6, right: 40 }} >
                                                <Feather name="check-circle" color="green" size={20} />
                                            </RightIcon2>
                                        ) : (
                                            <RightIcon2 style={{ top: 6, right: 40 }} >
                                                <Feather name="x-circle" color="red" size={20} />
                                            </RightIcon2>
                                        )}
                                />
                                {errorMessage2 ? (
                                    <Text style={styles.error}>{errorMessage2}</Text>
                                ) : (
                                    <Text style={styles.success}>{successMassage2}</Text>
                                )}

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
const MyTextInput = ({ icon, rightIcon22, isPassword, hidePassword, setHidePassword, isConfirmPassword, hideConfirmPassword, setHideConfirmPassword, ...props }) => {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, justifyContent: 'center' }}>
            <LeftIcon>
                <FontAwesome name={icon} size={20} color={fifthColor} marginBottom={20} />
            </LeftIcon>
            <StyledTextInputSignUp {...props} style={{ width: '100%' }} />
            {rightIcon22}

            {isPassword && (
                <RightIcon style={{ top: 6 }} onPress={() => setHidePassword(!hidePassword)}>
                    <Ionicons name={hidePassword ? "eye-off" : "eye"} size={25} color={darkLight} />
                </RightIcon>
            )}
            {isConfirmPassword && (
                <RightIcon style={{ top: 6 }} onPress={() => setHideConfirmPassword(!hideConfirmPassword)}>
                    <Ionicons name={hideConfirmPassword ? "eye-off" : "eye"} size={25} color={darkLight} />
                </RightIcon>
            )}

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
    error: {
        color: 'red',
        fontSize: 12,
        marginLeft: 20, marginTop: -15, marginBottom: 10, fontWeight: 'bold'
    },
    success: {
        color: 'green',
        fontSize: 12, marginLeft: 20, marginTop: -15, marginBottom: 10, fontWeight: 'bold'
    },

});