import React, { useEffect,useState, useContext } from 'react';
import { View, Text, Image, TouchableOpacity,TextInput, StyleSheet, FlatList,ScrollView, Animated, Button, Alert, Platform } from 'react-native';
import { Ionicons, Feather, FontAwesome5, EvilIcons, FontAwesome,MaterialIcons
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
// Color constants
const { secondary, primary, careysPink, darkLight, fourhColor, tertiary, fifthColor,firstColor } = Colors;
const { width, height } = Dimensions.get('window');


export default function ProfilePage ({ navigation}) {

    const nav = useNavigation();
    const { isNightMode, toggleNightMode } = useContext(NightModeContext);
    const [scrollY] = useState(new Animated.Value(0));
    const [uploadType, setUploadType] = useState('link'); // "link" أو "image"
    const [image, setImage] = useState(null); // لتخزين الصورة
    const [showPosts, setShowPosts] = useState(false);

    const [languages, setLanguages] = useState([]);  // لتخزين اللغات المسترجعة من الـ API
  const [selectedLanguages, setSelectedLanguages] = useState([]);  // لتخزين اللغات المختارة
  const [modalVisible, setModalVisible] = useState(false);  // لإظهار/إخفاء النافذة المنبثقة

    

    const [skill, setSkill] = useState(''); // لتخزين المهارة الحالية
    const [skillsList, setSkillsList] = useState([]); // قائمة المهارات

    // وظيفة لإضافة المهارة للقائمة
    const addSkill = () => {
        if (skill.trim()) {
            setSkillsList([...skillsList, skill]); // إضافة المهارة
            setSkill(''); // مسح حقل الإدخال
        }
    };


    const [githubLink, setGithubLink] = useState(''); // لحفظ الرابط الذي يُدخله المستخدم  
    const [isEditing, setIsEditing] = useState(false); // حالة للتحكم في إظهار/إخفاء الإدخال



    // Load custom fonts
    const bottomBarTranslate = scrollY.interpolate({
        inputRange: [0, 50],
        outputRange: [0, 100], // 100 to move it off-screen
        extrapolate: 'clamp',
    });


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
    console.log("sama");
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
     console.log('ProfileData:',data );
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

     console.log("Hi",FullName, bio, about, userName, location, CoverImage, profileImage);
     
     } catch (error) {
       console.error('Error fetching ProfileData:', error);
   }
   finally {
     setIsLoading(false);
   }
  };


  const handleUpdateProfile = async (values) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.error('Token not found');
        return;
      }
  
      // إعداد البيانات باستخدام FormData
      const formData = new FormData();
  
      // إضافة الحقول النصية
      formData.append('Bio', newbio);
      formData.append('Location', newlocation);
      formData.append('About', newabout);
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
  
      console.log('Sending updated profile data:', formData);
  
      const response = await fetch(`${baseUrl}/user/updateprofile`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Wasan__${token}`,
        },
        body: formData, // إرسال البيانات كـ FormData
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
      }
  
      const data = await response.json();
      console.log('User profile updated successfully:', data);
  
      // تحديث البيانات في الواجهة الأمامية
      setAbout(data.user.About);
      seUserName(data.user.UserName);
      setBio(data.user.Bio);
      setLocation(data.user.Location);
      setProfileimage(data.user.PictureProfile?.secure_url || '');
      setCoverimage(data.user.CoverImage?.secure_url || '');
      console.log('User profile updated successfully:', data);
      Alert.alert('Profile updated successfully.');
  
      // إرسال التحديث عبر socket بعد نجاح التحديث
      socket.emit('profileUpdated', data.user); // إرسال التحديث للسيرفر
  
    } catch (error) {
      console.error('Error updating profile:', error.message);
      setMenuVisible(true);
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
      console.log('User profile Created successfully:', data);
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
  

  
  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access the media library is required!');
    }
  };

  
  // دالة لتحميل اللغات المختارة من AsyncStorage
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

// دالة لحفظ اللغات المختارة في AsyncStorage
const saveSelectedLanguages = async (languages) => {
  try {
    await AsyncStorage.setItem('selectedLanguages', JSON.stringify(languages)); // حفظ البيانات
  } catch (error) {
    console.error('Error saving selected languages to AsyncStorage:', error);
  }
};

// دالة لاسترجاع اللغات من الـ API
const handleGetLanguages = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken'); // استرجاع التوكن
    if (!token) {
      console.error('Token not found');
      return;
    }

    const response = await fetch(`${baseUrl}/externalapi/getlanguages`, {
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
    setLanguages(data.languages); // تخزين اللغات في الحالة

    // (اختياري) طباعة اللغات للتحقق أثناء التطوير
    console.log('Fetched languages:', data.languages);
  } catch (error) {
    console.error('Error fetching languages:', error.message);
  }
};

// دالة لإضافة أو إزالة اللغة المختارة
const handleLanguageSelect = (language) => {
  setSelectedLanguages((prevSelectedLanguages) => {
    const newSelectedLanguages = prevSelectedLanguages.some((l) => l.id === language.id)
      ? prevSelectedLanguages.filter((l) => l.id !== language.id) // إزالة اللغة إذا كانت موجودة
      : [...prevSelectedLanguages, language]; // إضافة اللغة الجديدة
    saveSelectedLanguages(newSelectedLanguages); // حفظ التغييرات في AsyncStorage
    return newSelectedLanguages;
  });
};

// دالة لحذف اللغة
const handleDeleteLanguage = (languageId) => {
  setSelectedLanguages((prevSelectedLanguages) => {
    const updatedLanguages = prevSelectedLanguages.filter((l) => l.id !== languageId);
    saveSelectedLanguages(updatedLanguages); // تحديث AsyncStorage
    return updatedLanguages;
  });
};

// دالة لفتح النافذة المنبثقة واسترجاع اللغات من API
const handleOpenModal = () => {
  handleGetLanguages(); // استرجاع اللغات
  setModalVisible(true); // إظهار النافذة
};

// تحميل اللغات المختارة عند تحميل الصفحة
useEffect(() => {
  loadSelectedLanguages();
}, []);


useEffect(() => {
  handleViewProfile(); 
  requestPermission();
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
    onPress={() => nav.navigate('notifications')}>
            <Ionicons  name="notifications" size={20} color= {isNightMode ? primary : "#000"} />
    </TouchableOpacity>
    <TouchableOpacity onPress={toggleNightMode} style={{ marginRight:100 }}>
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
    onPress={() => nav.navigate('notifications')}>
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





        {/* أزرار البوستات والتعليقات */}
        <View
  style={{
    flexDirection: 'row',
    flexWrap: 'wrap', // السماح بالتفاف العناصر
    justifyContent: 'center',
    width: '100%',
    marginTop: 30,
    marginBottom: 20,
  }}
>
  {/* زر الرسائل */}
  <TouchableOpacity
    onPress={() => console.log('Go to Messages')}
    style={{
      backgroundColor: '#C99FA9',
      padding: 15,
      borderRadius: 25,
      alignItems: 'center',
      justifyContent: 'center',
      width: '45%', // عرض الزر 45% لتوفير مساحة للزر الآخر
      margin: 10, // إضافة مسافة بين الأزرار
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
    }}
  >
    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#000' }}>Message</Text>
  </TouchableOpacity>

  {/* زر الطلبات */}
  <TouchableOpacity
    onPress={() => console.log('Go to Connect')}
    style={{
      backgroundColor: '#C99FA9',
      padding: 15,
      borderRadius: 25,
      alignItems: 'center',
      justifyContent: 'center',
      width: '45%',
      margin: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
    }}
  >
    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#000' }}>Connect</Text>
  </TouchableOpacity>

  {/* زر البوستات */}
  {/* زر Posts */}
  <TouchableOpacity
      //  onPress={handelGetUserPosts} // استدعاء الدالة عند الضغط على الزر
        style={{
          backgroundColor: '#C99FA9',
          padding: 15,
          borderRadius: 25,
          alignItems: 'center',
          justifyContent: 'center',
          width: '45%',
          margin: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 5,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#000' }}>Posts</Text>
      </TouchableOpacity>

      {/* عرض مؤشر تحميل عند جلب البيانات */}
      {isLoading && <ActivityIndicator size="large" color="#C99FA9" />}

      {/* عرض البوستات إذا كانت الحالة showPosts تساوي true */}
      {showPosts && ownpost && Array.isArray(ownpost) && ownpost.length > 0 ? (
        ownpost.map((post, index) => (
          <View
            key={index}
            style={{
              backgroundColor: '#f9f9f9',
              padding: 15,
              borderRadius: 10,
              margin: 10,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
            }}
          >
            <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>{post.UserId}</Text>
            <Text>{post.Body}</Text>
            {post.Images && post.Images.length > 0 && (
              <Image
                source={{ uri: post.Images[0].secure_url }}
                style={{ width: '100%', height: 200, marginTop: 10 }}
              />
            )}
          </View>
        ))
      ) : showPosts && !isLoading ? (
        <Text>No posts available.</Text>
      ) : null}

      {/* عرض البوستات إذا كانت الحالة true */}
      {showPosts && ownpost && Array.isArray(ownpost) && ownpost.length > 0 ? (
        ownpost.map((post, index) => (
          <View
            key={index}
            style={
              Platform.OS === 'web'
                ? {
                    marginTop: 30,
                    width: isSidebarVisible ? '50%' : '50%',
                    marginLeft: isSidebarVisible ? '35%' : 0,
                  }
                : { width: '100%', alignItems: 'center', marginBottom: 10 }
            }
          >
            <View
              style={{
                backgroundColor: isNightMode ? '#454545' : secondary,
                padding: 10,
                borderRadius: 15,
                width: '95%',
                boxShadow: Platform.OS === 'web' ? '0 4px 10px rgba(0,0,0,0.1)' : undefined,
                margin: 10,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                <Image
                  source={{ uri: post.ProfilePicture }}
                  style={{
                    width: Platform.OS === 'web' ? 80 : 40,
                    height: Platform.OS === 'web' ? 80 : 40,
                    borderRadius: Platform.OS === 'web' ? 40 : 25,
                    marginRight: 10,
                    objectFit: 'cover',
                  }}
                />
                <View>
                  <Text style={{ color: isNightMode ? primary : '#000', fontWeight: 'bold', fontSize: 16 }}>
                    {post.UserId}
                  </Text>
                  <Text style={{ color: darkLight, fontSize: 12 }}>
                    {new Date(post.createdAt).toLocaleString()}
                  </Text>
                </View>
              </View>

              <Text style={{ color: isNightMode ? primary : '#000', padding: 15 }}>{post.Body}</Text>

              {post.Images && post.Images.length > 0 && (
                <Image
                  source={{ uri: post.Images[0].secure_url }}
                  style={{
                    width: Platform.OS === 'web' ? '90%' : '100%',
                    height: Platform.OS === 'web' ? 500 : 320,
                    alignSelf: 'center',
                  }}
                />
              )}
            </View>
          </View>
        ))
      ) : (
        showPosts && <Text>No posts available.</Text> // عرض رسالة في حال عدم وجود بوستات
      )}
          
  {/* زر التعليقات */}
  <TouchableOpacity
    onPress={() => console.log('Go to Comments')}
    style={{
      backgroundColor: '#C99FA9',
      padding: 15,
      borderRadius: 25,
      alignItems: 'center',
      justifyContent: 'center',
      width: '45%',
      margin: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
    }}
  >
    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#000' }}>Comments</Text>
  </TouchableOpacity>
</View>


                  

              {/* 1- Card Add Experince*/}
              <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Add Experience</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                onPress={() => console.log('Add Experience')}
                style={styles.smallButton}
              >
                <Text style={styles.smallButtonText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => console.log('Edit Experience')}
                style={styles.smallButton}
              >
                <Text style={styles.smallButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TextInput
            placeholder="Institution Name"
            placeholderTextColor="#888"
            style={styles.input}
          />
          <TextInput
            placeholder="Job Title"
            placeholderTextColor="#888"
            style={styles.input}
          />
          <TextInput
            placeholder="Duration (e.g., 2 years)"
            placeholderTextColor="#888"
            style={styles.input}
          />
        </View>
              {/* 1- Card Add Eduction*/}
              <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Add Eduction</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                onPress={() => console.log('Add Eduction')}
                style={styles.smallButton}
              >
                <Text style={styles.smallButtonText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => console.log('Edit Eduction')}
                style={styles.smallButton}
              >
                <Text style={styles.smallButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TextInput
            placeholder="University Name"
            placeholderTextColor="#888"
            style={styles.input}
          />
          <TextInput
            placeholder="Degree"
            placeholderTextColor="#888"
            style={styles.input}
          />
          <TextInput
            placeholder="Field Of Study"
            placeholderTextColor="#888"
            style={styles.input}
          />
        </View>

         {/* 3- Card Add Certification*/}
         <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Add Certification</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            onPress={() => console.log('Add Certification')}
            style={styles.smallButton}
          >
            <Text style={styles.smallButtonText}>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => console.log('Edit Certification')}
            style={styles.smallButton}
          >
            <Text style={styles.smallButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Title */}
      <TextInput
        placeholder="Certificate Title"
        placeholderTextColor="#888"
        style={styles.input}
      />
      {/* Issuing Organization */}
      <TextInput
        placeholder="Issuing Organization"
        placeholderTextColor="#888"
        style={styles.input}
      />
      {/* Issue Date */}
      <TextInput
        placeholder="Issue Date (e.g., 01/2024)"
        placeholderTextColor="#888"
        style={styles.input}
      />
      {/* Expiration Date */}
      <TextInput
        placeholder="Expiration Date (optional)"
        placeholderTextColor="#888"
        style={styles.input}
      />

      {/* Credential Options */}
      <View style={styles.switchContainer}>
        <TouchableOpacity
          onPress={() => setUploadType('link')}
          style={[
            styles.switchButton,
            uploadType === 'link' && styles.activeSwitchButton,
          ]}
        >
          <Text style={uploadType === 'link' ? styles.activeSwitchText : styles.switchText}>
            Link
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setUploadType('image')}
          style={[
            styles.switchButton,
            uploadType === 'image' && styles.activeSwitchButton,
          ]}
        >
          <Text style={uploadType === 'image' ? styles.activeSwitchText : styles.switchText}>
            Upload Image
          </Text>
        </TouchableOpacity>
      </View>

      {uploadType === 'link' ? (
        <TextInput
          placeholder="Credential URL"
          placeholderTextColor="#888"
          style={styles.input}
        />
      ) : (
        <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
          <Text style={styles.uploadButtonText}>Choose Image</Text>
        </TouchableOpacity>
      )}

      {image && (
        <Image source={{ uri: image }} style={styles.previewImage} />
      )}
    </View>
       

       {/* 4- Card Add Projects*/}
       <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Add Projects</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            onPress={() => console.log('Add Projects')}
            style={styles.smallButton}
          >
            <Text style={styles.smallButtonText}>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => console.log('Edit Projects')}
            style={styles.smallButton}
          >
            <Text style={styles.smallButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Title */}
      <TextInput
        placeholder="Projects Title"
        placeholderTextColor="#888"
        style={styles.input}
      />
      <TextInput
        placeholder="Projects Discription"
        placeholderTextColor="#888"
        style={styles.input}
      />

      {/* Projects Options */}
      <View style={styles.switchContainer}>
        <TouchableOpacity
          onPress={() => setUploadType('link')}
          style={[
            styles.switchButton,
            uploadType === 'link' && styles.activeSwitchButton,
          ]}
        >
          <Text style={uploadType === 'link' ? styles.activeSwitchText : styles.switchText}>
            Link
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setUploadType('image')}
          style={[
            styles.switchButton,
            uploadType === 'image' && styles.activeSwitchButton,
          ]}
        >
          <Text style={uploadType === 'image' ? styles.activeSwitchText : styles.switchText}>
            Upload Image
          </Text>
        </TouchableOpacity>
      </View>

      {uploadType === 'link' ? (
        <TextInput
          placeholder="Projects URL"
          placeholderTextColor="#888"
          style={styles.input}
        />
      ) : (
        <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
          <Text style={styles.uploadButtonText}>Choose Image</Text>
        </TouchableOpacity>
      )}

      {image && (
        <Image source={{ uri: image }} style={styles.previewImage} />
      )}
    </View>
                         {/* Add Skills */}
                         <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Add Skills</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                onPress={() => console.log('Add Skills')}
                style={styles.smallButton}
              >
                <Text style={styles.smallButtonText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity
            onPress={() => console.log('Delete Skills')}
            style={styles.smallButton}
          >
            <Text style={styles.smallButtonText}>Delete</Text>
          </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity>
                    <Text style={styles.input}>{ "Add Skills"}</Text>
                </TouchableOpacity>
        </View>



              {/* Add Language */}
              <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Add Language</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity onPress={handleOpenModal} style={styles.smallButton}>
            <Text style={styles.smallButtonText}>Select Languages</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* عرض اللغات المختارة */}
      <View style={styles.selectedLanguagesContainer}>
        {selectedLanguages.map((language, index) => (
          <View style={[styles.languageItem, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
  <Text style={styles.selectedLanguageText}>{language.name}</Text>
  <TouchableOpacity
    onPress={() => handleDeleteLanguage(language.id)} // حذف اللغة
    style={styles.deleteButton}
  >
    <Text style={styles.deleteButtonText}>X</Text>
  </TouchableOpacity>
</View>

        ))}
      </View>

      {/* النافذة المنبثقة لاختيار اللغات */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Languages</Text>

            <FlatList
              data={languages}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleLanguageSelect(item)} // اختيار اللغة
                  style={styles.languageItem}
                >
                  <Text style={styles.languageName}>{item.name}</Text>
                  {selectedLanguages.some((l) => l.id === item.id) && (
                    <Text style={styles.selectedText}>Selected</Text>
                  )}
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              onPress={() => setModalVisible(false)} // إغلاق النافذة
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>

         {/* Add Recommendation */}
         <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Add Recommendation</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                onPress={() => console.log('Add Recommendation')}
                style={styles.smallButton}
              >
                <Text style={styles.smallButtonText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity
            onPress={() => console.log('Delete Recommendation')}
            style={styles.smallButton}
          >
            <Text style={styles.smallButtonText}>Delete</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => console.log('Edit Recommendation')}
            style={styles.smallButton}
          >
            <Text style={styles.smallButtonText}>Edit</Text>
          </TouchableOpacity>
              
            </View>
          </View>

          <TextInput
        placeholder="Add Recommendation"
        placeholderTextColor="#888"
        style={styles.input}
      />
                   
               
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
                    width: '100%', 
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
                <TouchableOpacity onPress={toggleNightMode}>
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
    

        </View>
    );
};

    

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#CAC5D8',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
    marginVertical: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  smallButton: {
    backgroundColor: '#C99FA9',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginLeft: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // خلفية شفافة
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
  selectedLanguagesContainer: {
    marginTop: 16,
  },
  selectedLanguageText: {
    fontSize: 16,
    color: '#000',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  languageItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  languageName: {
    fontSize: 16,
  },
  selectedText: {
    color: 'green',
    fontSize: 14,
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: '#C99FA9',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
  },
  deleteButton: {
    backgroundColor: '#C99FA9',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  
  deleteButtonText: {
    fontSize: 12,
    color: '#FFF',
    fontWeight: 'bold',
  },
  
  
});


