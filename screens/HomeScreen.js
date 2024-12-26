import React, { useState, useContext,useRef,useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, Image,TextInput,TouchableOpacity, StyleSheet, ToastAndroid, PermissionsAndroid, ScrollView,Animated, Button, Alert, Platform,TouchableWithoutFeedback,Keyboard, FlatList,KeyboardAvoidingView,flatListRef} from 'react-native';
import { Ionicons, Feather, FontAwesome5, EvilIcons, FontAwesome,Entypo,MaterialIcons
} from '@expo/vector-icons';
import axios from 'axios';
import * as MediaLibrary from 'expo-media-library';
import Modal from 'react-native-modal';
import { useNavigation } from '@react-navigation/native';
import { Dimensions } from 'react-native';
import { useFonts } from 'expo-font';
import { NightModeContext } from './NightModeContext';
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
import { Video } from 'react-native-video';
import ImageViewer from 'react-native-image-zoom-viewer';
// Color constants
const { secondary, primary, careysPink, darkLight, fourhColor, tertiary, fifthColor } = Colors;
const { width } = Dimensions.get('window');

import * as FileSystem from 'expo-file-system';
import * as Linking from 'expo-linking';
import * as DocumentPicker from 'expo-document-picker';

import * as DocumentViewer from 'expo-document-viewer'; // لاستعراض ملفات PDF
export default function HomeScreen({ navigation, route}) {


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




  const [selectedChatId, setSelectedChatId] = useState(null);



  const handleBubbleClick = (bubbleId) => {
    // إزالة الدردشة من قائمة الفقاعات (minimizedChats)
    setMinimizedChats((prev) => prev.filter((chat) => chat._id !== bubbleId));
  
    // الحصول على بيانات الشخص من minimizedChats باستخدام bubbleId
    const person = minimizedChats.find((chat) => chat._id === bubbleId);
  
    // إضافة الدردشة إلى قائمة الدردشات المفتوحة (selectedPeople)
    setSelectedPeople((prev) => {
      // تحقق إذا كانت الدردشة موجودة مسبقًا في قائمة الدردشات المفتوحة
      const isAlreadyOpen = prev.some((person) => person._id === bubbleId);
  
      if (!isAlreadyOpen && person) {
        // أضف الشخص إلى selectedPeople إذا لم تكن الدردشة مفتوحة بالفعل
        return [...prev, person];
      }
      return prev; // إذا كانت الدردشة مفتوحة، لا تفعل شيئًا
    });
  
    // استدعاء الدالة الخاصة بإزالة الفقاعة من التجمع (إذا لزم الأمر)
    handleRemoveBubble(bubbleId);
  };

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
 
    const [fileUri, setFileUri] = useState(null);
  

  
    const downloadFile = async (fileUrl, fileName) => {
      try {
        const fileUri = FileSystem.documentDirectory + fileName;
        const downloadResult = await FileSystem.downloadAsync(fileUrl, fileUri);
        return downloadResult.uri;
      } catch (error) {
        console.log('Error downloading file: ', error);
        Alert.alert('Error', 'Failed to download file');
      }
    };
    
    const getFileExtension = (fileName) => {
      return fileName.split('.').pop();
    };
  
  
  
    const getFileIcon = (fileExtension) => {
      switch (fileExtension) {
        case 'pdf':
          return <FontAwesome name="file-pdf-o" size={24} color="red" />;
        case 'jpg':
        case 'jpeg':
        case 'png':
          return <FontAwesome name="file-image-o" size={24} color="blue" />;
        case 'mp3':
          return <FontAwesome name="file-audio-o" size={24} color="green" />;
        case 'docx':
        case 'xlsx':
          return <FontAwesome name="file-word-o" size={24} color="orange" />;
        default:
          return <FontAwesome name="file-o" size={24} color="#555" />;
      }
    };


    const handleFilePress = async (uri, fileName) => {
      if (!Array.isArray(uri) || uri.length === 0) {
        Alert.alert('Error', 'Invalid file URL');
        return;
      }
    
      const fileUri = uri[0]; // استخراج أول عنصر من المصفوفة (الملف)
    
      const fileExtension = getFileExtension(fileName);
      const downloadedFileUri = await downloadFile(fileUri, fileName);
    
      // التعامل مع الملف بناءً على نوعه
      if (fileExtension === 'pdf') {
        DocumentViewer.previewDocumentAsync(downloadedFileUri)
          .catch((error) => {
            console.log('Error opening PDF: ', error);
            Alert.alert('Error', 'Failed to open PDF');
          });
      } else if (fileExtension === 'jpg' || fileExtension === 'jpeg' || fileExtension === 'png') {
        // عرض الصور
        Linking.openURL(downloadedFileUri);
      } else if (fileExtension === 'mp3') {
        // تشغيل الصوت
        Linking.openURL(downloadedFileUri);
      } else {
        Alert.alert('Unsupported File', 'This file type is not supported for viewing.');
      }
    };
  const handleCloseChat = (personId) => {
    
    setMinimizedChats((prev) => prev.filter((chat) => chat._id !== personId));
    console.log("after clos",minimizedChats);
    closeChat(personId); 
    handleRemoveBubble(personId);
  };

  const extractFileName = (filePathArray) => {
    console.log(filePathArray); // عرض المدخلات لفحصها
    if (!Array.isArray(filePathArray) || filePathArray.length === 0) return "Unknown File"; // تحقق من أن المدخل مصفوفة وغير فارغة
    
    const filePath = filePathArray[0]; // استخراج أول عنصر من المصفوفة
    if (typeof filePath !== "string" || !filePath) return "Unknown File"; // تحقق من أن العنصر نص
    
    const parts = filePath.split("\\"); // تقسيم النص إلى أجزاء باستخدام "\\"
    return parts[parts.length - 1] || "Unknown File"; // إذا لم يتم العثور على اسم ملف
  };
  const [minimizedChats, setMinimizedChats] = useState([]); // قائمة الفقاعات


  const handleMessageChange = (chatId, text) => {
    setNewMessage((prev) => ({
      ...prev,
      [chatId]: text, // Update the text for the specific chatId
    }));
  };
  



  
  const sendMessage = (personId) => {
    setMessages(prevMessages => ({
      ...prevMessages,
      [personId]: [
        ...(prevMessages[personId] || []),
        { sender:'you', text: newMessage[personId] },
      ],
    }));
  
    setNewMessage(prevState => ({
      ...prevState,
      [personId]: '', // مسح النص المدخل بعد الإرسال
    }));
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

  const [gatheredChats, setGatheredChats] = useState([]);

  const handleCloseAllBubbles = () => {
// دالة لإغلاق الفقاعات المتجمعة فقط عند الضغط على علامة الإغلاق
const handleCloseGatheredBubbles = () => {
  // إزالة جميع الفقاعات المتجمعة من gatheredChats
  setGatheredChats([]);

  // تحديث minimizedChats لإزالة الفقاعات التي كانت في التجمع
  setMinimizedChats(prevMinimizedChats => 
    prevMinimizedChats.filter(chatId => !gatheredChats.includes(chatId))
  );
};
  };

  // دالة لإزالة فقاعة معينة من الفقاعات المعروضة
const handleRemoveBubble = (chatId) => {
  // إذا كانت الفقاعات المعروضة أقل من 4، أضف الفقاعة من التجمع إلى المعروض
  if (minimizedChats.length < 4 && gatheredChats.length > 0) {
    console.log(gatheredChats);

    const nextBubble = gatheredChats[0]; // أخذ أول فقاعة في التجمع

    setMinimizedChats((prevMinimizedChats) => [
      ...prevMinimizedChats,
      nextBubble, // إضافة البيانات الكاملة للفقاعة
    ]);

    // إزالة الفقاعة من التجمع
    setGatheredChats((prevGatheredChats) =>
      prevGatheredChats.filter((chat) => chat._id !== nextBubble._id) // التحقق باستخدام _id
    );

    console.log(gatheredChats);
  }
};

  // دالة لإضافة فقاعة جديدة
  const addBubble = (person) => {
    // إذا كان عدد الفقاعات المعروضة أقل من 4، أضف الفقاعة إلى المعروض
    if (minimizedChats.length < 4) {
      setSelectedPeople((prevPeople) => prevPeople.filter((p) => p._id !== person._id));  // استخدام _id بدلاً من id
      setMinimizedChats((prevMinimizedChats) => [
        ...prevMinimizedChats,
        { _id: person._id, PictureProfile: person.PictureProfile, FullName: person.FullName },  // إضافة صورة الشخص مع _id
      ]);
    } 
    else {
      setSelectedPeople((prevPeople) => prevPeople.filter((p) => p._id !== person._id));  // استخدام _id بدلاً من id
      // إذا كانت الفقاعات المعروضة بالفعل 4، أضف الفقاعة إلى التجمع
      setGatheredChats((prevGatheredChats) => [
        ...prevGatheredChats,
        { _id: person._id, PictureProfile: person.PictureProfile, FullName: person.FullName },  // إضافة البيانات الكاملة للشخص إلى التجمع
      ]);
    }
  };
  

// دالة لتقليص الفقاعة عند إزالتها من التجمع
const handleBubbleMinimize = (person) => {
  if (minimizedChats.length < 4) {
    // إضافة الشخص إلى minimizedChats مع بياناته الكاملة
    setMinimizedChats((prevMinimizedChats) => [
      ...prevMinimizedChats,
      person,  // إضافة الكائن الكامل (person) بدلاً من chatId
    ]);
  } else {
    // إزالة الشخص من التجمع
    setGatheredChats((prevGatheredChats) =>
      prevGatheredChats.filter((chat) => chat._id !== person._id) // التحقق باستخدام _id
    );
  }
};

  const handleCloseGatheredBubbles = () => {
    // إزالة جميع الفقاعات المتجمعة من gatheredChats
    setGatheredChats([]);
  };

  const renderGatheredBubble = () => {
    if (gatheredChats.length > 0) {
      return (
        <View
          style={{
            position: 'relative', // لتحديد مكان زر الإغلاق
          }}
        >
          <TouchableOpacity
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: '#ccc',
              justifyContent: 'center',
              alignItems: 'center',
              margin: 8,
              borderWidth: 1,
              borderColor: '#ccc',
            }}
            onPress={() => {handleCloseGatheredBubbles() // حذف الفقاعات المتجمعة فقط
          }}
            onMouseEnter={() => setIsGatheredBubbleHovered(true)} // عند التمرير على التجمع
            onMouseLeave={() => setIsGatheredBubbleHovered(false)} // عند الخروج من التجمع
          >
            <Text style={{ fontSize: 12, color: 'black' }}>
              {gatheredChats.length} + {/* عرض عدد الفقاعات المتجمعة */}
            </Text>
          </TouchableOpacity>
  
          {isGatheredBubbleHovered && ( // عند التمرير على التجمع يظهر زر الإغلاق
            <TouchableOpacity
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                backgroundColor: 'red',
                borderRadius: 12,
                width: 20,
                height: 20,
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1,
              }}
            >
              <FontAwesome name="close" size={12} color="white" />
            </TouchableOpacity>
          )}
        </View>
      );
    }
    return null;
  };





  const handleChatOpen = (personId) => {
    setSelectedChatId(personId);  // أو أي معرّف آخر تستخدمه لتمييز الشات
  };

  // دالة لإدارة الفقاعات عند التجميع أو العرض
  const handleChatChange = (person) => {
      addBubble(person);
      handleRemoveBubble(person);
  };

  const handleBothFunctions = (person) => {
 //   handleMinimizeChat(person.id);  // استدعاء handleMinimizeChat باستخدام person.id
    handleChatChange(person);        // استدعاء handleChatChange باستخدام person
  };
  


  

    const { userField } = route.params || {};
    const nav = useNavigation();
    const { isNightMode, toggleNightMode } = useContext(NightModeContext);
    const [scrollY] = useState(new Animated.Value(0));

    const bottomBarTranslate = scrollY.interpolate({
        inputRange: [0, 50],
        outputRange: [0, 100], // 100 to move it off-screen
        extrapolate: 'clamp',
    });
    const [isMenuVisible, setMenuVisible] = useState(false); // For the menu visibility

    const [chatId, setchatId] = useState(); // For the menu visibility

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

    const handlePressOutside = () => {
        if (isMenuVisible) {
            setMenuVisible(false); // Close the menu when touched outside
        }
    };


  

    const [hoveredMessageId, setHoveredMessageId] = useState(null); // لتحديد الرسالة التي يتم التمرير عليها


      const [hoveredPersonId, setHoveredPersonId] = useState(null); // حالة لتخزين الشخص الذي يتم التمرير عليه







        const [selectedMessage, setSelectedMessage] = useState(null); // لتحديد الرسالة المختارة
        const [isModalVisible, setIsModalVisible] = useState(false); // التحكم في ظهور القائمة
      
        // دالة فتح القائمة
        const openMenu = (message) => {
          setSelectedMessage(message);
          setIsModalVisible(true);
        };


           // دالة حذف الرسالة
  const deleteMessage = () => {
    // منطق الحذف هنا
    console.log('Delete message:', selectedMessage);
    setIsModalVisible(false);
  };

  // دالة تعديل الرسالة
  const editMessage = () => {
    // منطق التعديل هنا
    console.log('Edit message:', selectedMessage);
    setIsModalVisible(false);
  };



  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible); // تبديل حالة الشريط الجانبي
  
  };
  
  








