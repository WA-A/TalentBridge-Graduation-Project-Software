import React, {  useRef,useState, useContext,useEffect } from 'react';
import { View, Text, TouchableOpacity,StyleSheet, Modal, FlatList, ScrollView, Image,Platform,Animated} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { NightModeContext } from './NightModeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from './../compnent/Style';
import { TextInput } from 'react-native-gesture-handler';
const { tertiary, firstColor, secColor,fifthColor,secondary, primary, darkLight, fourhColor, careysPink} = Colors;
import { EvilIcons,AntDesign,Feather,FontAwesome5,FontAwesome
} from '@expo/vector-icons';
import MultiSelect from 'react-native-multiple-select';
import { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { Dimensions } from "react-native";
import * as Animatable from "react-native-animatable";
import Slider from '@react-native-community/slider';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import ImageViewer from 'react-native-image-zoom-viewer';
import * as WebBrowser from 'expo-web-browser'
import { decode as atob } from 'base-64'; // إذا كنت تستخدم React Native
import * as DocumentPicker from "expo-document-picker";
const { width } = Dimensions.get("window");

export default function ChatMopile ({ navigation, route }) {
  const {projectID} = route.params || {}; 

    const baseUrl = Platform.OS === 'web'
      ? 'http://localhost:3000'
      : 'http://192.168.1.239:3000' || 'http://192.168.0.107:3000';
        const [selectedFeilds, setSelectedFeilds] = useState([]);
        const [Feilds, setFeilds] = useState([]);
  const [currentModal, setCurrentModal] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState('');
const [project,setProject]=useState();
  const openModal = (modalName) => {
    setCurrentModal(modalName);
    setModalVisible(true);
    setError('');
    setSelectedField([]);
  };
    // إغلاق الـ Modal
    const closeModal = () => {
      setModalVisible(false);
      setCurrentModal('');
    };
    const onSelectedItemsChange = (selectedItems) => {
      setSelectedFeilds(selectedItems); // تحديث حالة اللغات المحددة
  
    };
  
    /////////////////////////////////////////// Filter /////////////////////////////////////////////////////
    const flatListRef = useRef(null); // مرجع لـ FlatList





    const [selectedMessage, setSelectedMessage] = useState(null); // الرسالة المختارة عند الضغط المطول
    const [isModalVisibleMassage, setModalVisibleMassage] = useState(false); // للتحكم في ظهور المودال
  
    // التعامل مع حذف الرسالة
    const handleDeleteMessage = (messageId) => {
      console.log(`Delete message with ID: ${messageId}`);
      deleteMessage(messageId);
      setModalVisibleMassage(false);
    };
  
    // التعامل مع تعديل الرسالة
    const handleEditMessage = (messageId) => {
      console.log(`Edit message with ID: ${messageId}`);
      setModalVisibleMassage(false);
    };
  
    // فتح المودال عند الضغط المطوّل
    const handleLongPressMessage = (messageId) => {
      setSelectedMessage(messageId);
      setModalVisibleMassage(true);
    };




    const [isModalVisible, setIsModalVisible] = useState(false);
   
  
    const toggleModal = () => setIsModalVisible(!isModalVisible);
  

      const [selectedFilters, setSelectedFilters] = useState({
        projectName: "",
        seniorName: "",
        minPrice: 0,
        maxPrice: 1000,
        field: "",
        status: "",
      });
      const [filterType, setFilterType] = useState(null); // نوع الفلترة المختار
    
      const [activeFilters, setActiveFilters] = useState([]); // قائمة الفلاتر النشطة

      const toggleFilter = (filterType) => {
        if (activeFilters.includes(filterType)) {
          setActiveFilters((prev) => prev.filter((filter) => filter !== filterType));
        } else {
          setActiveFilters((prev) => [...prev, filterType]);
        }
      };
      const handleSliderChange = (minPrice, maxPrice) => {
        setSelectedFilters({ minPrice, maxPrice });
      };
      const resetFilters = () => {
        setSelectedFilters({
          projectName: "",
          seniorName: "",
          minPrice: 0,
          maxPrice: 1000,
          field: "",
          status: "",
        });
        setActiveFilters([]);
      };
    
   
    /////////////////////////////////////////////////////////////////////////////////////////////////////////
  
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
     //       console.log('Fetched Feilds:', data.Fields); // تحقق من البيانات
          } catch (error) {
            console.error('Error fetching Feilds:', error.message);
          }
        };
      

        const handleGetProjectByFeildOrSkills = async () => {
          try {
            const token = await AsyncStorage.getItem('userToken'); // استرجاع التوكن
            console.log('Retrieved Token:', token); // تحقق من التوكن
            if (!token) { 
              console.error('Token not found');
              return;
            }
      
            const response = await fetch(`${baseUrl}/project/GetProjectsByFieldAndSkills`, {
              method: 'GET',
              headers: {
                'Authorization': `Wasan__${token}`, // تأكد من التنسيق الصحيح هنا
              },
            });
      
            if (!response.ok) {
              const errorData = await response.json(); // إذا كان هناك خطأ في الرد
              throw new Error(errorData.message || 'Failed to fetch skills');
            }
      
            const data = await response.json(); // تحويل الرد إلى JSON
            setProject(data.projects);

            console.log('Fetched Project:', data.projects); // تحقق من البيانات

          } catch (error) {
            console.error('Error fetching Project:', error.message);
          }
        };

           
        const handleSave = async (selectedFeilds) => {

          if (currentModal === 'Feild') {
       console.log(selectedFeilds);
    //   GetProjectsByField(selectedFeilds[0]);
       setSelectedFilters((prev) => ({
        ...prev,
       field:selectedFeilds[0] ,
      }))
      closeModal();
          }
      
        };
        const handleFilter = async () => {
          console.log(selectedFilters.maxPrice);
          try {
            const token = await AsyncStorage.getItem("userToken"); // استرجاع التوكن
            if (!token) {
              setError("Token not found. Please log in.");
              return;
            }
        
            // بناء استعلام الفلاتر بناءً على الفلاتر المحددة
            const queryParams = new URLSearchParams({
              ...(selectedFilters.projectName && { projectName: selectedFilters.projectName }),
              ...(selectedFilters.minPrice !='undefined' &&
                selectedFilters.maxPrice != 'undefined' && {
                  priceRange: `${selectedFilters.minPrice}-${selectedFilters.maxPrice}`,
                }),              ...(selectedFilters.seniorName && { seniorName: selectedFilters.seniorName }),
              ...(selectedFilters.field && { FieldId: selectedFilters.field }),
              ...(selectedFilters.status && { status: selectedFilters.status }),
            }).toString();
        
            const response = await fetch(`${baseUrl}/project/filterprojects?${queryParams}`,
              {
                method: "GET",
                headers: {
                  Authorization: `Wasan__${token}`,
                },
              }
            );
        
            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || "Failed to fetch projects.");
            }
        
            const data = await response.json(); // تحويل الرد إلى JSON
            setProject(data.projects);
            if(data.projects.filteredProjects == null){
              console.log(data.message);
              setProject(null);
            }
            console.log('Fetched Project:', data.projects); // تحقق من البيانات
                  setModalVisible(false);
          } catch (error) {
            console.error('Error fetching Project:', error.message);
          }
        };
        
        const applyFilters = () => {
          console.log('Filters applied:', selectedFilters);
          handleFilter(); // استدعاء دالة الفلترة التي تقوم بإرسال الفلاتر إلى الخادم
          toggleModal(); // إغلاق المودال بعد تطبيق الفلاتر
        };
         
        const GetProjectsByField = async (id) => {
          console.log(id);
          try {
            const token = await AsyncStorage.getItem('userToken'); // استرجاع التوكن
            console.log('Retrieved Token:', token); // تحقق من التوكن
            if (!token) { 
              console.error('Token not found');
              return;
            }
      
            const response = await fetch(`${baseUrl}/project/viewprojectbyfiled/${id}`, {
              method: 'GET',
              headers: {
                'Authorization': `Wasan__${token}`, // تأكد من التنسيق الصحيح هنا
              },
            });
      
            if (!response.ok) {
              const errorData = await response.json(); // إذا كان هناك خطأ في الرد
              throw new Error(errorData.message || 'Failed to fetch skills');
            }
      
            const data = await response.json(); // تحويل الرد إلى JSON
            setProject(data.projects);
            if(data.projects == null){
              console.log("no project");
              setProject(null);
            }
            console.log('Fetched Project:', data.projects); // تحقق من البيانات
                  setModalVisible(false);
          } catch (error) {
            console.error('Error fetching Project:', error.message);
          }
        };
        const navigateToProjectDetails = (project,userRole) => {
          // Implement navigation logic here, e.g., navigation.navigate('ProjectDetails', { project });
          console.log('Navigate to Project Details:', project);
          navigation.navigate('ProjectPage', { userData: project,RoleUser:userRole });
        };
      
        const navigateToSeniorProfile = async (senior) => {
          await handleViewOtherProfile(senior._id);  // الانتظار حتى يتم تحميل البيانات
          // التأكد من تحميل البيانات قبل الانتقال
          if (profileUser) {
            console.log('Navigate to Senior Profile:',profileUser);
            navigation.navigate('ViewOtherProfile', { userData: profileUser });
          } else {
            console.log('No profile data available');
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
    const formatTime = (timestamp) => {
      const date = new Date(timestamp);
    
      // أسماء أيام الأسبوع
      const daysOfWeek = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ];
    
      // تحديد اليوم (Sunday, Monday, ...)
      const day = daysOfWeek[date.getDay()];
    
      // تحديد الوقت بصيغة AM/PM
      let hours = date.getHours();
      const minutes = date.getMinutes();
      const isAM = hours < 12;
      const period = isAM ? 'AM' : 'PM';
    
      // تحويل الساعة إلى صيغة 12 ساعة
      if (hours > 12) {
        hours -= 12;
      } else if (hours === 0) {
        hours = 12;
      }
    
      // صيغة الوقت النهائية: Day, HH:MM AM/PM
      return `${day}, ${hours}:${minutes < 10 ? '0' + minutes : minutes} ${period}`;
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
    
    

    const deleteMessage = async (messageId) => {
      try {
        const token = await AsyncStorage.getItem('userToken'); // الحصول على التوكن من التخزين
        console.log(token);
        if (!token) {
          console.error('Token not found');
          return;
        }          const response = await fetch(`${baseUrl}/chat/deletechatProject/${projectID}/${messageId}`, {
              method: 'DELETE',
              headers: {
                  'Authorization': `Wasan__${token}`,
              },
          });
  
          const data = await response.json();
          console.log(data.message);
          fetchMessages();
      } catch (error) {
          console.error('Error deleting message:', error);
      }
  };
  
  const [profile,setprofileimg] = useState('');
  const [profileUser,setOtherProfile] = useState('');

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



  const handleViewOtherProfile = async (userId) => {
    console.log(userId);
    try {
      const token = await AsyncStorage.getItem('userToken'); // الحصول على التوكن من التخزين
      console.log(token);
      if (!token) {
        console.error('Token not found');
        return;
      }
  
      const response = await fetch(`${baseUrl}/User/viewotherprofile/${userId}`, {
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
  
    const nav = useNavigation();
    const { isNightMode, toggleNightMode } = useContext(NightModeContext);
    const [selectFieldModalVisible, setSelectFieldModalVisible] = useState(false); 
    const [applyNowModalVisible, setApplyNowModalVisible] = useState(false);  
    const [selectedField, setSelectedField] = useState('');
    const [NumberOfTrain ,setNumberOfTrain] = useState('');
    const [ProfileLink ,setProfileLink] = useState('');
  const [scrollY] = useState(new Animated.Value(0));
    let [fontsLoaded] = useFonts({
        'Updock-Regular': require('./../compnent/fonts/Updock-Regular.ttf'),
        'Lato-Bold': require('./../compnent/fonts/Lato-Bold.ttf'),
        'Lato-Regular': require('./../compnent/fonts/Lato-Regular.ttf'),
    });


    // Load custom fonts
    const bottomBarTranslate = scrollY.interpolate({
      inputRange: [0, 50],
      outputRange: [0, 100], // 100 to move it off-screen
      extrapolate: 'clamp',
    });
  const [searchQuery, setSearchQuery] = useState('');

  const { ProjectId } = route.params; // الحصول على الـ ProjectId من الـ Route
  const [messages, setMessages] = useState([]); // لتخزين الرسائل المستلمة
  const [newMessage, setNewMessage] = useState(''); // لتخزين الرسالة الجديدة
  const [loading, setLoading] = useState(true); // لتحديد حالة تحميل الرسائل
  const [userData, setUserData] = useState(null); // لتخزين بيانات المستخدم السينيور
  const [chatsData , setchatsData] = useState(); // لتخزين بيانات المستخدم السينيور
  const [file , setFile] = useState(); // لتخزين بيانات المستخدم السينيور
  const [imageChat , setImageChat] = useState(); // لتخزين بيانات المستخدم السينيور
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
 
         result = await ImagePicker.launchImageLibraryAsync({
           mediaTypes: ['images'],
           allowsEditing: true,
           aspect: [8, 5],
           quality: 1,
         });
       
      
       console.log(result);
       // إذا تم اختيار صورة
      
           setImageChat(result.assets[0].uri); // تعيين صورة البروفايل
    
     } catch (error) {
       console.log('Error picking image: ', error);
     }
   };
    function base64ToBlob(base64Data, mimeType) {
            const byteCharacters = atob(base64Data.split(',')[1]);  // إزالة الـ prefix 'data:application/pdf;base64,'
            const byteArrays = [];
        
            for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
                const slice = byteCharacters.slice(offset, offset + 1024);
                const byteNumbers = new Array(slice.length);
        
                for (let i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }
        
                const byteArray = new Uint8Array(byteNumbers);
                byteArrays.push(byteArray);
            }
        
            return new Blob(byteArrays, { type: mimeType });
        };
 
   
  const handleSendMessage = async () => {
    if (!newMessage.trim() && !file && !imageChat) return; // التحقق من أن الرسالة غير فارغة

    try {
      const token = await AsyncStorage.getItem('userToken'); // الحصول على التوكن من التخزين
      console.log(token);
      if (!token) {
        console.error('Token not found');
        return;
      }
      console.log(imageChat);
      const formData = new FormData();
    
      formData.append('MessageContent', newMessage);

           if (imageChat) {
              if (Platform.OS === 'web') {
                // استخدام Blob للويب
                const profileBlob = base64ToBlob(imageChat, 'image/jpeg');
                formData.append('images', profileBlob, 'images.jpg');
              } else {
                // استخدام uri للموبايل
                formData.append('images', {
                  uri: imageChat,
                  type: 'image/jpeg',
                  name: 'images.jpg',
                });
              }
            }

         
                     if (file) {
                       console.log("Thefile", file);
                 
                       const fileUri = file.uri.startsWith('file://') ? file.uri : `file://${file.uri}`;
                 
                       // إذا كان التطبيق على الويب
                       if (Platform.OS === 'web') {
                         // تحويل البيانات إلى Blob (بيانات الـ PDF المشفرة بتنسيق Base64)
                         const pdfBlob = base64ToBlob(file.uri, 'application/pdf');
                         formData.append('files', pdfBlob,file.name);  // اسم الملف الذي سيتم حفظه
                 
                       } else {
                        formData.append('files', {
                           uri: fileUri,
                           name: file.name,
                           type: file.mimeType || 'application/pdf',
                         });
                       }
                     }
  console.log(formData);

   
 
      const response = await fetch(`${baseUrl}/chat/AddmessageToChatProject/${projectID}`,{
        method: 'POST',
        headers: {
          'Authorization': `Wasan__${token}`, // تأكد من كتابة التوكن بالشكل الصحيح
        },
          body: formData, // إرسال البيانات كـ FormData
      });
   
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
      }
  
      fetchMessages();
      const data = await response.json();
      console.log(data); // قم بإجراء شيء ما مع البيانات المستلمة من الخادم
      setNewMessage(''); // إعادة تعيين الرسالة بعد الإرسال  
      setImageChat('');
      setFile('');
    } catch (error) {
      console.error('Error fetching chat', error);
    }
     
  };


  const renderSelectedMedia = () => {
    if (imageChat) {
      return (
        <View style={styles.previewContainer}>
          <Text style={styles.previewLabel}>Selected Media:</Text>
          <Image
            source={{ uri: imageChat }}
            style={styles.previewImage}
          />
        </View>
      );
    }
    if (file) {
      return (
        <View style={styles.previewContainer}>
          <Text style={styles.previewLabel}>Selected Media:</Text>
          <Text>file.name</Text>
         
        </View>
      );
    }
    return null;
  };


  const fetchMessages = async () => {

    console.log("projectId",projectID);
    try {
      const token = await AsyncStorage.getItem('userToken'); // الحصول على التوكن من التخزين
      console.log(token);
      if (!token) {
        console.error('Token not found');
        return;
      }
  
      const response = await fetch(`${baseUrl}/chat/GetAllChatsProject/${projectID}`, {
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
      setchatsData(data.chats);  // تحديث حالة البروفايل
        flatListRef.current?.scrollToEnd({ animated: true });
      
    } catch (error) {
//      console.error('Error fetching chat:', error);
    }
  };


  useEffect(() => {
    fetchMessages();
    handleViewProfile();
    flatListRef.current?.scrollToEnd({ animated: true });

  },[]);
  


  const cardScale = useSharedValue(1);

  const handlePressIn = () => {
    cardScale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    cardScale.value = withSpring(1);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  const isMobile = width <= 768;
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };
  return (
    <View style={{ flex: 1,backgroundColor: isNightMode ? "#000" :"#ffff" }}>
      <View style={{
        height: Platform.OS === 'web' ? 50 : 20, backgroundColor: isNightMode ? "#000" :secondary

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
  <Ionicons name="folder" size={20} color= {isNightMode ? Colors.fifthColor : Colors.fifthColor}  />
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
              
        <View
      style={{
        flex: 1,
        marginBottom: Platform.OS === 'web' ? 0 : 50,
        marginHorizontal: Platform.OS === 'web' ? '20%' : 0,
      }}
    >
      <View style={{ marginBottom: Platform.OS === 'web' ? 100 : 60, margin: 4 }}>
        {chatsData?.length > 0 ? (
          <FlatList
            ref={flatListRef} // تعيين المرجع
            data={chatsData[0]?.messages || []}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onLongPress={() => handleLongPressMessage(item._id)}
                style={styles.messageContainer}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image
                    source={{
                      uri: item.sender.PictureProfile?.secure_url || 'https://via.placeholder.com/80',
                    }}
                    style={styles.profileImage}
                  />
                  <Text style={styles.senderName}>
                    {item.sender.FullName} (@{item.sender.UserName})
                  </Text>
                </View>

                {/* وقت الإرسال */}
                <Text style={styles.timeText}>{formatTime(item.timestamp)}</Text>

                <View style={styles.divider}></View>
                <View style={styles.messageContent}>
                  <Text style={styles.messageText}>{item.content}</Text>

                  {item.messageType === 'file' &&
                    item.media &&
                    item.media.map((file, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.fileCard}
                        onPress={() =>
                          openFileInBrowser(file.secure_url, file.originalname)
                        }
                      >
                        <FontAwesome
                          name="file-o"
                          size={24}
                          color="#555"
                          style={styles.icon}
                        />
                        <Text style={styles.fileName}>
                          {file.originalname || 'Click to view/download file'}
                        </Text>
                      </TouchableOpacity>
                    ))}

                  {item.messageType === 'image' &&
                    item.media &&
                    item.media.map((image, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => openImageViewer(image?.secure_url)}
                      >
                        <Image
                          source={{ uri: image.secure_url }}
                          style={{
                            width: '100%',
                            height: 300,
                            borderRadius: 10,
                            marginVertical: 10,
                            width: Platform.OS === 'web' ? '30%' : '100%',
                            resizeMode: 'cover',
                          }}
                        />
                      </TouchableOpacity>
                    ))}
                </View>
              </TouchableOpacity>
            )}
          />
        ) : (
          <Text>No messages available.</Text>
        )}
      </View>

      {/* عرض الصورة أو الملف المختار */}
      <View style={styles.inputContainerImage}>{renderSelectedMedia()}</View>
      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={pickImage} style={{ marginRight: 5 }}>
          <Ionicons name="image" size={25} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleFilePicker} style={{ marginRight: 5 }}>
          <Feather name="file" size={23} color="#000" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={newMessage}
          onChangeText={setNewMessage} // تحديث الحالة عند تغيير النص
        />
        <TouchableOpacity onPress={handleSendMessage}>
          <Ionicons name="send" size={25} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
          {/* المودال عند الضغط المطول */}
      <Modal
        visible={isModalVisibleMassage}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisibleMassage(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
           
            <TouchableOpacity
              onPress={() => handleDeleteMessage(selectedMessage)}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>Delete Message</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalVisibleMassage(false)}
              style={[styles.modalButton, { backgroundColor: '#ccc' }]}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
  
            
            {/* Bottom Navigation Bar */}
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
  <Ionicons name="folder" size={25} color= {isNightMode ? Colors.fifthColor : Colors.fifthColor}  />
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

      {/*///////////////////////////////////////////////Show Feild////////////////////////////*/}
      


                            {/* المودال */}
                            <Modal
      animationType="slide"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={toggleModal}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Filter Options</Text>

          {/* قائمة اختيار الفلاتر */}
          <View >
            <Text style={styles.label}>Select Filters:</Text>
            {["Project Name", "Senior Name", "Price Range", "Field", "Status"].map(
              (type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.filterOption,
                    activeFilters.includes(type) && styles.activeFilterOption,
                  ]}
                  onPress={() => toggleFilter(type)}
                >
                  <Ionicons
                    name={
                      activeFilters.includes(type) ? "checkbox" : "square-outline"
                    }
                    size={24}
                    color={activeFilters.includes(type) ? Colors.tertiary : Colors.brand}
                  />
                  <Text style={styles.filterText}>{type}</Text>
                </TouchableOpacity>
              )
            )}
          </View>
          <View style={styles.divider} />

          {/* حقول الفلاتر النشطة */}
                         {/* حقول الفلاتر النشطة */}
                         {activeFilters.includes("Project Name") ? (
          <View style={styles.filterOptionContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter project name"
              value={selectedFilters.projectName}
              onChangeText={(text) =>
                setSelectedFilters((prev) => ({ ...prev, projectName: text }))
              }
            />
          </View>
        ) : (
          selectedFilters.projectName !== "" &&   setSelectedFilters((prev) => ({ ...prev, projectName : "" }))
        
        )}
        
        {activeFilters.includes("Senior Name") ? (
          <View style={styles.filterOptionContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter senior name"
              value={selectedFilters.seniorName}
              onChangeText={(text) =>
                setSelectedFilters((prev) => ({ ...prev, seniorName: text }))
              }
            />
          </View>
        ) : (
          selectedFilters.seniorName !== "" &&
          setSelectedFilters((prev) => ({ ...prev, seniorName: "" }))
        )}
        
               
        {activeFilters.includes("Price Range") ? (
          <View style={styles.filterOptionContainer}>
            <Text style={styles.label}>Price Range (in $):</Text>
            <View style={styles.priceRange}>
              <Text style={styles.priceLabel}>${selectedFilters.minPrice}</Text>
              <Slider
                style={{ flex: 1 }}
                minimumValue={0}
                maximumValue={1000}
                value={selectedFilters.minPrice}
                onValueChange={(value) =>
                  setSelectedFilters((prev) => ({
                    ...prev,
                    minPrice: Math.round(value),
                  }))
                }
              />
              <Text style={styles.priceLabel}>${selectedFilters.maxPrice}</Text>
              <Slider
                style={{ flex: 1 }}
                minimumValue={0}
                maximumValue={1000}
                value={selectedFilters.maxPrice}
                onValueChange={(value) =>
                  setSelectedFilters((prev) => ({
                    ...prev,
                    maxPrice: Math.round(value),
                  }))
                }
              />
            </View>
          </View>
        ) : (
          (selectedFilters.minPrice !== 0 || selectedFilters.maxPrice !== 1000) &&
          setSelectedFilters((prev) => ({
            ...prev,
            minPrice: 0,
            maxPrice: 1000,
          }))
        )}
          {activeFilters.includes("Field") && (
            
            <View style={styles.filterOptionContainer}>
              <View >
          <TouchableOpacity onPress={() =>openModal('Feild')}>
          <Text style={{
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    opacity: 0.7,
  }}>
Select Field           </Text>
          </TouchableOpacity>
        </View>
              
            </View>
          )}
          

          {activeFilters.includes("Status") && (
            <View style={styles.filterOptionContainer}>
              <Text style={styles.label}>Select Status:</Text>
              {["Open", "In Progress", "Completed"].map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.statusOption,
                    selectedFilters.status === status && styles.selectedStatus,
                  ]}
                  onPress={() =>
                    setSelectedFilters((prev) => ({ ...prev, status }))
                  }
                >
                
                  <Text style={styles.statusText}>{status}</Text>
                </TouchableOpacity>
              ))}
            </View>
            
          )}

          {/* أزرار التحكم بالمودال */}
          <View style={styles.modalButtons}>
            <TouchableOpacity
              onPress={() => {
                toggleModal();
                resetFilters();
              }}
              style={styles.cancelButton}
            >
              <Ionicons name="close-circle" size={24} color="red" />
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={applyFilters}
              style={styles.applyButton}
            >
              <Ionicons name="checkmark-circle" size={24} color= {fifthColor} />
              <Text style={styles.buttonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
      {/*///////////////////////////////////////////////Show Feild////////////////////////////*/}
   {/* Modal لكل بطاقة */}
   <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={closeModal}>
                  <View style={styles.modalContainer}>
                    <View style={[styles.modalContent, { backgroundColor: isNightMode ? Colors.black : Colors.primary }]}>
                   <>
                                      <Text style={[styles.modalTitle, { marginTop: 0 }]}>Select Feild(s)</Text>
                                      <Text style={{ color: Colors.brand }}>{error}</Text>
                                      <MultiSelect
                                        style={styles.scrollableItemsContainer}
                                        items={Feilds} // قائمة اللغات
                                        uniqueKey="id" // المفتاح الفريد لكل عنصر
                                        onSelectedItemsChange={onSelectedItemsChange} // التعامل مع التحديد
                                        selectedItems={selectedFeilds} // العناصر المحددة حالياً
                                        selectText="Choose Feilds"
                                        submitButtonColor={isNightMode ? Colors.fourhColor : Colors.fourhColor} // لون خلفية زر "Submit"
                                        tagRemoveIconColor={isNightMode ? Colors.brand : Colors.brand} // لون أيقونة الحذف
                                        tagBorderColor={isNightMode ? '#4A90E2' : '#333'} // لون الحدود
                                        tagTextColor={isNightMode ? Colors.fifthColor : '#333'} // لون النص في التاج
                                        selectedItemTextColor={isNightMode ? Colors.fifthColor : '#333'} // لون النص في العنصر المحدد
                                        selectedItemIconColor={isNightMode ? Colors.brand : '#333'} // لون أيقونة العنصر المحدد
                                        itemTextColor={isNightMode ? '#000' : '#333'} // لون النص في العنصر غير المحدد
                                        displayKey="sub_specialization"
                  
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
              
                  <View style={styles.buttonsContainer}>
                                  <TouchableOpacity onPress={()=>handleSave(selectedFeilds)} style={styles.saveButton}>
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
    );
};

