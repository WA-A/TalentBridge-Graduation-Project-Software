import React, { useEffect,useState, useContext } from 'react';
import { View, Text, Image,Pressable, TouchableOpacity,TextInput, StyleSheet,Switch, FlatList,ScrollView, Animated, Button, Alert, Platform } from 'react-native';
import { Ionicons, Feather, FontAwesome5, EvilIcons, FontAwesome,MaterialIcons,MaterialCommunityIcons,Entypo

} from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Dimensions } from 'react-native';
import { useFonts } from 'expo-font';
import { NightModeContext } from './NightModeContext';
import './../compnent/webCardStyle.css'
import * as ImagePicker from 'expo-image-picker';
import { Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import io from 'socket.io-client';
import Modal from 'react-native-modal';
import ImageViewer from 'react-native-image-zoom-viewer';

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
} from '../compnent/Style'
import { use } from 'react';
import { color } from 'react-native-elements/dist/helpers';
import { colors } from 'react-native-elements';
import MultiSelect from 'react-native-multiple-select';
import { GetUserSkills } from '../GraduationProject1-BackEnd/ExternalApiSkills/ExternealApiSkills.controller';

// Color constants
const { secondary, primary, careysPink, darkLight, fourhColor, tertiary, fifthColor,firstColor } = Colors;
const { width, height } = Dimensions.get('window');


export default function ProfilePage ({ navigation}) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisibleEditting, setModalEdittingVisible] = useState(false);
  const [currentModalEditting, setCurrentModalEditting] = useState('');

  const openModalEditting = (item, type) => {
    setSelectedItem({ ...item, type }); // تخزين بيانات البطاقة والنوع
    setModalEdittingVisible(true); // إظهار المودال
    setCurrentModalEditting(type); // تحديد نوع المودال (experience في هذه الحالة)
  };
  
  const closeModalEditting = () => {
    setModalEdittingVisible(false);
  };
      const [isMenuVisible, setMenuVisible] = useState(false); // For the menu visibility

      const handlePressOutside = () => {
        if (isMenuVisible) {
            setMenuVisible(false); // Close the menu when touched outside
        }
    };


    const handleLogout = async () => {
      setMenuVisible(false); // إغلاق القائمة بعد الضغط على "تسجيل الخروج"
    
      if (Platform.OS === 'web') {
        // إذا كان على الويب، يتم تنفيذ تسجيل الخروج مباشرة
        try {
            await AsyncStorage.removeItem('userToken');
            console.log('User logged out successfully');
            // العودة إلى شاشة تسجيل الدخول بعد الخروج
            navigation.navigate('WelcomeScreen');
        } catch (error) {
          console.error('Error during logout:', error);
        }
      } else {
        // عرض رسالة التأكيد على الجوال
        Alert.alert('Logout', 'Are you sure you want to log out?', [
          { text: 'Cancel', style: 'cancel' }, // إذا تم الضغط على "إلغاء"
          { 
            text: 'Logout', 
            onPress: async () => {
              try {
                // مسح التوكن من AsyncStorage
                await AsyncStorage.removeItem('userToken');
                console.log('User logged out successfully');
                // العودة إلى شاشة تسجيل الدخول بعد الخروج
                navigation.navigate('WelcomeScreen');
              } catch (error) {
                console.error('Error during logout:', error);
              }
            },
          },
        ]);
      }
    };
    


  
    const nav = useNavigation();
    const { isNightMode, toggleNightMode } = useContext(NightModeContext);
    const [scrollY] = useState(new Animated.Value(0));
    const [uploadType, setUploadType] = useState('link'); // "link" أو "image"
    const [image, setImage] = useState(null); // لتخزين الصورة
    const [showPosts, setShowPosts] = useState(false);
    const [newExperiance,setNewExperiance] = useState(
    {
      name: '',
      jobTitle: '',
      startDate: '',
      endDate: '',
      isContinuing: false,
      Description: '',
    }
    );
    const [newEducation, setNewEducation] = useState({
      universityName: '',
      degree: '',
      fieldOfStudy: '',
    });

    const [newCertification,setNewCertificaion]=useState({
      title:'',
      issuingOrganization: '',
      issueDate: '',
      expirationDate: '',
      credentialType:'',
      certificationImageData:'',
      certificationLinkData:'',
    });
    const [languages, setLanguages] = useState([]); // قائمة اللغات من API
  const [userLanguages, setUserLanguages] = useState([]); // قائمة لغات المستخدم

    
    
    const handleChangeExperience = (field, value) => {
      setNewExperiance(prevState => ({
        ...prevState,
        [field]: value,
      }));
    };
    
     
    const handleChangeEducation = (field, value) => {
      setNewEducation(prevState => ({
        ...prevState,
        [field]: value,
      }));
    };

    const [isImageType, setIsImageType] = useState(true);

    // دالة لتبديل العرض بين الصورة والرابط
    const toggleDisplayType = () => {
      setIsImageType(!isImageType);
    };


    const [userSkills, setUserSkills] = useState([]);  
    const [userRateSkills, setUserRateSkills] = useState([]);
    const [skillsList, setSkillsList] = useState([]); // قائمة المهارات
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [RateselectedSkills, setRateSelectedSkills] = useState([]);
    const [Skills, setSkills] = useState([]);


    // وظيفة لإضافة المهارة للقائمة
    // const addSkill = () => {
    //     if (skill.trim()) {
    //         setSkillsList([...skillsList, skill]); // إضافة المهارة
    //         setSkill(''); // مسح حقل الإدخال
    //     }
    // };



    const [githubLink, setGithubLink] = useState(''); // لحفظ الرابط الذي يُدخله المستخدم  
    const [isEditing, setIsEditing] = useState(false); // حالة للتحكم في إظهار/إخفاء الإدخال


    const [showAllCertification, setShowAllCertification] = useState(false); // المتغير الذي يحدد ما إذا كان يجب عرض جميع الشهادات

    // دالة لعرض جميع الشهادات
    const handleShowAllCertification = () => {
      setShowAllCertification(true);
    };
  
    // دالة لإخفاء الشهادات
    const handleHideCertification = () => {
      setShowAllCertification(false);
    };
  
    const handleShowAllLanguage =()=>{
      setShowAllLanguage(true);
    }
    const handleHideLanguage = ()=>{
      setShowAllLanguage(false);

    }

    
    // Load custom fonts
    const bottomBarTranslate = scrollY.interpolate({
        inputRange: [0, 50],
        outputRange: [0, 100], // 100 to move it off-screen
        extrapolate: 'clamp',
    });


const [friendsCount,setFriendsCount]= useState('');
const [userProgress,setUserProgress]=useState('');
const [achievements,setAchievements]=useState('');
    const [UniversityName, setUniversityName] = useState('Najah');
  const [Degree, setDegree] = useState('BS');
  const [FieldOfStudy, setFieldOfStudy] = useState('CE');

  const [profileData, setProfileData] = useState(null); // حالة لتخزين بيانات البروفايل
  const [bio, setBio] = useState(''); // لتخزين التعديل على Bio
  const [about, setAbout] = useState(''); // لتخزين التعديل على About
  const [profileImage,setProfileimage]=useState('');
  const [CoverImage,setCoverimage]=useState('');
  const [location,setLocation]= useState('');
  const [FullName,setFullName]=useState('');
  const [userName,seUserName]= useState('');
  const [role,setRole]= useState('');
  const [creativeDegree,setCreativeDegree]= useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [ownpost,setOwnpost]= useState(null);
  
  const socket = io('http://192.168.1.239:3000'); // السيرفر المحلي

  //forEditAndCreat
  const [newFullName,setNewFullName]=useState('');
  const [newuserName,setNewUserName]= useState('');
  const [newprofileImage,setnewProfileImage] = useState(null);
  const [newcoverImage, setnewCoverImage] = useState(null);
  const [newbio, setnewBio] = useState('');
  const [newlocation, setnewLocation] = useState('');
  const [newabout, setnewAbout] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false); // متغير لحالة المودال
  const [cancelled,setIsCancled]=useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [activeTab, setActiveTab] = useState('Posts');

  const [modalVisible, setModalVisible] = useState(false);
  const [currentModal, setCurrentModal] = useState('');

  // دالة لمعالجة التحديد
  const onSelectedItemsChange = (selectedItems) => {
    setSelectedLanguages(selectedItems); // تحديث حالة اللغات المحددة
    
  };


  const onSelectedItemsChangeSkills = (selectedItemsSkills) => {
    setSelectedSkills(selectedItemsSkills);
  };

  

  
  const [experiences, setExperiences] = useState([]);

 const [Education, setEducation] = useState([]);
 const [isModalVisibleviewImage, setIsModalVisibleViewImage] = useState(false);
 const [currentImage, setCurrentImage] = useState(null);
 
 // دالة لفتح نافذة عرض الصورة
 const openImageViewer = (imageUri) => {
   console.log('Open Image Viewer:', imageUri);
   
   // تعيين الصورة المعروضة
   setCurrentImage([{ url: imageUri }]);
   setIsModalVisibleViewImage(true);  // فتح النافذة
 };
 
 // إغلاق نافذة عرض الصورة
 const closeImageViewer = () => {
   setIsModalVisibleViewImage(false);
 };
  const [certification, setCertification] = useState([ ]);

  const [project, setProject] = useState([]);

  const [recommendation, setRecommendation] = useState([ ]);


  const sortedExperiences = [...experiences].sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

  const [selectedLanguages, setSelectedLanguages] = useState([]);
const [error,setError]=useState('');

  const [showAllExperiences, setShowAllExperiences] = useState(false);
  const [showAllEducation, setShowAllEducation] = useState(false);
  const [showAlllLanguage,setShowAllLanguage]=useState(false);
  const [showAllSkills,setShowAllSkills]=useState(false);


  const handleShowAllExperiences = () => {
    setShowAllExperiences(true);
  };
  const handleHideExperiences = () => {
    setShowAllExperiences(false);
  };

  const handleShowAllEducation = () => {
    setShowAllEducation(true);
  };
  const handleHideEducation = () => {
    setShowAllEducation(false);
  };
   
  const handleShowAllSkills = () => {
    setShowAllSkills(true);
  };

  const handleHideSkills = () => {
    setShowAllSkills(false);
  };


  // دالة لفتح الـ Modal بناءً على البطاقة
  const openModal = (modalName) => {
    setCurrentModal(modalName);
    setModalVisible(true);
    setError('');
    setSelectedLanguages([]);
    setSelectedSkills([]);
  };

  // إغلاق الـ Modal
  const closeModal = () => {
    setModalVisible(false);
    setCurrentModal('');
  };


  const handleSave = async () => {
    
    if (currentModal === 'experience') {
      // إذا كان النوع "experience" (التجربة)
      await addExperience();
    } 
    if (currentModal === 'education') {
      // إذا كان النوع "experience" (التجربة)
      await addEducation();
    }
    if (currentModal === 'certification') {
      await addCertification ();

    }
    if(currentModal === 'language'){
      await handleAddLanguages();
      
    }
    if(currentModal === 'skills'){
      await handleAddSkills();
      
    }
  };
 
 
  
  const handleEditForEachCard = async () => {
    const { type,...updatedItem } = selectedItem;  // استخراج الـ type والتواريخ
    delete updatedItem.type;
    if (currentModalEditting === 'experience') {
      // إذا كان القسم "الخبرة"
      await updateExperience(updatedItem);
    } 
    if (currentModalEditting === 'education') {
      // إذا كان القسم "التعليم"
      await updateEducation(updatedItem);
    } 
    if (currentModalEditting === 'certification') {
      // إذا كان القسم "التعليم"
      await updateCertification(updatedItem);
    } 
    if (currentModalEditting === 'project') {
      // إذا كان القسم "المشاريع"
      await addProject();
    } 
    // if (currentModalEditting === 'skills') {
    //   // إذا كان القسم "المهارات"
    //   await addSkill();
    // } 
  };
  

  const selectNewImage = async () => {
      try {
        // طلب إذن الوصول إلى مكتبة الصور
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
          Alert.alert('Permission required', 'You need to grant permission to access the gallery.');
          return;
        }
    
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [8, 5],
          quality: 1,
        });
    
        console.log(result);
    
        // إذا تم اختيار صورة
        if (!result.canceled) {
          const selectedImage = result.assets[0];
          setImage(selectedImage.uri);
          setSelectedItem((prev) => ({
            ...prev,credentialType: 'image',
            certificationImageData: selectedImage.uri,
          }));  
             } 
      } catch (error) {
        console.log('Error picking image: ', error);
      }
    };
    
  
  const cancleEdit = ()=>{
    setnewProfileImage(profileImage);
    setnewCoverImage(CoverImage);
    setnewAbout(about);
    setnewBio(bio);
    setnewLocation(location);
    setNewFullName(FullName);
    setNewUserName(userName);
    setIsCancled(true);
    setIsModalVisible(false)  
  };

  const pickImage = async (type) => {
    try {
      // طلب إذن الوصول إلى مكتبة الصور
      let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert('Permission required', 'You need to grant permission to access the gallery.');
        return;
      }
      let result ;
      // إطلاق نافذة لاختيار الصورة
      if (type === 'profile') {

       result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 5],
        quality: 1,
      });
    }
    if (type === 'cover') {

     result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [9, 7],
        quality: 1,
      });
    }
      console.log(result);
      // إذا تم اختيار صورة
      if (!result.canceled) {
        if (type === 'profile') {
         setnewProfileImage(result.assets[0].uri); // تعيين صورة البروفايل
        } 
        else {
          setnewCoverImage(result.assets[0].uri); // تعيين صورة الغلاف
        }
      } 
    } catch (error) {
      console.log('Error picking image: ', error);
    }
  };


  const pickImageCertification = async () => {
    try {
      // طلب إذن الوصول إلى مكتبة الصور
      let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert('Permission required', 'You need to grant permission to access the gallery.');
        return;
      }
      let result ;
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [8, 5],
        quality: 1,
      });
      console.log(result);
      // إذا تم اختيار صورة
      if (!result.canceled) {
        const selectedImage = result.assets[0];
        setImage(selectedImage.uri);
        setNewCertificaion((prev) => ({
          ...prev,credentialType: 'image',
          certificationImageData: selectedImage.uri,
        }));  
           } 
      
    } catch (error) {
      console.log('Error picking image: ', error);
    }
   
  };
