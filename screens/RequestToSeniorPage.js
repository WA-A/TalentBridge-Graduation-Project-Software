import React, { useState ,useContext} from 'react';
import { View, Text,TextInput, Image, TouchableOpacity, ScrollView, StyleSheet, Platform  } from 'react-native';
import { Ionicons, Feather, FontAwesome5, EvilIcons,FontAwesome6,FontAwesome, } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import { Dimensions } from 'react-native';
import { useFonts } from 'expo-font';
import * as DocumentPicker from 'expo-document-picker';
import { launchImageLibrary } from 'react-native-image-picker'; // لإختيار الصور
//import { Video } from 'react-native-video'; // لإختيار الفيديوهات إذا كنت تريد عرض الفيديوهات
import { Video } from 'expo-av';

import { NightModeProvider, NightModeContext } from './NightModeContext';

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
    StyledInputLable,
    StyledTextInput,
    Colors,
    RightIcon,
    Circle,
    Rectangle,
    StyledLine,
    Circle1,
    Circle2,
    Container,
    Switch,
    Text2,
    StyledTextInputSignUp,
    labelStyle

} from '../compnent/Style';
//color
const { brand, darkLight, careysPink, firstColor, secColor, thirdColor, fourhColor, fifthColor, primary, tertiary, secondary,black } = Colors;
const { width } = Dimensions.get('window');

const RequestToSeniorPage = () => {
  const nav = useNavigation();
    const [selectedFile, setSelectedFile] = useState(null);
        console.log('Selected File:', selectedFile);
    return (
        <View style={{ flex: 1, backgroundColor: secondary, paddingTop: 20 }}>
        {/* الشريط العلوي */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, paddingVertical: 25, backgroundColor: secondary }}>

            <Text style={{ fontFamily: 'Updock-Regular', fontSize: 30, position: 'absolute', left: 0, right: 0, textAlign: 'center' }}>
                Talent Bridge
            </Text>

        </View>

           
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, paddingVertical: 20, backgroundColor: fourhColor, elevation: 3 }}>

            <TouchableOpacity onPress={() => nav.navigate('Signup')}>
                <FontAwesome6 name="circle-left" size={25} color={careysPink} style={{ position: 'absolute', top: -15 }} />
                <Text style={{ fontSize: 17,fontWeight:'bold',color:primary ,position: 'absolute',top: -15,left:30 }}>
               Back
            </Text>
            </TouchableOpacity>
            </View>
                   
                    {/* Main Contant */}
        
                    <StyledContainer>

            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                <InnerContainer>
                    <Formik
    // Inital Value
                    >

                        {({ handleChange, handleBlur, handleSubmit, values }) => (
                            <StyledFormArea>
                                  {/* إدخال خبرات سابقة في قيادة المشاريع أو التدريس أو التدريب  */}

                                <Text style={labelStyle}> Previous Experiences</Text>
                                <MyTextInput
                                    icon="book-open"
                                    placeholder="previousExperiences"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange('previousExperiences')}
                                    onBlur={handleBlur('previousExperiences')}
                                    // onChange={e => handlepreviousExperiences(e)}
                                    // value={values.FullName}
                                    // rightIcon22={
                                    //     name.length < 1 ? null : nameVerfy ? (
                                    //         <RightIcon2 style={{ top: 6 }} >
                                    //             <Feather name="check-circle" color="green" size={20} />
                                    //         </RightIcon2>
                                    //     ) : (
                                    //         <RightIcon2 style={{ top: 6 }} >
                                    //             <Feather name="x-circle" color="red" size={20} />
                                    //         </RightIcon2>
                                    //     )}
                                />

                                {/* {
                                    name.length < 1 ? null : nameVerfy ? null :
                                        <Text style={{ marginLeft: 20, marginTop: -20, marginBottom: 10, color: 'red', }}>
                                            Name should be more then 1 characters.</Text>
                                } */}

                                {/* لماذا يريد الشخص أن يصبح سينيور */}

                                <Text style={labelStyle}>Motivation</Text>
                                <MyTextInput
                                    icon="bulb-outline"
                                    placeholder="motivation"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange('motivation')}
                                    onBlur={handleBlur('motivation')}
                                    // onChange={e => handlemotivation(e)}
                                    // value={values.motivation}
                                    // rightIcon22={
                                    //     email.length < 1 ? null : emailVerfy ? (
                                    //         <RightIcon2 style={{ top: 6 }} >
                                    //             <Feather name="check-circle" color="green" size={20} />
                                    //         </RightIcon2>
                                    //     ) : (
                                    //         <RightIcon2 style={{ top: 6 }} >
                                    //             <Feather name="x-circle" color="red" size={20} />
                                    //         </RightIcon2>
                                    //     )}

                                />
                                {/* {
                                    email.length < 1 ? null : emailVerfy ? null :
                                        <Text style={{ marginLeft: 20, marginTop: -20, marginBottom: 10, color: 'red', fontWeight: 'bold' }}>
                                            Enter Proper Email Address.</Text>
                                } */}


                                {/* كيف يمكنه المساهمة في تطوير الفرق الجينيور*/}
                                <Text style={labelStyle}>Contribution</Text>
                                <MyTextInput
                                    icon="hands-helping"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange('contribution')}
                                    onBlur={handleBlur('contribution')}
                                    placeholder="contribution"
                                    // onChange={e => handlecontribution(e)}
                                    // value={values.contribution}

                                />
                                {/* {errorMessage ? (
                                    <Text style={styles.error}>{errorMessage}</Text>
                                ) : (
                                    <Text style={styles.success}>{successMassage}</Text>
                                )} */}

                                 


                                 
                                             {/* الوثائق والشهادات*/}
      
      
                                 
                                       

                                
                            


                                <StyledButton
                                    onPress={() => {}}
                                >
                                    <ButtonText>Submit a Request to the Admin</ButtonText>
                                </StyledButton>


                              

                            </StyledFormArea>
                        )}
                    </Formik>
                </InnerContainer>
            </ScrollView>
        </StyledContainer>



            
        </View>
    );
};
const MyTextInput = ({ icon, rightIcon22,  ...props }) => {
  return (
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, justifyContent: 'center' }}>
          <LeftIcon>
              <FontAwesome name={icon} size={20} color={fifthColor} style={{ marginBottom: Platform.OS === 'web' ? 10 : 20 }}
              />
          </LeftIcon>
          <StyledTextInputSignUp {...props} style={{ width: '100%' }} />
          {rightIcon22}

      </View>
  );
};
const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
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

  },
    submitButton: {
        backgroundColor: fifthColor,
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 20,
    },

    submitText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 20,
        backgroundColor: secondary,
        elevation: 3,
    },
        fileDetails: {
            marginTop: 10,
        },
   fileButton: {
        backgroundColor: careysPink,
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 20,
    },
});

export default RequestToSeniorPage;
