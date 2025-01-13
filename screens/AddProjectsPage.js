import React, { useState, useContext,useRef,useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, Image,TextInput,TouchableOpacity, StyleSheet, ToastAndroid,useColorScheme, PermissionsAndroid, ScrollView,Animated, Button, Alert, Platform,TouchableWithoutFeedback,Keyboard, FlatList,KeyboardAvoidingView,flatListRef} from 'react-native';
import { Ionicons, Feather, FontAwesome5, EvilIcons, FontAwesome,Entypo,MaterialIcons,AntDesign,MaterialCommunityIcons,FontAwesome6} from '@expo/vector-icons';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import MultiSelect from 'react-native-multiple-select';
import { Video as ExpoVideo } from 'expo-av';
import * as MediaLibrary from 'expo-media-library';
import Modal from 'react-native-modal';
import { useNavigation } from '@react-navigation/native';
import { Dimensions } from 'react-native';
import { useFonts } from 'expo-font';
import { NightModeContext } from './NightModeContext';
import * as ImagePicker from 'expo-image-picker';
import io from 'socket.io-client';
import moment from 'moment';
import { decode as atob } from 'base-64'; // إذا كنت تستخدم React Native
import * as DocumentPicker from "expo-document-picker";
import './../compnent/webCardStyle.css';
import {
    Colors,
    Card,
    ContainerCard,
    UserIMg,
    UserInfo,
    UserName,
    UserInfoText,
    PostTime,
    PostText,
    PostIMg,
    ReactionOfPost,
    Interaction,
    InteractionText,
} from './../compnent/Style'
import ImageViewer from 'react-native-image-zoom-viewer';
// Color constants
const { secondary, primary, careysPink, darkLight, fourhColor, tertiary, fifthColor,brand } = Colors;
const { width } = Dimensions.get('window');
import * as WebBrowser from 'expo-web-browser'

import * as FileSystem from 'expo-file-system';
import Video from 'react-native-video';
//import * as Linking from 'expo-linking';
import CommentsModal from './CommentsModal';
import { setIsEnabledAsync } from 'expo-av/build/Audio';
import { string } from 'prop-types';
import { use } from 'react';