// عند التبديل بين الصورة والرابط
const toggleCredentialType = () => {
  setSelectedItem((prev) => ({
    ...prev,
    credentialType: prev.credentialType === 'image' ? 'link' : 'image',
    certificationImageData: prev.credentialType === 'image' ? null : prev.certificationImageData,
    certificationLinkData: prev.credentialType === 'link' ? null : prev.certificationLinkData,
  }));
};

const base64ToBlob = (base64Data, contentType = 'image/jpeg') => {
  const byteCharacters = atob(base64Data.split(',')[1]);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
};

  

/////////////////////////////////delete////////////////////////////
  // حالة لتحديد القسم عند فتح المودال
const [currentSectionToDelete, setCurrentSectionToDelete] = useState(null); // إما "experience" أو "education"
const [selectedItemToDelete, setSelectedItemToDelete] = useState(null); // لتخزين العنصر المحدد
const [confirmDeleteModalVisible, setConfirmDeleteModalVisible] = useState(false); // حالة لظهور المودال

// دالة لفتح المودال بناءً على القسم المختار
const openConfirmDeleteModal = (section, item) => {
    setCurrentSectionToDelete(section); // تحديد القسم
    setSelectedItemToDelete(item); // تحديد العنصر
    setConfirmDeleteModalVisible(true); // إظهار المودال
};

// دالة لإغلاق المودال
const closeConfirmDeleteModal = () => {
    setConfirmDeleteModalVisible(false);
    setSelectedItemToDelete(null);
    setCurrentSectionToDelete(null);
};

//////////////////////////////////////////////////////////////////


// دالة فتح وإغلاق المودال
const toggleModal = () => {
  setIsModalVisible(!isModalVisible);
};

  const baseUrl = Platform.OS === 'web' 
? 'http://localhost:3000' 
: 'http://192.168.1.239:3000'; // عنوان IP الشبكة المحلية للجوال





 //////////////////////////////SEARCH //////////////////////////////////

 const [searchQuery, setSearchQuery] = useState('');
   

 /////////////////////////////////////////////////////////////////



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
     setProfileData(data); 
     setFullName(data.FullName);
     seUserName(data.UserName);
     setAbout(data.About);
     setBio(data.Bio);
     setLocation(data.Location);
     setProfileimage(data.PictureProfile?.secure_url || '');
     setCoverimage(data.CoverImage?.secure_url || '');
     setnewProfileImage(profileImage);
     setnewCoverImage(CoverImage);
     setnewAbout(about);
     setnewBio(bio);
     setnewLocation(location);
     setNewFullName(FullName);
     setNewUserName(userName);
     setSearchQuery(data.FullName);
     socket.emit('profileUpdated', data.user); // إرسال التحديث للسيرفر

     
     } catch (error) {
       console.error('Error fetching ProfileData:', error);
   }
   finally {
     setIsLoading(false);
   }
  };
const addCertification = async () =>{
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      console.error('Token not found');
      return;
    }
    // إعداد البيانات باستخدام FormData
    const formData = new FormData();
  
    // إضافة الحقول النصية
    formData.append('title', newCertification.title);
    formData.append('issuingOrganization', newCertification.issuingOrganization);
    formData.append('issueDate', newCertification.issueDate);
    formData.append('expirationDate', newCertification.expirationDate);
    formData.append('credentialType',newCertification.credentialType);
    formData.append('certificationLinkData',newCertification.certificationLinkData);
    // إضافة صورة البروفايل إذا كانت موجودة
    if (newCertification.certificationImageData) {
      if (Platform.OS === 'web') {
        // استخدام Blob للويب
        const profileBlob = base64ToBlob(newCertification.certificationImageData, 'image/jpeg');
        formData.append('CertificationImage', profileBlob, 'CertificationImage.jpg');
      } else {
        console.log("ss",newCertification.certificationImageData);

        // استخدام uri للموبايل
        formData.append('CertificationImage', {
          uri: newCertification.certificationImageData,
          type: 'image/jpeg',
          name: 'CertificationImage.jpg',
        }
      );
      }
    }

    console.log('Sending certification data:', formData);

    const response = await fetch(`${baseUrl}/user/addCertification`, {
      method: 'POST',
      headers: {
        'Authorization': `Wasan__${token}`,
      },
      body: formData, // إرسال البيانات كـ FormData
    });
   //setCurrentModal(false);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Something went wrong');
    }
  }
  catch (error) {
    console.error('Error fetching addCertification:', error);
} 
};

const handleUpdateProfile = async (values) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      console.error('Token not found');
      return;
    }

    const formData = new FormData();

    // النصوص
    formData.append('Bio', newbio);
    formData.append('Location', newlocation);
    formData.append('About', newabout);
    formData.append('UserName', newuserName);
      console.log("saaaaaaaamaaaaaaaaaaaaaaaa");
    // صورة البروفايل
    if (newprofileImage !==profileImage) {
      if (Platform.OS === 'web') {
        const profileBlob = base64ToBlob(newprofileImage, 'image/jpeg');
        formData.append('PictureProfile', profileBlob, 'profile.jpg');
        console.log("saaaaaaaamaaaaaaaaaaaaaaaa",newprofileImage);
      } else {
        formData.append('PictureProfile', {
          uri: newprofileImage,
          type: 'image/jpeg',
          name: 'profile.jpg',
        });
      }
    }else{
      formData.append('PictureProfile', {
        uri: profileImage,
        type: 'image/jpeg',
        name: 'profile.jpg',
      });      }

    // صورة الغلاف
    if (newcoverImage !==CoverImage) {
      console.log("diffrent Covver",newcoverImage);
      console.log("diffrent Covver",CoverImage);

      if (Platform.OS === 'web') {
        console.log("sama",newcoverImage);
        const coverBlob = base64ToBlob(newcoverImage, 'image/jpeg');
        formData.append('CoverImage', coverBlob, 'cover.jpg');
      } else {
        formData.append('CoverImage', {
          uri: newcoverImage,
          type: 'image/jpeg',
          name: 'cover.jpg',
        });
      }
    }else{
      
      formData.append('CoverImage', {
        uri: CoverImage,
        type: 'image/jpeg',
        name: 'cover.jpg',
      });    }

    console.log('Sending updated profile data:', formData);

    const response = await fetch(`${baseUrl}/user/updateprofile`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Wasan__${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Something went wrong');
    }

    const data = await response.json();

    setAbout(data.user.About);
    seUserName(data.user.UserName);
    setBio(data.user.Bio);
    setLocation(data.user.Location);
    setProfileimage(data.user.PictureProfile?.secure_url || '');
    setCoverimage(data.user.CoverImage?.secure_url || '');

    console.log('User profile updated successfully:', data);
    Alert.alert('Profile updated successfully.');
    socket.emit('profileUpdated', data.user);
  } catch (error) {
    console.error('Error updating profile:', error.message);

  }
};


  const handleCreateProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.error('Token not found');
        return;
      }
  
      // إعداد البيانات باستخدام FormData
      const formData = new FormData();

      formData.append('About', newabout);
      formData.append('Bio', newbio);
      formData.append('UserName', newuserName);
     // إضافة صورة البروفايل إذا كانت موجودة
     if (newprofileImage) {
      if (Platform.OS === 'web') {
        // استخدام Blob للويب
        const profileBlob = base64ToBlob(newprofileImage, 'image/jpeg');
        formData.append('PictureProfile', profileBlob, 'profile.jpg');
      } else {
        // استخدام uri للموبايل
        formData.append('PictureProfile', {
          uri: newprofileImage,
          type: 'image/jpeg',
          name: 'profile.jpg',
        });
      }
    }

    // إضافة صورة الغلاف
    if (newcoverImage) {
      if (Platform.OS === 'web') {
        // استخدام Blob للويب
        const coverBlob = base64ToBlob(newcoverImage, 'image/jpeg');
        formData.append('CoverImage', coverBlob, 'cover.jpg');
      } else {
        // استخدام uri للموبايل
        formData.append('CoverImage', {
          uri: newcoverImage,
          type: 'image/jpeg',
          name: 'cover.jpg',
        });
      }
    }
      // إرسال الطلب إلى الـ Backend
      const response = await fetch(`${baseUrl}/user/createprofile`, {
        method: 'POST',
        headers: {
          'Authorization': `Wasan__${token}`,
        },
        body: formData, // إرسال البيانات كـ FormData
      });
  
  
      // التحقق من نجاح الاستجابة
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
      }
  
      // جلب البيانات المسترجعة من السيرفر
      const data = await response.json();  
      // تحديث الحالة أو التنقل إلى صفحة أخرى بعد نجاح العملية
      setAbout(data.user.About);
      seUserName(data.user.UserName);
      setBio(data.user.Bio);
      setLocation(data.user.Location);
      setProfileimage(data.user.PictureProfile?.secure_url || '');
      setCoverimage(data.user.CoverImage?.secure_url || '');
      Alert.alert('Profile Created successfully.');

          // إرسال التحديث عبر socket بعد نجاح التحديث
          socket.emit('profileUpdated', data.user); 

    } catch (error) {
      console.error('Error creating profile:', error.message);
    }
  };

  
  
   ////////////////////////////Call Creat and Update ////////////////////////////////////
   const handleProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.error('Token not found');
        return;
      }
  
      // جلب بيانات المستخدم الحالية من السيرفر
      const response = await fetch(`${baseUrl}/user/ViewOwnProfile`, {
        method: 'GET',
        headers: {
          'Authorization': `Wasan__${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }
  
      const userData = await response.json();
  
      // التحقق مما إذا كانت هناك بيانات موجودة
      const hasProfileData = userData.About || userData.Bio || userData.PictureProfile || userData.CoverImage || userData.UserName;
  
      if (hasProfileData) {
        // إذا كانت هناك بيانات، استدعِ دالة التحديث
        await handleUpdateProfile();
      } else {
        // إذا لم تكن هناك بيانات، استدعِ دالة الإنشاء
        await handleCreateProfile();
      }
  
    } catch (error) {
      console.error('Error handling profile:', error.message);
    }
  };
  


  //////////////////////////////////////////GetAllExperiance//////////////////////////////////
const getAllExperiance = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      console.error('Token not found');
      return;
    }

    // جلب بيانات المستخدم الحالية من السيرفر
    const response = await fetch(`${baseUrl}/user/getAllExperiences`, {
      method: 'GET',
      headers: {
        'Authorization': `Wasan__${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user Experiences');
    }

    const userData = await response.json();
    setExperiences(userData.experiences);


  } catch (error) {
    console.error('Error handling experiamce:', error.message);
  }

};

const getAllCertifications = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      console.error('Token not found');
      return;
    }

    // جلب بيانات المستخدم الحالية من السيرفر
    const response = await fetch(`${baseUrl}/user/getAllCertifications `, {
      method: 'GET',
      headers: {
        'Authorization': `Wasan__${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user Experiences');
    }

    const userData = await response.json();
    setCertification(userData.certifications);
    console.log(certification);

  } catch (error) {
    console.error('Error handling experiamce:', error.message);
  }

};


const updateExperience = async (updatedItem) => {

  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      console.error('Token not found');
      return;
    }
    // جلب بيانات المستخدم الحالية من السيرفر
    const response = await fetch(`${baseUrl}/user/updateExperience/${updatedItem._id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Wasan__${token}`,
        'Content-Type': 'application/json', // تحديد نوع البيانات المرسلة
      },
      body: JSON.stringify(updatedItem), // تحويل البيانات إلى JSON

    });

    if (!response.ok) {
      throw new Error('Failed to fetch user Experiences');
    }

    if (response.ok) {
      console.log('Experience updated successfully');
      setModalEdittingVisible(false); // إغلاق المودال بعد التحديث
    } else {
      console.error('Failed to update experience');
    }
    
    const userData = await response.json();
    setExperiences(userData.experiences);
   socket.emit('profileUpdated', userData.experiences); 
  getAllExperiance();
  } catch (error) {
    console.error('Error updating experience:', error);
  }
};

const updateCertification = async (updatedItem) => {
  console.log(updatedItem._id);
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      console.error('Token not found');
      return;
    }

    // إعداد البيانات باستخدام FormData
    const formData = new FormData();

    // إضافة الحقول النصية
    formData.append('title', updatedItem.title);
    formData.append('issuingOrganization', updatedItem.issuingOrganization);
    formData.append('issueDate', updatedItem.issueDate);
    formData.append('expirationDate', updatedItem.expirationDate);
    formData.append('credentialType', updatedItem.credentialType);
    formData.append('certificationLinkData', updatedItem.certificationLinkData);

  // إضافة صورة البروفايل إذا كانت موجودة
  if (selectedItem.certificationImageData) {
    if (Platform.OS === 'web') {
      // استخدام Blob للويب
      const profileBlob = base64ToBlob(selectedItem.certificationImageData, 'image/jpeg');
      formData.append('CertificationImage', profileBlob, 'CertificationImage.jpg');
    } else {
      console.log("ss",selectedItem.certificationImageData);

      // استخدام uri للموبايل
      formData.append('CertificationImage', {
        uri: selectedItem.certificationImageData,
        type: 'image/jpeg',
        name: 'CertificationImage.jpg',
      }
    );
    }
  }
  console.log("ss",formData.certificationImageData);


    console.log("theform", formData);

    // إرسال الطلب باستخدام fetch
    const response = await fetch(`${baseUrl}/user/updateCertification/${updatedItem._id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Wasan__${token}`,
      },
      body: formData, // إرسال formData مباشرة
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user Certification');
    }

    if (response.ok) {
      console.log('Certification updated successfully');
      setModalEdittingVisible(false); // إغلاق المودال بعد التحديث
    } else {
      console.error('Failed to update Certification');
    }

    const userData = await response.json();
    setCertification(userData.certifications);
    socket.emit('profileUpdated', userData.certifications);
    getAllCertifications();

  } catch (error) {
    console.error('Error updating certifications:', error);
  }
};


const updateEducation = async (updatedItem) => {

  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      console.error('Token not found');
      return;
    }
    // جلب بيانات المستخدم الحالية من السيرفر
    const response = await fetch(`${baseUrl}/user/updateEducation/${updatedItem._id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Wasan__${token}`,
        'Content-Type': 'application/json', // تحديد نوع البيانات المرسلة
      },
      body: JSON.stringify(updatedItem), // تحويل البيانات إلى JSON

    });

    if (!response.ok) {
      throw new Error('Failed to fetch user Education');
    }

    if (response.ok) {
      console.log('Education updated successfully');
      setModalEdittingVisible(false); // إغلاق المودال بعد التحديث
    } else {
      console.error('Failed to update education');
    }
    
    const userData = await response.json();
    setEducation(userData.education);
   socket.emit('profileUpdated', userData.education); 
  getAllEducation();
  } catch (error) {
    console.error('Error updating experience:', error);
  }
};


const getAllEducation = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      console.error('Token not found');
      return;
    }

    // جلب بيانات المستخدم الحالية من السيرفر
    const response = await fetch(`${baseUrl}/user/getAllEducation`, {
      method: 'GET',
      headers: {
        'Authorization': `Wasan__${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user Education');
    }

    const userData = await response.json();
    setEducation(userData.education);

  } catch (error) {
    console.error('Error handling education:', error.message);
  }

};



const addExperience = async () => {
  console.log(newExperiance);
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      console.error('Token not found');
      return;
    }

    // إرسال بيانات التجربة الجديدة إلى السيرفر
    const response = await fetch(`${baseUrl}/user/addExperience`, {
      method: 'POST',
      headers: {
        'Authorization': `Wasan__${token}`,
        'Content-Type': 'application/json', // تحديد نوع البيانات المرسلة
      },
      body: JSON.stringify(newExperiance), // تحويل البيانات إلى JSON
    });

    if (!response.ok) {
      throw new Error('Failed to add experience');
    }

    // الحصول على بيانات الاستجابة
    const userData = await response.json();
    console.log('Experience added successfully:', userData);
    getAllExperiance();
  } catch (error) {
    console.error('Error adding experience:', error.message);
  }
};

const addEducation = async () => {
  console.log(newEducation);
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      console.error('Token not found');
      return;
    }

    // إرسال بيانات التجربة الجديدة إلى السيرفر
    const response = await fetch(`${baseUrl}/user/addEducation`, {
      method: 'POST',
      headers: {
        'Authorization': `Wasan__${token}`,
        'Content-Type': 'application/json', // تحديد نوع البيانات المرسلة
      },
      body: JSON.stringify(newEducation), // تحويل البيانات إلى JSON
    });

    if (!response.ok) {
      throw new Error('Failed to add Education');
    }
    const userData = await response.json();
    console.log('Education added successfully:', userData);
    getAllEducation();
  } catch (error) {
    console.error('Error adding  Education:', error.message);
  }
};




