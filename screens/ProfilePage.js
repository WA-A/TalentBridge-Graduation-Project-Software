import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Image, Pressable, TouchableOpacity, TextInput, StyleSheet, Switch, FlatList, ScrollView, Animated, Button, Alert, Platform } from 'react-native';
import {
  Ionicons, Feather, FontAwesome5, EvilIcons, FontAwesome, MaterialIcons, MaterialCommunityIcons, Entypo

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
import * as Animatable from "react-native-animatable";
import { jwtDecode } from "jwt-decode";
import { Video as ExpoVideo } from 'expo-av';
import * as MediaLibrary from 'expo-media-library';
import moment from 'moment';
import { decode as atob } from 'base-64'; // إذا كنت تستخدم React Native

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

import * as WebBrowser from 'expo-web-browser'

import * as FileSystem from 'expo-file-system';
import Video from 'react-native-video';
//import * as Linking from 'expo-linking';


// Color constants
const { secondary, primary, careysPink, darkLight, fourhColor, tertiary, fifthColor, firstColor } = Colors;
const { width, height } = Dimensions.get('window');


export default function ProfilePage({ navigation }) {

  const [skillsRecommendation, setSkillsRecommendation] = useState([]);
  const [showAllRecommendations, setShowAllRecommendations] = useState(false);

  const handleShowAllRecommendations = () => {
    setShowAllRecommendations(true);
  };

  const handleHideRecommendations = () => {
    setShowAllRecommendations(false);
  };
  
  const handleShowAllSkillsRec = () => {
    setShowAllSkills(true);
  };
  const handleHideSkillsRec = () => {
    setShowAllSkills(false);
  };
  
    
/////////
 const [likedPosts, setLikedPosts] = useState({});

  const handleLike = (postId) => {
    setLikedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));

    toggleLike(postId); // استدعاء الدالة الأصلية لتحديث البيانات في الخادم.
  };


  const [posts, setPosts] = useState([]);
///////////////Comment /////////////////
const [isEditing, setIsEditing] = useState(false);
const [editingCommentId, setEditingCommentId] = useState(null); // ID التعليق الجاري تعديله
const [editingImage, setEditingImage] = useState(null); // صورة التعليق الجاري تعديله
const [isedit,setisedt]=useState(false);
const editCommentHandler = (commentId, text, images) => {
  setIsEditing(true);
  setEditingCommentId(commentId);

  // إعداد النص الحالي
  setNewCommentText(text || '');

  // إعداد الصور الحالية
  if (images && images.length > 0 && images[0].secure_url) {
    setImageUriComment(images);
    setEditingImage(images[0].secure_url);
  } else {
    setImageUriComment(null);
    setEditingImage(null);
  }
};
const removeimgcomment =()=>{
setImageUriComment(null);
setEditingImage(null);
}
const cancelEditHandler = () => {
  setIsEditing(false);
  setEditingCommentId(null);
  setNewCommentText(''); // إعادة تعيين النص
  setImageUriComment(null);  // إعادة تعيين الصورة
  setEditingImage(null);
};
const [imageUriComment, setImageUriComment] = useState('');
const [newCommentText, setNewCommentText] = useState('');
const [imageUriForComment, setImageUriForComment] = useState('');
const [selectedCommentImage, setSelectedCommentImage] = useState(null);

const handleAddComment = () => {
  addCommentHandler();
  setNewCommentText('');
  setImageUriComment(null);  // إعادة تعيين الصورة
  setEditingImage(null);
};


const pickImageComment = async () => {
  try {
    // طلب إذن الوصول إلى مكتبة الصور
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission required', 'You need to grant permission to access the gallery.');
      return;
    }
    let result ;
    // اختيار صورة
     result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [8, 5],
          quality: 1,
        });
    if (!result.canceled) {
      const selectedImage = result.assets[0];
      setEditingImage(selectedImage.uri);
      setImageUriComment(selectedImage.uri); // فقط URI هنا
      setisedt(true);
      console.log('Selected image URI:', selectedImage.uri);
    }
  } catch (error) {
    console.log('Error picking image: ', error);
  }
};

const [isCommentModal,setCommenModal] = useState (false);
const [commentPost, setCommentPosts]=useState([]);
const [postIdForComment,setPostIdForComment]=useState([]);

const handleCommentPress = () => {
  setCommenModal(true); // إظهار المودال عند الضغط على تعليق
};

const handleCloseModal = () => {
  setCommenModal(false); // إغلاق المودال
};
const toggleModalComment = () =>setCommenModal(!isCommentModal);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [imageUri, setImageUri] = useState('');

    // دالة لإضافة تعليق جديد
    const addComment = () => {
      if (newComment.trim()) {
        const newComments = [
          ...comments,
          { text: newComment, user: 'User', image: imageUri },
        ];
        setComments(newComments);  // إضافة التعليق الجديد
        setNewComment('');
        setImageUriComment('');
      }
    };

    const updateMyComment = async (CommentId) => {
   //   console.log("f", newCommentText, imageUriComment);
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          console.error('Token not found');
          return;
        }
    
        const formData = new FormData();
    
        // إضافة النص إذا كان موجودًا
        if (newCommentText && newCommentText.trim() !== '') {
          formData.append('Text', newCommentText);
        }
    
        // إضافة الصورة إذا كانت موجودة
        if (imageUriComment) {
          if (isedit) {
            if (Platform.OS === 'web') {
              const profileBlob = base64ToBlob(imageUriComment, 'image/jpeg');
              formData.append('images', profileBlob, 'images.jpg');
            } else {
              formData.append('images', {
                uri: imageUriComment,
                type: 'image/jpeg',
                name: 'image.jpg',
              });
            }
          } else {
            // إذا لم يكن هناك تعديل في الصورة (لكن الصورة موجودة بالفعل)، أرسل الرابط
            console.log("no image edit, sending existing image URI",imageUriComment);
            const existingImage = imageUriComment; // الحصول على صورة موجودة
            if (existingImage) {
              formData.append('images',imageUriComment);
        //      console.log("dd",formData.images);

                      }          }
        }
    
        // طباعة `FormData` للتأكد
        formData.forEach((value, key) => {
          console.log(`${key}:`, value);
        });
    
        const response = await fetch(`${baseUrl}/comment/updatecomment/${CommentId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Wasan__${token}`,
          },
          body: formData,
        });
    
        if (!response.ok) {
          throw new Error('Failed to update comment');
        }
    
        const userData = await response.json();
    
        if (!userData.comment) {
          console.error('Missing comment field in response:', userData);
          throw new Error('Comment data not returned from server');
        }
    
        console.log('Comment updated successfully:', userData);
    
        // تحديث البيانات المحلية
        setImageUri(userData.comment.Images?.[0]?.secure_url || null);
        setNewCommentText(userData.comment.Text || '');
        setEditingImage(null);
        handleGetAllPostsComment(postIdForComment);
        cancelEditHandler();
        setisedt(false);
      } catch (error) {
        console.error('Error updating comment:', error);
      }
    };


    const addTokendevice = async () => {
    try {
      const deviceToken = await AsyncStorage.getItem('expoPushToken');
      if (!deviceToken) {
        console.log('no Token found:',deviceToken );
        return ;
      } 
        // التأكد من تحويل deviceToken إلى سترينغ
        const tokenString = String(deviceToken);

        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
            console.error('Token not found');
            return;
        }

        // إرسال بيانات التوكن إلى السيرفر
        const response = await fetch(`${baseUrl}/user/addDeviceToken`, {
            method: 'POST',
            headers: {
                'Authorization': `Wasan__${token}`, // المصادقة باستخدام التوكن
                'Content-Type': 'application/json', // تحديد نوع البيانات المرسلة
            },
            body: JSON.stringify({deviceToken:tokenString}), // إرسال deviceToken كسترينغ
        });

        if (!response.ok) {
            throw new Error('Failed to add deviceToken');
        }

        // الحصول على بيانات الاستجابة
        const userData = await response.json();
        console.log('deviceToken added successfully:', userData);
    } catch (error) {
        console.error('Error adding DeviceToken:', error.message);
    }
};


const sendPushNotification = async (expoPushToken) => {
      const message = {
        to: expoPushToken,
        sound: 'default',
        title: 'Original Title',
        body: 'And here is the body!',
        data: { someData: 'goes here' },
      };
    
      await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });
    }; 
    