const styles = StyleSheet.create({
  openModalButton: {
    backgroundColor: '#6200ea',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  filterOption: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  priceRange: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6200ea',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  closeButton: {
    backgroundColor: fourhColor,
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
grid: {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between", // يجعل البطاقات تبدأ بجانب بعضها
  marginBottom: 40,
flex:"1",  gap: 20, // توفير مسافة ثابتة بين البطاقات
},

  cardMobile: {
    marginBottom: 20,
    width: width - 20, // تأكيد أن عرض البطاقة يتناسب مع عرض الشاشة
  },
cardWeb: {
  marginBottom: 20,
  flexBasis: "30%", // تحديد نسبة العرض للبطاقة
  width: '50%',
  height: "auto", // السماح للارتفاع بالتكيف مع المحتوى
  flex: 1, 
},


  cardMobileContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
    overflow: "hidden",
    justifyContent: "space-between",
  },
cardWebContent: {
  height: "auto", // السماح للارتفاع بالتكيف
  padding: 10,
  backgroundColor: "#fff",
  borderRadius: 10,
  shadowColor: "#000",
  shadowOpacity: 0.2,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 5 },
  elevation: 5,
},


  projectImage: {
    width: "100%",
    height: 150,
  },
  cardDetails: {
    padding: 10,
    flex: 1,
  },
projectName: {
  fontSize: 18,
  fontWeight: "bold",
  marginBottom: 5,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
},

  projectDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  seniorInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  seniorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  seniorName: {
    fontSize: 14,fontWeight:'bold',
    color:Colors.fifthColor,
  },
  noProjects: {
    textAlign: "center",
    color: "#aaa",
    marginTop: 20,
  },
  projectDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
 
  projectPrice: {
    fontSize: 14,
    color: '#007bff',fontWeight:'bold',
    marginBottom: 5,
  },
  projectCreatedAt: {
    fontSize: 12,
    color: '#888',
    marginBottom: 0,
  },
  seniorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  seniorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },  seeMoreContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end', // هذا سيضع النص على الجهة اليمنى
    marginTop: 15,
  },
  seeMoreText: {
    fontSize: 14,
    color: Colors.fifthColor, // لون النص ليكون مشابه للروابط
    fontWeight: 'bold',
  },divider: {
    height: 3,
    backgroundColor: '#ddd',
    marginVertical: 8,
  },
  divider1: {
    height: 5,
    backgroundColor: Colors.fourhColor,
    marginVertical: 8,
  },
  divider3: {
    height: 1,
    backgroundColor: Colors.fourhColor,
    marginVertical: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: Colors.white,
  },
  filterOption: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: Colors.white,
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: 5,
    padding: 10,
  },
  priceRange: {
    flexDirection: "row",
    alignItems: "center",
  },
  priceLabel: {
    marginHorizontal: 10,
    fontSize: 14,
    color: Colors.white,
  },
  statusOptions: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statusOption: {
    padding: 5,
    borderRadius: 5,
    backgroundColor: Colors.secondary,margin:2
  },
  selectedStatus: {
    backgroundColor: Colors.darkLight,
  },
  statusText: {
    color: Colors.tertiary,
    fontSize: 14,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  applyButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    marginLeft: 5,
    color: Colors.white,
    fontSize: 16,
  },  filterOption: { flexDirection: "row", alignItems: "center", padding: 10 },
  activeFilterOption: { backgroundColor: Colors.fourhColor},
  filterText: { marginLeft: 10 },filterOptionContainer: {
  marginVertical: 4,
  paddingHorizontal: 10,
  paddingVertical: 5,
  backgroundColor: '#f9f9f9',
  borderRadius: 8,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 6,
  elevation: 3, // For Android shadow
}, 
filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,padding:5,  borderRadius: 8,

  },
  messagesList: {
    flex: 1,
    marginBottom: 10,
  },
  messageContainer: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#f1f1f1',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  sender: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  seniorLabel: {
    color: 'red',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  message: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 10,
  },
 
  senderName: {
    fontWeight: 'bold',
  }, profileImage: {
    width: 40,
    height: 40,
    marginRight: 10,
                borderRadius: 30,
                borderColor: tertiary,
                borderWidth: 1
  },
inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute', // تثبيت المدخل في الأسفل
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 2,
    borderTopColor: '#ccc',
  },
  inputContainerImage: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute', // تثبيت المدخل في الأسفل
    bottom: 50,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: '#fff',

  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  sendIcon: {
    padding: 5,
    backgroundColor: '#E8E8E8',
    borderRadius: 20,
  },
  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,marginTop: 10,
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
    color: Colors.darkLight,
    textDecorationLine: 'underline',
    flexShrink: 1,
    fontSize: 14,
  }, previewContainer: {
    marginBottom: 10,
    alignItems: 'center',
  },
  previewLabel: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalButton: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: Colors.darkLight,
    marginVertical: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  timeText: {
    fontSize: 12,
    color: 'gray',
    marginTop: 5,
  },

});