const handleDelete = async () => {
  console.log("sssssssssss");
  console.log("delete",selectedItemToDelete);
  if (!selectedItemToDelete) {
      console.error('No item selected for deletion');
      return;
  }

  const itemId = selectedItemToDelete._id;  // المعرف الخاص بالعنصر
  const section = currentSectionToDelete;   // القسم (الخبرة أو التعليم)

  try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
          console.error('Token not found');
          return;
      }
      // إرسال طلب الحذف إلى السيرفر بناءً على القسم المحدد
      const response = await fetch(`${baseUrl}/user/delete${section.charAt(0).toUpperCase() + section.slice(1)}/${itemId}`, {
          method: 'DELETE',
          headers: {
              'Authorization': `Wasan__${token}`,
              'Content-Type': 'application/json',
          },
      });

      if (!response.ok) {
          throw new Error('Failed to delete item');
      }

      const userData = await response.json();
      console.log(`${section} deleted successfully`, userData);

      setConfirmDeleteModalVisible(false);  // إغلاق المودال بعد الحذف

      // تحديث قائمة العناصر بعد الحذف
      if (section === 'experience') {
          setExperiences(userData.Experiences); // تحديث الخبرات فقط
      } else if (section === 'education') {
          setEducation(userData.Education); // تحديث التعليم فقط
      }
      else if (section === 'certification') {
        setCertification(userData.certification); // تحديث التعليم فقط
    }
    getAllEducation();
    getAllExperiance();
    getAllCertifications();
  } catch (error) {
      console.error('Error deleting item:', error);
  }
};

const handleDeleteAction = () => {
  console.log(currentSectionToDelete);
  if (currentSectionToDelete === 'language') { 
    // تحقق من كون اللغة هي "language"
    handleDeleteLanguages();  // استدعاء دالة حذف اللغة
    closeConfirmDeleteModal();
  } 
  else if (currentSectionToDelete === 'skills') { 
    handleDeleteSkills();  // استدعاء دالة حذف اللغة
    closeConfirmDeleteModal();
  } 
  else {
    // دالة الحذف الأخرى في حال لم يكن currentSectionToDelete هو "language" أو "skills"
    handleDelete();  // استدعاء دالة الحذف العامة
  }
};


////////////////////////////////////////////////////////////////////////////////////////////
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};
  
  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access the media library is required!');
    }
  };


  
  // دالة لتحميل اللغات المختارة من AsyncStorage (يمكنك الإبقاء عليها)
const loadSelectedLanguages = async () => {
  try {
    const savedLanguages = await AsyncStorage.getItem('selectedLanguages');
    if (savedLanguages) {
      setSelectedLanguages(JSON.parse(savedLanguages)); // تحميل اللغات المحفوظة
    }
  } catch (error) {
    console.error('Error loading selected languages from AsyncStorage:', error);
  }
};

// دالة لاسترجاع اللغات من الـ API (لعرضها فقط)
const handleGetLanguages = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken'); // استرجاع التوكن
    if (!token) {
      console.error('Token not found');
      return;
    }

    const response = await fetch(`${baseUrl}/externalapiLanguages/getlanguages`, {
      method: 'GET',
      headers: {
        'Authorization': `Wasan__${token}`, // تضمين التوكن في الهيدر
      },
    });

    if (!response.ok) {
      const errorData = await response.json(); // إذا كان هناك خطأ في الرد
      throw new Error(errorData.message || 'Failed to fetch languages');
    }

    const data = await response.json(); // تحويل الرد إلى JSON
    setLanguages(data.languages); // تخزين اللغات في الحالة لعرضها
    
    console.log('Fetched languages:', data.languages); // تحقق من البيانات
  } catch (error) {
    console.error('Error fetching languages:', error.message);
  }
};


// دالة لاسترجاع اللغات من الـ API (لعرضها فقط)
const handleGetLanguagesUser = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken'); // استرجاع التوكن
    if (!token) {
      console.error('Token not found');
      return;
    }

    const response = await fetch(`${baseUrl}/externalapiLanguages/GetLanguagesUser`, {
      method: 'GET',
      headers: {
        'Authorization': `Wasan__${token}`, // تضمين التوكن في الهيدر
      },
    });

    if (!response.ok) {
      const errorData = await response.json(); 
      throw new Error(errorData.message || 'Failed to fetch languages');
    } 

    const data =  await response.json(); 
    setUserLanguages(data.languages); 
    console.log('Fetched languages:', data.languages); 
  } catch (error) {
    console.error('Error fetching languages:', error.message);
  }
};

const handleDeleteLanguages = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken'); // استرجاع التوكن
    if (!token) {
      console.error('Token not found');
      return;
    }
    const languageId = selectedItemToDelete.id;
    console.log(languageId);
    const response = await fetch(`${baseUrl}/externalapiLanguages/deletelanguages`, { // تأكد من المسار الصحيح
      method: 'DELETE',  // طريقة الحذف يجب أن تكون DELETE
      headers: {
        'Authorization': `Wasan__${token}`, // تضمين التوكن في الهيدر
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        LanguageId: languageId,  // تمرير الـ LanguageId الذي نريد حذفه
      }),
    });

    if (!response.ok) {
      const errorData = await response.json(); // إذا كان هناك خطأ في الرد
      throw new Error(errorData.message || 'Failed to delete language');
    }
    const data = await response.json(); // تحويل الرد إلى JSON
    setUserLanguages(data.languages); // تخزين اللغات المحدثة في الحالة لعرضها بعد الحذف

    console.log('Updated languages:', data.languages); // تحقق من البيانات
  } catch (error) {
    console.error('Error deleting language:', error.message);
  }
};


