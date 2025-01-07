import React, { useState, useContext,useRef,useEffect, } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text,Image,TextInput,TouchableOpacity, StyleSheet, ToastAndroid,useColorScheme, PermissionsAndroid, ScrollView,Animated, Button, Alert, Platform,TouchableWithoutFeedback,Keyboard, FlatList,KeyboardAvoidingView,flatListRef} from 'react-native';
import { Ionicons, Feather, FontAwesome5, EvilIcons, FontAwesome,Entypo,MaterialIcons,AntDesign

} from '@expo/vector-icons';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
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

import './../compnent/webCardStyle.css';
import {
    Colors,
} from './../compnent/Style'
import ImageViewer from 'react-native-image-zoom-viewer';
// Color constants
const { secondary, primary, careysPink, darkLight, fourhColor, tertiary, fifthColor } = Colors;
const { width } = Dimensions.get('window');
import * as WebBrowser from 'expo-web-browser'

import * as FileSystem from 'expo-file-system';
import Video from 'react-native-video';
//import * as Linking from 'expo-linking';
import CommentsModal from './CommentsModal';
import { setIsEnabledAsync } from 'expo-av/build/Audio';
import { string } from 'prop-types';

export default function PostFromNotification({ navigation, route }) {
    const nav = useNavigation();
    const { post, commentIde, notificationType } = route.params;
    const [fadeAnim] = useState(new Animated.Value(0)); // لعمل التأثير على الشفافية
  
    const [firstCommentId, setFirstCommentId] = useState(null); // لتحديد أول تعليق
  
    useEffect(() => {
        if(notificationType==='comment'){
      ActionComment(post._id);
      setFirstCommentId(commentIde); // تعيين أول تعليق عندما يتغير commentIde
        }
    }, [commentIde]);
  
    // استخدام التأثير فقط على التعليق المعني
    const handleCommentAnimation = (commentId) => {
      if (commentId === firstCommentId) {
        // تطبيق التأثير التدريجي على أول تعليق فقط
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 1, // جعل الشفافية 1 لظهور اللون
            duration: 1000, // مدة التأثير بالميلي ثانية
            useNativeDriver: false, // لأننا نغير الألوان وليس الشفافية
          }),
          Animated.timing(fadeAnim, {
            toValue: 0, // إخفاء اللون تدريجيًا
            duration:0, // مدة التغيير إلى الشفافية
            useNativeDriver: false, // لأننا نغير الألوان وليس الشفافية
          }),
        ]).start();
      }
    };
  
    const renderCommentItem = ({ item }) => {
      const isOwner = item.UserId === currentUserId; // تحقق إن كان صاحب الحساب
      const isFirstComment = item._id === commentIde; // تحقق إذا كان أول تعليق
  
      // تحديد لون النص والخلفية فقط للتعليق المعني
      const commentTextColor = isFirstComment ? '#ff6347' : '#000000'; // لون النص للتعليق المعني
      const commentBackgroundColor = isFirstComment ? Colors.secondary : 'transparent'; // خلفية تظهر للتعليق المعني
  
      // نقوم بإنشاء خاصية التغيير على اللون باستخدام Animated
      const animatedTextColor = fadeAnim.interpolate({
        inputRange: [0, 0],
        outputRange: ['transparent', commentTextColor], // اللون يظهر ثم يختفي
      });
  
      const animatedBackgroundColor = fadeAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['transparent', commentBackgroundColor], // الخلفية تظهر ثم تختفي
      });
  
      return (
        <Animated.View
          style={[
            styles.commentItem,
            { opacity: 1 }, // تبقى الشفافية كما هي
            { backgroundColor: animatedBackgroundColor }, // تغيير الخلفية فقط
            isNightMode && styles.commentItemDark, // إذا كان في الوضع الليلي، إضافة التنسيق
          ]}
        >
          <TouchableOpacity onPress={() => handleProfilePress(item.UserId)}>
            {item.PictureProfile && item.PictureProfile.secure_url && (
              <Image
                source={{ uri: item.PictureProfile.secure_url }}
                style={styles.commentUserImage}
              />
            )}
          </TouchableOpacity>
          <View style={styles.commentTextContainer}>
            <Text style={[styles.commentUser, isNightMode && styles.commentUserDark]}>
              {item.FullName}
            </Text>
            <Text style={[styles.commentDate, isNightMode && styles.commentDateDark]}>
              {moment(item.createdAt).format('MMM Do YYYY,[at] h:mm a')}
            </Text>
            {item.Text && (
              <Animated.Text
                style={[
                  { color: animatedTextColor }, // تغيير لون النص فقط للتعليق المعني
                  styles.commentText,
                  isNightMode && styles.noCommentsTextDark,
                ]}
              >
                {item.Text}
              </Animated.Text>
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
        </Animated.View>
      );
    };
  

  
  
      const [scrollY] = useState(new Animated.Value(0));
 
   // Load custom fonts
   const bottomBarTranslate = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, 100], // 100 to move it off-screen
    extrapolate: 'clamp',
});
  const [likedPosts, setLikedPosts] = useState({});

