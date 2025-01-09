import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Platform, ScrollView, StyleSheet } from 'react-native';
import DateTimePickerModal from '@react-native-community/datetimepicker';  // للموبايل
import { StatusBar } from 'expo-status-bar';
import { Formik } from 'formik';
import { Feather, FontAwesome, Ionicons, Entypo } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker'
import { Colors, StyledContainer, InnerContainer, PageLogo, StyledFormArea, StyledButton, ButtonText, StyledTextInputSignUp, LeftIcon, labelStyle, RightIcon, RightIcon2 } from './../compnent/Style';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// استيراد مكتبة DatePicker  فقط للويب
let DatePicker;
if (Platform.OS === 'web') {
    DatePicker = require('react-datepicker').default;
    require('react-datepicker/dist/react-datepicker.css');  // استيراد أنماط الويب
    import('./../compnent/webStyles.css');  // استيراد الأنماط الخاصة بالويب
}

// الألوان
const { brand, darkLight, fifthColor, black, secondary, fourhColor, primary, careysPink } = Colors;

export default function Signup({ navigation }) {
    const [userType, setUserType] = useState('Junior');
    const [gender, setGender] = useState('');
    const [BirthDate, setDateOfBirth] = useState(new Date());
    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

    // التعامل مع التاريخ على الموبايل
    const handleDateConfirm = (event, date) => {
        setDateOfBirth(date || BirthDate);
        setIsDatePickerVisible(false);
    };
    // const jobFields = [
    //     { label: 'Software Engineer', value: 'Software Engineer' },
    //     { label: 'Data Scientist', value: 'Data Scientist' },
    //     { label: 'Product Manager', value: 'Product Manager' },
    //     { label: 'UX/UI Designer', value: 'UX/UI Designer' },
    //     { label: 'Marketing Specialist', value: 'Marketing Specialist' },
    //     { label: 'Business Analyst', value: 'Business Analyst' },
    //     { label: 'DevOps Engineer', value: 'DevOps Engineer' },
    //     { label: 'QA Tester', value: 'QA Tester' },
    //     { label: 'IT', value: 'IT' },
    //     { label: 'Digital Marketing', value: 'Digital Marketing' },
    //     { label: 'Decor Design', value: 'Decor Design' },
    //     { label: 'Graphic Design', value: 'Graphic Design' }
    // ];

    const [values, setValues] = useState({
        FullName: '', Email: '', Password: '', ConfirmPassword: '', Gender: '', BirthDate: '', PhoneNumber: '', Location: '', YearsofExperience: '', Field: '',SeniorAccountStatus:'',
    });


    const [selectedJob, setSelectedJob] = useState('Software Engineer');
    const [jobFields, setJobFields] = useState([]); // تخزين الوظائف المحملة من API
    const [hidePassword, setHidePassword] = useState(true);
    const [hideConfirmPassword, setHideConfirmPassword] = useState(true);

    const [errorMessage, setErrorMessage] = useState('');
    const [errorMessage2, setErrorMessage2] = useState('');
    const [errorMessage3, setErrorMessage3] = useState('');

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
    const [ConfirmPassword, setConfirmPassword] = useState('');
    const [phoneVerfy, setPhoneVerfy] = useState(false);
    const [phone, setPhone] = useState('');

    const [locationVerfy, setlocationVerfy] = useState(false);
    const [Location, setlocation] = useState('');

    const [expVerfy, setExpVerfy] = useState(false);
    const [exp, setexp] = useState('');
    const [isMenuVisible, setMenuVisible] = useState(false); // For the menu visibility



    function handleName(e) {
        const nameVar = e.nativeEvent.text;
        setName(nameVar);
        setNameVerfy(false);

        if (nameVar.length > 1) {
            setName(nameVar);
            setNameVerfy(true);
        }

    }

    function handleExp(e) {
        const expNum = e.nativeEvent.text;
        setexp(expNum);
        setExpVerfy(false);

        if (/^([0-9]|[1-6][0-9]|70)$/.test(expNum)) {
            setexp(expNum);
            setExpVerfy(true);
        }
    }

    function handlelocation(e) {
        const locationVar = e.nativeEvent.text;

        setlocation(locationVar);
        setlocationVerfy(false);

        if (/^[A-Za-z\s]+$/.test(locationVar)) {

            setlocation(locationVar);
            setlocationVerfy(true);
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


    function handelPhonNumber(e) {
        const phonNumber = e.nativeEvent.text;

        setPhone(phoneVerfy);
        setPhoneVerfy(false);

        if (/^\+([1-9]{1}[0-9]{1,3})?([0-9]{4,14})$/.test(phonNumber) && phonNumber.length < 15) // تحقق من الصيغة العامة للرقم
        {
            setPhone(phonNumber);
            setPhoneVerfy(true);
        }

    }
    const handleSubmit = () => {
        if (!gender) {
            alert("Please select gender");
            return;
        }

        // تابع معالجة البيانات هنا
        console.log("Gender selected:", gender);
    };


    // Join Api With FrontPage 
    const handleSignup = async (values) => {
        try {
            // تجهيز البيانات مع التأكد من وجود FieldId
            const dataToSend = {
                ...values,
                BirthDate: BirthDate.toISOString(), // تحويل التاريخ للتنسيق المناسب
                Gender: gender, // النوع
                FieldId: selectedJob, // التأكد من إرسال FieldId من الحقل المختار
                Role: userType, // نوع المستخدم
            };
               

            if (userType === 'Senior') {
                dataToSend.SeniorAccountStatus = 'Pending';
            }


            // التحقق من وجود FieldId قبل الإرسال
            if (!dataToSend.FieldId) {
                console.error('FieldId is missing. Please select a job.');
                setErrorMessage3('Please select a job field.'); // عرض رسالة للمستخدم
                setMenuVisible(true);
                return; // منع العملية إذا كان الحقل مفقودًا
            }
    
            console.log('Sending Signup Data:', dataToSend);
    
            const baseUrl =
                Platform.OS === 'web'
                    ? 'http://localhost:3000'
                    : 'http://192.168.1.239:3000';
    
            const response = await fetch(`${baseUrl}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });
    
            // التعامل مع الاستجابة
            if (!response.ok) {
                const errorData = await response.json();
                if (response.status === 409) {
                    setErrorMessage3('This email already exists.');
                    setMenuVisible(true);
                } else {
                    setErrorMessage3(errorData.message || 'Something went wrong.');
                    setMenuVisible(true);
                }
                return;
            }
    
            const result = await response.json();
            console.log('User registered successfully:', result);
    
            if (userType === 'Senior') {
                console.log('Senior user registered with status Pending');
                navigation.navigate('RequestToSeniorPage');
            } else if (result.token) {
                // إذا كان المستخدم من نوع Junior
                await AsyncStorage.setItem('userToken', result.token); // تخزين التوكين
                navigation.navigate('HomeScreen'); 
            } else {
                console.warn('No token found in response.');
            }
        } catch (error) {
            console.error('Error in Signup Process:', error.message);
            setErrorMessage3('An unexpected error occurred.');
            setMenuVisible(true);
        }
    };
    
    

    const handelGetJobFields = async () => {
        try {
            const baseUrl = Platform.OS === 'web' ? 'http://localhost:3000' : 'http://192.168.1.239:3000';
            
            const response = await fetch(`${baseUrl}/externalapiFields/getfields`, {
                method: 'GET', 
                headers: {
                    'Content-Type': 'application/json'
                    // حذفنا Authorization لأنها قد لا تكون ضرورية هنا
                },
            });
    
            if (!response.ok) {
                throw new Error('Failed to fetch Fields');
            }
    
            const data = await response.json();
            console.log('Fetched Fields:', data.Fields); 
    
            if (data && data.Fields) {
                setJobFields(data.Fields.map(field => ({
                    label: field.sub_specialization,
                    value: field.id.toString() // تحويل المعرف إلى نص
                })));
            }
        } catch (error) {
            console.error("Error fetching fields:", error);
            setError("Failed to load job fields.");
            setMenuVisible(true);
        }
    };

    const handAddFields = async (fieldId) => {
        console.log('Field ID to add:', fieldId);
        try {
            const baseUrl =
                Platform.OS === 'web'
                    ? 'http://localhost:3000'
                    : 'http://192.168.1.239:3000';
    
            const response = await fetch(`${baseUrl}/externalapiFields/addfieldswithouttoken`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ FieldId: fieldId }),
            });
    
            console.log('Response status:', response.status);
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error response:', errorData);
                throw new Error(errorData.message || 'Failed to add field');
            }
    
            const result = await response.json();
            console.log('Field added successfully:', result);
    
            // تحديث الحقل المختار بعد الإضافة
            setSelectedJob(fieldId);
            setErrorMessage3('Field added successfully!');
            setMenuVisible(true);
        } catch (error) {
            console.error('Error in Adding Field Process:', error.message);
            setErrorMessage3('An unexpected error occurred.');
            setMenuVisible(true);
        }
    };
    
    
    
    
        

        useEffect(() => {
        handelGetJobFields(); 
    }, []);


    // useEffect(() => {
    //     if (selectedJob) {
    //         handAddFields(selectedJob);
    //     }
    // }, [selectedJob]);


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
                        initialValues={{ FullName: '', Email: '', Password: '', ConfirmPassword: '', Gender: '', BirthDate: '', PhoneNumber: '', Location: '', YearsOfExperience: '', Field: '',SeniorAccountStatus:'' }}
                        onSubmit={(values) => {
                            setValues({
                                FullName: formikValues.FullName,
                                Email: formikValues.Email,
                                Password: formikValues.Password,
                                ConfirmPassword: formikValues.ConfirmPassword,
                                Gender: formikValues.Gender,
                                BirthDate: formikValues.BirthDate,
                                PhoneNumber: formikValues.PhoneNumber,
                                Address: formikValues.Location,
                                YearsOfExperience: formikValues.YearsOfExperience,
                                Field: formikValues.Field
                            });
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
                                    onChangeText={handleChange('FullName')}
                                    onBlur={handleBlur('FullName')}
                                    onChange={e => handleName(e)}
                                    value={values.FullName}
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
                                    onChangeText={handleChange('Email')}
                                    onBlur={handleBlur('Email')}
                                    keyboardType="email-address"
                                    onChange={e => handleemail(e)}
                                    value={values.Email}
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

                                <Text style={labelStyle}>Phone Number</Text>
                                <MyTextInput
                                    icon="phone"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange('PhoneNumber')}
                                    placeholder="+ 972"
                                    onBlur={handleBlur('PhoneNumber')}
                                    onChange={e => handelPhonNumber(e)}
                                    value={values.PhoneNumber}
                                    rightIcon22={
                                        phone.length < 1 ? null : phoneVerfy ? (
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
                                    phone.length < 1 ? null : phoneVerfy ? null :
                                        <Text style={{ marginLeft: 20, marginTop: -20, marginBottom: 10, color: 'red', fontWeight: 'bold' }}>
                                            Enter A valid Number!.</Text>
                                }


                                <Text style={labelStyle}>Location</Text>
                                <MyTextInput
                                    icon="home"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange('Location')}
                                    onBlur={handleBlur('Location')}
                                    placeholder="Loacation"
                                    onChange={e => handlelocation(e)}
                                    value={values.Location}

                                    rightIcon22={
                                        Location.length < 1 ? null : locationVerfy ? (
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
                                    Location.length < 1 ? null : locationVerfy ? null :
                                        <Text style={{ marginLeft: 20, marginTop: -20, marginBottom: 10, color: 'red', fontWeight: 'bold' }}>
                                            Not Valid Location</Text>
                                }




                                {/* عرض حقل عدد سنوات الخبرة إذا كان المستخدم "Senior" */}
                                {userType === 'Senior' && (
                                    <>
                                        <Text style={labelStyle}>Years of Experience</Text>
                                        <MyTextInput
                                            icon="briefcase"
                                            placeholderTextColor={darkLight}
                                            placeholder="Years Number"
                                            onChangeText={handleChange('YearsOfExperience')}
                                            onBlur={handleBlur('YearsOfExperience')}
                                            value={Number(values.YearsOfExperience)}
                                            keyboardType="numeric"
                                            onChange={e => handleExp(e)}
                                            rightIcon22={
                                                exp.length < 1 ? null : expVerfy ? (
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
                                            exp.length < 1 ? null : expVerfy ? null :
                                                <Text style={{ marginLeft: 20, marginTop: -20, marginBottom: 10, color: 'red', fontWeight: 'bold' }}>
                                                    Select number from 0 to 40</Text>
                                        }



                                    </>
                                )}

                                {/* اختيار تاريخ الميلاد */}
                                <Text style={labelStyle}>Date of Birth</Text>
                                {Platform.OS === 'web' ? (
                                    <DatePicker
                                        selected={BirthDate}
                                        onChange={(date) => setDateOfBirth(date)}
                                        dateFormat="yyyy-MM-dd"
                                        className="date-picker"
                                    />
                                ) : (
                                    <TouchableOpacity
                                        onPress={() => setIsDatePickerVisible(true)
                                        }
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
                                        <Text style={{ color: black }}>{BirthDate.toDateString()}</Text>
                                    </TouchableOpacity>
                                )}

                                {isDatePickerVisible && (
                                    <DateTimePickerModal
                                        value={BirthDate}
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
                                        value={values.Gender}
                                    //
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
                    onValueChange={(itemValue) => {
                        setSelectedJob(itemValue); // تحديث الوظيفة المختارة
                    }}
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
                    onValueChange={(itemValue) => {
                        setSelectedJob(itemValue); // تحديث الوظيفة المختارة
                    }}
                >
                    {jobFields.map((field, index) => (
                        <Picker.Item label={field.label} value={field.value} key={index} />
                    ))}
                </Picker>
            )}
        </View>
    </View>
</View>


                         {userType === 'Senior' && (

                       <StyledButton style={{ backgroundColor: brand, marginBottom: 10}}
                                    onPress={() => navigation.navigate('RequestToSeniorPage')}
                                >
                                    <ButtonText> Request To Senior </ButtonText>
                                </StyledButton>
                          )}

                                {isMenuVisible && (
                                    <View style={[
                                        Platform.OS === 'web' ? styles.webStyle : styles.mobileStyle
                                    ]}>
                                        <View>
                                            <Text style={{
                                                fontSize: 20,
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
                                        if (!nameVerfy || !emailVerfy || !passwordVerfy || !confirmpasswordVerfy || !gender || !phoneVerfy || !locationVerfy) {

                                            setMenuVisible(true)
                                            return; // إيقاف العملية إذا لم يتم التحقق

                                        }
                                        if (!name || !email || !password || !ConfirmPassword || !gender || !phone || !Location) {

                                            setMenuVisible(true)
                                            return;
                                        }

                                        const finalValues = {
                                            ...values,
                                            BirthDate: BirthDate, // إضافة قيمة التاريخ
                                            Gender: gender, // إضافة قيمة الجنس
                                            Field: selectedJob, // إضافة مجال العمل
                                        };

                                        console.log('Button Pressed');
                                        handleSignup(finalValues);
                                        navigation.navigate('RequestToSeniorPage');
                                    }}
                                >
                                    <ButtonText>Sign Up as a  {userType}</ButtonText>
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
    webStyle: {
        position: 'fixed',   // العنصر سيبقى مثبتًا في مكانه بالنسبة للشاشة
        top: '90%',  // على سبيل المثال
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
        height: '15%',
        marginTop: 450,
    },
    textWp: {
        fontSize: 20, marginTop: 60, marginLeft: 350, color: primary
    },
    textMopile: {
        fontSize: 20, marginTop: 45, marginLeft: 220, color: primary

    }
});