const handleAddLanguages = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken'); // استرجاع التوكن
    if (!token) {
      console.error('Token not found');
      return;
    }

    console.log("Selected Languages: ", selectedLanguages);

    // إرسال الـ LanguageIds مباشرةً إذا كانت selectedLanguages تحتوي على الـ ids
    const LanguageIds = selectedLanguages;

    const response = await fetch(`${baseUrl}/externalapiLanguages/addlanguages`, {
      method: 'POST',
      headers: {
        'Authorization': `Wasan__${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ LanguageIds }), // إرسال الـ IDs مباشرةً
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add languages');
    }

    // استرجاع اللغات بعد إضافة اللغات
    handleGetLanguagesUser();
    closeModal();
    console.log('Languages added successfully:', LanguageIds);
  } catch (error) {
    setError(error.message);
   // console.error('Error adding languages:', error.message);
  }
};

// Function Skills
const loadSelectedSkills = async () => {
  try {
    const savedSkills = await AsyncStorage.getItem('selectedSkills');
    if (savedSkills) {
      setSelectedSkills(JSON.parse(savedSkills)); // تحميل اللغات المحفوظة
    }
  } catch (error) {
    console.error('Error loading selected skills from AsyncStorage:', error);
  }
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

const handleGetSkillsUser = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken'); // استرجاع التوكن
    if (!token) {
      console.error('Token not found');
      return;
    }

    const response = await fetch(`${baseUrl}/externalapiSkills/getuserskills`, {
      method: 'GET',
      headers: {
        'Authorization': `Wasan__${token}`, // تضمين التوكن في الهيدر
      },
    });

    if (!response.ok) {
      const errorData = await response.json(); 
      throw new Error(errorData.message || 'Failed to fetch skills');
    } 

    const data =  await response.json(); 
    setUserSkills(data.skills); 
    setUserRateSkills(data.skills.map((skill) => skill.rating || 1)); // تحديث التقييمات
    console.log('Fetched skills:', data.skills); 
  } catch (error) {
    console.error('Error fetching skills:', error.message);
  }
};

const handleDeleteSkills = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken'); // استرجاع التوكن
    if (!token) {
      console.error('Token not found');
      return;
    }
    const SkillId = selectedItemToDelete.id;
    console.log("sama",SkillId);
    const response = await fetch(`${baseUrl}/externalapiSkills/deleteskills`, { // تأكد من المسار الصحيح
      method: 'DELETE',  // طريقة الحذف يجب أن تكون DELETE
      headers: {
        'Authorization': `Wasan__${token}`, // تضمين التوكن في الهيدر
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
       SkillId: SkillId,  
      }),
    });

    if (!response.ok) {
      const errorData = await response.json(); // إذا كان هناك خطأ في الرد
      throw new Error(errorData.message || 'Failed to delete skills');
    }
    handleGetSkillsUser();
  } catch (error) {
    console.error('Error deleting skills:', error.message);
  }
};

const handleAddSkills = async () => {
  try {
    console.log("Selected Skills:", selectedSkills);

    // تحويل البيانات إلى الشكل المطلوب
    const SkillsWithRates = selectedSkills.map(skill => ({
      SkillId: skill.id, // استخدام id كـ SkillId
      Rate: skill.Rate, // استخدام Rate
    }));

    console.log("SkillsWithRates:", SkillsWithRates);

    const token = await AsyncStorage.getItem('userToken'); // استرجاع التوكن
    if (!token) {
      console.error('Token not found');
      return;
    }

    const response = await fetch(`${baseUrl}/externalapiSkills/addskills`, {
      method: 'POST',
      headers: {
        'Authorization': `Wasan__${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        SkillsWithRates, // إرسال المهارات مع التقييمات بالتنسيق المطلوب
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add skills');
    }

    // استرجاع المهارات بعد الإضافة
    handleGetSkillsUser();
    closeModal();
    console.log('Skills added successfully');
  } catch (error) {
    console.error("Error adding skills:", error.message);
    setError(error.message);
  }
};







useEffect(() => {
  loadSelectedLanguages();
  handleGetLanguages(); // استرجاع اللغات عند تحميل المكون
  loadSelectedSkills();
  handleGetSkills(); // استرجاع المهارات عند تحميل المكون
  handleViewProfile(); 
  requestPermission();
  getAllExperiance();
  getAllEducation();
  getAllCertifications();
  handleGetLanguagesUser();
  handleGetSkillsUser();
  socket.on('profileUpdated', (updatedUserData) => {
    console.log('Profile updated:', updatedUserData);
  
    // تحقق من أن البيانات ليست null أو undefined
    if (updatedUserData) {
      setFullName(updatedUserData.FullName || '');
      seUserName(updatedUserData.UserName || '');
      setAbout(updatedUserData.About || '');
      setBio(updatedUserData.Bio || '');
      setLocation(updatedUserData.Location || '');
      setProfileimage(updatedUserData.PictureProfile?.secure_url || '');
      setCoverimage(updatedUserData.CoverImage?.secure_url || '');
    } else {
      console.log('there is no update');
    }
  });
        return () => {
          // تنظيف الاستماع عند مغادرة الصفحة أو مكون آخر
          socket.off('profileUpdated');
        };
}, [FullName, bio, about, userName, location, CoverImage, profileImage]);

  if (isLoading) {
    return <Text>Loading...</Text>; 
  }

  if (!profileData) {
    return <Text>No profile data available</Text>; 
  }


  const handelGetUserPosts = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) throw new Error('No token found');
  
      const baseUrl = Platform.OS === 'web'
        ? 'http://localhost:3000'
        : 'http://192.168.1.239:3000';
  
      const response = await fetch(`${baseUrl}/post/getpost`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Wasan__${token}`,
        },
      });
  
      if (!response.ok) throw new Error('Failed to fetch posts');
  
      const result = await response.json();
      console.log('User posts:', result);
  
      if (result.posts && result.posts.length > 0) {
        setOwnpost(result.posts);
      } else {
        console.log('No posts found for this user');
        setOwnpost([]);  
      }
  
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching user posts:', error);
      setIsLoading(false);
    }
  };

  const getStatusColor = (isContinuing) => {
    return isContinuing ? 'green' : 'red'; // أخضر إذا كان مستمر وأحمر إذا كان منتهي
  };
  const ExperienceList = ({ experiences }) => {
    // دالة لتصفية الخبرات وعرض الخبرات من الثالثة فما فوق
    const filterExperiences = () => {
      return sortedExperiences.slice(2); // تصفية الخبرات بحيث تبدأ من الخبرة الثالثة
    };
    return (
      <ScrollView>
        {filterExperiences().map((exp, index) => (
          <View key={index} style={styles.experienceItem}>
          <View style={styles.experienceHeader}>
                    <Text style={[styles.experienceTitle,{color:isNightMode ?Colors.primary :Colors.black}]}>{exp.jobTitle}</Text>
                    <TouchableOpacity onPress={() =>  openModalEditting(exp, 'experience')} style={styles.editButton}>
              <MaterialIcons name="edit" size={20} color={isNightMode ? Colors.primary : Colors.black} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openConfirmDeleteModal('experience',exp)} style={styles.deleteButton}>
              <MaterialCommunityIcons name="minus-circle" size={20} color={isNightMode ? Colors.primary : Colors.black} />
            </TouchableOpacity>
          </View>
            <Text style={[styles.experienceDescription,{color:isNightMode? Colors.primary :Colors.black}]}>{exp.Description}</Text>
            <Text style={styles.experienceDate}>
            {exp.isContinuing 
              ?   `working at ${exp.name} since ${formatDate(exp.startDate)}` // إذا كان العمل مستمر فقط يظهر منذ وتاريخ البدء
              : ` ًWorked at ${exp.name} from  ${formatDate(exp.startDate)} to ${formatDate(exp.endDate)}`} 
          </Text>
                      {/* عرض حالة العمل (مستمر أو منتهي) */}
          <Text
            style={[
              styles.experienceStatus,
              { color: getStatusColor(exp.isContinuing) },
            ]}
          >
            {exp.isContinuing ? 'Ongoing' : 'Completed'}
          </Text>
                    <View style={styles.divider} />
                </View>

        ))}
      </ScrollView>
    );
  };
 

  const EducationList = ({ education }) => {
    // دالة لتصفية الخبرات وعرض الخبرات من الثالثة فما فوق
    const filterExperiences = () => {
      return Education.slice(2); // تصفية الخبرات بحيث تبدأ من الخبرة الثالثة
    };
    return (
      <ScrollView>
        {filterExperiences().map((exp, index) => (
          <View key={index} style={styles.experienceItem}>
                <View style={styles.experienceHeader}>
                    <Text style={[styles.experienceTitle,{color:isNightMode ?Colors.primary :Colors.black}]}>{exp.universityName}</Text>
                    <TouchableOpacity onPress={() =>  openModalEditting(exp, 'education')} style={styles.editButton}>
              <MaterialIcons name="edit" size={20} color={isNightMode ? Colors.primary : Colors.black} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openConfirmDeleteModal('education',exp)} style={styles.deleteButton}>
              <MaterialCommunityIcons name="minus-circle" size={20} color={isNightMode ? Colors.primary : Colors.black} />
            </TouchableOpacity>
          </View>
                    <Text style={[styles.experienceDescription,{color:isNightMode ?Colors.primary :Colors.black}]}>{exp.degree}</Text>
                    <Text style={styles.experienceDate}>{exp.fieldOfStudy}</Text>

                      {/* عرض حالة العمل (مستمر أو منتهي) */}
                    <View style={styles.divider} />
                </View>

        ))}
      </ScrollView>
    );
  };

  const LanguageList = ({ language }) => {
    // دالة لتصفية الخبرات وعرض الخبرات من الثالثة فما فوق
    const filterExperiences = () => {
      return userLanguages.slice(2); // تصفية الخبرات بحيث تبدأ من الخبرة الثالثة
    };
    return (
      <ScrollView>
        {filterExperiences().map((exp, index) => (
          <View key={index} style={[styles.experienceItem, { flexDirection: 'row' }]}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.experienceTitle, { color: isNightMode ? Colors.primary : Colors.black }]}>
          {exp.name}
        </Text>
            <TouchableOpacity onPress={() => openConfirmDeleteModal('language',exp)} style={styles.editButton}>
              <MaterialCommunityIcons name="minus-circle" size={20} color={isNightMode ? Colors.primary : Colors.black} />
            </TouchableOpacity>
      </View>
    </View>

        ))}
      </ScrollView>
    );
  };
     
  
  // Skills List
  const SkillsList = ({ skill }) => {
    // دالة لتصفية الخبرات وعرض الخبرات من الثالثة فما فوق
    const filterExperiences = () => {
      return userSkills.slice(2); // تصفية الخبرات بحيث تبدأ من الخبرة الثالثة
    };
  
    return (
      <ScrollView>
        {filterExperiences().map((cert, index) => {
          // نحصل على الفهرس الحقيقي من المصفوفة الأصلية
          const actualIndex = index + 2;
  
          return (
            <View key={actualIndex} style={[styles.experienceItem, { flexDirection: 'row' }]}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.experienceTitle, { color: isNightMode ? Colors.primary : Colors.black }]}>
                  {cert.name}
                </Text>
  
                <TouchableOpacity style={styles.editButton}>
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    {/* النجوم هنا */}
    {[1, 2, 3, 4, 5].map((starIndex) => (
      <TouchableOpacity
        key={starIndex}
        onPress={() => {
          // تحديث تقييم المهارة فقط
          const updatedSkills = [...userSkills];
          updatedSkills[index].rating = starIndex; // تحديث تقييم المهارة
          setUserSkills(updatedSkills);
        }}
      >
        <MaterialCommunityIcons
          name={starIndex <= cert.Rate ? 'star' : 'star-outline'} // ملء النجوم بناءً على cert.rating
          size={20}
          color={starIndex <= cert.Rate ? '#F7A8B8' : isNightMode ? Colors.primary : Colors.black}
        />
      </TouchableOpacity>
    ))}

    {/* مسافة بسيطة بين النجوم وزر الحذف */}
    <TouchableOpacity onPress={() => openConfirmDeleteModal('skills', cert)} style={{ marginLeft: 10 }}>
      <MaterialCommunityIcons name="minus-circle" size={20} color={isNightMode ? Colors.primary : Colors.black} />
    </TouchableOpacity>
  </View>
</TouchableOpacity>


            
              </View>
            </View>
          );
        })}
      </ScrollView>
    );
  };
  

  

  const CertificationList = ({certification}) => {
    // دالة لتصفية الخبرات وعرض الخبرات من الثالثة فما فوق
    const filterExperiences = () => {
      return certification.slice(2); // تصفية الخبرات بحيث تبدأ من الخبرة الثالثة
    };
    return (
      <ScrollView>
        {filterExperiences().map((cert, index) => (
          <View key={index} style={[styles.experienceItem, { flexDirection: 'row' }]}>
    
    {/* عرض الصورة */}
    {cert.credentialType === 'image' && cert.certificationImageData?.secure_url&& (
    <TouchableOpacity onPress={() => openImageViewer(cert.certificationImageData?.secure_url)}>
      <Image
        source={{ uri: cert.certificationImageData.secure_url
 }}
        style={styles.certImage}                 

      />
    </TouchableOpacity>
    )}

    {/* محتوى الشهادة */}
    <View style={{ flex: 1 }}>
      {/* العنوان */}
      <Text style={[styles.experienceTitle, { color: isNightMode ? Colors.primary : Colors.black }]}>
        {cert.title}
      </Text>
      <TouchableOpacity onPress={() =>  openModalEditting(cert, 'certification')}style={styles.editButton}>
            <MaterialIcons name="edit" size={20} color={isNightMode ? Colors.primary : Colors.black} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openConfirmDeleteModal('certification',cert)} style={styles.deleteButton}>
            <MaterialCommunityIcons name="minus-circle" size={20} color={isNightMode ? Colors.primary : Colors.black} />
          </TouchableOpacity>
      {/* الجهة المصدرة */}
      <Text style={[styles.experienceDescription, { color: isNightMode ? Colors.primary : Colors.black }]}>
        {cert.issuingOrganization}
      </Text>

      {/* تاريخ الإصدار والانتهاء */}
      <Text style={[styles.experienceDate, { color: isNightMode ? Colors.primary : Colors.gray }]}>
        Issued: {cert.issueDate} {cert.expirationDate ? ` - Expires: ${cert.expirationDate}` : ''}
      </Text>

      {/* المحتوى بناءً على النوع */}
      {cert.credentialType === 'link' && cert.certificationLinkData && (
        <TouchableOpacity onPress={() => Linking.openURL(cert.certificationLinkData)} style={styles.linkContainer}>
          <Text style={styles.linkText}>{cert.certificationLinkData}</Text>
        </TouchableOpacity>
      )}
    </View>
  </View>

        ))}
      </ScrollView>
    );
  };




    return (
        <View style={{ flex: 1 }}>
            <View style={{
                height: Platform.OS === 'web' ? 50 : 20, backgroundColor: isNightMode ? "#000" : secondary

            }}/>     
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
    <View style={{ flexDirection: 'row', alignItems: 'center',left: '10%',
 }}>
  <TouchableOpacity onPress={() => nav.navigate('HomeScreen')} style={{ marginRight: 100, marginLeft: 80}}>
        <Ionicons name="home" size={20} color= {isNightMode ? primary : "#000"} />
      </TouchableOpacity>
    

      <TouchableOpacity onPress={() => nav.navigate('ProjectsSeniorPage')} style={{ marginRight: 100 }}>
        <Ionicons name="folder" size={20} color= {isNightMode ? primary : "#000"} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => nav.navigate('AddPostScreen')} style={{ marginRight:100 }}>
        <Ionicons name="add-circle" size={25} color= {isNightMode ? primary : "#000"} />
      </TouchableOpacity>

      

      <TouchableOpacity onPress={() => nav.navigate('Chat')} style={{ marginRight:100}}>
        <EvilIcons name="sc-telegram" size={30} color= {isNightMode ? primary : "#000"} />
      </TouchableOpacity>

      <TouchableOpacity style={{marginRight: 100 }}
    onPress={() => nav.navigate('Notification')}>
            <Ionicons  name="notifications" size={20} color= {isNightMode ? primary : "#000"} />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => setMenuVisible(true)}
 style={{ marginRight:100 }}>
        <Ionicons name="settings" size={20} color= {isNightMode ? primary : "#000"} />
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
      <Ionicons name="search" size={20} color= {isNightMode ? primary : "#000"} style={{ marginRight: 5 }} />
      <TextInput
        style={{
          height: 30,
          borderColor: '#000',
          borderWidth: 1,
          paddingLeft: 5,
          borderRadius: 15,
          padding: 10,
          width: 300,
          color:  isNightMode ? '#FFF' : '#000',
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
:(
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
          onFocus={() => nav.navigate('SearchScreen',{searchQuery:searchQuery})}
        />
      </View>
    </View>
</>
  )}


   {/* Main Content */}
              <View style={{ flex: 1 }}>
     
     {/* Animated.ScrollView - يحتوي على النصوص والأزرار */}
     <Animated.ScrollView
       style={{
         flex: 1,
         margin : Platform.OS=== 'web'? 40:'',
         borderRadius : Platform.OS === 'web'? 10 : 0 ,
         backgroundColor: isNightMode ? Colors.black : Colors.primary
       }}
     >

      
<View style={{
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  backgroundColor: 'white',
  zIndex: 10,
  width: '100%',backgroundColor: isNightMode ?  Colors.black : Colors.primary
}}>

  {/* صورة غلاف */}
<View style={styles.coverImageContainer}>
  {CoverImage ? (
    <Image
      source={{ uri: CoverImage }}
      style={styles.coverImage}
      resizeMode="cover"
    />
  ) : (
    ''
  )}
  <View style={styles.coverImageOverlay} />
</View>

      {/* صورة البروفايل */}
<View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', padding: 10 }}>

  {/* صورة البروفايل */}
  <TouchableOpacity style={{ marginRight: 15,marginTop:-40}} onPress={pickImage}>
    <View style={[styles.profileImageContainer, { borderColor: isNightMode ? Colors.primary : Colors.black }]}>
      <Image
        source={{
          uri: profileImage || 'https://via.placeholder.com/80',
        }}
        style={styles.profileImage}
        resizeMode="cover"
      />
    </View>
  </TouchableOpacity>

  {/* حاوية النصوص (الاسم واسم المستخدم) */}
  <View style={{ flex: 1, justifyContent: 'center',marginTop:-23 }}>
    <Text 
      style={{
        fontSize: 20,
        fontWeight: 'bold',
        color: isNightMode ? Colors.primary : Colors.black,
        flexShrink: 1, // يسمح بتقليص النص إذا زاد عن المساحة المتاحة
      }}
      numberOfLines={1}
      ellipsizeMode="tail"
    >
      {FullName || 'Full Name'}
    </Text>

    <Text 
      style={{
        fontSize: 14,
        color: isNightMode ? Colors.fourhColor : Colors.fifthColor,
        flexShrink: 1,fontWeight:'bold'
      }}
      numberOfLines={1}
      ellipsizeMode="tail"
    >
      {'@'+userName || 'Username'}
    </Text>
  </View>

  {/* أيقونة التعديل */}
  <TouchableOpacity 
  onPress={toggleModal}>
  <MaterialIcons
    style={{ marginTop: -23 }}
    name="create"
    size={25}
    color={isNightMode ? Colors.primary : Colors.black}
  />
  </TouchableOpacity>

</View>

        
      {/* عرض أو تعديل رابط GitHub */}
      {isEditing ? (
        <View style={styles.githubEditWrapper}>
          <TextInput
            placeholder="Enter GitHub URL"
            value={githubLink}
            onChangeText={setGithubLink}
            style={styles.githubInput}
          />
          <TouchableOpacity
            onPress={() => {
              if (githubLink) {
                setIsEditing(false);
              } else {
                alert('Please enter a valid URL');
              }
            }}
            style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => {
            if (githubLink) {
              Linking.openURL(githubLink);
            } else {
              setIsEditing(true);
            }
          }}
          style={styles.githubIcon}>
          <Ionicons name="logo-github" size={30} color="#000" />
        </TouchableOpacity>
      )}
    </View>

         {/* قسم الأصدقاء والتقدم والإنجازات */}
         <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: isNightMode ? Colors.tertiary : Colors.secondary,
            width: '100%',
            marginTop: 20,
            padding: 10,
          }}>

            {/* عدد الأصدقاء */}
            <View style={{ flex: 1, alignItems: 'center'}}>
            <TouchableOpacity>
              <Text style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: isNightMode ? Colors.primary : Colors.black
              }}>
                Friends {friendsCount || '0'}
              </Text></TouchableOpacity>
            </View>

            {/* التقدم */}
            <View style={{ flex: 1, alignItems: 'center',left:18 }}>
              <Text style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: isNightMode ? Colors.fourhColor : Colors.gray
              }}>
                {userProgress || 'Beginner'}
              </Text>
            </View>

            {/* قائمة الإنجازات */}
            <View style={{ flex: 1, alignItems: 'center' ,left:19 }}>
              <MaterialIcons
                name="emoji-events"
                size={24}
                color={isNightMode ? Colors.fourhColor : Colors.gold}
              />
            </View>

          </View>

    <View style={[styles.divider,{height:3}]}/>



         
        
       
      {/* النصوص تحت الصورة */}
      
      {(bio || location || about) ? (
  <View style={styles.bioWrapper}>
    {/* قسم الـ Bio */}
    {bio ? (
      <>
        <View style={styles.section}>
          <Text style={[styles.bioTitle, { fontStyle: 'italic', color: isNightMode ? Colors.primary : Colors.black }]}>
            Bio:
          </Text>
          <Text style={[styles.bioText, { color: isNightMode ? Colors.fourhColor : Colors.black }]}>
            {bio}
          </Text>
        </View>
        <View style={styles.divider} />
      </>
    ) : null}

    {/* قسم الموقع Location */}
    {location ? (
      <>
        <View style={styles.section}>
          <Text style={[styles.bioTitle, { fontStyle: 'italic', color: isNightMode ? Colors.primary : Colors.black }]}>
            Location:
          </Text>
          <Text style={[styles.bioText, { color: isNightMode ? Colors.fourhColor : Colors.black }]}>
            {location}
          </Text>
        </View>
        <View style={styles.divider} />
      </>
    ) : null}

    {/* قسم الـ About */}
    {about ? (
      <View style={styles.section}>
        <Text style={[styles.bioTitle, { fontStyle: 'italic', color: isNightMode ? Colors.primary : Colors.black }]}>
          About:
        </Text>
        <Text style={[styles.bioText, { color: isNightMode ? Colors.fourhColor : Colors.black }]}>
          {about}
        </Text>
      </View>
    ) : null}
  </View>
) : null}



<View style={[styles.divider,{height:3}]}/>


{/* بطاقة Experience */}
<View style={[styles.card, { backgroundColor: isNightMode ? Colors.black : Colors.primary }]}>
            <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: isNightMode ? Colors.primary : Colors.black }]}>Experience</Text>
                <View style={styles.actionButtons}>
                    <TouchableOpacity onPress={() => openModal('experience')} style={styles.smallButton}>
                        <Text style={styles.smallButtonText}>Add</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* عرض أول 2 خبرات */}
            {sortedExperiences.slice(0, 2).map((exp, index) => (
                <View key={index} style={styles.experienceItem}>
                <View style={styles.experienceHeader}>
                    <Text style={[styles.experienceTitle,{color:isNightMode ?Colors.primary :Colors.black}]}>{exp.jobTitle}</Text>
                    <TouchableOpacity onPress={() =>  openModalEditting(exp, 'experience')} style={styles.editButton}>
              <MaterialIcons name="edit" size={20} color={isNightMode ? Colors.primary : Colors.black} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openConfirmDeleteModal('experience',exp)} style={styles.deleteButton}>
              <MaterialCommunityIcons name="minus-circle" size={20} color={isNightMode ? Colors.primary : Colors.black} />
            </TouchableOpacity>
          </View>
                    <Text style={[styles.experienceDescription,{color:isNightMode ?Colors.primary :Colors.black}]}>{exp.Description}</Text>
                    <Text style={styles.experienceDate}>
          
          {exp.isContinuing 
            ?   `working at ${exp.name} since ${formatDate(exp.startDate)}` // إذا كان العمل مستمر فقط يظهر منذ وتاريخ البدء
            : ` ًWorked at ${exp.name} from  ${formatDate(exp.startDate)} to ${formatDate(exp.endDate)}`} 
        </Text>

                      {/* عرض حالة العمل (مستمر أو منتهي) */}
          <Text
            style={[
              styles.experienceStatus,
              { color: getStatusColor(exp.isContinuing) },
            ]}
          >
            {exp.isContinuing ? 'Ongoing' : 'Completed'}
          </Text>
                    <View style={styles.divider} />
                </View>
            ))}

            {/* عرض خيار "عرض الكل" إذا كانت هناك أكثر من خبرتين */}
            {experiences.length > 2 && !showAllExperiences && (
                <TouchableOpacity onPress={handleShowAllExperiences} style={styles.showAllButton}>
                    <Text style={styles.showAllButtonText}>Show All</Text>
                </TouchableOpacity>
            )}

            {/* عرض جميع الخبرات إذا كانت حالة العرض تم تفعيلها */}
            {showAllExperiences && (
                <>
                    <ExperienceList experiences={experiences} />
                    <TouchableOpacity onPress={handleHideExperiences} style={styles.showAllButton}>
                        <Text style={styles.showAllButtonText}>Hide</Text>
                    </TouchableOpacity>
                </>
            )}

     
      </View>
      <View style={[styles.divider,{height:3}]}/>


      {/* بطاقة Education */}
      <View style={[styles.card,{ backgroundColor: isNightMode ? Colors.black : Colors.primary }]}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle,{color: isNightMode ? Colors.primary : Colors.black }]}>Education</Text>
          <View style={styles.actionButtons}>

          <TouchableOpacity onPress={() => openModal('education')} style={styles.smallButton}>
            <Text style={styles.smallButtonText}>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log('Edit Recommendation')} style={styles.smallButton}>
              <Text style={styles.smallButtonText}>Edit</Text>
            </TouchableOpacity></View>

            
        </View>
         {/* عرض أول 2 خبرات */}
         {Education.slice(0, 2).map((exp, index) => (
                <View key={index} style={styles.experienceItem}>
                <View style={styles.experienceHeader}>
                    <Text style={[styles.experienceTitle,{color:isNightMode ?Colors.primary :Colors.black}]}>{exp.universityName}</Text>
                    <TouchableOpacity onPress={() =>  openModalEditting(exp, 'education')}style={styles.editButton}>
              <MaterialIcons name="edit" size={20} color={isNightMode ? Colors.primary : Colors.black} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openConfirmDeleteModal('education',exp)} style={styles.deleteButton}>
              <MaterialCommunityIcons name="minus-circle" size={20} color={isNightMode ? Colors.primary : Colors.black} />
            </TouchableOpacity>
          </View>
                    <Text style={[styles.experienceDescription,{color:isNightMode ?Colors.primary :Colors.black}]}>{exp.degree}</Text>
                    <Text style={styles.experienceDate}>{exp.fieldOfStudy}</Text>

                      {/* عرض حالة العمل (مستمر أو منتهي) */}
                    <View style={styles.divider} />
                </View>
            ))}

            {/* عرض خيار "عرض الكل" إذا كانت هناك أكثر من خبرتين */}
            {Education.length > 2 && !showAllEducation && (
                <TouchableOpacity onPress={handleShowAllEducation} style={styles.showAllButton}>
                    <Text style={styles.showAllButtonText}>Show All</Text>
                </TouchableOpacity>
            )}

            {/* عرض جميع الخبرات إذا كانت حالة العرض تم تفعيلها */}
            {showAllEducation && (
                <>
                   
                   <EducationList education={Education} />
                    <TouchableOpacity onPress={handleHideEducation} style={styles.showAllButton}>
                        <Text style={styles.showAllButtonText}>Hide</Text>
                    </TouchableOpacity>
                </>
            )}

     
      </View>

      <View style={[styles.divider,{height:3}]}/>

 {/* بطاقة Certification */}
 <View style={[styles.card, { backgroundColor: isNightMode ? Colors.black : Colors.primary }]}>
  <View style={styles.cardHeader}>
    <Text style={[styles.cardTitle, { color: isNightMode ? Colors.primary : Colors.black }]}>Certification</Text>
    <View style={styles.actionButtons}>
      <TouchableOpacity onPress={() => openModal('certification')} style={styles.smallButton}>
        <Text style={styles.smallButtonText}>Add</Text>
      </TouchableOpacity>
     
    </View>
  </View>

  {/* عرض الشهادات */}
  {certification.slice(0, 2).map((cert, index) => (
    <View key={index} style={[styles.experienceItem, { flexDirection: 'row' }]}>
    
      {/* عرض الصورة */}
      {cert.credentialType === 'image' && cert.certificationImageData?.secure_url && (
         <TouchableOpacity onPress={() => openImageViewer(cert.certificationImageData.secure_url)}>
        <Image
          source={{ uri: cert.certificationImageData.secure_url }}
          style={styles.certImage}
        />
         </TouchableOpacity>
            )}

      {/* محتوى الشهادة */}
      <View style={{ flex: 1 }}>
        {/* العنوان */}
        <Text style={[styles.experienceTitle, { color: isNightMode ? Colors.primary : Colors.black }]}>
          {cert.title}
        </Text>
        <TouchableOpacity onPress={() =>  openModalEditting(cert, 'certification')}style={styles.editButton}>
              <MaterialIcons name="edit" size={20} color={isNightMode ? Colors.primary : Colors.black} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openConfirmDeleteModal('certification',cert)} style={styles.deleteButton}>
              <MaterialCommunityIcons name="minus-circle" size={20} color={isNightMode ? Colors.primary : Colors.black} />
            </TouchableOpacity>
        {/* الجهة المصدرة */}
        <Text style={[styles.experienceDescription, { color: isNightMode ? Colors.primary : Colors.black }]}>
          {cert.issuingOrganization}
        </Text>

        {/* تاريخ الإصدار والانتهاء */}
        <Text style={[styles.experienceDate, { color: isNightMode ? Colors.primary : Colors.gray }]}>
          Issued: {cert.issueDate} {cert.expirationDate ? ` - Expires: ${cert.expirationDate}` : ''}
        </Text>

        {/* المحتوى بناءً على النوع */}
        {cert.credentialType === 'link' && cert.certificationLinkData && (
          <TouchableOpacity onPress={() => Linking.openURL(cert.certificationLinkData)} style={styles.linkContainer}>
            <Text style={styles.linkText}>{cert.certificationLinkData}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  ))}

    {/* عرض خيار "عرض الكل" إذا كانت هناك أكثر من خبرتين */}
    {certification.length > 2 && !showAllCertification && (
                <TouchableOpacity onPress={handleShowAllCertification} style={styles.showAllButton}>
                    <Text style={styles.showAllButtonText}>Show All</Text>
                </TouchableOpacity>
            )}

            {/* عرض جميع الخبرات إذا كانت حالة العرض تم تفعيلها */}
            {showAllCertification && (
                <>  
                   <CertificationList certification={certification} />
                    <TouchableOpacity onPress={handleHideCertification} style={styles.showAllButton}>
                        <Text style={styles.showAllButtonText}>Hide</Text>
                    </TouchableOpacity>
                </>
            )}

</View>

<View style={[styles.divider, { height: 3 }]} />


      {/* بطاقة Project */}
      <View style={[styles.card,{ backgroundColor: isNightMode ? Colors.black : Colors.primary }]}>
      <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle,{color: isNightMode ? Colors.primary : Colors.black }]}>Project</Text>
          <View style={styles.actionButtons}>

          <TouchableOpacity onPress={() => openModal('project')} style={styles.smallButton}>
            <Text style={styles.smallButtonText}>Add</Text>
          </TouchableOpacity>
          </View>
        </View>
      </View>


      <View style={[styles.divider,{height:3}]}/>


      {/* بطاقة Skills */}
      <View style={[styles.card, { backgroundColor: isNightMode ? Colors.black : Colors.primary }]}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle,{color: isNightMode ? Colors.primary : Colors.black }]}>Skills</Text>
          <View style={styles.actionButtons}>

          <TouchableOpacity 
          handleAddSkills
          onPress={() => openModal('skills')} style={styles.smallButton}>
              <Text style={styles.smallButtonText}>Add</Text>
            </TouchableOpacity>
           </View>
        </View>
             {userSkills.slice(0,2).map((cert, index) => (
        <View key={index} style={[styles.experienceItem, { flexDirection: 'row' }]}>
            <View style={{ flex: 1 }}>
        <Text style={[styles.experienceTitle, { color: isNightMode ? Colors.primary : Colors.black }]}>
          {cert.name}
        </Text>
        
             <TouchableOpacity style={styles.editButton}>
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    {/* النجوم هنا */}
    {[1, 2, 3, 4, 5].map((starIndex) => (
      <TouchableOpacity
        key={starIndex}
        onPress={() => {
          // تحديث تقييم المهارة فقط
          const updatedSkills = [...userSkills];
          updatedSkills[index].rating = starIndex; // تحديث تقييم المهارة
          setUserSkills(updatedSkills);
        }}
      >
        <MaterialCommunityIcons
          name={starIndex <= cert.Rate ? 'star' : 'star-outline'} // ملء النجوم بناءً على cert.rating
          size={20}
          color={starIndex <= cert.Rate ? '#F7A8B8' : isNightMode ? Colors.primary : Colors.black}
        />
      </TouchableOpacity>
    ))}

    {/* مسافة بسيطة بين النجوم وزر الحذف */}
    <TouchableOpacity onPress={() => openConfirmDeleteModal('skills', cert)} style={{ marginLeft: 10 }}>
      <MaterialCommunityIcons name="minus-circle" size={20} color={isNightMode ? Colors.primary : Colors.black} />
    </TouchableOpacity>
  </View>
</TouchableOpacity>


            
          </View>
         </View>
                      ))}

        {userSkills.length > 2 && !showAllSkills && (
                <TouchableOpacity onPress={handleShowAllSkills} style={styles.showAllButton}>
                    <Text style={styles.showAllButtonText}>Show All</Text>
                </TouchableOpacity>
            )}


            {showAllSkills && (
                <>  
                   <SkillsList skill={Skills} />
                    <TouchableOpacity onPress={handleHideSkills} style={styles.showAllButton}>
                        <Text style={styles.showAllButtonText}>Hide</Text>
                      
                    </TouchableOpacity>
                </>
            )}
      </View>
      
      <View style={[styles.divider,{height:3}]}/>
     

      {/* بطاقة Languages */}
      <TouchableOpacity
  style={[styles.card, { backgroundColor: isNightMode ? Colors.black : Colors.primary }]}
>
  <View style={styles.cardHeader}>
  
    <Text style={[styles.cardTitle, { color: isNightMode ? Colors.primary : Colors.black }]}>
      Language
    </Text>
    
    <View style={styles.actionButtons}>

      <TouchableOpacity
      handleAddLanguage
      onPress={() => openModal('language') }
        style={styles.smallButton}>
        <Text style={styles.smallButtonText}>Add</Text>
      </TouchableOpacity>
 
    </View>
  </View>
    {userLanguages.slice(0,2).map((cert, index) => (
    <View key={index} style={[styles.experienceItem, { flexDirection: 'row' }]}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.experienceTitle, { color: isNightMode ? Colors.primary : Colors.black }]}>
          {cert.name}
        </Text>
            <TouchableOpacity onPress={() => openConfirmDeleteModal('language',cert)} style={styles.editButton}>
              <MaterialCommunityIcons name="minus-circle" size={20} color={isNightMode ? Colors.primary : Colors.black} />
            </TouchableOpacity>
      </View>
    </View>
  ))}

    {userLanguages.length > 2 && !showAlllLanguage && (
                <TouchableOpacity onPress={handleShowAllLanguage} style={styles.showAllButton}>
                    <Text style={styles.showAllButtonText}>Show All</Text>
                </TouchableOpacity>
            )}


            {showAlllLanguage && (
                <>  
                   <LanguageList language ={'language'} />
                    <TouchableOpacity onPress={handleHideLanguage} style={styles.showAllButton}>
                        <Text style={styles.showAllButtonText}>Hide</Text>
                    </TouchableOpacity>
                </>
            )}
            

</TouchableOpacity>
      <View style={[styles.divider,{height:3}]}/>

      {/* بطاقة Recommendation */}
      <View style={[styles.card,{ backgroundColor: isNightMode ? Colors.black : Colors.primary }]}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle,{color: isNightMode ? Colors.primary : Colors.black }]}>Recommendation</Text>
          <View style={styles.actionButtons}>
          <TouchableOpacity onPress={() => openModal('recommendation')} style={styles.smallButton}>
              <Text style={styles.smallButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={[styles.divider,{height:3}]}/>

      {/* Modal لكل بطاقة */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent,{ backgroundColor: isNightMode ? Colors.black : Colors.primary }]}>
            {/* محتويات Modal Experience */}
            {currentModal === 'experience' && (
              <>
                <Text style={[styles.modalTitle,{color:isNightMode ? Colors.primary : Colors.black}]}>Experience</Text>
                <TextInput placeholder="Institution Name" value={newExperiance.name} placeholderTextColor = "#333"style={styles.input}  
                             onChangeText={(text) => handleChangeExperience('name', text)}
 />
                <TextInput placeholder="Job Title" placeholderTextColor = "#333" value={newExperiance.jobTitle} onChangeText={(text) => handleChangeExperience('jobTitle', text)}style={styles.input} />
               
                <TextInput
              placeholder="Start Date (e.g., 2022-01-01)"
              placeholderTextColor="#333"
              style={styles.input}
              value={newExperiance.startDate}
              onChangeText={(text) => handleChangeExperience('startDate', text)}
            />
            
            
            {/* Checkbox للتحديد ما إذا كان العمل مستمرًا */}
            <View style={styles.switchContainer}>
              <Text style={[styles.label, { color: isNightMode ? Colors.primary : Colors.black }]}>
                Is the work still continuing?
              </Text>
              <Switch
    //value={newExperiance.isContinuing}
                onValueChange={(value) => handleChangeExperience('isContinuing', value)}   
                value={newExperiance.isContinuing}             
                trackColor={{ false: '#767577', true: Colors.fourhColor }}
                thumbColor={newExperiance.isContinuing ? Colors.black : Colors.fourhColor}
              />
            </View>

            {/* حقل تاريخ النهاية يظهر فقط إذا لم يكن العمل مستمرًا */}
            {!newExperiance.isContinuing && (
              <TextInput
                placeholder="End Date (e.g., 2023-05-01)"
                placeholderTextColor="#333"
                style={styles.input}
                value={newExperiance.endDate}
                onChangeText={(text) => handleChangeExperience('endDate', text)}/>
            )}
            
            <TextInput
              placeholder="Description"
              placeholderTextColor="#333"
              style={styles.input}
              value={newExperiance.Description}
              onChangeText={(text) => handleChangeExperience('Description', text)}
                          />
                          </>
            )}

          {/* محتويات Modal Education */}
{currentModal === 'education' && (
  <>
    <Text style={[styles.modalTitle, { color: isNightMode ? Colors.primary : Colors.black }]}>Education</Text>
    
    {/* University Name */}
    <TextInput
      placeholder="University Name"
      placeholderTextColor="#333"
      style={[styles.input, { color: isNightMode ? Colors.primary : Colors.black }]}
      value={newEducation.universityName}
      onChangeText={(text) => handleChangeEducation('universityName', text)}
    />
    
    {/* Degree */}
    <TextInput
      placeholder="Degree"
      placeholderTextColor="#333"
      style={[styles.input, { color: isNightMode ? Colors.primary : Colors.black }]}
      value={newEducation.degree}
      onChangeText={(text) =>handleChangeEducation('degree', text)}
    />
    
    {/* Field Of Study */}
    <TextInput
      placeholder="Field Of Study"
      placeholderTextColor="#333"
      style={styles.input}
      value={newEducation.fieldOfStudy}
      onChangeText={(text) => handleChangeEducation('fieldOfStudy', text)}
    />
  </>
)}

            {/* محتويات Modal Certification */}
            {currentModal === 'certification' && (
              <>
    <Text style={styles.modalTitle}>Certification</Text>
    
    <TextInput
  placeholder="Certificate Title"
  placeholderTextColor="#333"
  style={styles.input}
  value={newCertification.title}
  onChangeText={(text) => setNewCertificaion((prev) => ({ ...prev, title: text }))}
/>

<TextInput
  placeholder="Issuing Organization"
  placeholderTextColor="#333"
  style={styles.input}
  value={newCertification.issuingOrganization}
  onChangeText={(text) => setNewCertificaion((prev) => ({ ...prev, issuingOrganization: text }))}
/>

<TextInput
  placeholder="Issue Date (e.g., 01/2024)"
  placeholderTextColor="#333"
  style={styles.input}
  value={newCertification.issueDate}
  onChangeText={(text) => setNewCertificaion((prev) => ({ ...prev, issueDate: text }))}
/>

<TextInput
  placeholder="Expiration Date (optional)"
  placeholderTextColor="#333"
  style={styles.input}
  value={newCertification.expirationDate}
  onChangeText={(text) => setNewCertificaion((prev) => ({ ...prev, expirationDate: text }))}
/>

    {/* Credential Options: Switch Between Link or Image */}
<View style={styles.switchContainer}>
  <TouchableOpacity
    onPress={() => {
      setUploadType('link');
      setNewCertificaion((prev) => ({ ...prev,credentialType: 'link', certificationImageData: '', certificationLinkData: '' }));
      
    }}
    style={[styles.switchButton, uploadType === 'link' && styles.activeSwitchButton]}
  >
    <Text style={uploadType === 'link' ? styles.activeSwitchText : styles.switchText}>Link</Text>
  </TouchableOpacity>

  <TouchableOpacity
    onPress={() => {
      setUploadType('image');
      setNewCertificaion((prev) => ({ ...prev,credentialType: 'image', certificationImageData: '', certificationLinkData: '' }));
    }}
    style={[styles.switchButton, uploadType === 'image' && styles.activeSwitchButton]}
  >
    <Text style={uploadType === 'image' ? styles.activeSwitchText : styles.switchText}>Upload Image</Text>
  </TouchableOpacity>
</View>

{/* If 'link' is selected, show URL input */}
{uploadType === 'link' ? (
  <TextInput
    placeholder="Credential URL"
    placeholderTextColor="#333"
    style={styles.input}
    value={newCertification.certificationLinkData}
    onChangeText={(text) => setNewCertificaion((prev) => ({ ...prev,credentialType: 'link', certificationLinkData: text }))}
/>
) : (
  <TouchableOpacity
    onPress={pickImageCertification}
    style={styles.uploadButton}
  >
    <Text style={styles.uploadButtonText}>Choose Image</Text>
  </TouchableOpacity>
)}
{image && <Image source={{ uri: image }} style={styles.previewImage} />}
              </>
            )}
              {/* محتويات Modal Project */}
              {currentModal === 'project' && (
              <>
                <Text style={styles.modalTitle}>Edit Project</Text>
                <TextInput placeholder="Project Title" placeholderTextColor = "#333" style={styles.input} />
                <TextInput placeholder="Project Description" placeholderTextColor = "#333" style={styles.input} />
                <View style={styles.switchContainer}>
                  <TouchableOpacity
                    onPress={() => setUploadType('link')}
                    style={[styles.switchButton, uploadType === 'link' && styles.activeSwitchButton]}
                  >
                    <Text style={uploadType === 'link' ? styles.activeSwitchText : styles.switchText}>
                      Link
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setUploadType('image')}
                    style={[styles.switchButton, uploadType === 'image' && styles.activeSwitchButton]}
                  >
                    <Text style={uploadType === 'image' ? styles.activeSwitchText : styles.switchText}>
                      Upload Image
                    </Text>
                  </TouchableOpacity>
                </View>
                {uploadType === 'link' ? (
                  <TextInput placeholder="Project URL" placeholderTextColor = "#333"style={styles.input} />
                ) : (
                  <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
                    <Text style={styles.uploadButtonText}>Choose Image</Text>
                  </TouchableOpacity>
                )}
                {image && <Image source={{ uri: image }} style={styles.previewImage} />}
              </>
            )}
 {/* محتويات Modal Skills */}
 {/* محتويات Modal Skills */}
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


            {currentModal === 'language' && (
  <>
    <Text style={[styles.modalTitle, { marginTop: 0 }]}>Select Language(s)</Text>
    <Text style={{color:Colors.brand}}>{error}</Text>
    <MultiSelect
      style={styles.scrollableItemsContainer}
      items={languages} // قائمة اللغات
      uniqueKey="id" // المفتاح الفريد لكل عنصر
      onSelectedItemsChange={onSelectedItemsChange} // التعامل مع التحديد
      selectedItems={selectedLanguages} // العناصر المحددة حالياً
      selectText="Choose Languages"
      submitButtonColor={isNightMode ? Colors.fourhColor : Colors.fourhColor} // لون خلفية زر "Submit"
      tagRemoveIconColor={isNightMode ? Colors.brand : Colors.brand} // لون أيقونة الحذف
      tagBorderColor={isNightMode ? '#4A90E2' : '#333'} // لون الحدود
      tagTextColor={isNightMode ? Colors.fifthColor : '#333'} // لون النص في التاج
      selectedItemTextColor={isNightMode ? Colors.fifthColor : '#333'} // لون النص في العنصر المحدد
      selectedItemIconColor={isNightMode ? Colors.brand : '#333'} // لون أيقونة العنصر المحدد
      itemTextColor={isNightMode ?'#000' : '#333'} // لون النص في العنصر غير المحدد
      displayKey="name"
 
  // تخصيص النص عند عدم اختيار أي عنصر

       // تخصيص رأس القائمة (الخلفية التي تحتوي النص الافتراضي)
  styleDropdownMenu={{
    backgroundColor: isNightMode ? '#444' : '#EEE', // خلفية رأس القائمة
  }}
      // تخصيص النص داخل الحقل
      styleTextDropdown={{
        color: isNightMode ? '#000' : '#333', // لون النص
        fontSize: 16, // حجم الخط
        fontWeight: 'bold', // سمك الخط
      }}
      // خصائص إضافية لتحسين العرض والتخصيص
      fixedHeight={true} // تحديد ارتفاع ثابت
      styleItemsContainer={{
        maxHeight: 190, // تحديد الحد الأقصى للارتفاع
        
      }}

    />
  </>
)}



            {/* محتويات Modal Recommendation */}
            {currentModal === 'recommendation' && (
              <>
                <Text style={styles.modalTitle}>Edit Recommendation</Text>
                <TextInput placeholder="Recommendation"  placeholderTextColor = "#333" style={styles.input} />
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


   {/*modal for Editting*/}
     {/* Modal لكل بطاقة */}
     <Modal animationType="slide" transparent={true} visible={modalVisibleEditting} onRequestClose={closeModal}>
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, { backgroundColor: isNightMode ? '#000' : '#fff' }]}>
          {/* محتويات المودال بناءً على النوع */}
          {currentModalEditting === 'experience' && selectedItem && (
            <>
              <Text style={[styles.modalTitle, { color: isNightMode ? '#fff' : '#000' }]}>Edit Experience</Text>
              <TextInput
                placeholder="Institution Name"
                value={selectedItem.name}
                onChangeText={(text) => setSelectedItem({ ...selectedItem, name: text })}
                style={styles.input}
              />
              <TextInput
                placeholder="Job Title"
                value={selectedItem.jobTitle}
                onChangeText={(text) => setSelectedItem({ ...selectedItem, jobTitle: text })}
                style={styles.input}
              />
              <TextInput
                placeholder="Start Date (e.g., 2022-01-01)"
                value={selectedItem.startDate}
                onChangeText={(text) => setSelectedItem({ ...selectedItem, startDate: text })}
                style={styles.input}
              />
              <View style={styles.switchContainer}>
                <Text style={[styles.label, { color: isNightMode ? '#fff' : '#000' }]}>Is the work still continuing?</Text>
                <Switch
                  value={selectedItem.isContinuing}
                  onValueChange={(value) => setSelectedItem({ ...selectedItem, isContinuing: value })}
                  trackColor={{ false: '#767577', true: '#81b0ff' }}
                  thumbColor={selectedItem.isContinuing ? '#f5dd4b' : '#f4f3f4'}
                />
              </View>
              {!selectedItem.isContinuing && (
                <TextInput
                  placeholder="End Date (e.g., 2023-05-01)"
                  value={selectedItem.endDate || ''}
                  onChangeText={(text) => setSelectedItem({ ...selectedItem, endDate: text })}
                  style={styles.input}
                />
              )}
              <TextInput
                placeholder="Description"
                value={selectedItem.Description}
                onChangeText={(text) => setSelectedItem({ ...selectedItem, Description: text })}
                style={styles.input}
              />
            </>
          )}

          {currentModalEditting === 'education' && selectedItem && (
            <>
              <Text style={[styles.modalTitle, { color: isNightMode ? '#fff' : '#000' }]}>Edit Education</Text>
              <TextInput
                placeholder="University Name"
                value={selectedItem.universityName}
                onChangeText={(text) => setSelectedItem({ ...selectedItem, universityName: text })}
                style={styles.input}
              />
              <TextInput
                placeholder="Degree"
                value={selectedItem.degree}
                onChangeText={(text) => setSelectedItem({ ...selectedItem, degree: text })}
                style={styles.input}
              />
              <TextInput
                placeholder="Field Of Study"
                value={selectedItem.fieldOfStudy}
                onChangeText={(text) => setSelectedItem({ ...selectedItem, fieldOfStudy: text })}
                style={styles.input}
              />
            </>
          )}

          {currentModalEditting === 'project' && selectedItem && (
            <>
              <Text style={[styles.modalTitle, { color: isNightMode ? '#fff' : '#000' }]}>Edit Project</Text>
              <TextInput
                placeholder="Project Title"
                value={selectedItem.title}
                onChangeText={(text) => setSelectedItem({ ...selectedItem, title: text })}
                style={styles.input}
              />
              <TextInput
                placeholder="Project Description"
                value={selectedItem.description}
                onChangeText={(text) => setSelectedItem({ ...selectedItem, description: text })}
                style={styles.input}
              />
              <TextInput
                placeholder="Project URL"
                value={selectedItem.url}
                onChangeText={(text) => setSelectedItem({ ...selectedItem, url: text })}
                style={styles.input}
              />
            </>
          )}

          {currentModalEditting === 'skills' && selectedItem && (
            <>
              <Text style={[styles.modalTitle, { color: isNightMode ? '#fff' : '#000' }]}>Edit Skills</Text>
              <TextInput
                placeholder="Skill Name"
                value={selectedItem.skill}
                onChangeText={(text) => setSelectedItem({ ...selectedItem, skill: text })}
                style={styles.input}
              />
            </>
          )}



          
          {currentModalEditting === 'certification' && selectedItem && (
  <View>
    <Text style={[styles.modalTitle, { color: isNightMode ? '#fff' : '#000' }]}>Edit Certification</Text>

    {/* عرض عنوان الشهادة */}
    <TextInput
      placeholder="Certification Title"
      value={selectedItem.title}
      onChangeText={(text) => setSelectedItem({ ...selectedItem, title: text })}
      style={styles.input}
    />

    {/* عرض الجهة المصدرة */}
    <TextInput
      placeholder="Issuing Organization"
      value={selectedItem.issuingOrganization}
      onChangeText={(text) => setSelectedItem({ ...selectedItem, issuingOrganization: text })}
      style={styles.input}
    />

    {/* عرض تاريخ الإصدار والانتهاء */}
    <TextInput
      placeholder="Issue Date"
      value={selectedItem.issueDate}
      onChangeText={(text) => setSelectedItem({ ...selectedItem, issueDate: text })}
      style={styles.input}
    />
    <TextInput
      placeholder="Expiration Date (optional)"
      value={selectedItem.expirationDate || ''}
      onChangeText={(text) => setSelectedItem({ ...selectedItem, expirationDate: text })}
      style={styles.input}
    />

    {/* التبديل بين صورة ورابط */}
    <TouchableOpacity onPress={toggleCredentialType} style={styles.switchButton}>
      <Text style={styles.switchButtonText}>
        {selectedItem.credentialType === 'image' ? 'Switch to Link' : 'Switch to Image'}
      </Text>
    </TouchableOpacity>

    {/* إذا كانت الشهادة تحتوي على صورة */}
    {selectedItem.credentialType === 'image' && selectedItem.certificationImageData && (
      <TouchableOpacity onPress={selectNewImage}>
        <Image
          source={{ uri: selectedItem.certificationImageData.secure_ur }}
          style={styles.certImage}
        />
      </TouchableOpacity>
    )}

    {/* إذا كانت الشهادة تحتوي على رابط */}
    {selectedItem.credentialType === 'link' && (
      <TextInput
        placeholder="Certification Link"
        value={selectedItem.certificationLinkData || ''}
        onChangeText={(text) => setSelectedItem({ ...selectedItem, certificationLinkData: text })}
        style={styles.input}
      />
    )}

 
  </View>
)}


            {/* محتويات Modal Language */}
            {currentModal === 'Language' && (
              <>
                <Text style={styles.modalTitle}>Edit Language</Text>
                <TextInput placeholder="Add a Language" placeholderTextColor = "#333" style={styles.input} />
              </>
            )}

            {/* محتويات Modal Recommendation */}
            {currentModal === 'recommendation' && (
              <>
                <Text style={styles.modalTitle}>Edit Recommendation</Text>
                <TextInput placeholder="Recommendation"  placeholderTextColor = "#333" style={styles.input} />
              </>
            )}

            {/* أزرار الحفظ والإغلاق */}
            <View style={styles.buttonsContainer}>
            <TouchableOpacity onPress={handleEditForEachCard} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={closeModalEditting} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>

<View style={{ flex: 1,marginBottom:50}}>
{/* قائمة التبويبات */}
          <View style={styles.tabContainer}>
        {['Messages', 'Connect', 'Posts', 'Comments'].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={styles.tabButton}
          >
            <Text style={[styles.tabText,{color: isNightMode? Colors.primary : Colors.black}]}>{tab}</Text>
            {activeTab === tab && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* عرض محتوى التبويب المختار */}
      <View style={[styles.content,{backgroundColor : isNightMode? Colors.black : Colors.primary }]}>
        {activeTab === 'Messages' && <Text style={[styles.tabContent,{color: isNightMode? Colors.primary : Colors.black}]}>Messages Content</Text>}
        {activeTab === 'Connect' && <Text style={[styles.tabContent,{color: isNightMode? Colors.primary : Colors.black}]}>Connect Content</Text>}
        {activeTab === 'Posts' && <Text style={[styles.tabContent,{color: isNightMode? Colors.primary : Colors.black}]}>Posts Content</Text>}
        {activeTab === 'Comments' && <Text style={[styles.tabContent,{color: isNightMode? Colors.primary : Colors.black}]}>Comments Content</Text>}
      </View>
    </View>
    
      </Animated.ScrollView>
    </View>
                

    <Modal
      isVisible={isModalVisible}
      onBackdropPress={() => setIsModalVisible(false)}
      style={{ justifyContent: 'flex-end', margin: 0}}
    >
     <View style={{
        backgroundColor: isNightMode ? '#333' : '#fff', 
        padding: 20, 
        borderTopLeftRadius: 20, 
        borderTopRightRadius: 20, 
        height: '80%'
             }}>
          <ScrollView>
          <Text style={{
            fontSize: 24, 
            fontWeight: 'bold', 
            marginBottom: 20, 
            color: isNightMode ? Colors.primary : Colors.black
          }}>
            Edit Profile
          </Text>

           {/* إدخال صورة البروفايل */}
          <Text style={{ color: isNightMode ? Colors.primary : Colors.black }}>Profile Image:</Text>
          <TouchableOpacity onPress={() => pickImage('profile')}>
            <View style={{ marginVertical: 10 }}>
              <Text style={{ color: isNightMode ? Colors.primary : Colors.black }}>
                {profileImage ? 'Change Profile Image' : 'Choose Profile Image'}
              </Text>
              {newprofileImage && (
                <Image 
                  source={{ uri: newprofileImage}} 
                  style={{
                    width: 100, 
                    height: 100, 
                    borderRadius: 50, 
                    marginVertical: 10 
                  }} 
                />
              )}
            </View>
          </TouchableOpacity>
        

          <View style={{ borderBottomWidth: 1, borderBottomColor: isNightMode ? '#555' : '#ddd', marginVertical: 10 }} />

         {/* إدخال صورة الغلاف */}
          <Text style={{ color: isNightMode ? Colors.primary : Colors.black }}>Cover Image:</Text>
          <TouchableOpacity onPress={() => pickImage('cover')}>
            <View style={{ marginVertical: 10 }}>
              <Text style={{ color: isNightMode ? Colors.primary : Colors.black }}>
                {CoverImage ? 'Change Cover Image' : 'Choose Cover Image'}
              </Text>
              {newcoverImage && (
                <Image 
                  source={{ uri: newcoverImage }} 
                  style={{
                    width: Platform.OS === 'web' ? '70%' : '100%',
                    height: 200, 
                    borderRadius: 10, 
                    marginVertical: 10 
                  }} 
                />
              )}
            </View>
          </TouchableOpacity>

          <View style={{ borderBottomWidth: 1, borderBottomColor: isNightMode ? '#555' : '#ddd', marginVertical: 10 }} />
               {/* إدخال الـ Bio */}
               <Text style={{ color: isNightMode ? Colors.primary : Colors.black }}>User Name:</Text>
          <TextInput
            placeholder="Enter Bio"
            value={newuserName}
            onChangeText={setNewUserName}
            style={{
              borderWidth: 1, 
              padding: 10, 
              marginBottom: 10, 
              color: isNightMode ? '#fff' : '#000', 
              borderRadius: 5, 
              backgroundColor: isNightMode ? '#555' : '#fff'
            }}
          />
          <View style={{ borderBottomWidth: 1, borderBottomColor: isNightMode ? '#555' : '#ddd', marginVertical: 10 }} />
          <View style={{ borderBottomWidth: 1, borderBottomColor: isNightMode ? '#555' : '#ddd', marginVertical: 10 }} />

          {/* إدخال الـ Bio */}
          <Text style={{ color: isNightMode ? Colors.primary : Colors.black }}>Bio:</Text>
          <TextInput
            placeholder="Enter Bio"
            value={newbio}
            onChangeText={setnewBio}
            style={{
              borderWidth: 1, 
              padding: 10, 
              marginBottom: 10, 
              color: isNightMode ? '#fff' : '#000', 
              borderRadius: 5, 
              backgroundColor: isNightMode ? '#555' : '#fff'
            }}
          />
          <View style={{ borderBottomWidth: 1, borderBottomColor: isNightMode ? '#555' : '#ddd', marginVertical: 10 }} />

          {/* إدخال الموقع */}
          <Text style={{ color: isNightMode ? Colors.primary : Colors.black }}>Location:</Text>
          <TextInput
            placeholder="Enter Location"
            value={newlocation }
            onChangeText={setnewLocation}
            style={{
              borderWidth: 1, 
              padding: 10, 
              marginBottom: 10, 
              color: isNightMode ? '#fff' : '#000', 
              borderRadius: 5, 
              backgroundColor: isNightMode ? '#555' : '#fff'
            }}
          />
          <View style={{ borderBottomWidth: 1, borderBottomColor: isNightMode ? '#555' : '#ddd', marginVertical: 10 }} />

          {/* إدخال الـ About */}
          <Text style={{ color: isNightMode ? Colors.primary : Colors.black }}>About:</Text>
          <TextInput
            placeholder="Enter About"
            value={newabout}
            onChangeText={setnewAbout}
            style={{
              borderWidth: 1, 
              padding: 10, 
              marginBottom: 10, 
              color: isNightMode ? '#fff' : '#000', 
              borderRadius: 5, 
              backgroundColor: isNightMode ? '#555' : '#fff'
            }}
          />


          <View style={{ borderBottomWidth: 1, borderBottomColor: isNightMode ? '#555' : '#ddd', marginVertical: 10 }} />
        </ScrollView>

        {/* أزرار الحفظ والإلغاء */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
          <TouchableOpacity onPress={() => cancleEdit()} style={{ padding: 10 }}>
            <Text style={{ color: 'red', fontSize: 16 }}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { 
            setIsModalVisible(false); 
            handleProfile();
            console.log('Profile saved');
          }} style={{ padding: 10 }}>
            <Text style={{ color: 'green', fontSize: 16 }}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>




    {/* Modal لتأكيد الحذف */}
<Modal animationType="slide" transparent={true} visible={confirmDeleteModalVisible} onRequestClose={closeConfirmDeleteModal}>
    <View style={styles.modalContainer}>
        <View style={[styles.modalContent, { backgroundColor: isNightMode ? Colors.black : Colors.primary }]}>
            <Text style={[styles.modalTitle, { color: isNightMode ? Colors.primary : Colors.black }]}>
                Confirm Deletion
            </Text>
            {/* عرض تفاصيل العنصر (الخبرة أو التعليم) الذي سيتم حذفه */}
            {currentSectionToDelete === 'experience' && (
              <>
                <Text style={{ color: isNightMode ? Colors.primary : Colors.black }}>
                    Are you sure you want to delete the experience:
                </Text>
                            
            <Text style={{ fontWeight: 'bold', color: isNightMode ? Colors.primary : Colors.black }}>
                {selectedItemToDelete?.name} - {selectedItemToDelete?.jobTitle || selectedItemToDelete?.degree}
            </Text></>
            )}
            {currentSectionToDelete === 'education' && (
                <Text style={{ color: isNightMode ? Colors.primary : Colors.black }}>
                    Are you sure you want to delete the education:
                </Text>
            )}
            {currentSectionToDelete === 'certification' && (
              <>
                <Text style={{ color: isNightMode ? Colors.primary : Colors.black }}>
                    Are you sure you want to delete the certification:
                </Text>
                <Text style={{ fontWeight: 'bold', color: isNightMode ? Colors.primary : Colors.black }}>
                {selectedItemToDelete?.title}
            </Text></>
            )}

            {currentSectionToDelete === 'language' && (
              <>
                <Text style={{ color: isNightMode ? Colors.primary : Colors.black }}>
                Are you sure you want to remove the ,<Text style={{ fontWeight: 'bold', color: isNightMode ? Colors.primary : Colors.black }}>{selectedItemToDelete?.name} </Text> language?
                </Text>
               
             
           </>
            )}

            {currentSectionToDelete === 'skills' && (
              <>
                <Text style={{ color: isNightMode ? Colors.primary : Colors.black }}>
                Are you sure you want to remove the ,<Text style={{ fontWeight: 'bold', color: isNightMode ? Colors.primary : Colors.black }}>{selectedItemToDelete?.name} </Text> skills?
                </Text>    
             
           </>
            )}
            <View style={styles.modalButtonsContainer}>
                <TouchableOpacity onPress={handleDeleteAction} style={styles.confirmButton}>
                    <Text style={styles.buttonText}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={closeConfirmDeleteModal} style={styles.cancelButton}>
                    <Text style={styles.buttonText}>No</Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
</Modal>


                      {/* Bottom Navigation Bar */}
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
                <TouchableOpacity onPress={() => nav.navigate('ProjectsSeniorPage')}>
                    <Ionicons name="folder" size={25} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => nav.navigate('ProfilePage')}>
                    <Image
          source={{
            uri: profileImage || 'https://via.placeholder.com/80', // استخدام الصورة المختارة أو صورة بروفايل أو صورة افتراضية
          }}                        style={{
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
    

             <Modal visible={isModalVisibleviewImage} transparent={true} onRequestClose={closeImageViewer}>


      <ImageViewer
        imageUrls={currentImage} // الصورة المعروضة
        onCancel={closeImageViewer} // غلق الصورة عند الضغط
        enableSwipeDown={true} // تمكين السحب لأسفل لإغلاق الصورة
        backgroundColor="transparent" // إزالة الخلفية السوداء

      />
    </Modal>


            {/* Menu */}
            {isMenuVisible && (
          <View style={{
              position: Platform.OS === 'web' ? 'fixed' : 'absolute', // إذا كان الويب، يبقى ثابت
left: 10, backgroundColor: 'white', padding: 10, borderRadius: 5, zIndex: 20,bottom:50,width:150,borderColor:fourhColor,borderWidth:1
          }}>
          
          <View style={{
          flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'

      }}>
          <Entypo name="log-out" size={25} color={careysPink} style={{}} />
              <TouchableOpacity onPress={handleLogout}>
                  <Text style={{ fontSize: 16, padding: 10,marginRight:40 }}>Logout</Text>
              </TouchableOpacity>
              </View>
                  
          <View style={{
          flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'

      }}>
              <Ionicons name="close-circle" size={25}  color={careysPink} style={{right:2}} />
              <TouchableOpacity onPress={() => setMenuVisible(false)}>
                  <Text style={{ fontSize: 16, padding: 10 ,marginRight:40}}>Cancel</Text>
              </TouchableOpacity>
              </View>
          </View>
      )}

        </View>
    );


};

    

const styles = StyleSheet.create({
  modalButtonsContainer:{
    flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
      },
      actionButtons: {
        flexDirection: 'row',
      },
      smallButton: {
        backgroundColor: fourhColor,
        borderRadius: 15,
        marginLeft: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 3,padding:8
      },
      smallButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
      },
      input: {
        backgroundColor: '#FFF',
        borderRadius: 10,
        padding: 10,
        marginBottom: 15,
        fontSize: 16,
        borderColor: '#E0E0E0',
        borderWidth: 1,
      },
      switchContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 15,
      },
      switchButton: {
        flex: 1,
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#F0F0F0',
        marginHorizontal: 5,
        alignItems: 'center',
      },
      activeSwitchButton: {
        backgroundColor: '#D1CFE9',
      },
      switchText: {
        color: '#555',
        fontSize: 16,
      },
      activeSwitchText: {
        color: '#000',
        fontWeight: 'bold',
      },
      uploadButton: {
        backgroundColor: '#E6E6E6',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
      },
      uploadButtonText: {
        color: '#333',
        fontWeight: 'bold',
      },
      previewImage: {
        width: '100%',
        height: 150,
        marginTop: 15,
        borderRadius: 10,
      },
      cardContent: {
        marginTop: 10,
    },
    skillText: {
        fontSize: 16,
        color: '#555',
        marginBottom: 5,
    },
    coverImageContainer: {
      width: '100%',
      height: height * 0.3, // استخدام نسبة من حجم الشاشة
      backgroundColor: '#f0f0f0',
      position: 'relative',
      justifyContent: 'center', // لتوسيط المحتوى عموديًا
      alignItems: 'center',     // لتوسيط المحتوى أفقيًا
    },
    coverImagePlaceholder: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    
    coverImagePlaceholderText: {
      fontSize: 18,
      color: '#888',
      textAlign: 'center',
    },
    
    coverImage: {
      width: '100%',
      height: '100%',
    },
    
    coverImageOverlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 3,
      backgroundColor:'black', // لون رمادي مع شفافية بسيطة
    },
    
      profileImageWrapper: {
        position: 'absolute',
        right: width * 0.35, // تخصيص المسافة بناءً على ارتفاع الشاشة
        top: height * -0.04, // تخصيص المسافة بناءً على ارتفاع الشاشة
      },
      fullName:{
        right: width * 0.21, // تخصيص المسافة بناءً على ارتفاع الشاشة
        top: height * -0.003, // تخصيص المسافة بناءً على ارتفاع الشاشة
        fontSize: 20,
        fontWeight: 'bold',
      },
      userName:{
        right: width * 0.21, // تخصيص المسافة بناءً على ارتفاع الشاشة
        top: height * -0.01, // تخصيص المسافة بناءً على ارتفاع الشاشة
        fontSize: 14,color:firstColor,fontWeight:'bold',
      },
      profileImageContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        overflow: 'hidden',
        borderWidth: 2,
      },
      profileImage: {
        width: '100%',
        height: '100%',
      },
      editIcon: {
        position: 'absolute',
        top: height * 0.25, // تعديل الموقع بناءً على ارتفاع الشاشة
        right: 10,
        borderRadius: 25,
        padding: 5,
      },
      githubEditWrapper: {
        position: 'absolute',
        top: height * 0.39, // تخصيص الموقع بناءً على الشاشة
        right: 20,
        flexDirection: 'row',
        alignItems: 'center',
      },
      githubInput: {
        position: 'absolute',
        backgroundColor: '#f0f0f0',
        padding: 5,
        borderRadius: 5,    
        top: height * -0.02, // تعديل الموقع بناءً على ارتفاع الشاشة
        right:width *0.22,
        width: 150,height:30,
        marginRight: 10,  height:30, 
      },
      saveButton: {
        position: 'absolute',
        backgroundColor: '#000',
        padding: 5,    
        top: height * -0.02, // تعديل الموقع بناءً على ارتفاع الشاشة
        right:width *0.13,height:30,
        borderRadius: 5,
      },
      saveButtonText: {
        color: '#fff',
      },
      githubIcon: {
        position: 'absolute',
        top: height * 0.37, // تعديل الموقع بناءً على ارتفاع الشاشة
        right:width *0.61,
      },
      bioWrapper: {
        marginTop: 20,
        alignItems: 'flex-start',
        paddingHorizontal: 20,
      },
      bioTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 5,
      },
      bioText: {
        fontSize: 16,
        color: '#000',
        marginBottom: 10,
      },
      modalContent: {
        width: '80%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
      },
      bioWrapper: {
        padding: 15,
      },
      section: {
        marginBottom: 10,
      },
      bioTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
      },
      bioText: {
        fontSize: 16,
        color: '#555',
        lineHeight: 22,
      },
      divider: {
        height: 1,
        backgroundColor: '#ddd',
        marginVertical: 10,
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
      menuContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 20,
      },
      menuItem: {
        backgroundColor: '#C99FA9',
        padding: 15,
        borderRadius: 25,
        width: '22%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
      },
      menuText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
      },
      tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
      },
      tabButton: {
        alignItems: 'center',
        paddingVertical: 10,
        width: '25%',
      },
      tabText: {
        fontSize: 18,
        fontWeight: 'bold',
      },
      activeTabText: {
        color: '#fff',
      },
      activeIndicator: {
        width: '86%',
        height:4,
        borderRadius: 5,
        backgroundColor: fourhColor,
      },
      content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        backgroundColor: '#fff',
      },
      tabContent: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
      },
      card: {
        backgroundColor: '#ffffff',
        padding: 15,
        marginBottom: 15,
        borderRadius: 8,
      },
      cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
      },
      modalContainer: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center'
      },
      modalContent: {
        width: '90%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 5,borderWidth: 1,
        borderColor: Colors.fourhColor,
      },
      modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
      },
      input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 15,
        paddingLeft: 10,
        borderRadius: 5,
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
    closeButton: {
      backgroundColor: fourhColor,
      padding: 10,
      borderRadius: 5,
      width: '45%',
      alignItems: 'center',
    },
    experienceItem: {
      marginBottom: 15,
    },
    experienceTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
    },
    experienceDescription: {
      fontSize: 14,
      color: '#666',
    },
    experienceDate: {
      fontSize: 12,
      color: '#888',
    },
    showAllButton: {
      marginTop: 10,
      padding: 10,
      backgroundColor: fourhColor ,
      borderRadius: 5,
      alignItems: 'center',
    },
    showAllButtonText: {
      color: '#fff',
      fontSize: 16,
    },
    experienceItem: {
      marginTop:10,
      padding: 15,
      borderRadius: 8,
      borderColor: fifthColor,
      borderWidth: 1,
    },
    experienceTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
    },
    experienceDescription: {
      fontSize: 14,
      color: '#666',
      marginVertical: 5,
    },
    experienceDate: {
      fontSize: 12,
      color: '#777',
      marginBottom: 5,
    },
    experienceStatus: {
      fontSize: 14,
      fontWeight: 'bold',
    }, divider2: {
      borderBottomWidth: 1,
      borderColor: '#eee',
      marginTop: 10,
    },  experienceHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    editButton:{
      position: 'absolute',
      right: 0, /* موقع الأيقونة من اليمين */
      cursor: 'pointer',
    },
    deleteButton:{
      position: 'absolute',
      right: 25, /* موقع الأيقونة من اليمين */
      cursor: 'pointer',
    },
    switchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginVertical: 10,
      paddingHorizontal: 20,
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',  // يمكنك تعديل اللون حسب الوضع الليلي أو النهاري
    },
    input: {
      height: 40,
      borderColor: '#ccc',
      borderWidth: 1,
      marginVertical: 10,
      paddingHorizontal: 10,
      borderRadius: 5,
    },
    switchButton: {
      marginLeft: 10,
    },
    linkContainer: {
      marginTop: 10,
    },
    linkText: {
      color: 'blue',
      textDecorationLine: 'underline',
      fontSize: 14,
    },
    certImage: {
      width: '100%',
      height: 150,
      resizeMode: 'contain',
      marginTop: 10,
    },
    experienceDate: {
      fontSize: 12,
      marginTop: 5,
    },
    certImage: {
      width: 60,
      height: 60,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: Colors.primary, // تغيير اللون كما يناسبك
      marginRight: 10,
      resizeMode: 'cover',
    },
    linkContainer: {
      marginTop: 5,
    },
    linkText: {
      color: Colors.primary,
      textDecorationLine: 'underline',
    },
    
    closeButtonimg: {
      position: 'absolute',
      left: '100%', // لتوسيط الزر
      top:'25%',
      transform:  [{ translateX: -20 }], // تعويض الحجم لتوسيطه بشكل دقيق
      zIndex: 10, // التأكد من أن الزر سيكون في المقدمة
    },
    switchButton: {
        marginVertical: 10,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
      },
      switchButtonText: {
        color: '#007BFF',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: 'bold',
      },
    
      addLinkButton: {
        padding:  10,
        backgroundColor: '#28a745',
        borderRadius: 5,
        marginTop: 10,
      },
      addLinkButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
      },
    
      buttonText:{
        padding:  7,
        backgroundColor: fourhColor ,
        borderRadius: 10,
        marginTop: 10,
      },  pickerContainer: {
        borderRadius: 10,
        padding: 10,
      },
      pickerItem: {
        fontSize: 16,
      },
      languageListContainer: {
        maxHeight: 200, // تحديد ارتفاع ثابت فقط لقائمة اللغات
        padding: 10,
        borderRadius: 10,
        marginTop: 10,
      },
      selectedLanguagesText: {
        fontSize: 16,
        marginTop: 10,
      },
      scrollableItemsContainer: {
      flex:1
      },
     
      
});