const handleLike = (postId) => {
    setLikedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));

    toggleLike(postId); // استدعاء الدالة الأصلية لتحديث البيانات في الخادم.
  };
 const [searchQuery, setSearchQuery] = useState('');
const [pushNotToken,setpushNotToken]=useState('');
const [friends, setFriends] = useState([]);
const [loading, setLoading] = useState(true);
const [openedChatId, setOpenedChatId] = useState(null); // لتتبع أي شات مفتوح

  const [isFocused, setIsFocused] = useState(false);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [selectedPeople, setSelectedPeople] = useState([]); // الأشخاص الذين يتم فتح شات معهم
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState({}); // تخزين الرسائل بشكل منفصل لكل chatId
  const [isGatheredBubbleHovered, setIsGatheredBubbleHovered] = useState(false);
  const [activeChatId, setActiveChatId] = useState(null); // لتخزين الـ chatId الحالي
  const [currentUserId,setuserId] = useState(''); // أو حسب هيكلة التوكن

  const [selectedChatId, setSelectedChatId] = useState(null);
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
const colorScheme = useColorScheme(); // Check if dark mode is enabled

const handleAddComment = () => {
  addCommentHandler();
  setNewCommentText('');
  setImageUriComment(null);  // إعادة تعيين الصورة
  setEditingImage(null);
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
const toggleModal = () =>setCommenModal(!isCommentModal);
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

    
//////////////////Add new Comment///////////
const addCommentHandler = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      console.error('Token not found');
      return;
    }
    // إعداد البيانات باستخدام FormData
    const formData = new FormData();
    //newCommentText, selectedCommentImage
    // إضافة الحقول النصية
    formData.append('Text', newCommentText);
    if (editingImage) {
      if (Platform.OS === 'web') {
        // استخدام Blob للويب
        const profileBlob = base64ToBlob(imageUriComment, 'image/jpeg');
        formData.append('images', profileBlob, 'images.jpg');
      } 
    // إضافة الصور إذا كانت موجودة
    if (imageUriComment) {
      console.log('Image URI:', imageUriComment);
      formData.append('images', {
        uri: imageUriComment,
        type: 'image/jpeg', // تأكد من مطابقة نوع الملف
        name: 'image.jpg', // اسم الملف
      });
    }

    }

    console.log('Sending comment data:', postIdForComment);

    const response = await fetch(`${baseUrl}/comment/createcomment/${postIdForComment}`, {
      method: 'POST',
      headers: {
        'Authorization': `Wasan__${token}`,
      },
      body: formData, // إرسال البيانات كـ FormData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Something went wrong');
    }
    handleGetAllPostsComment(postIdForComment);
  }

  catch (error) {
    console.error('Error fetching addComment:', error);
} 

};
//////////////////////////////////////////


    const ActionComment = async(postId) =>{
        console.log("sama",postId);
      setCommentPosts([]);
      handleGetAllPostsComment(postId);
      setCommenModal(true);           // فتح المودال
    };    

    const handleGetAllPostsComment = async (postId,notificationCommentId) => {
        setPostIdForComment(postId); // تخزين ID المنشور
        console.log("Fetching Comments...");
        setIsLoading(true); // بدء التحميل
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
            : 'http://192.168.1.239:3000';
      
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
            // ترتيب التعليقات بحيث يظهر الكومنت الذي يتطابق مع notificationCommentId أولاً
            const sortedComments = data.comments.sort((a, b) => {
              // إذا كان تعليق a هو التعليق من الإشعار، ضعه أولاً
              if (a._id === notificationCommentId) return -1;
              if (b._id === notificationCommentId) return 1;
              return 0; // إذا لم يكن أي تعليق هو تعليق الإشعار، يتم الإبقاء على ترتيبهم
            });
      
            setCommentPosts(sortedComments); // تخزين التعليقات المرتبة في الحالة
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
      



//////////////////////////////////////


  const saveImageToDevice = async (imageUrl) => {
    setLoading(true); 
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
    } finally {
      setLoading(false);
    }
  };
 
  

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



    const { isNightMode, toggleNightMode } = useContext(NightModeContext);

    const [isMenuVisible, setMenuVisible] = useState(false); // For the menu visibility

    const handlePressOutside = () => {
        if (isMenuVisible) {
            setMenuVisible(false); // Close the menu when touched outside
        }
    };

        

    const getToken = async () => {
      try {
        const token = await AsyncStorage.getItem('expoPushToken');
        if (token !== null) {
          console.log('Token found:', token);
           setpushNotToken(token);
          return token;  // يمكنك استخدام التوكن هنا
        } else {
          console.log('No token found');
          return null;
        }
      } catch (error) {
        console.error('Error retrieving token:', error);
        return null;
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







//////////////////////////////////////  Chat  //////////////////////////////////////////////// 

const baseUrl = Platform.OS === 'web' 
? 'http://localhost:3000' 
: 'http://192.168.1.239:3000'; // عنوان IP الشبكة المحلية للجوال


    return (

                <View style={{ flex: 1,backgroundColor: isNightMode ? "#000" : primary }}>
                    <View style={{
                        height: Platform.OS === 'web' ? 50 : 0, backgroundColor: isNightMode ? "#000" : secondary
        
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


    <View
      style={{
        width: Platform.OS === 'web' ? '50%' : '100%',marginLeft:Platform.OS === 'web' ?'25%':'',
        alignItems: 'center',
        marginBottom: 15,marginTop: 30,
      }}
    >


        <View
          style={{
            backgroundColor: isNightMode ? '#3a3a3a' : '#fff',
            borderRadius: 15,
            padding: 15,
                    width: Platform.OS === 'web' ? '100%' : '95%',
        
            shadowColor: '#000',margin:10,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 5,
            elevation: 5,
          }}
        >
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
                borderColor: isNightMode ? '#ffff' : '#ddd',
              }}
            />
            <View>
              <Text style={{ color: isNightMode ? '#ffff' : '#000', fontWeight: 'bold', fontSize: 16 }}>
                {post.UserId.FullName}
              </Text>
              <Text style={{ color: '#888', fontSize: 12 }}>
                {new Date(post.createdAt).toLocaleString()}
              </Text>
            </View>
          </View>
  
          {/* Body */}
          <Text style={{ color: isNightMode ? '#fff' : '#000', fontSize: 16, lineHeight: 22, marginBottom: 15 }}>
            {post.Body}
          </Text>
          <View style={styles.divider} />
  
          {/* Images */}
          {post.Images && post.Images.length > 0 && post.Images.map((image, idx) => (
            <TouchableOpacity key={idx} onPress={() => openImageViewer(image?.secure_url)}>
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
                <video controls style={styles.video} src={video.secure_url} />
              ) : (
                <ExpoVideo
                  source={{ uri: video.secure_url }}
                  style={styles.video}
                  useNativeControls
                  resizeMode="contain"
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
  
          {/* Actions */}
         
         <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }}>
           {/* Like Button */}
           <TouchableOpacity  style={{ flexDirection: 'column', alignItems: 'center', marginRight: 0 }}>
             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
             <Text style={{ color: isNightMode ? primary : '#000', fontSize: 14, marginLeft: 0, fontWeight: 'bold',marginTop: 0 }}>
                 {post.like.length}
               </Text>
               <Ionicons name="heart-circle" size={27} color={post.isLiked ? '#ff0000' : '#ccc34'} />
              
             </View>
           </TouchableOpacity>
         

       <TouchableOpacity 
  onPress={() => ActionComment(post._id)} // تمرير الدالة بدون تنفيذها مباشرة
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

        
                  {/* Bottom Navigation Bar */}
                  {Platform.OS === 'web' ? null : (
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
                        zIndex: 10,
                      }}
                    >
                      <TouchableOpacity onPress={() => setMenuVisible(true)}>
                        <Ionicons name="settings" size={25} color='#000' />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => navigation.navigate('ProjectsSeniorPage', { userField })}>
                        <Ionicons name="folder" size={25} color='#000' />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => nav.navigate('ProfilePage')}>
                        <Image
                          source={require('./../assets/img1.jpeg')}
                          style={{
                            width: 33,
                            height: 33,
                            borderRadius: 30,
                            borderColor: isNightMode ? '#000' : '#000',
                            borderWidth: 2,
                            bottom: 3,
                          }}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => nav.navigate('AddPostScreen')}>
                        <Ionicons name="add-circle" size={28} color='#000' />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => nav.navigate('HomeScreen')}>
                        <Ionicons name="home" size={25} color='#000' />
                      </TouchableOpacity>
                    </Animated.View>
                  )}
                  
                  
                  
        
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
        height: '80%',
        flexDirection: 'column',
      }}>
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
            renderItem={(item) => {
              handleCommentAnimation(item.item._id); // تطبيق التأثير على أول تعليق
              return renderCommentItem(item);
            }}
            keyExtractor={(item) => item._id ? item._id.toString() : ''}
            contentContainerStyle={styles.commentList}
          />
        ) : (
          <Text style={[styles.noCommentsText, isNightMode && styles.noCommentsTextDark]}>No comment yet</Text>
        )}

        {/* تعليق جديد وإدخال */}
        <View style={[styles.commentInputContainer]}>
          <TextInput
            placeholder="Write a comment..."
            value={newCommentText}
            onChangeText={setNewCommentText}
            style={[styles.commentInput, isNightMode && styles.commentInputDark, { minHeight: 40, textAlignVertical: 'top' }]}
            multiline={true}
          />
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity onPress={pickImageComment} style={styles.imagePickerButton}>
              <Ionicons name="image" size={30} color={isNightMode ? 'white' : 'gray'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              if (newCommentText.trim() || editingImage) {
                isEditing ? updateMyComment(editingCommentId) : handleAddComment();
              }
            }} style={styles.commentSendButton}>
              <Ionicons name="send" size={15} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
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

menuContainer: {
    position: 'relative',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 10,
    padding: 10,
    
    flexDirection: 'row',
    justifyContent: 'space-around',
  },   divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 8,
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
});
 
  