//////delete Comment ///////////////////////
const handleDeleteComments = async (CommentId) => {
  console.log(CommentId);
  try {
    const token = await AsyncStorage.getItem('userToken'); // استرجاع التوكن
    if (!token) {
      console.error('Token not found');
      return;
    }
    const response = await fetch(`${baseUrl}/comment/deletecomment/${CommentId}`, { // تأكد من المسار الصحيح
      method: 'DELETE',  // طريقة الحذف يجب أن تكون DELETE
      headers: {
        'Authorization': `Wasan__${token}`, // تضمين التوكن في الهيدر
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json(); // إذا كان هناك خطأ في الرد
      throw new Error(errorData.message || 'Failed to delete language');
    }
    handleGetAllPostsComment(postIdForComment);
    console.log('delete comment'); // تحقق من البيانات
  } catch (error) {
    console.error('Error deleting commen:', error.message);
  }
};


const handleDeleteApp = async (CommentId) => {
  console.log(CommentId);
  try {
    const token = await AsyncStorage.getItem('userToken'); // استرجاع التوكن
    if (!token) {
      console.error('Token not found');
      return;
    }
    const response = await fetch(`${baseUrl}/applicationtrain/deleteApplication/${CommentId}`, { // تأكد من المسار الصحيح
      method: 'DELETE',  // طريقة الحذف يجب أن تكون DELETE
      headers: {
        'Authorization': `Wasan__${token}`, // تضمين التوكن في الهيدر
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json(); // إذا كان هناك خطأ في الرد
      throw new Error(errorData.message || 'Failed to delete App');
    }
    handlegetPendingRequests();
    console.log('Application deleted successfully');
  } catch (error) {
    console.error('Error deleting App:', error.message);
  }
};

    /////////ddLike/////////
    const toggleLike = async (postIdForComment) => {
      console.log(postIdForComment);
      try {
        // استرجاع التوكن
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          console.error('Token not found');
          return;
        }
    
        // فك تشفير التوكن
        const decodedToken = jwtDecode(token);
        console.log('Decoded Token:', decodedToken);
        const loggedInUserId = decodedToken.id;
    
        if (!loggedInUserId) {
          console.error('Failed to extract userId from token');
          return;
        }
    
        // إرسال طلب toggleLike
        const response = await fetch(`${baseUrl}/notification/toggleLike`, {
          method: 'POST',
          headers: {
            'Authorization': `Wasan__${token}`,
            'Content-Type': 'application/json', // تأكد من إضافة Content-Type
          },
          body: JSON.stringify({
            userId: loggedInUserId,
            postId: postIdForComment,
          }),
        });
    
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Something went wrong');
        }
    
        console.log('Toggle like successful',loggedInUserId,postIdForComment);
        handleGetAllPosts(); 
      } catch (error) {
        console.error('Error in toggleLike:', error);
      }
    };
    
//////////////////Add new Comment///////////


const addCommentHandler = async () => {
  try {
    // استرجاع التوكن
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      console.error('Token not found');
      return;
    }

    // فك تشفير التوكن باستخدام jwt-decode
    const decodedToken = jwtDecode(token);
    console.log('Decoded Token:', decodedToken);
    const loggedInUserId = decodedToken.id; // تأكد أن `userId` موجود في التوكن

    if (!loggedInUserId) {
      console.error('Failed to extract userId from token');
      return;
    }

    console.log('Logged-in User ID:', loggedInUserId);

    // إعداد البيانات باستخدام FormData
    const formData = new FormData();
    formData.append('Text', newCommentText);

    if (editingImage) {
      if (Platform.OS === 'web') {
        const profileBlob = base64ToBlob(imageUriComment, 'image/jpeg');
        formData.append('images', profileBlob, 'images.jpg');
      }
    }

    if (imageUriComment) {
      formData.append('images', {
        uri: imageUriComment,
        type: 'image/jpeg',
        name: 'image.jpg',
      });
    }

    console.log('Sending comment data:', postIdForComment);

    // إرسال التعليق
    const response = await fetch(`${baseUrl}/comment/createcomment/${postIdForComment}`, {
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

    const responseData = await response.json();
  
    console.log('Comment added successfully:', responseData);
    const commentId = responseData.comment._id;
    console.log("comment",commentId);
    // استدعاء دالة إنشاء الإشعار
    await fetch(`${baseUrl}/notification/createCommentNotification`, {
      method: 'POST',
      headers: {
        'Authorization': `Wasan__${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        postId: postIdForComment,
        commentContent: newCommentText,
        userId: loggedInUserId, // تمرير معرف المستخدم
        commentId: commentId,
      }),
    });

    console.log('Notification created successfully');

    // تحديث التعليقات
    handleGetAllPostsComment(postIdForComment);
  } catch (error) {
    console.error('Error in addCommentHandler:', error);
  }
};


//////////////////////////////////////////
  const [currentUserId,setuserId] = useState(''); // أو حسب هيكلة التوكن


    const ActionComment = async(postId) =>{
      setCommentPosts([]);
      handleGetAllPostsComment(postId);
      setCommenModal(true);           // فتح المودال
    };

const handleGetAllPostsComment = async (postId) => {
  setPostIdForComment(postId);    // تخزين ID المنشور
  console.log("Fetching Comments...");
  try {
    const token = await AsyncStorage.getItem('userToken');

    if (!token) {
      throw new Error('No token found');
    }
    
    const decodedToken = jwtDecode(token); // فك التوكن
    setuserId(decodedToken.id); // تخزين معرف المستخدم (id)
    console.log('Decoded Token:', decodedToken); 
    const baseUrl = Platform.OS === 'web'
      ? 'http://localhost:3000'
      : 'http://192.168.1.239:3000' || 'http://192.168.0.107:3000';

    const response = await fetch(`${baseUrl}/comment/getallcomments/${postId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Wasan__${token}`,
      },
    });
    
    console.log('Response:', response); 
    
    if (!response.ok) {
      throw new Error('Failed to fetch comments');
    }

    const data = await response.json();
    console.log('Fetched Comments:', data);

    if (data && Array.isArray(data.comments) && data.comments.length > 0) {
      setCommentPosts(data.comments); // تخزين التعليقات في الحالة
    } else {
      console.log('No comments available.');
    }
  } catch (error) {
    console.error('Error fetching comments:', error);
    alert("Error loading comments. Please try again.");
  } finally {
    setIsLoading(false); // إيقاف التحميل
  }
};
 const saveImageToDevice = async (imageUrl) => {
  try {
      if (Platform.OS === 'web') {
        // منطق خاص بالويب مع اختيار مكان الحفظ
        const response = await fetch(imageUrl);
        const blob = await response.blob();

        const fileHandle = await window.showSaveFilePicker({
          suggestedName: 'image.png',
          types: [
            {
              description: 'Image Files',
              accept: { 'image/png': ['.png'] },
            },
          ],
        });

        const writableStream = await fileHandle.createWritable();
        await writableStream.write(blob);
        await writableStream.close();

        Alert.alert('Success', 'Image has been saved');
      }  else {
          // منطق خاص بالموبايل
          const fileUri = FileSystem.documentDirectory + 'image.png';
          const { uri } = await FileSystem.downloadAsync(imageUrl, fileUri);
  
          const { status } = await MediaLibrary.requestPermissionsAsync();
          if (status === 'granted') {
            const asset = await MediaLibrary.createAssetAsync(uri);
            const album = await MediaLibrary.getAlbumAsync('Expo');
            if (album) {
              await MediaLibrary.addAssetsToAlbumAsync([asset], album.id, false);
            } else {
              await MediaLibrary.createAlbumAsync('Expo', asset, false);
            }
            Alert.alert('Success', 'Image has been saved to gallery');
          } else {
            Alert.alert('Permission Denied', 'We need permission to save the image');
          }
        }
      }  catch (error) {
      Alert.alert('Error', 'There was an error downloading or saving the image');
    } 
  };
 
    const [fileUri, setFileUri] = useState(null);
  

    const openFileInBrowser = async (uri) => {
      if (!uri) {
        Alert.alert('Error', 'Invalid file URL');
        return;
      }
    
      try {
        // إضافة المعامل download إلى الرابط لتنزيل الملف مباشرة
        const downloadUrl = `${uri}?download=true`; 
        await WebBrowser.openBrowserAsync(downloadUrl); // فتح الرابط في المتصفح
      } catch (error) {
        console.log('Error opening file:', error);
        Alert.alert('Error', 'Failed to open file');
      }
    };
    



////////









    // دالة سيتم استدعائها عند الضغط على البطاقة
    const handleCardPress = (requestId) => {
      // يمكنك إضافة الوظائف التي تريدها هنا
      Alert.alert('Request pressed', `Request ID: ${requestId}`);
    };
  const [pendingRequests,setpendingRequests]=useState();

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
  const [newExperiance, setNewExperiance] = useState(
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

  const [newCertification, setNewCertificaion] = useState({
    title: '',
    issuingOrganization: '',
    issueDate: '',
    expirationDate: '',
    credentialType: '',
    certificationImageData: '',
    certificationLinkData: '',
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


  const [showAllCertification, setShowAllCertification] = useState(false); // المتغير الذي يحدد ما إذا كان يجب عرض جميع الشهادات

  // دالة لعرض جميع الشهادات
  const handleShowAllCertification = () => {
    setShowAllCertification(true);
  };

  // دالة لإخفاء الشهادات
  const handleHideCertification = () => {
    setShowAllCertification(false);
  };

  const handleShowAllLanguage = () => {
    setShowAllLanguage(true);
  }
  const handleHideLanguage = () => {
    setShowAllLanguage(false);

  }


  // Load custom fonts
  const bottomBarTranslate = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, 100], // 100 to move it off-screen
    extrapolate: 'clamp',
  });


  const [friendsCount, setFriendsCount] = useState('');
  const [userProgress, setUserProgress] = useState('');
  const [achievements, setAchievements] = useState('');
  const [UniversityName, setUniversityName] = useState('Najah');
  const [Degree, setDegree] = useState('BS');
  const [FieldOfStudy, setFieldOfStudy] = useState('CE');
  const [profileData, setProfileData] = useState(null); // حالة لتخزين بيانات البروفايل
  const [bio, setBio] = useState(''); // لتخزين التعديل على Bio
  const [about, setAbout] = useState(''); // لتخزين التعديل على About
  const [profileImage, setProfileimage] = useState('');
  const [CoverImage, setCoverimage] = useState('');
  const [location, setLocation] = useState('');
  const [FullName, setFullName] = useState('');
  const [userName, seUserName] = useState('');
  const [role, setRole] = useState('');
  const [creativeDegree, setCreativeDegree] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [ownpost, setOwnpost] = useState(null);

  const socket = io('http://192.168.1.239:3000'); // السيرفر المحلي

  //forEditAndCreat
  const [newFullName, setNewFullName] = useState('');
  const [newuserName, setNewUserName] = useState('');
  const [newprofileImage, setnewProfileImage] = useState(null);
  const [newcoverImage, setnewCoverImage] = useState(null);
  const [newbio, setnewBio] = useState('');
  const [newlocation, setnewLocation] = useState('');
  const [newabout, setnewAbout] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false); // متغير لحالة المودال
  const [cancelled, setIsCancled] = useState(false);
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
  const [certification, setCertification] = useState([]);

  const [project, setProject] = useState([]);

  const [recommendation, setRecommendation] = useState([]);


  const sortedExperiences = [...experiences].sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [error, setError] = useState('');

  const [showAllExperiences, setShowAllExperiences] = useState(false);
  const [showAllEducation, setShowAllEducation] = useState(false);
  const [showAlllLanguage, setShowAllLanguage] = useState(false);
  const [showAllSkills, setShowAllSkills] = useState(false);


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
      await addCertification();

    }
    if (currentModal === 'language') {
      await handleAddLanguages();

    }
    if (currentModal === 'skills') {
      await handleAddSkills();

    }
    closeModal();
  };



  const handleEditForEachCard = async () => {
    const { type, ...updatedItem } = selectedItem;  // استخراج الـ type والتواريخ
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
    if (currentModalEditting === 'post') {

      // إذا كان القسم "المشاريع"
      await updatePost(updatedItem);
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
          ...prev, credentialType: 'image',
          certificationImageData: selectedImage.uri,
        }));
      }
    } catch (error) {
      console.log('Error picking image: ', error);
    }
  };


  const cancleEdit = () => {
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
      let result;
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
      let result;
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
          ...prev, credentialType: 'image',
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
  const handlegetPendingRequests = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken'); // الحصول على التوكن من التخزين
      console.log(token);
      if (!token) {
        console.error('Token not found');
        return;
      }

      const response = await fetch(`${baseUrl}/applicationtrain/getPendingRequests`, {
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
      if (data && data.data && data.data.length > 0) {
        console.log("ddddddddddd");
        setpendingRequests(data.data); // تعيين البيانات إذا كانت موجودة
      } else {
        setpendingRequests([]); // تعيين مصفوفة فارغة إذا لم تكن هناك بيانات
      }

    } catch (error) {
    //  console.error('Error fetching ProfileData:', error);
    }
    finally {
      setIsLoading(false);
    }
  };


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
      setRole(data.Role);
      socket.emit('profileUpdated', data.user); // إرسال التحديث للسيرفر


    } catch (error) {
     // console.error('Error fetching ProfileData:', error);
    }
    finally {
      setIsLoading(false);
    }
  };
  const addCertification = async () => {
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
      formData.append('credentialType', newCertification.credentialType);
      formData.append('certificationLinkData', newCertification.certificationLinkData);
      // إضافة صورة البروفايل إذا كانت موجودة
      if (newCertification.certificationImageData) {
        if (Platform.OS === 'web') {
          // استخدام Blob للويب
          const profileBlob = base64ToBlob(newCertification.certificationImageData, 'image/jpeg');
          formData.append('CertificationImage', profileBlob, 'CertificationImage.jpg');
        } else {
          console.log("ss", newCertification.certificationImageData);

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
      getAllCertifications();
    }
    catch (error) {
   //   console.error('Error fetching addCertification:', error);
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
      if (newprofileImage !== profileImage) {
        if (Platform.OS === 'web') {
          const profileBlob = base64ToBlob(newprofileImage, 'image/jpeg');
          formData.append('PictureProfile', profileBlob, 'profile.jpg');
          console.log("saaaaaaaamaaaaaaaaaaaaaaaa", newprofileImage);
        } else {
          formData.append('PictureProfile', {
            uri: newprofileImage,
            type: 'image/jpeg',
            name: 'profile.jpg',
          });
        }
      } else {
        formData.append('PictureProfile', {
          uri: profileImage,
          type: 'image/jpeg',
          name: 'profile.jpg',
        });
      }

      // صورة الغلاف
      if (newcoverImage !== CoverImage) {
        console.log("diffrent Covver", newcoverImage);
        console.log("diffrent Covver", CoverImage);

        if (Platform.OS === 'web') {
          console.log("sama", newcoverImage);
          const coverBlob = base64ToBlob(newcoverImage, 'image/jpeg');
          formData.append('CoverImage', coverBlob, 'cover.jpg');
        } else {
          formData.append('CoverImage', {
            uri: newcoverImage,
            type: 'image/jpeg',
            name: 'cover.jpg',
          });
        }
      } else {

        formData.append('CoverImage', {
          uri: CoverImage,
          type: 'image/jpeg',
          name: 'cover.jpg',
        });
      }

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
      if(userData.experiences===null){
return;
      }
      console.log("theeeeeeeeeeee",experiences);
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
      //  throw new Error('Failed to fetch user Experiences');
      }

      const userData = await response.json();
      if(userData.certifications===null){
        return;
              }
      setCertification(userData.certifications);
      console.log(certification);
     
    } catch (error) {
    //  console.error('Error handling experiamce:', error.message);
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


  const updatePost = async (updatedItem) => {
    console.log("samaaaaaaaaaa",updatedItem._id);
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.error('Token not found');
        return;
      }

      // إعداد البيانات باستخدام FormData
      const formData = new FormData();

      // إضافة الحقول النصية
      formData.append('Body', updatedItem.Body);
     

      console.log("theform", formData);

      // إرسال الطلب باستخدام fetch
      const response = await fetch(`${baseUrl}/post/updatepost/${updatedItem._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Wasan__${token}`,
        },
        body: formData, // إرسال formData مباشرة
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user post');
      }

      if (response.ok) {
        console.log('post updated successfully',response);
        setModalEdittingVisible(false); // إغلاق المودال بعد التحديث
      } else {
        console.error('Failed to update post');
      }
   
      handleGetAllPosts();

    } catch (error) {
      console.error('Error updating certifications:', error);
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
          console.log("ss", selectedItem.certificationImageData);

          // استخدام uri للموبايل
          formData.append('CertificationImage', {
            uri: selectedItem.certificationImageData,
            type: 'image/jpeg',
            name: 'CertificationImage.jpg',
          }
          );
        }
      }
      console.log("ss", formData.certificationImageData);


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
      if(userData.education===null){
        return;
      }
      setEducation(userData.education);

    } catch (error) {
   //   console.error('Error handling education:', error.message);
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
    console.log("delete", selectedItemToDelete);
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
      if(data.language=== null){
        return;
      }
      setLanguages(data.languages); // تخزين اللغات في الحالة لعرضها

      console.log('Fetched languages:', data.languages); // تحقق من البيانات
    } catch (error) {
   //   console.error('Error fetching languages:', error.message);
    }
  };

  const handleGetRecomandation = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken'); // استرجاع التوكن
      if (!token) {
        console.error('Token not found');
        return;
      }

      const response = await fetch(`${baseUrl}/user/getRecommendations`, {
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
      if(data.recommendations=== null || data.skillsWithReviews=== null){
        return;
      }
      setRecommendation(data.recommendations); // تخزين اللغات في الحالة لعرضها
      setSkillsRecommendation(data.skillsWithReviews);
    } catch (error) {
   //   console.error('Error fetching languages:', error.message);
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

      const data = await response.json();
      setUserLanguages(data.languages);
      console.log('Fetched languages:', data.languages);
    } catch (error) {
 //     console.error('Error fetching languages:', error.message);
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
    } catch (error) {
    //  console.error('Error fetching skills:', error.message);
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

      const data = await response.json();
      setUserSkills(data.skills);
      setUserRateSkills(data.skills.map((skill) => skill.rating || 1)); // تحديث التقييمات
      console.log('Fetched skills:', data.skills);
    } catch (error) {
 //     console.error('Error fetching skills:', error.message);
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
      console.log("sama", SkillId);
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

  const handleGetAllPosts = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      console.log('Token:', token); 
      if (!token) {
        throw new Error('No token found');
      }
  
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
  
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
  
      const data = await response.json();
  
      if (Array.isArray(data.posts) && data.posts.length > 0) {
        // إضافة حالة التفاعل لكل منشور
        const updatedPosts = data.posts.map(post => {
          const decodedToken = jwtDecode(token);
          const loggedInUserId = decodedToken.id;
  
          // التحقق من إذا كان المستخدم قد وضع لايك على هذا المنشور
          const isLiked = post.like.includes(loggedInUserId);
  
          // إضافة حالة التفاعل (لايك) إلى المنشور
          return {
            ...post,
            isLiked
          };
        });
  
        setPosts(updatedPosts);
      } else {
    //    console.error('No posts found or data is not an array', data);
      }
  
    } catch (error) {
     // console.error('Error fetching posts:', error);
    }
  };
  
      
  

  const [dataprofile,setIDProfile]=useState('');

  const [profileUser,setOtherProfile] = useState('');

  const handleViewOtherProfile = async (id) => {
    try {
      const token = await AsyncStorage.getItem('userToken'); // الحصول على التوكن من التخزين
      console.log(token);
      if (!token) {
        console.error('Token not found');
        return;
      }
  
      const response = await fetch(`${baseUrl}/User/viewotherprofile/${id}`, {
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
      setOtherProfile(data);  // تحديث حالة البروفايل
      console.log('senior', data);
  
    } catch (error) {
      console.error('Error fetching ProfileData:', error);
    }
  };
  const navigateToSeniorProfile = async (id) => {
    await handleViewOtherProfile(id);  // الانتظار حتى يتم تحميل البيانات
    // التأكد من تحميل البيانات قبل الانتقال
    if (profileUser) {
      console.log('Navigate to Senior Profile:',profileUser);
      navigation.navigate('ViewOtherProfile', { userData: profileUser });
    } else {
      console.log('No profile data available');
    }
  };
  useEffect(() => {
    handleGetRecomandation();
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
    handlegetPendingRequests();
    handleGetAllPosts();
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


  const handleTabPress = (tab) => {
    setActiveTab(tab);
  
    // استدعاء الدالة عند الضغط على علامة التبويب "Request"
    if (tab === 'Request') {
      handlegetPendingRequests();
    }
  };
  

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

    } catch (error) {
   //   console.error('Error fetching user posts:', error);
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
              <Text style={[styles.experienceTitle, { color: isNightMode ? Colors.primary : Colors.black }]}>{exp.jobTitle}</Text>
              <TouchableOpacity onPress={() => openModalEditting(exp, 'experience')} style={styles.editButton}>
                <MaterialIcons name="edit" size={20} color={isNightMode ? Colors.primary : Colors.black} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => openConfirmDeleteModal('experience', exp)} style={styles.deleteButton}>
                <MaterialCommunityIcons name="minus-circle" size={20} color={isNightMode ? Colors.primary : Colors.black} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.experienceDescription, { color: isNightMode ? Colors.primary : Colors.black }]}>{exp.Description}</Text>
            <Text style={styles.experienceDate}>
              {exp.isContinuing
                ? `working at ${exp.name} since ${formatDate(exp.startDate)}` // إذا كان العمل مستمر فقط يظهر منذ وتاريخ البدء
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
              <Text style={[styles.experienceTitle, { color: isNightMode ? Colors.primary : Colors.black }]}>{exp.universityName}</Text>
              <TouchableOpacity onPress={() => openModalEditting(exp, 'education')} style={styles.editButton}>
                <MaterialIcons name="edit" size={20} color={isNightMode ? Colors.primary : Colors.black} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => openConfirmDeleteModal('education', exp)} style={styles.deleteButton}>
                <MaterialCommunityIcons name="minus-circle" size={20} color={isNightMode ? Colors.primary : Colors.black} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.experienceDescription, { color: isNightMode ? Colors.primary : Colors.black }]}>{exp.degree}</Text>
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
              <TouchableOpacity onPress={() => openConfirmDeleteModal('language', exp)} style={styles.editButton}>
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




  const CertificationList = ({ certification }) => {
    // دالة لتصفية الخبرات وعرض الخبرات من الثالثة فما فوق
    const filterExperiences = () => {
      return certification.slice(2); // تصفية الخبرات بحيث تبدأ من الخبرة الثالثة
    };
    return (
      <ScrollView>
        {filterExperiences().map((cert, index) => (
          <View key={index} style={[styles.experienceItem, { flexDirection: 'row' }]}>

            {/* عرض الصورة */}
            {cert.credentialType === 'image' && cert.certificationImageData?.secure_url && (
              <TouchableOpacity onPress={() => openImageViewer(cert.certificationImageData?.secure_url)}>
                <Image
                  source={{
                    uri: cert.certificationImageData.secure_url
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
              <TouchableOpacity onPress={() => openModalEditting(cert, 'certification')} style={styles.editButton}>
                <MaterialIcons name="edit" size={20} color={isNightMode ? Colors.primary : Colors.black} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => openConfirmDeleteModal('certification', cert)} style={styles.deleteButton}>
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



            <TouchableOpacity onPress={() => nav.navigate('AllPeapleItalk')} style={{ marginRight: 100 }}>
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

              <TouchableOpacity onPress={() => nav.navigate('AllPeapleItalk')}>
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


      {/* Main Content */}
      <View style={{ flex: 1 }}>

        {/* Animated.ScrollView - يحتوي على النصوص والأزرار */}
        <Animated.ScrollView
          style={{
            flex: 1,
            margin: Platform.OS === 'web' ? 40 : '',
            borderRadius: Platform.OS === 'web' ? 10 : 0,
            backgroundColor: isNightMode ? Colors.black : Colors.primary
          }}
        >


          <View style={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            backgroundColor: 'white',
            zIndex: 10,
            width: '100%', backgroundColor: isNightMode ? Colors.black : Colors.primary
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
              <TouchableOpacity style={{ marginRight: 15, marginTop: -40 }} onPress={pickImage}>
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
              <View style={{ flex: 1, justifyContent: 'center', marginTop: -23 }}>
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
                    flexShrink: 1, fontWeight: 'bold'
                  }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {'@' + userName || 'Username'}
                </Text>
                <Text  style={{
                    fontSize: 14,
                    color: isNightMode ? Colors.fourhColor : Colors.fifthColor,
                    flexShrink: 1, fontWeight: 'bold'
                  }}>{role || 'role'}</Text>
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
              /*
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
              
              
              </View>*/''
            ) : ( ''
       /*       <TouchableOpacity
                onPress={() => {
                  if (githubLink) {
                    Linking.openURL(githubLink);
                  } else {
                    setIsEditing(true);
                  }
                }}
                style={styles.githubIcon}>
                <Ionicons name="logo-github" size={30} color="#000" />
              </TouchableOpacity>*/
            )}
          </View>

          <View style={[styles.divider, { height: 3 }]} />






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



          <View style={[styles.divider, { height: 3 }]} />


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
                  <Text style={[styles.experienceTitle, { color: isNightMode ? Colors.primary : Colors.black }]}>{exp.jobTitle}</Text>
                  <TouchableOpacity onPress={() => openModalEditting(exp, 'experience')} style={styles.editButton}>
                    <MaterialIcons name="edit" size={20} color={isNightMode ? Colors.primary : Colors.black} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => openConfirmDeleteModal('experience', exp)} style={styles.deleteButton}>
                    <MaterialCommunityIcons name="minus-circle" size={20} color={isNightMode ? Colors.primary : Colors.black} />
                  </TouchableOpacity>
                </View>
                <Text style={[styles.experienceDescription, { color: isNightMode ? Colors.primary : Colors.black }]}>{exp.Description}</Text>
                <Text style={styles.experienceDate}>

                  {exp.isContinuing
                    ? `working at ${exp.name} since ${formatDate(exp.startDate)}` // إذا كان العمل مستمر فقط يظهر منذ وتاريخ البدء
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
          <View style={[styles.divider, { height: 3 }]} />


          {/* بطاقة Education */}
          <View style={[styles.card, { backgroundColor: isNightMode ? Colors.black : Colors.primary }]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: isNightMode ? Colors.primary : Colors.black }]}>Education</Text>
              <View style={styles.actionButtons}>

                <TouchableOpacity onPress={() => openModal('education')} style={styles.smallButton}>
                  <Text style={styles.smallButtonText}>Add</Text>
                </TouchableOpacity>
              </View>


            </View>
            {/* عرض أول 2 خبرات */}
            {Education.slice(0, 2).map((exp, index) => (
              <View key={index} style={styles.experienceItem}>
                <View style={styles.experienceHeader}>
                  <Text style={[styles.experienceTitle, { color: isNightMode ? Colors.primary : Colors.black }]}>{exp.universityName}</Text>
                  <TouchableOpacity onPress={() => openModalEditting(exp, 'education')} style={styles.editButton}>
                    <MaterialIcons name="edit" size={20} color={isNightMode ? Colors.primary : Colors.black} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => openConfirmDeleteModal('education', exp)} style={styles.deleteButton}>
                    <MaterialCommunityIcons name="minus-circle" size={20} color={isNightMode ? Colors.primary : Colors.black} />
                  </TouchableOpacity>
                </View>
                <Text style={[styles.experienceDescription, { color: isNightMode ? Colors.primary : Colors.black }]}>{exp.degree}</Text>
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

          <View style={[styles.divider, { height: 3 }]} />

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
                  <TouchableOpacity onPress={() => openModalEditting(cert, 'certification')} style={styles.editButton}>
                    <MaterialIcons name="edit" size={20} color={isNightMode ? Colors.primary : Colors.black} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => openConfirmDeleteModal('certification', cert)} style={styles.deleteButton}>
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
          <View style={[styles.card, { backgroundColor: isNightMode ? Colors.black : Colors.primary }]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: isNightMode ? Colors.primary : Colors.black }]}>Project</Text>
              <View style={styles.actionButtons}>

                <TouchableOpacity onPress={() => openModal('project')} style={styles.smallButton}>
                  <Text style={styles.smallButtonText}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>


          <View style={[styles.divider, { height: 3 }]} />


          {/* بطاقة Skills */}
          <View style={[styles.card, { backgroundColor: isNightMode ? Colors.black : Colors.primary }]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: isNightMode ? Colors.primary : Colors.black }]}>Skills</Text>
              <View style={styles.actionButtons}>

                <TouchableOpacity
                  handleAddSkills
                  onPress={() => openModal('skills')} style={styles.smallButton}>
                  <Text style={styles.smallButtonText}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
            {userSkills.slice(0, 2).map((cert, index) => (
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

          <View style={[styles.divider, { height: 3 }]} />


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
                  onPress={() => openModal('language')}
                  style={styles.smallButton}>
                  <Text style={styles.smallButtonText}>Add</Text>
                </TouchableOpacity>

              </View>
            </View>
            {userLanguages.slice(0, 2).map((cert, index) => (
              <View key={index} style={[styles.experienceItem, { flexDirection: 'row' }]}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.experienceTitle, { color: isNightMode ? Colors.primary : Colors.black }]}>
                    {cert.name}
                  </Text>
                  <TouchableOpacity onPress={() => openConfirmDeleteModal('language', cert)} style={styles.editButton}>
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
                <LanguageList language={'language'} />
                <TouchableOpacity onPress={handleHideLanguage} style={styles.showAllButton}>
                  <Text style={styles.showAllButtonText}>Hide</Text>
                </TouchableOpacity>
              </>
            )}


          </TouchableOpacity>
          <View style={[styles.divider, { height: 3 }]} />

          {/* بطاقة Recommendation */}
     
          <View style={[styles.card, { backgroundColor: isNightMode ? Colors.black : Colors.primary }]}>
  <View style={styles.cardHeader}>
    <Text style={[styles.cardTitle, { color: isNightMode ? Colors.primary : Colors.black }]}>
      Review
    </Text>
  </View>

  {/* عرض التوصيات فقط إذا كانت موجودة */}
  <View style={styles.experienceItem}>
  {Array.isArray(recommendation) && recommendation.length > 0 && recommendation.slice(0, 2).map((rec, index) => (
    <View key={index}>
      <TouchableOpacity   
       onPress={() => {{
        navigateToSeniorProfile(rec.author.id); // الانتقال
  }}}
     style={styles.authorContainer}>
        {/* عرض صورة المؤلف */}
        <Image source={{ uri: rec.author.profilePicture.secure_url }} style={styles.authorImage} />
        <View>
          {/* اسم المؤلف */}
        <Text style={styles.recommendationAuthor}>{rec.author.fullName}</Text>
          <Text style={styles.dateText}>
  {moment(rec.date).format('DD MMM YYYY, hh:mm A')}
</Text>
          {/* النص الخاص بالتوصية */}
          <Text style={styles.recommendationText}>{rec.text}</Text>
        </View>        

      </TouchableOpacity>
    </View>
  ))}
<View style={styles.divider2}></View>
  {/* عرض المهارات والتقييمات داخل نفس البطاقة */}
  {Array.isArray(skillsRecommendation) && skillsRecommendation.length > 0 && (
    <View style={styles.skillsContainer}>
      {skillsRecommendation.slice(0, 2).map((skill, index) => (
        <View key={index} style={styles.skillCard}>
          <Text style={styles.projectName}>{skill.projectName}</Text>
          
          {Array.isArray(skill.reviews) && skill.reviews.length > 0 && skill.reviews.map((review, reviewIndex) => (
            <View key={reviewIndex} style={{ flexDirection: 'row', alignItems: 'center',justifyContent:'space-between' }}>
              {/* اسم السينيور (الذي قام بالتقييم) */}

              <Text style={styles.seniorName}>{review.skillName}</Text>
              {/* تقييم النجوم */}
              <View style={[styles.starRating,{justifyContent:'space-between'}]}>
                {[1, 2, 3, 4, 5].map((starIndex) => (
                  <TouchableOpacity
                    key={starIndex}
                    onPress={() => {
                      const updatedSkills = [...skillsRecommendation];
                      updatedSkills[index].reviews[reviewIndex].rating = starIndex;
                      setSkillsRecommendation(updatedSkills);
                    }}
                  >
                    <MaterialCommunityIcons
                      name={starIndex <= review.rating ? 'star' : 'star-outline'}
                      size={20}
                      color={starIndex <= review.rating ? '#F7A8B8' : isNightMode ? Colors.primary : Colors.black}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </View>
      ))}
    </View>
  )}</View>
</View>



<View style={[styles.divider, { height: 3 }]} />



          {/* Modal لكل بطاقة */}
          <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={closeModal}>
            <View style={styles.modalContainer}>
              <View style={[styles.modalContent, { backgroundColor: isNightMode ? Colors.black : Colors.primary }]}>
                {/* محتويات Modal Experience */}
                {currentModal === 'experience' && (
                  <>
                    <Text style={[styles.modalTitle, { color: isNightMode ? Colors.primary : Colors.black }]}>Experience</Text>
                    <TextInput placeholder="Institution Name" value={newExperiance.name} placeholderTextColor="#333" style={styles.input}
                      onChangeText={(text) => handleChangeExperience('name', text)}
                    />
                    <TextInput placeholder="Job Title" placeholderTextColor="#333" value={newExperiance.jobTitle} onChangeText={(text) => handleChangeExperience('jobTitle', text)} style={styles.input} />

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
                        onChangeText={(text) => handleChangeExperience('endDate', text)} />
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
                      onChangeText={(text) => handleChangeEducation('degree', text)}
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
                          setNewCertificaion((prev) => ({ ...prev, credentialType: 'link', certificationImageData: '', certificationLinkData: '' }));

                        }}
                        style={[styles.switchButton, uploadType === 'link' && styles.activeSwitchButton]}
                      >
                        <Text style={uploadType === 'link' ? styles.activeSwitchText : styles.switchText}>Link</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => {
                          setUploadType('image');
                          setNewCertificaion((prev) => ({ ...prev, credentialType: 'image', certificationImageData: '', certificationLinkData: '' }));
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
                        onChangeText={(text) => setNewCertificaion((prev) => ({ ...prev, credentialType: 'link', certificationLinkData: text }))}
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
                    <TextInput placeholder="Project Title" placeholderTextColor="#333" style={styles.input} />
                    <TextInput placeholder="Project Description" placeholderTextColor="#333" style={styles.input} />
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
                      <TextInput placeholder="Project URL" placeholderTextColor="#333" style={styles.input} />
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


                {currentModal === 'language' && (
                  <>
                    <Text style={[styles.modalTitle, { marginTop: 0 }]}>Select Language(s)</Text>
                    <Text style={{ color: Colors.brand }}>{error}</Text>
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
                      itemTextColor={isNightMode ? '#000' : '#333'} // لون النص في العنصر غير المحدد
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
                        overflow: 'hidden', // منع تجاوز العناصر للحاوية

                      }}

                    />
                  </>
                )}



                {/* محتويات Modal Recommendation */}
                {currentModal === 'recommendation' && (
                  <>
                    <Text style={styles.modalTitle}>Edit Recommendation</Text>
                    <TextInput placeholder="Recommendation" placeholderTextColor="#333" style={styles.input} />
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














                {currentModalEditting === 'post' && selectedItem && (
                  <>
                    <Text style={[styles.modalTitle, { color: isNightMode ? '#fff' : '#000' }]}>Edit Post</Text>
                    <TextInput
                      placeholder="Body"
                      value={selectedItem.Body}
                      onChangeText={(text) => setSelectedItem({ ...selectedItem, Body: text })}
                      style={styles.input}
                    />
               
                  </>
                )}

                {/* محتويات Modal Language */}
                {currentModal === 'Language' && (
                  <>
                    <Text style={styles.modalTitle}>Edit Language</Text>
                    <TextInput placeholder="Add a Language" placeholderTextColor="#333" style={styles.input} />
                  </>
                )}

                {/* محتويات Modal Recommendation */}
                {currentModal === 'recommendation' && (
                  <>
                    <Text style={styles.modalTitle}>Edit Recommendation</Text>
                    <TextInput placeholder="Recommendation" placeholderTextColor="#333" style={styles.input} />
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

          <View style={{ flex: 1, marginBottom: 50 }}>
            {/* قائمة التبويبات */}
            <View style={styles.tabContainer}>
              {['Posts',].map((tab) => (
                <TouchableOpacity
      key={tab}
      onPress={() => handleTabPress(tab)}
      style={[
        styles.tabButton,
        activeTab === tab && styles.activeTab,
      ]}
    >

                  <Text style={[styles.tabText, { color: isNightMode ? Colors.primary : Colors.black }]}>{tab}</Text>
                  {activeTab === tab && <View style={styles.activeIndicator} />}
                </TouchableOpacity>
              ))}
            </View>

            {/* عرض محتوى التبويب المختار */}
            {/* عرض محتوى التبويب المختار */}
      <View style={[styles.content, { backgroundColor: isNightMode ? Colors.black : Colors.primary }]}>
        {activeTab === 'Connect' && <Text style={[styles.tabContent, { color: isNightMode ? Colors.primary : Colors.black }]}>Connect Content</Text>}
        {activeTab === 'Posts' && 
  posts.map((post, index) => (
    <React.Fragment key={index}>
      <View
        style={{
          width: Platform.OS === 'web' ? '50%' : '100%',
          alignItems: 'center',
          marginBottom: 15,
          marginTop: 30,
        }}
      >
        <View
          style={{
            backgroundColor: isNightMode ? '#3a3a3a' : '#fff',
            width: '95%',
            borderRadius: 15,
            padding: 15,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 5,
            elevation: 5,
          }}
        >
              
          <TouchableOpacity onPress={() => openModalEditting(post, 'post')} style={[styles.editButton,{margin:10}]}>
                    <MaterialIcons name="edit" size={15} color={isNightMode ? Colors.primary : Colors.black} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => openConfirmDeleteModal('post',post)} style={[styles.deleteButton,{margin:10}]}>
                    <MaterialCommunityIcons name="minus-circle" size={15} color={isNightMode ? Colors.primary : Colors.black} />
                  </TouchableOpacity>             

          {/* Header */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <Image
              source={{ uri: post.UserId.PictureProfile.secure_url }}
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                marginRight: 10,
                borderWidth: 2,
                borderColor: isNightMode ? primary : '#ddd',
              }}
            />
            <View>
              <Text style={{ color: isNightMode ? primary : '#000', fontWeight: 'bold', fontSize: 16 }}>
                {post.UserId.FullName}
              </Text>
              <Text style={{ color: darkLight, fontSize: 12 }}>
                {new Date(post.createdAt).toLocaleString()}
              </Text>
            </View>
          </View>

          {/* Body */}
          <Text style={{ color: isNightMode ? primary : '#000', fontSize: 16, lineHeight: 22, marginBottom: 15 }}>
            {post.Body}
          </Text>
          <View style={styles.divider} />

          {/* Images */}
          {post.Images && post.Images.length > 0 && post.Images.map((image, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => openImageViewer(image?.secure_url)}
            >
              <Image
                source={{ uri: image.secure_url }}
                style={{
                  width: '100%',
                  height: 300,
                  borderRadius: 10,
                  marginBottom: 10,
                  resizeMode: 'cover',
                }}
              />
            </TouchableOpacity>
          ))}

          {/* Videos */}
          {post.Videos && post.Videos.length > 0 && post.Videos.map((video, idx) => (
            <View key={idx}>
              {Platform.OS === 'web' ? (
                <video
                  controls
                  style={styles.video}
                  src={video.secure_url}
                  resizeMode="contain" // التأكد من أن الفيديو يبقى ضمن الحدود
                />
              ) : (
                <ExpoVideo
                  source={{ uri: video.secure_url }}
                  style={styles.video}
                  useNativeControls
                  resizeMode="contain" // التأكد من أن الفيديو يبقى ضمن الحدود
                />
              )}
            </View>
          ))}

          {/* Files */}
          {post.Files && post.Files.length > 0 && post.Files.map((file, index) => (
            <TouchableOpacity
              key={index}
              style={styles.fileCard}
              onPress={() => openFileInBrowser(file.secure_url, file.originalname)}
            >
              <FontAwesome name="file-o" size={24} color="#555" style={styles.icon} />
              <Text style={styles.fileName}>
                {file.originalname || 'Click to view/download file'}
              </Text>
            </TouchableOpacity>
          ))}

          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }}>
            {/* Like Button */}
            <TouchableOpacity onPress={() => handleLike(post._id, post.like)} style={{ flexDirection: 'column', alignItems: 'center', marginRight: 0 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: isNightMode ? primary : '#000', fontSize: 14, marginLeft: 0, fontWeight: 'bold', marginTop: 0 }}>
                  {post.like.length}
                </Text>
                <Ionicons name="heart-circle" size={27} color={post.isLiked ? '#ff0000' : '#ccc34'} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => ActionComment(post._id)} 
              style={{ alignItems: 'center' }}
            >
              <Ionicons 
                name="chatbubbles" 
                size={26} 
                color={isNightMode ? secondary : '#ccc34'} 
              />
              <Text style={{ color: isNightMode ? primary : '#000', fontSize: 14 }}>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Divider */}
      {index < posts.length - 1 && (
        <View style={{ width: '100%', height: 3, backgroundColor: isNightMode ? '#555' : '#ddd', marginVertical: 20 }} />
      )}
    </React.Fragment>
  ))
}




{activeTab === 'Request' && (
  <View style={styles.requestsContainer}>
    {pendingRequests?.length > 0 ? (
      pendingRequests.map((request, index) => ( // التأكد من وجود الطلبات
        <React.Fragment key={request._id}>
          <Animatable.View
            animation="zoomIn"
            delay={index * 100}  // تأخير ظهور كل بطاقة
            duration={500}  // مدة تأثير الزوم
            style={styles.requestCard}
          >
            <Text style={[styles.requestName, { color: isNightMode ? Colors.primary : Colors.black }]}>
              {request.roleName}
            </Text>
            <TouchableOpacity
              onPress={() => handleDeleteApp(request._id)}
              style={styles.deleteIcon}
            >
              <Ionicons name="remove-circle-sharp" size={24} color="red" />
            </TouchableOpacity>
          </Animatable.View>
          <View style={styles.divider} />
        </React.Fragment>
      ))
    ) : (
      // عرض النص في حالة عدم وجود طلبات
      <Text style={[styles.noRequestsText, { color: isNightMode ? Colors.primary : Colors.black }]}>
        No pending requests
      </Text>
    )}
  </View>
)}


      </View>
          </View>

        </Animated.ScrollView>
      </View>


      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setIsModalVisible(false)}
        style={{ justifyContent: 'flex-end', margin: 0 }}
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
                    source={{ uri: newprofileImage }}
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
              value={newlocation}
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
                uri: profileImage || 'https://via.placeholder.com/80', // استخدام الصورة المختارة أو صورة بروفايل أو صورة افتراضية
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
          left: 10, backgroundColor: 'white', padding: 10, borderRadius: 5, zIndex: 20, bottom: 50, width: 150, borderColor: fourhColor, borderWidth: 1
        }}>

          <View style={{
            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'

          }}>
            <Entypo name="log-out" size={25} color={careysPink} style={{}} />
            <TouchableOpacity onPress={handleLogout}>
              <Text style={{ fontSize: 16, padding: 10, marginRight: 40 }}>Logout</Text>
            </TouchableOpacity>
          </View>

          <View style={{
            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'

          }}>
            <Ionicons name="close-circle" size={25} color={careysPink} style={{ right: 2 }} />
            <TouchableOpacity onPress={() => setMenuVisible(false)}>
              <Text style={{ fontSize: 16, padding: 10, marginRight: 40 }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}


           {/* Menu */}


            <Modal
        visible={isModalVisibleviewImage}
        transparent={true}
        onRequestClose={closeImageViewer}
      >
        <ImageViewer
          imageUrls={currentImage}
          onCancel={closeImageViewer}
          enableSwipeDown={true}
          menus={({  }) => (
            <View style={styles.menuContainer}>
              <Button
                title="Download Image"
                color={Colors.darkLight}
                onPress={() => saveImageToDevice(currentImage[0]?.url)}
              />
            </View>
          )}
        />
      </Modal>


      <Modal 
  isVisible={isCommentModal} 
  onBackdropPress={handleCloseModal} 
  style={{ justifyContent: 'flex-end', margin: 0 }} 
  transparent={true}
>
  <View style={{
    backgroundColor: isNightMode ? '#333' : '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: Platform.OS === 'web' ? '80%' : '80%',  // إذا كانت ويب، عرض المودال بنصف الصفحة
    margin: Platform.OS === 'web' ? '5%' : '',  // إذا كانت ويب، عرض المودال بنصف الصفحة
    borderRadius: Platform.OS === 'web' ? 20 : '',  // إذا كانت ويب، عرض المودال بنصف الصفحة
    flexDirection: 'column',
  }}>
    {/* Header */}
    <View style={styles.commentHeader}>
      <Text style={[styles.commentTitle, isNightMode && styles.commentTitleDark]}>Comments</Text>
      <TouchableOpacity onPress={handleCloseModal} style={styles.commentCloseButton}>
        <Ionicons name="close" size={28} color={isNightMode ? 'white' : 'gray'} />
      </TouchableOpacity>
    </View>

    {/* Comments List - FlatList */}
    {commentPost && commentPost.length > 0 ? (
      <FlatList 
        style={{ flex: 1 }}
        data={commentPost}
        renderItem={({ item }) => {
          const isOwner = item.UserId === currentUserId; // تحقق إن كان صاحب الحساب
          return (
            <View style={[styles.commentItem, isNightMode && styles.commentItemDark]}>
              <TouchableOpacity onPress={() => navigation.navigate('ViewOtherProfile', { userData: item.UserId})} // تمرير بيانات المستخدم
>
                {item.PictureProfile && item.PictureProfile.secure_url && (
                  <Image
                    source={{ uri: item.PictureProfile.secure_url }}
                    style={styles.commentUserImage}
                  />
                )}
              </TouchableOpacity>
              <View style={styles.commentTextContainer}>
                <Text style={[styles.commentUser, isNightMode && styles.commentUserDark]}>{item.FullName}</Text>
                <Text style={[styles.commentDate, isNightMode && styles.commentDateDark]}>
                  {moment(item.createdAt).format('MMM Do YYYY,[at] h:mm a')}
                </Text>
                {item.Text && (
                  <Text style={[styles.commentText,isNightMode && styles.noCommentsTextDark]}>{item.Text}</Text>
                )}
                {item.Images && item.Images.length > 0 && (
                  <TouchableOpacity onPress={() => openImageViewer(item.Images[0]?.secure_url)}>
                    <Image
                      source={{ uri: item.Images[0].secure_url }}
                      style={Platform.OS === 'web' ? styles.commentImagewep : styles.commentImage}
                    />
                  </TouchableOpacity>
                )}

                {isOwner && (
                  <View style={styles.commentOptions}>
                    <TouchableOpacity onPress={() => editCommentHandler(item._id, item.Text, item.Images)}>
                      <Ionicons name="create" size={15} color={isNightMode ? 'white' : 'gray'} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeleteComments(item._id)}>
                      <Ionicons name="trash" size={15} color={isNightMode ? 'white' : 'gray'} />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          );
        }}
        keyExtractor={(item) => item._id ? item._id.toString() : ''}
        contentContainerStyle={styles.commentList}
      />
    ) : (
      <Text style={[styles.noCommentsText, isNightMode && styles.noCommentsTextDark]}>No comment yet</Text>
    )}

    {editingImage && editingImage.length > 0 && (
      <View style={styles.imageWrapper}>
        <TouchableOpacity onPress={pickImageComment}>
          <Image source={{ uri: editingImage }} style={Platform.OS === 'web' ? styles.commentImagewep : styles.commentImage} />
        </TouchableOpacity>
        {/* Remove Image Button */}
        <TouchableOpacity onPress={() => removeimgcomment()} style={styles.removeImageButton}>
          <Ionicons name="close" size={15} color="white" />
        </TouchableOpacity>
      </View>
    )}

    {/* Comment Input Section */}
    <View style={[styles.commentInputContainer]}>
      {/* Text Input with auto-resize */}
      <TextInput
        placeholder="Write a comment..."
        value={newCommentText}
        onChangeText={setNewCommentText}
        style={[
          styles.commentInput,
          isNightMode && styles.commentInputDark,
          { minHeight: 40, textAlignVertical: 'top' }, // توسع الحقل مع النص
        ]}
        multiline={true} // لجعل الإدخال متعدد الأسطر
      />

      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity onPress={pickImageComment} style={styles.imagePickerButton}>
          <Ionicons name="image" size={30} color={isNightMode ? 'white' : 'gray'} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (newCommentText.trim() || editingImage) {
              isEditing ? updateMyComment(editingCommentId) : handleAddComment();
            } 
          }}
          style={styles.commentSendButton}
        >
          <Ionicons name="send" size={15} color="white" />
        </TouchableOpacity>
      </View>
    </View>

  </View>
</Modal>












      

    </View>
  );


};



const styles = StyleSheet.create({
  modalButtonsContainer: {
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
    shadowRadius: 3, padding: 8
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
    backgroundColor: 'black', // لون رمادي مع شفافية بسيطة
  },

  profileImageWrapper: {
    position: 'absolute',
    right: width * 0.35, // تخصيص المسافة بناءً على ارتفاع الشاشة
    top: height * -0.04, // تخصيص المسافة بناءً على ارتفاع الشاشة
  },
  fullName: {
    right: width * 0.21, // تخصيص المسافة بناءً على ارتفاع الشاشة
    top: height * -0.003, // تخصيص المسافة بناءً على ارتفاع الشاشة
    fontSize: 25,
    fontWeight: 'bold',
  },
  userName: {
    right: width * 0.21, // تخصيص المسافة بناءً على ارتفاع الشاشة
    top: height * -0.01, // تخصيص المسافة بناءً على ارتفاع الشاشة
    fontSize: 14, color: firstColor, fontWeight: 'bold',
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
    right: width * 0.22,
    width: 150, height: 30,
    marginRight: 10, height: 30,
  },
  saveButton: {
    position: 'absolute',
    backgroundColor: '#000',
    padding: 5,
    top: height * -0.02, // تعديل الموقع بناءً على ارتفاع الشاشة
    right: width * 0.13, height: 30,
    borderRadius: 5,
  },
  saveButtonText: {
    color: '#fff',
  },
  githubIcon: {
    position: 'absolute',
    top: height * 0.37, // تعديل الموقع بناءً على ارتفاع الشاشة
    right: width * 0.61,
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
    height: 4,
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
    backgroundColor: fourhColor,
    borderRadius: 5,
    alignItems: 'center',
  },
  showAllButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  experienceItem: {
    marginTop: 10,
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
  }, experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  editButton: {
    position: 'absolute',
    right: 0, /* موقع الأيقونة من اليمين */
    cursor: 'pointer',
  },
  deleteButton: {
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
    top: '25%',
    transform: [{ translateX: -20 }], // تعويض الحجم لتوسيطه بشكل دقيق
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
    padding: 10,
    backgroundColor: '#28a745',
    borderRadius: 5,
    marginTop: 10,
  },
  addLinkButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  buttonText: {
    padding: 7,
    backgroundColor: fourhColor,
    borderRadius: 10,
    marginTop: 10,
  }, pickerContainer: {
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
    flex: 1
  },
  requestsContainer: {
    marginTop: 20,marginBottom: 20,
  },
  requestCard: {
    shadowColor: fifthColor,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    overflow: "hidden",margin:5,
    justifyContent: "space-between",flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 10,
    padding: 15,
    borderRadius: 10,
  },
  requestName: {
    fontSize: 16,
    fontWeight: '600',
  },
  deleteIcon: {
    padding: 5,
  },

container: {
    alignItems: 'center',
    marginVertical: 10,
  },
  divider2: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 8,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  
  icon: {
    marginRight: 10,
  },
  fileName: {
    color: '#007BFF',
    textDecorationLine: 'underline',
    flexShrink: 1,
    fontSize: 14,
  },
  video: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#000', // لون خلفية الفيديو (لأغراض التحميل)
},    webVideo: {
  width: '100%',
  height: 300,
  borderRadius: 10,
  marginBottom: 10,
  backgroundColor: '#000', // لون خلفية الفيديو (لأغراض التحميل)
},
commentModal: { 
  justifyContent: 'center',
  alignItems: 'center',
  justifyContent: 'flex-end', // لظهور المودال من الأسفل في الجوال
  margin: 0,
},
commentModalDark: {
  backgroundColor: '#000000AA', // لون الظل عند التفعيل في وضع الليل
},
commentModalContent: {
  width: '100%',
  backgroundColor: '#fff',
  borderTopLeftRadius: 20,  // جولة الزوايا من الأعلى
  borderTopRightRadius: 20,  // جولة الزوايا من الأعلى
  padding: 20,
  justifyContent: 'flex-end',  // يتم وضع حقل التعليق في أسفل المودال
  maxHeight: '70%',// تحديد أقصى ارتفاع للمودال ليكون 90% من الشاشة
},
// الهيدر
commentHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 20,
},
commentTitle: {
  fontSize: 18,
  fontWeight: 'bold',
},
commentTitleDark: {
  color: 'white',
},
commentCloseButton: {
  padding: 10,
},
// القائمة التعليقات
commentList: {
  paddingBottom: 20,
},
// تعليق فردي
commentItem: {
  flexDirection: 'row',
  marginBottom: 15,
  borderBottomWidth: 1,
  borderBottomColor: '#ddd',
  paddingBottom: 10,
  paddingRight: 10,
},
commentItemDark: {
  backgroundColor: '#333',
},
commentUserImageContainer: {
  marginRight: 10,
},
commentUserImage: {
  width: 45,
  height: 45,
  borderRadius: 25, // جعل الصورة دائرية
  borderWidth: 1,   // إطار
  borderColor:Colors.fifthColor,
  marginRight: 10,  // مسافة بين الصورة والنص
},
commentTextContainer: {
  flex: 1,
},
commentUser: {
  fontWeight: 'bold',
  fontSize: 14,
},
commentUserDark: {
  color: 'white',
},
commentImage: {
  width: '100%',
  height: 200,
  borderRadius: 10,
  marginTop: 10,
},
commentImagewep: {
  width: 400,
  height: 200,
  borderRadius: 10,
  marginTop: 10,
},
commentOptions: {
  flexDirection: 'row',
  marginTop: 10,
},
commentInputDark: {
  backgroundColor: '#333',
  color: 'white',
},
previewImage: {
  width: '100%',
  height: 200,
  borderRadius: 10,
  marginTop: 10,
},
imagePickerButton: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 10,
},
imagePickerText: {
  fontSize: 16,
  marginLeft: 10,
  color: '#007BFF',
},
commentInputContainer: {
  flexDirection: 'row',  // وضع العناصر في نفس السطر
  alignItems: 'center',  // محاذاة العناصر في الوسط عموديا
  marginBottom: 15,  // مسافة بين المودال وعناصر الإدخال
},


commentInputDark: {
  backgroundColor: '#333',  // تعديل الخلفية في الوضع الداكن
  color: 'white',  // تغيير لون النص في الوضع الداكن
},
previewImage: {
  width: 40,  // عرض الصورة المعاينة
  height: 40,  // ارتفاع الصورة المعاينة
  borderRadius: 5,
  marginLeft: 10,  // مسافة بين الزر والصورة
},
imagePickerButton: {
  padding: 10,
},
commentModalContent: {
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  padding: 20,
  flex: 1,
  justifyContent: 'flex-start', // جعل التبرير يبدأ من الأعلى
  maxHeight: '80%', // تحديد أقصى ارتفاع ليكون 80% من الشاشة
},

commentList: {
  paddingBottom: 20, // تحديد المسافة أسفل القائمة
},

commentInputContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 10, // تقليل المسافة بين منطقة الإدخال والتعليقات
  marginBottom: 0, // لا نريد مسافة إضافية أسفل منطقة الإدخال
},


// إضافة هذا لتجنب المسافة البيضاء الكبيرة أسفل منطقة الإدخال:
modalContentContainer: {
  flex: 1,
  justifyContent: 'space-between', // توزيع المحتوى ليشغل المساحة المتاحة بشكل متساوٍ
},
commentCancelButton: {
  backgroundColor: 'red',
  paddingHorizontal: 15,
  paddingVertical: 10,
  borderRadius: 5,
  marginRight: 10,
},
commentCancelText: {
  color: 'red',
  fontSize: 14,
  fontWeight: 'bold',
},
commentInputContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  commentInput: {
    flex: 1, // لتمديد الحقل لملء المساحة المتاحة
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.darkLight,
    borderRadius: 5,backgroundColor:Colors.secondary
  },
  commentInputContainer: {
    flexDirection: 'row', // وضع العناصر بجانب بعضها
    alignItems: 'center', // محاذاة العناصر عمودياً
    marginTop: 10,
  },
  commentInputDark: {
    backgroundColor: '#222',
    color: 'white',
  },
  imageWrapper: {
    position: 'relative',
    marginTop: 10,
    alignSelf: 'stretch',
  },
  commentImagePreview: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: 20,
    right:-5,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 15,padding:3
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    width: '100%',
  },
  imagePickerButton: {
    marginRight: 10,
  },
  commentSendButton: {
    backgroundColor:Colors.fourhColor,
    padding: 8,
    width:30,height:30, borderRadius: 30,
  },
  actionButtonsContainer: {
    flexDirection: 'row', // ترتيب الأزرار بجانب بعضها
    alignItems: 'center',
    marginLeft: 10,
  },
  noCommentsText: {
    fontSize: 18,
    color: 'gray',
    textAlign: 'center',
    flex: 1,
    justifyContent: 'center',  // توسيط النص في الاتجاه العمودي

  },
  noCommentsTextDark: {
    color: 'white',  // تغيير اللون إلى الأبيض في وضع الليل
  },
  commentDate: {
  fontSize: 9,
  color: 'gray',
  marginTop: 5,
},
commentDateDark: {
  color: 'lightgray',
},
commentText: {
  color: '#000',
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
container: {
  flexDirection: 'row',
  alignItems: 'center',
  padding: 5,
},
backButton: {
  marginRight: 10,
}, 
recommendationText: {
  fontSize: 16,
  color: '#000',fontWeight:'bold'
},
recommendationAuthor: {
  fontSize: 14,
  color: '#777',
  marginTop: 5,
},

projectName: {
  fontSize: 14,
  fontWeight: 'bold',
  color: '#333',
},
reviewContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
},
seniorImage: {
  width: 40,
  height: 40,
  borderRadius: 20,
  marginRight: 10,
},
seniorName: {
  fontSize: 16,
  color: '#333',
  flex: 1,
},
starRating: {
  flexDirection: 'row',
  alignItems: 'center',
},authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  authorImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  recommendationAuthor: {
    fontWeight: 'bold',
  },
  recommendationText: {
    fontSize: 14,
    color: '#000',
  },
  skillsContainer: {
  },
  skillCard: {
    marginBottom: 15,
  },
  projectName: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  reviewContainer: {
    marginTop: 5,
  },
  seniorName: {
    fontSize: 14,
    color: '#000',
  },
  starRating: {
    flexDirection: 'row',
    marginTop: 5,
  },dateText: {
    fontSize: 10,              // حجم الخط
    color: '#333',             // اللون (يمكنك تخصيصه حسب التصميم)
    fontFamily: 'Arial',       // الخط المستخدم (اختياري)
  },
});