//////////////////////////////////////  Chat  //////////////////////////////////////////////// 

const baseUrl = Platform.OS === 'web' 
? 'http://localhost:3000' 
: 'http://192.168.1.239:3000'; // عنوان IP الشبكة المحلية للجوال

const fetchFriends = async () => {
  console.log("sama");
 /* if (Platform.OS === 'web') {
    // على الويب، استخدم localStorage
    const token = localStorage.getItem('userToken');
    console.log(token);
  } else {
    const token = await AsyncStorage.getItem('userToken'); // الحصول على التوكن من التخزين
    console.log(token);
  }*/
  try {
    const token = await AsyncStorage.getItem('userToken'); // الحصول على التوكن من التخزين
    console.log(token);
    if (!token) {
      console.error('Token not found');
      return;
  }
 
  const response = await fetch(`${baseUrl}/chat/getchatusers`, {
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
  console.log('Friends:',data );
    setFriends(data.users); 
  } catch (error) {
    console.error('Error fetching friends:', error);
}
finally {
  setLoading(false);
}
};

const fetchChatMessagesByChatId = async (chatId) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      console.error('Token not found');
      return;
    }

    const response = await fetch(`${baseUrl}/chat/getchatmessages/${chatId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Wasan__${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    setchatId(chatId);
    setMessages((prevMessages) => ({
      ...prevMessages,
      [chatId]: data.messages, 
    }));

    console.log(`Messages for chat ${chatId}:`, data.messages);
  } catch (error) {
    console.error('Error fetching chat messages:', error);
  }
};


const fetchChatIdForPerson = async (personId) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      console.error('Token not found');
      return;
    }

    const response = await fetch(`${baseUrl}/chat/getallchats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Wasan__${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const allChats = data.chats;

    // البحث عن الشات الذي يحتوي على الشخص المحدد
    const chat = allChats.find(chat =>
      chat.users.includes(personId)
    );

    if (chat) {
      console.log(`Found Chat ID: ${chat._id}`);
      await fetchChatMessagesByChatId(chat._id); // جلب الرسائل بناءً على Chat ID
    } else {
      console.error('No chat found for this user.');
    }
  } catch (error) {
    console.error('Error fetching chat ID for person:', error);
  }
};


const handleChatSelect = (selectedChatId) => {
  if (messages[selectedChatId]) {
    setActiveChatId(selectedChatId); // تعيين الـ activeChatId
  } else {
    fetchChatMessagesByChatId(selectedChatId); // جلب الرسائل إذا لم تكن موجودة
  }
};



useEffect(() => {

  fetchFriends();      handleGetAllPosts();

  console.log('Messages state:', messages);

  console.log('Gathered chats:', gatheredChats);
  console.log('min',minimizedChats);
  console.log("selectedPeiple",selectedPeople)
}, [gatheredChats],[minimizedChats], [messages],[selectedPeople]);














const handleSelectedPerson = async (item) => {
  setSelectedPeople((prevSelectedPeople) => {
    if (prevSelectedPeople.some(person => person._id === item._id)) {
      console.log("Person already in selected chats:", prevSelectedPeople);
      return prevSelectedPeople;
    }

    if (minimizedChats.some(person => person._id === item._id)) {
      setMinimizedChats((prevMinimizedChats) =>
        prevMinimizedChats.filter(chat => chat._id !== item._id)
      );
      return [...prevSelectedPeople, item];
    }

    if (gatheredChats.some(person => person._id === item._id)) {
      setGatheredChats((prevGatheredChats) =>
        prevGatheredChats.filter(chat => chat._id !== item._id)
      );
      return [...prevSelectedPeople, item];
    }

    if (prevSelectedPeople.length >= 3) {
      return [...prevSelectedPeople.slice(1), item];
    }

    return [...prevSelectedPeople, item];
  });

  // استدعاء الدالة للبحث عن Chat ID وجلب الرسائل
  await fetchChatIdForPerson(item._id);
  handleChatOpen(item._id);
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
    
          const response = await fetch(`${baseUrl}/post/getallpost`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Wasan__${token}`,
            },
          });
          
          console.log('Response:', response); 
          
          if (!response.ok) {
            throw new Error('Failed to fetch posts');
          }
          
          const data = await response.json();
          console.log('Fetched posts:', data);
    
          if (Array.isArray(data.posts) && data.posts.length > 0) {
            setPosts(data.posts);
          } else {
            console.error('No posts found or data is not an array', data);
          }

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setIsLoading(false);
      }
    };
    
    
    


    return (
        <TouchableWithoutFeedback onPress={handlePressOutside}> 
        <View style={{ flex: 1 }}>
        <View style={{ height: 20, backgroundColor: isNightMode ? "#000" : secondary }} />

            {/* Header */}
            <View style={{
                flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, paddingVertical: 10, backgroundColor: isNightMode ? "#000" : secondary,
                position: Platform.OS === 'web' ? 'fixed' : ' ',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 10,

            }}>
                <Text style={{ fontFamily: 'Updock-Regular', fontSize: 30, position: 'absolute', left: 0, right: 0, textAlign: 'center', color: isNightMode ? primary : "#000" }}>
                    Talent Bridge
                </Text>

                <TouchableOpacity onPress={toggleSidebar}>
                    <EvilIcons name="sc-telegram" size={39} color={careysPink} style={{ position: 'absolute', top: -20, left: 10 }} />
                    <EvilIcons name="sc-telegram" size={37} color={darkLight} style={{ position: 'absolute', top: -20, left: 10 }} />
                </TouchableOpacity>


                <TouchableOpacity onPress={toggleNightMode}>
                    <View style={{ position: 'relative', width: 50, height: 50 }}>
                        <Ionicons name={isNightMode ? "sunny" : "moon"} size={25} color={darkLight} style={{ position: 'absolute', top: 9, right: 20 }} />
                        <Ionicons name="cloud" size={30.7} color={isNightMode ? "#000" : secondary} style={{ position: 'absolute', top: 8.7, left: -12 }} />
                        <Ionicons name="cloud" size={27} color={careysPink} style={{ position: 'absolute', top: 11, left: -11 }} />
                    </View>
                </TouchableOpacity>
            </View>

            {/* Icon Navigation */}
            <View style={{
                flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, paddingVertical: 10, backgroundColor: fourhColor, elevation: 3
                , position: Platform.OS === 'web' ? 'fixed' : ' ',
                zIndex: 10, width: '100%',
                top: Platform.OS === 'web' ? 55 : ' ',
                marginBottom: Platform.OS === 'web' ? 20 : ' ',

            }}>
                <TouchableOpacity onPress={() => nav.navigate('Search')}>
                    <Ionicons name="search" size={25} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => nav.navigate('notifications')}>
                    <Ionicons name="notifications" size={25} color={secondary} />
                </TouchableOpacity>
            </View>

  {/* الشريط الجانبي */}
  <View style={{ flexDirection: 'row', flex: 1 }}>
  {/* الشريط الجانبي */}
  {Platform.OS === 'web' && isSidebarVisible && (
  <View style={{
    position: 'fixed',
    width: '30%',
    height: '100%',
    backgroundColor: isNightMode ? '#333' : '#fff',
    padding: 10,
    zIndex: 5,
    borderRightWidth: 1,
    borderColor: '#ccc',
    overflow: 'auto',
    paddingVertical: 10,
    marginTop: Platform.OS === 'web' ? 80 : 0,
    height: `calc(100vh - 0px - 150px)`,
    overflowY: 'auto',
  }}>
    <Text style={{
      color: isNightMode ? '#fff' : '#000',
      fontSize: 18,
      marginBottom: 20,
      fontWeight: 'bold',
    }}>
      Friend List
    </Text>
    {loading ? (
      <Text style={{
        color: isNightMode ? '#fff' : '#000',
        fontSize: 16,
        textAlign: 'center',
      }}>
        Loading...
      </Text>
    ) : (
      <FlatList
        data={friends}
        renderItem={({ item }) => (
          <TouchableOpacity
            key={item._id}
            onPress={() => handleSelectedPerson(item)}
            style={{
              padding: 15,
              borderBottomWidth: 1,
              borderBottomColor: '#ccc',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              borderRadius: 8,
              marginBottom: 10,
              backgroundColor: isNightMode ? '#444' : '#f9f9f9',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
            }}
          >
            {/* عرض صورة المستخدم */}
            <Image
              source={{
                uri: item.PictureProfile && item.PictureProfile.secure_url
                  ? item.PictureProfile.secure_url
                  : 'https://www.example.com/default-avatar.png', // رابط صورة افتراضية على الإنترنت
              }}
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                marginRight: 15,
                borderWidth: 2,
                borderColor: isNightMode ? '#fff' : '#444',
              }}
            />
            {/* عرض اسم المستخدم */}
            <Text style={{
              color: isNightMode ? '#fff' : '#000',
              fontSize: 16,
              fontWeight: '500',
            }}>
              {item.FullName}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item._id.toString()}
      />
    )}
  </View>
)}


 
  {/* المحتوى الرئيسي (المنشورات) */}
  <Animated.ScrollView
    style={{
      flex: 1,
      backgroundColor: isNightMode ? "#000" : primary,
      marginLeft: Platform.OS === 'web' && isSidebarVisible ? '30%' : 0,  // تحديد المسافة في حالة وجود الشريط الجانبي
    }}
    contentContainerStyle={{
      flexGrow: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingVertical: 10,
      marginTop: Platform.OS === 'web' ? 80 : 0,
      marginBottom: Platform.OS === 'web' ? 50 : 0,
    }}
    onScroll={Animated.event(
      [{ nativeEvent: { contentOffset: { y: scrollY } } }],
      { useNativeDriver: false }
    )}
    scrollEventThrottle={16}
  >
<Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 15, textAlign: 'center', color: isNightMode ? primary : '#000' }}>
  Posts
</Text>
{posts.map((post, index) => (
  <React.Fragment key={index}>
    <View
      style={{
        width: Platform.OS === 'web' ? '50%' : '100%',
        alignItems: 'center',
        marginBottom: 15,
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
          <RNVideo
            key={idx}
            source={{ uri: video.secure_url }}
            style={{
              width: '100%',
              height: 300,
              borderRadius: 10,
              marginBottom: 10,
            }}
            controls
          />
        ))}

        {/* Files */}
        {post.Files && post.Files.length > 0 && post.Files.map((file, index) => (
        <TouchableOpacity
          key={index}
          style={styles.fileCard}
          onPress={() => openFile(post.Files)} // فتح الملف أولاً
        >
          <FontAwesome name="file-o" size={24} color="#555" style={styles.icon} />
          <Text style={styles.fileName}>
            {extractFileName(post.Files) || 'Click to view/download file'}
          </Text>
        </TouchableOpacity>
      ))}

        {/* Actions */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }}>
          <TouchableOpacity style={{ alignItems: 'center' }}>
            <Ionicons name="heart-circle" size={30} color={isNightMode ? secondary : Colors.brand} />
            <Text style={{ color: isNightMode ? primary : '#000', fontSize: 14 }}>Like</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ alignItems: 'center' }}>
            <Ionicons name="chatbubbles" size={28} color={isNightMode ? secondary : Colors.brand} />
            <Text style={{ color: isNightMode ? primary : '#000', fontSize: 14 }}>Comment</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>

    {/* Divider */}
    {index < posts.length - 1 && (
      <View style={{ width: '100%', height:3, backgroundColor: isNightMode ? '#555' : '#ddd', marginVertical: 20 }} />
    )}
  </React.Fragment>
))}





  </Animated.ScrollView>

  
  {Platform.OS === 'web' && (
  <View
    style={{
      position: 'fixed',
      left: 0,
      right: 0,
      bottom: 45,
      backgroundColor: 'transparent',
      padding: 10,
      marginLeft: '93%',
      flexWrap: 'wrap',
    }}
  >
    <ScrollView
      style={{ flexDirection: 'column' }}
      contentContainerStyle={{
        flexDirection: 'column',
        paddingHorizontal: 10,
        alignItems: 'flex-end',
      }}
    >


{/* عرض الفقاعات بناءً على minimizedChats فقط */}
{minimizedChats.map((chat) => (
  <View
    key={chat._id} // استخدم chat._id كـ key
    style={{ position: 'relative', marginBottom: 10 }}
    onMouseEnter={() => setHoveredPersonId(chat._id)}
    onMouseLeave={() => setHoveredPersonId(null)}
  >
    <TouchableOpacity
      style={{
        width: 40,
        height: 40,
        borderRadius: 25,
        backgroundColor: isNightMode ? '#444' : '#f9f9f9',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 15,
        flexDirection: 'column',
      }}
      onPress={() => handleBubbleClick(chat._id)}
    >
      {/* عرض صورة الشخص بدلاً من النص */}
      <Image
  source={{
    uri: chat.PictureProfile && chat.PictureProfile.secure_url 
      ? chat.PictureProfile.secure_url 
      : 'https://www.example.com/default-avatar.png', // رابط صورة افتراضية على الإنترنت
  }}
  style={{ width:40, height: 40, borderRadius: 20 }}
/>
    </TouchableOpacity>

    {hoveredPersonId === chat._id && (
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          backgroundColor: 'red',
          borderRadius: 12,
          width: 20,
          height: 20,
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1,
        }}
        onPress={() => handleCloseChat(chat._id)}
      >
        <FontAwesome name="close" size={12} color="white" />
      </TouchableOpacity>
    )}
  </View>
))}

{renderGatheredBubble()}

    </ScrollView>

  </View>

)}




{Platform.OS === 'web' && (
  <View
    style={{
      position: 'fixed',
      left: 0,
      right: 0,
      bottom: 45,
      backgroundColor: 'transparent',
      padding: 10,
      marginLeft: Platform.OS === 'web' && isSidebarVisible ? '30%' : 0,
      marginRight: '7%',
    }}
  >
    {/* عرض الشات المفتوح */}
    <ScrollView
      horizontal
      contentContainerStyle={{
        flexDirection: 'row',
        paddingHorizontal: 10,
      }}
    >
      {selectedPeople.map((person) =>
        !minimizedChats.includes(person._id) && (
          
          <View
            key={person._id}
            style={{
              width: 300,
              height: 400,
              marginHorizontal: 5,
              padding: 0,
              borderRadius: 10,
              overflow: 'hidden',
              borderWidth: 1,
              borderColor: '#ccc',
              backgroundColor: isNightMode ? '#444' : '#f9f9f9',
            }}
          >
            {console.log("chat:",person._id)} {/* تحقق من محتويات الرسائل */}

           <View
                  style={{
                 backgroundColor: Colors.darkLight,
     paddingVertical: 10,
               paddingHorizontal: 15,
       flexDirection: 'row',
        justifyContent: 'space-between',
      alignItems: 'center',
       borderBottomWidth: 1,
            borderBottomColor: isNightMode ? '#222' : '#ccc',
  }}
 >
  {/* الاسم في المنتصف */}
  <View style={{ flex: 1 }}>
    <Text style={{ fontWeight: 'bold', fontSize: 16, color: 'white', textAlign: 'left' }}>
      {person.FullName}
    </Text>
  </View>

  {/* أيقونة الماينس وأيقونة الإغلاق في الجانب الأيمن */}
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    {/* أيقونة الماينس */}
    <TouchableOpacity
      onPress={() => handleBothFunctions(person)}
      style={{
        marginRight: 15, // مسافة ثابتة بين الأيقونتين
      }}
    >
      <FontAwesome name="minus" size={18} color='white' />
    </TouchableOpacity>

    {/* أيقونة الإغلاق */}
    <TouchableOpacity
      onPress={() => closeChat(person._id)}
    >
      <FontAwesome name="close" size={20} color='white' />
    </TouchableOpacity>
  </View>
           </View>


  <ScrollView
  style={{ flex: 1, padding: 10 }}
  contentContainerStyle={{ paddingBottom: 10 }}
 >
  {console.log(messages)} {/* تحقق من محتويات الرسائل */}
  {(messages[chatId] || []).map((message) => (
    <View
    key={message._id}
    
    style={{
      alignSelf: message.sender._id === 'you' ? 'flex-end' : 'flex-start',
      backgroundColor: message.sender._id === 'you' ? Colors.secondary : Colors.darkLight,
      padding: 8,
      borderRadius: 10,
      marginBottom: 5,
      maxWidth: '75%',
    }}
  >
    <Text style={{ fontSize: 14, color: '#fff' }}>{message.content}</Text>
    <Text
      style={{
        fontSize: 10,
        color: message.sender._id === 'you' ? '#ddd' : '#555',
        marginTop: 5,
      }}
    >
      {new Date(message.timestamp).toLocaleString()} {/* عرض وقت الإرسال */}
    </Text>

      {hoveredMessageId === message._id && message.sender._id === 'you' && (
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 5,
            right: -25,
          }}
          onPress={() => openMenu(message)} // الضغط على النقاط الثلاث لفتح القائمة
        >
          <FontAwesome name="ellipsis-v" size={16} color="#555" />
        </TouchableOpacity>
      )}
    </View>
  ))}
  </ScrollView>

  {/* القائمة المنبثقة */}
      {isModalVisible && (
        <Modal transparent={true} animationType="fade" visible={isModalVisible}>
          <TouchableOpacity
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}
            onPress={() => setIsModalVisible(false)} // إغلاق القائمة عند النقر خارجها
          >
            <View
              style={{
                backgroundColor: 'white',
                padding: 20,
                borderRadius: 10,
                width: '70%',
              }}
            >
              <TouchableOpacity onPress={deleteMessage}>
                <Text style={{ fontSize: 16, marginBottom: 10 }}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={editMessage}>
                <Text style={{ fontSize: 16 }}>Edit</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
  

            {/* منطقة الإدخال */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 5,
                backgroundColor: isNightMode ? '#333' : '#fff',
              }}
            >
              {/* أيقونات الصور، الفيديو، الملفات */}
  <TouchableOpacity  style={{ marginHorizontal: 5 }}>
    <FontAwesome name="image" size={20} color={Colors.fifthColor} />
  </TouchableOpacity>
  
  <TouchableOpacity  style={{ marginHorizontal: 5 }}>
    <Entypo name="video" size={20} color={Colors.fifthColor} />
  </TouchableOpacity>
  
        <TouchableOpacity  style={{ marginHorizontal: 5 }}>
    <MaterialIcons name="attach-file" size={20} color={Colors.fifthColor} />
                </TouchableOpacity>
            <TextInput
                 style={{
                       width: 165, // عرض أصغر
                      height: 40, // ارتفاع النص
                      borderRadius: 20, // دائري الشكل
                     paddingHorizontal: 15, // مساحة داخلية أفقية
                     fontSize: 14, // حجم النص
                       backgroundColor: '#f9f9f9', // لون الخلفية
                      color: '#333', // لون النص
               }}
                multiline // عدم السماح بعدة أسطر
                placeholder="Write Message..."
                placeholderTextColor="#888"
                value={newMessage[chatId] || ''}
                scrollEnabled={true} // تمكين التمرير داخل الحقل
                onChangeText={(text) => handleMessageChange(chatId, text)}
              />

              <TouchableOpacity onPress={() => sendMessage(chatId)}>
                <Ionicons name="send" size={20} color={Colors.fifthColor} style={{ marginLeft: 10 }} />
              </TouchableOpacity>
            </View>
          </View>
        )
        
      )}
           

    </ScrollView>
  </View>

)}

</View>
  


            {/* Bottom Navigation Bar */}
            <Animated.View
                style={{
                    transform: [{ translateY: bottomBarTranslate }],
                    backgroundColor: isNightMode ?  "#454545":secondary,
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
                    <Ionicons name="settings" size={25} color ='#000'/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() =>navigation.navigate('ProjectsSeniorPage', { userField }) }  >
                    <Ionicons name="folder" size={25} color ='#000' />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => nav.navigate('ProfilePage')}>
                    <Image
                        source={require('./../assets/img1.jpeg')}
                        style={{
                            width: 33,
                            height: 33,
                            borderRadius: 30,
                            borderColor:isNightMode ? '#000' : '#000',
                            borderWidth: 2,
                            bottom:3
                        }}
                    />
                </TouchableOpacity>
                
                <TouchableOpacity onPress={() => nav.navigate('AddPostScreen')}>
                    <Ionicons name="add-circle" size={28} color ='#000'/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => nav.navigate('HomeScreen')}>
                    <Ionicons name="home" size={25} color ='#000' />
                </TouchableOpacity>
            </Animated.View>




   

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
                title="Dounlowd Image"
                color={Colors.darkLight}
                onPress={() => saveImageToDevice(currentImage[0]?.url)}
              />
            </View>
          )}
        />
      </Modal>


       
        </View>
    </TouchableWithoutFeedback>);






};

const styles = StyleSheet.create({
  menuContainer: {
    position: 'absolute',
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
});
 
  