const AddProjectsPage = () => {

    const [ProjectName, setProjectName] = useState('');
    const [Description, setDescription] = useState('');
    const [RequiredSkills, setRequiredSkills] = useState('');
    const [Field, setField] = useState('');
    const [DurationInMounths, setDurationInMounths] = useState('');
    const [PositionRole, setPositionRole] = useState('');
    const [WorkLocation, setWorkLocation] = useState('');
    const [Benefits, setBenefits] = useState('');
    const [Price, setPrice] = useState('');
    const [FieldUser, setFieldUser] = useState('');
  const [userSkills, setUserSkills] = useState([]);
  const [userRateSkills, setUserRateSkills] = useState([]);
  const [skillsList, setSkillsList] = useState([]); // قائمة المهارات
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [RateselectedSkills, setRateSelectedSkills] = useState([]);
  const [Skills, setSkills] = useState([]);
    const nav = useNavigation();
    let [fontsLoaded] = useFonts({
        'Updock-Regular': require('./../compnent/fonts/Updock-Regular.ttf'),
    });

   
    const baseUrl = Platform.OS === 'web'
      ? 'http://localhost:3000'
      : 'http://192.168.1.239:3000' || 'http://192.168.0.107:3000';
        const [selectedFeilds, setSelectedFeilds] = useState([]);
        const [Feilds, setFeilds] = useState([]);
  const [currentModal, setCurrentModal] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState('');

  const openModal = (modalName) => {
    setCurrentModal(modalName);
    setModalVisible(true);
    setError('');
    setSelectedSkills([]);
  };
    // إغلاق الـ Modal
    const closeModal = () => {
      setModalVisible(false);
      setCurrentModal('');
    };
    const onSelectedItemsChange = (selectedItems) => {
      setSelectedFeilds(selectedItems); // تحديث حالة اللغات المحددة
  
    };
  
  
    const handleGetSkills = async () => {
        try {
          const token = await AsyncStorage.getItem('userToken'); // استرجاع التوكن
          if (!token) {
            console.error('Token not found');
            return;
          }
    
          const response = await fetch(`${baseUrl}/externalapiSkills/getskills`, {
            method: 'GET',
            headers: {
              'Authorization': `Wasan__${token}`, // تضمين التوكن في الهيدر
            },
          });
    
          if (!response.ok) {
            const errorData = await response.json(); // إذا كان هناك خطأ في الرد
            throw new Error(errorData.message || 'Failed to fetch skills');
          }
    
          const data = await response.json(); // تحويل الرد إلى JSON
          setSkills(data.Skills); // تخزين اللغات في الحالة لعرضها
          console.log(Skills);
          console.log('Fetched skills:', data.Skills); // تحقق من البيانات
        } catch (error) {
          console.error('Error fetching skills:', error.message);
        }
      };
    const handleGetUserFeild = async () => {
        try {
          const token = await AsyncStorage.getItem('userToken'); // الحصول على التوكن من التخزين
          console.log(token);
          if (!token) {
            console.error('Token not found');
            return;
          }
    
          const response = await fetch(`${baseUrl}/user/getUserFeild`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Wasan__${token}`, // تأكد من كتابة التوكن بالشكل الصحيح
            },
          });
    
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();

         setFieldUser(data.Fields);

        } catch (error) {
          console.error('Error fetching ProfileData:', error);
        }
        finally {
          setIsLoading(false);
        }
      };
        const handleGetFeilds = async () => {
          try {
            const token = await AsyncStorage.getItem('userToken'); // استرجاع التوكن
            if (!token) {
              console.error('Token not found');
              return;
            }
      
            const response = await fetch(`${baseUrl}/externalapiFields/getfields`, {
              method: 'GET',
              headers: {
                'Authorization': `Wasan__${token}`, // تضمين التوكن في الهيدر
              },
            });
      
            if (!response.ok) {
              const errorData = await response.json(); // إذا كان هناك خطأ في الرد
              throw new Error(errorData.message || 'Failed to fetch skills');
            }
      
            const data = await response.json(); // تحويل الرد إلى JSON
            setFeilds(data.Fields); // تخزين اللغات في الحالة لعرضها
            console.log('Fetched Feilds:', data.Fields); // تحقق من البيانات
          } catch (error) {
            console.error('Error fetching Feilds:', error.message);
          }
        };
      

        const handleSave = async () => {

          if (currentModal === 'skills') {
       console.log(selectedSkills);
          }
      
        };
      

  const [profile,setprofileimg] = useState('');
  const handleViewProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken'); // الحصول على التوكن من التخزين
      console.log(token);
      if (!token) {
        console.error('Token not found');
        return;
      }

      const response = await fetch(`${baseUrl}/User/ViewOwnProfile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Wasan__${token}`, // تأكد من كتابة التوكن بالشكل الصحيح
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setprofileimg(data.PictureProfile?.secure_url || '');


    } catch (error) {
      console.error('Error fetching ProfileData:', error);
    }
  };
    const { isNightMode, toggleNightMode } = useContext(NightModeContext);
    const [selectFieldModalVisible, setSelectFieldModalVisible] = useState(false); 
    const [applyNowModalVisible, setApplyNowModalVisible] = useState(false);  
    const [selectedField, setSelectedField] = useState('');
    const [NumberOfTrain ,setNumberOfTrain] = useState('');
    const [ProfileLink ,setProfileLink] = useState('');
  const [scrollY] = useState(new Animated.Value(0));


    if (!fontsLoaded) {
        return <View><Text>Loading...</Text></View>;
    }

    const handleFieldSelect = (field) => {
        selectFieldModalVisible(field);
        setSelectFieldModalVisible(false);
    };

    const handleApplyNow = () => {
      setNumberOfTrain();
      setProfileLink();
      setApplyNowModalVisible(true);
  };

    // Load custom fonts
    const bottomBarTranslate = scrollY.interpolate({
      inputRange: [0, 50],
      outputRange: [0, 100], // 100 to move it off-screen
      extrapolate: 'clamp',
    });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    handleViewProfile();
    handleGetFeilds();
    handleGetUserFeild();
    handleGetSkills ();
  }, []);
  
      
    const [file, setFile] = useState(null);




        const handleFilePicker = async () => {
            try {
              const result = await DocumentPicker.getDocumentAsync({
                type: 'application/pdf', // فقط ملفات PDF
              });
              console.log(result.uri);
              console.log(result);
              // التأكد من أن المستخدم لم يلغي العملية
              if (result.canceled) {
                console.log('User canceled file selection');
              } else {
                // التعامل مع النتيجة
                const pickedFile = result.assets ? result.assets[0] : null;
                if (pickedFile) {
                  setFile(pickedFile);
                  console.log('File URI:', pickedFile.uri);  // عرض مسار الملف
                }
              }
            } catch (error) {
              console.error('Error picking file:', error);
            }
          };
    const handleAddProject = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) throw new Error('No token found');
    
            const baseUrl = Platform.OS === 'web'
                ? 'http://localhost:3000'
                : 'http://192.168.1.239:3000';
    
            const formData = new FormData();
    
            formData.append('ProjectName', ProjectName);
            formData.append('Description', Description);
            formData.append('FieldId', FieldUser[0]?.id);
            formData.append('DurationInMounths', DurationInMounths);
            formData.append('WorkLocation', WorkLocation);
            formData.append('Benefits', Benefits);
            formData.append('Price', Price);
    
       
                
            selectedSkills.forEach((skill, index) => {
                formData.append(`skillsArray[${index}].id`, skill.id);
                formData.append(`skillsArray[${index}].Rate`, skill.rating);
            });
        
            // إضافة الأدوار
            const defaultRoles = [
                { roleName: "Frontend Developer" },
                { roleName: "Backend Developer" }
            ];
    
            defaultRoles.forEach((role, index) => {
                formData.append(`Roles[${index}].roleName`, role.roleName);
            });

            if (file) {
                let fileUri = file.uri;
            
                // إذا كان التطبيق على الويب
                if (Platform.OS === 'web' && fileUri.startsWith('file://')) {
                    // في الويب لا نحتاج إلى "file://"
                    fileUri = fileUri.replace('file://', '');
                }
            
                formData.append('FileProject', {
                    uri: fileUri,
                    name: file.name,
                    type: file.mimeType || 'application/pdf',
                });
            }
            
            console.log('FormData before sending:', formData);
    
            const response = await fetch(`${baseUrl}/project/createproject`, {
                method: 'POST',
                headers: {
                    'Authorization': `Wasan__${token}`, 
                },
                body: formData,
            });
    

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Something went wrong');
            }
    
            const result = await response.json();
            console.log('Add Project successfully:', result);
        } catch (error) {
            console.error('Error adding project:', error);
        }
    };
    
    
    
    return (
        <View style={{ flex: 1 }}>
        <View style={{
          height: Platform.OS === 'web' ? 50 : 20, backgroundColor: isNightMode ? "#000" : secondary
  
        }} />
        {Platform.OS === 'web' ? (
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 10,
            paddingVertical: 10,
            backgroundColor: isNightMode ? "#000" : secondary,
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10
          }}>
  
            {/* زر الإعدادات وزر المشاريع */}
            <View style={{
              flexDirection: 'row', alignItems: 'center', left: '10%',
            }}>
              <TouchableOpacity onPress={() => nav.navigate('HomeScreen')} style={{ marginRight: 100, marginLeft: 80 }}>
                <Ionicons name="home" size={20} color={isNightMode ? primary : "#000"} />
              </TouchableOpacity>
  
  
              <TouchableOpacity
    onPress={async () => {
      try {
        const token = await AsyncStorage.getItem('userToken'); // استرجاع التوكن
        if (!token) {
          console.error('Token not found');
          return;
        }
  
        // إزالة المقدمة "Wasan__" وفك التوكن
        const jwt = token.replace('Wasan__', ''); // حذف المقدمة
        const payload = JSON.parse(atob(jwt.split('.')[1])); // فك تشفير الـ payload
  
        const userRole = payload.role; // الحصول على الدور
       console.log(userRole);
        // التحقق من الدور والتنقل
        if (userRole === 'Senior') {
          nav.navigate('ProjectsSeniorPage'); // الانتقال لصفحة Senior
        } else if (userRole === 'Junior') {
          nav.navigate('ProjectsJuniorPage'); // الانتقال لصفحة Junior
        } else {
          console.error('Invalid role');
        }
      } catch (error) {
        console.error('Error processing token:', error.message);
      }
    }}
    style={{ marginRight: 100 }}
  >
    <Ionicons name="folder" size={20} color={isNightMode ? primary : "#000"} />
  </TouchableOpacity>
              
              <TouchableOpacity onPress={() => nav.navigate('AddPostScreen')} style={{ marginRight: 100 }}>
                <Ionicons name="add-circle" size={25} color={isNightMode ? primary : "#000"} />
              </TouchableOpacity>
  
  
  
              <TouchableOpacity onPress={() => nav.navigate('Chat')} style={{ marginRight: 100 }}>
                <EvilIcons name="sc-telegram" size={30} color={isNightMode ? primary : "#000"} />
              </TouchableOpacity>
  
              <TouchableOpacity style={{ marginRight: 100 }}
                onPress={() => nav.navigate('Notification')}>
                <Ionicons name="notifications" size={20} color={isNightMode ? primary : "#000"} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setMenuVisible(true)}
                style={{ marginRight: 100 }}>
                <Ionicons name="settings" size={20} color={isNightMode ? primary : "#000"} />
              </TouchableOpacity>
  
            </View>
  
            {/* عنوان التطبيق */}
            <Text style={{
              fontFamily: 'Updock-Regular',
              fontSize: 30,
              textAlign: 'center',
              color: isNightMode ? primary : "#000",
              position: 'absolute',
              left: 45,
              //transform: [{ translateX: -75 }] // لضبط النص في المنتصف
            }}>
              Talent Bridge
            </Text>
  
            {/* مربع البحث */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 80 }}>
              <Ionicons name="search" size={20} color={isNightMode ? primary : "#000"} style={{ marginRight: 5 }} />
              <TextInput
                style={{
                  height: 30,
                  borderColor: '#000',
                  borderWidth: 1,
                  paddingLeft: 5,
                  borderRadius: 15,
                  padding: 10,
                  width: 300,
                  color: isNightMode ? '#FFF' : '#000',
                  backgroundColor: isNightMode ? '#5E5A5A' : '#fff'
                }}
                placeholder="Search.."
                placeholderTextColor={isNightMode ? '#fff' : '#888'}
                value={searchQuery}            // تعيين قيمة البحث
                onChangeText={setSearchQuery}  // تحديث قيمة البحث عند الكتابة
              />
            </View>
          </View>
        )
          : (
            <>
              <View style={{
                flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                paddingHorizontal: 10, paddingVertical: 10, backgroundColor: isNightMode ? "#000" : secondary,
                position: Platform.OS === 'web' ? 'fixed' : 'relative', top: 0, left: 0, right: 0, zIndex: 10,
              }}>
  
                <Text style={{ fontFamily: 'Updock-Regular', fontSize: 30, position: 'absolute', left: 0, right: 0, textAlign: 'center', color: isNightMode ? primary : "#000" }}>
                  Talent Bridge
                </Text>
  
                <TouchableOpacity onPress={() => nav.navigate('Chat')}>
                  <EvilIcons name="sc-telegram" size={39} color={careysPink} style={{ position: 'absolute', top: -20, left: 10 }} />
                  <EvilIcons name="sc-telegram" size={37} color={darkLight} style={{ position: 'absolute', top: -20, left: 10 }} />
                </TouchableOpacity>
  
                {/* أيقونة الإشعارات */}
                <TouchableOpacity style={{ position: 'relative', width: 50, height: 50 }}
                  onPress={() => nav.navigate('Notification')}>
                  <Ionicons style={{ position: 'absolute', top: 10, right: 18 }} name="notifications" size={27} color={darkLight} />
                </TouchableOpacity>
              </View>
  
  
              <View style={[styles.container, { backgroundColor: isNightMode ? '#2C2C2C' : '#f0f0f0' }]}>
                <TouchableOpacity onPress={() => nav.goBack()} style={styles.backButton}>
                  <Ionicons name="arrow-back" size={24} color={isNightMode ? '#fff' : '#000'} />
                </TouchableOpacity>
  
                <View style={[styles.searchBox, { backgroundColor: isNightMode ? '#5E5A5A' : '#fff' }]}>
                  <Ionicons name="search" size={20} color={isNightMode ? '#fff' : '#888'} style={styles.searchIcon} />
  
                  <TextInput
                    style={[styles.inputSearch, { color: isNightMode ? '#fff' : '#000' }]}
                    placeholder="Search..."
                    placeholderTextColor={isNightMode ? '#ccc' : '#888'}
                    value={searchQuery}            // تعيين قيمة البحث
                    onChangeText={setSearchQuery}  // تحديث قيمة البحث عند الكتابة
                    returnKeyType="search"         // تحويل زر الإدخال في لوحة المفاتيح إلى زر بحث
                    //  onSubmitEditing={() => nav.navigate('SearchScreen',{searchQuery:searchQuery})} // تنفيذ البحث
                    onFocus={() => nav.navigate('SearchScreen', { searchQuery: searchQuery })}
                  />
                </View>
              </View>
            </>
          )}
               

            {/* المحتوى الرئيسي لملء الشاشة */}
            <View style={{ flex: 1,  backgroundColor: isNightMode ? "#000" : primary }}>
            <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Project Name</Text>
                    <TextInput
                        style={styles.input}
                        value={ProjectName}
                        onChangeText={setProjectName}
                        placeholder="Enter project name"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                        style={styles.input}
                        value={Description}
                        onChangeText={setDescription}
                        placeholder="Enter project description"
                        multiline
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Required Skills</Text>
                    <TouchableOpacity onPress={() => openModal('skills')} style={styles.smallButton}>
                                     <Text style={styles.smallButtonText}>Add</Text>
                                   </TouchableOpacity>
                </View>
                <Text >{FieldUser[0]?.sub_specialization}</Text>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Field</Text>
                </View>


                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Duration (Months)</Text>
                    <TextInput
                        style={styles.input}
                        value={DurationInMounths}
                        onChangeText={setDurationInMounths}
                         placeholder="Enter duration in months"
                    />
                </View>
             
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Position Role</Text>
                    <TextInput
                        style={styles.input}
                        value={PositionRole}
                        onChangeText={setPositionRole}
                        placeholder="Enter position role"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Work Location</Text>
                    <TextInput
                        style={styles.input}
                        value={WorkLocation}
                        onChangeText={setWorkLocation}
                        placeholder="Enter Work Location"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Benefits</Text>
                    <TextInput
                        style={styles.input}
                        value={Benefits}
                        onChangeText={setBenefits}
                        placeholder="Enter Benefits"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Price</Text>
                    <TextInput
                        style={styles.input}
                        value={Price}
                        onChangeText={setPrice}
                        placeholder="Enter Price"
                    />
                </View>

                <View style={styles.container}>
      <Text style={styles.label}>File Project</Text>
      <TouchableOpacity style={styles.fileButton} onPress={handleFilePicker}>
        <Text style={styles.submitText}>Select File</Text>
      </TouchableOpacity>

      {file && (
        <View style={styles.fileInfo}>
          <Text>File Name: {file.name}</Text>
        </View>
      )} 

    </View>
   


                <TouchableOpacity style={styles.submitButton} onPress={handleAddProject}>
                    <Text style={styles.submitText}>Add Project</Text>
                </TouchableOpacity>
            </ScrollView>
                

            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={closeModal}>
                      <View style={styles.modalContainer}>
                        <View style={[styles.modalContent, { backgroundColor: isNightMode ? Colors.black : Colors.primary }]}>      
      {currentModal === 'skills' && (
                  <>
                    {/* عنوان النافذة */}
                    <Text style={[styles.modalTitle, { marginTop: 0 }]}>Select Skill(s)</Text>
                    <Text style={{ color: Colors.brand }}>{error}</Text>

                    {/* قائمة المهارات متعددة الاختيار */}
                    <MultiSelect
                      style={styles.scrollableItemsContainer}
                      items={Skills} // قائمة المهارات
                      uniqueKey="id" // المفتاح الفريد لكل مهارة
                      onSelectedItemsChange={(selectedItems) => {
                        const updatedSkills = selectedItems.map((itemId) => {
                          const existingSkill = selectedSkills.find((skill) => skill.id === itemId);
                          return existingSkill || {
                            id: itemId,
                            name: Skills.find((s) => s.id === itemId).name,
                            rating: 0, // التقييم الافتراضي 0
                            Rate: 0, // إضافة خاصية التقييم
                          };
                        });
                        setSelectedSkills(updatedSkills);
                      }}

                      selectedItems={selectedSkills.map((skill) => skill.id)} // تحديد العناصر المختارة حاليًا
                      selectText="Choose Skills"
                      submitButtonColor={isNightMode ? Colors.fourhColor : Colors.fourhColor}
                      tagRemoveIconColor={isNightMode ? Colors.brand : Colors.brand}
                      tagBorderColor={isNightMode ? '#4A90E2' : '#333'}
                      tagTextColor={isNightMode ? Colors.fifthColor : '#333'}
                      selectedItemTextColor={isNightMode ? Colors.fifthColor : '#333'}
                      selectedItemIconColor={isNightMode ? Colors.brand : '#333'}
                      itemTextColor={isNightMode ? '#000' : '#333'}
                      displayKey="name"
                      styleDropdownMenu={{
                        backgroundColor: isNightMode ? '#444' : '#EEE',
                      }}
                      styleTextDropdown={{
                        color: isNightMode ? '#000' : '#333',
                        fontSize: 16,
                        fontWeight: 'bold',
                      }}
                      fixedHeight={true}
                      styleItemsContainer={{
                        maxHeight: 190,
                        overflow: 'hidden', // منع تجاوز العناصر للحاوية

                      }}
                    />

                    {/* عرض المهارات المحددة مع نظام التقييم */}
                    {selectedSkills.map((skill, index) => (
                      <View
                        key={skill.id}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginVertical: 10,
                          justifyContent: 'space-between',
                        }}
                      >
                        {/* عرض اسم المهارة */}
                        <Text
                          style={{
                            color: isNightMode ? '#FFF' : '#000',
                            fontSize: 16,
                            flex: 1,
                          }}
                        >
                          {skill.name}
                        </Text>

                        {/* عرض نظام النجوم للتقييم */}
                        <View style={{ flexDirection: 'row', flex: 1 }}>
                          {[1, 2, 3, 4, 5].map((starIndex) => (
                            <TouchableOpacity
                              key={starIndex}
                              onPress={() => {
                                const updatedSkills = [...selectedSkills];
                                updatedSkills[index].rating = starIndex; // تحديث التقييم في rating
                                updatedSkills[index].Rate = starIndex;   // تخزين التقييم في Rate
                                setSelectedSkills(updatedSkills);
                              }}
                            >
                              <MaterialCommunityIcons
                                name={starIndex <= skill.rating ? 'star' : 'star-outline'}
                                size={20}
                                color={
                                  starIndex <= skill.rating
                                    ? '#F7A8B8'
                                    : isNightMode
                                      ? Colors.primary
                                      : Colors.black
                                }
                              />
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>
                    ))}
                  </>
                )}

                <View style={styles.buttonsContainer}>
                  <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                    <Text style={styles.saveButtonText}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
            </View>

            {/* شريط التنقل السفلي */}
            {Platform.OS === 'web' ? (null) : (
        <Animated.View
          style={{
            transform: [{ translateY: bottomBarTranslate }],
            backgroundColor: isNightMode ? "#454545" : secondary,
            flexDirection: 'row',
            justifyContent: 'space-around',
            padding: 10,
            elevation: 3,
            position: Platform.OS === 'web' ? 'fixed' : 'absolute', // إذا كان الويب، يبقى ثابت
            bottom: 0,
            width: '100%',
            zIndex: 10, // لضمان ظهور شريط التنقل فوق المحتوى
          }}
        >
          <TouchableOpacity onPress={() => setMenuVisible(true)}>
            <Ionicons name="settings" size={25} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity
  onPress={async () => {
    try {
      const token = await AsyncStorage.getItem('userToken'); // استرجاع التوكن
      if (!token) {
        console.error('Token not found');
        return;
      }

      // إزالة المقدمة "Wasan__" وفك التوكن
      const jwt = token.replace('Wasan__', ''); // حذف المقدمة
      const payload = JSON.parse(atob(jwt.split('.')[1])); // فك تشفير الـ payload

      const userRole = payload.role; // الحصول على الدور
     console.log(userRole);
      // التحقق من الدور والتنقل
      if (userRole === 'Senior') {
        nav.navigate('ProjectsSeniorPage'); // الانتقال لصفحة Senior
      } else if (userRole === 'Junior') {
        nav.navigate('ProjectsJuniorPage'); // الانتقال لصفحة Junior
      } else {
        console.error('Invalid role');
      }
    } catch (error) {
      console.error('Error processing token:', error.message);
    }
  }}
>
  <Ionicons name="folder" size={25} color={isNightMode ? primary : "#000"} />
</TouchableOpacity>
          <TouchableOpacity onPress={() => nav.navigate('ProfilePage')}>
            <Image
              source={{
                uri: profile || 'https://via.placeholder.com/80', // استخدام الصورة المختارة أو صورة بروفايل أو صورة افتراضية
              }} style={{
                width: 30,
                height: 30,
                borderRadius: 30,
                borderColor: tertiary,
                borderWidth: 1
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => nav.navigate('AddPostScreen')}>
            <Ionicons name="add-circle" size={28} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => nav.navigate('HomeScreen')}>
            <Ionicons name="home" size={25} color="#000" />
          </TouchableOpacity>
        </Animated.View>
      )}

        </View>
    );
};
const styles = StyleSheet.create({
    lightBackground: {
        position: 'absolute',
        top: 4,
        left: 22,
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#b0c4de',
        opacity: 0.6,
    },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 20,
            backgroundColor: secondary,
        },
        headerText: {
            fontFamily: 'Updock-Regular',
            fontSize: 30,
            color: '#fff',
            textAlign: 'center',
        },
        label: {
            fontSize: 16,
            fontWeight: 'bold',
            marginBottom: 5,
            color: brand,
        },
        inputContainer: {
            marginTop: 10,
            marginBottom: 15,
            paddingHorizontal: 10,
            borderWidth: 1, // إضافة الحدود
            borderColor: "fff", // لون الحدود
            borderRadius: 5, // تقويس الحواف
        },
        input: {
            height: 40,
            fontSize: 16,
            color: "#000",
            paddingHorizontal: 10,
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
        styledButton: {
  backgroundColor: fifthColor,  // لون خلفية الزر
  paddingVertical: 12,  // زيادة الحشو ليصبح الزر أكبر
  paddingHorizontal: 20,
  borderRadius: 8,  // زوايا دائرية للزر
  alignItems: 'center',  // محاذاة النص في الوسط
  justifyContent: 'center',  // محاذاة النص في الوسط
  marginTop: 20,  // مسافة فوق الزر
},

buttonText: {
  color: '#fff',  // لون النص الأبيض
  fontSize: 18,  // حجم النص
  fontWeight: 'bold',  // جعل النص عريضًا
},

modalContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',  // خلفية مظلمة خفيفة
},

modalContent: {
  width: '80%',  // جعل المودال أصغر في العرض
  backgroundColor: '#fff',  // خلفية بيضاء
  padding: 20,
  borderRadius: 10,  // زوايا دائرية للمودال
  alignItems: 'center',
},

input: {
  width: '100%',
},

inputField: {
  height: 45,
  fontSize: 16,
  color: '#333',
  paddingHorizontal: 10,
  marginBottom: 20,
  borderWidth: 1,  // إضافة حدود حول الحقول
  borderColor: '#ccc',  // لون الحدود
  borderRadius: 5,  // زوايا دائرية
},

closeButton: {
  marginTop: 10,
  backgroundColor: careysPink,  // لون زر الإغلاق
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 8,
},

closeButtonText: {
  color: '#fff',  // لون النص الأبيض
  fontSize: 16,
  fontWeight: 'bold',
},
    card: {
        width: '48%', // يجعل الكروت بحجم أصغر وتكون بجانب بعضها
        marginBottom: 15, // المسافة بين الكروت
        shadowColor: '#7C7692', // اللون البنفسجي للظل
        shadowOffset: { width: 0, height: 4 }, // اتجاه الظل
        shadowOpacity: 0.5, // شدة الظل
        shadowRadius: 6, // طول الظل
        elevation: 5, // لتحسين الظل في Android
        borderRadius: 10, // حواف مستديرة
        padding: 10,
        backgroundColor: '#fff', // خلفية الكارد
        justifyContent: 'center', // توسيط المحتوى عموديًا
        alignItems: 'center', // توسيط المحتوى أفقيًا
      },
      cardContent: {
        alignItems: 'center', // توسيط النص داخل الكارد
        justifyContent: 'center',
        textAlign: 'center', // لضمان أن النص يكون في المنتصف بشكل صحيح
      },
      projectTitle: {
        color: tertiary, // استخدام اللون المخصص للعناوين
        fontWeight: 'bold',
        fontSize: 18, // حجم الخط المناسب للعنوان
        textAlign: 'center', // تأكيد توسيط النص داخل الكارد
        marginBottom: 10,
      },
    container: {
        padding: 10,
        backgroundColor: '#FFF',
      },
    fieldItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    fieldText: {
        fontSize: 18,
    },
      projectsContainer: {
      padding: 10,
      alignItems: 'center',
        },
        projectCard: {
            backgroundColor: '#fff',
            borderRadius: 10,
            padding: 15,
            marginVertical: 10,
            width: '90%',
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 10,
            elevation: 3,
        },
        projectDescription: {
            fontSize: 14,
            color: '#666',
            marginBottom: 10,
        },
        projectField: {
            fontSize: 14,
            marginBottom: 5,
        },
        projectStatus: {
            fontSize: 14,
            fontWeight: 'bold',
            color: 'green',
            marginTop: 10,
        },
        container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  backButton: {
    marginRight: 10,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  searchIcon: {
    marginRight: 10,
  },
  inputSearch: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  scrollableItemsContainer: {
    flex: 1
  },  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    width: '90%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5, borderWidth: 1,
    borderColor: Colors.fourhColor,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  closeButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: fifthColor,
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
  },
  smallButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  closeButton: {
    backgroundColor: fourhColor,
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },

});
export default AddProjectsPage;
