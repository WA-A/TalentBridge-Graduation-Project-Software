import React, { useState, useContext,useRef,useEffect,useRoute } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, Image,TextInput,TouchableOpacity, StyleSheet, ToastAndroid,useColorScheme, PermissionsAndroid, ScrollView,Animated, Button, Alert, Platform,TouchableWithoutFeedback,Keyboard, FlatList,KeyboardAvoidingView,flatListRef} from 'react-native';
import { Ionicons, Feather, FontAwesome5, EvilIcons, FontAwesome,Entypo,MaterialIcons,AntDesign,MaterialCommunityIcons,FontAwesome6} from '@expo/vector-icons';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import * as Animatable from 'react-native-animatable';
import MultiSelect from 'react-native-multiple-select';
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
} from './../compnent/Style'
import ImageViewer from 'react-native-image-zoom-viewer';
// Color constants
const { secondary, primary, careysPink, darkLight, fourhColor, tertiary, fifthColor,brand } = Colors;
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from '@react-native-community/datetimepicker';  // للموبايل
import { color } from 'react-native-elements/dist/helpers';
import { use } from 'react';
let DatePicker;
if (Platform.OS === 'web') {
    DatePicker = require('react-datepicker').default;
    require('react-datepicker/dist/react-datepicker.css');  // استيراد أنماط الويب
    import('./../compnent/webStyles.css');  // استيراد الأنماط الخاصة بالويب
}

export default function AddTaskForProject({route}) {

   const { project, duration,file,role,ProjectName } = route.params;  // الحصول على الـ projectId و DurationInMounths
  
   const [inputMode, setInputMode] = useState("manual"); // وضع الإدخال (يدوي أو تلقائي)
   const [automaticNumber, setAutomaticNumber] = useState(""); // الرقم المدخل عند الوضع التلقائي
   const [isAutoApproval, setIsAutoApproval] = useState(false);
   const [maxAutoApproved, setMaxAutoApproved] = useState(0);


////////////////////////////For Phase And Task .//////////////////////////////
const [phases, setPhases] = useState([{ phaseName: '',BenefitFromPhase:'', tasks: [{ taskName: '', description: '', role: '', status: '', Priority: '', startDate: '', endDate: '' }] }]);
const addPhase = () => {
    setPhases([...phases, { phaseName: '',BenefitFromPhase:'', tasks: [{ taskName: '', description: '', role: '', status: '', Priority: '', startDate: '', endDate: '' }] }]);
  };

  const addTask = (index) => {
    const newPhases = [...phases];
    newPhases[index].tasks.push({ taskName: '', description: '', role: '', status: '', Priority: '', startDate: '', endDate: '' });
    setPhases(newPhases);
  };

  const handlePhaseChange = (index, value) => {
    const newPhases = [...phases];
    newPhases[index].phaseName = value;
    setPhases(newPhases);
  };
const [erorWep,setErrorWep]=useState('');

  const handleExpectedResultChange = (index, text) => {
    const updatedPhases = [...phases];
    updatedPhases[index].BenefitFromPhase = text; // حفظ النتيجة المتوقعة في البيانات
    setPhases(updatedPhases); // تحديث الحالة
  };
  

  const handleTaskChange = (phaseIndex, taskIndex, field, value) => {
    console.log("the valueeeeeeeeeeeeeeeee",value,field);
    const newPhases = [...phases];
    newPhases[phaseIndex].tasks[taskIndex][field] = value;
    setPhases(newPhases);
  };



  const removePhase = (index) => {
    const newPhases = phases.filter((_, phaseIndex) => phaseIndex !== index);
    setPhases(newPhases);
  };

  const removeTask = (phaseIndex, taskIndex) => {
    const newPhases = [...phases];
    newPhases[phaseIndex].tasks = newPhases[phaseIndex].tasks.filter((_, tIndex) => tIndex !== taskIndex);
    setPhases(newPhases);
  };

  const [allTasks, setallTask] = useState([]);  // التأكد من تهيئة useState بشكل صحيح

  const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  };
  
  const showAlert = () => {
    Alert.alert(
      "Error adding Task", // العنوان
      "Phase name is required and each phase must have at least one task.", // الرسالة
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel", // زر بشكل إلغاء
        },
        { 
          text: "OK", 
          onPress: () => console.log("OK Pressed") 
        },
      ],
      { cancelable: false } // عدم السماح بإغلاق التنبيه بالنقر خارج المربع
    );
    setErrorWep("Phase name is required and each phase must have at least one task."); // الرسالة
  
  };
  const validateFields = () => {
    // Check if any phase or task has missing data
    for (const phase of phases) {
      if (!phase.phaseName || phase.tasks.length === 0) {
        showAlert();

        return false;
      }
  
      for (const task of phase.tasks) {
        const startDateValid = isValidDate(task.startDate);
        const endDateValid = isValidDate(task.endDate);
  
        if (
          !task.taskName ||
          !task.description ||
          !task.role ||
          !task.status ||
          !task.Priority ||
          !startDateValid ||
          !endDateValid
        ) {
          showAlert();
                    return false;
        }
      }
    }
    return true; // All fields are valid
  };
  
  const transformPhasesToTasks = (phases) => {
    phases.forEach((phase, phaseIndex) => {
      phase.tasks.forEach((task, taskIndex) => {
        // التحقق من التواريخ
        const startDateValid = isValidDate(task.startDate) ? new Date(task.startDate).toISOString() : null;
        const endDateValid = isValidDate(task.endDate) ? new Date(task.endDate).toISOString() : null;
  
      
        // إضافة المهمة إذا كانت البيانات مكتملة
        allTasks.push({
          PhaseName: phase.phaseName, // أو phase.phaseName مباشرة إذا أردت الاسم الأصلي
          TaskName: task.taskName.trim(),
          Description: task.description.trim(),
          TaskRoleName: task.role.trim(),
          TaskStatus: task.status.trim(),
          Priority: task.Priority.trim(),
          StartDate: task.startDate.trim(),
          EndDate: task.endDate.trim(),
          BenefitFromPhase: phase.BenefitFromPhase, // استخدام القيمة المتاحة من phase
        });
  
        console.log("All tasks:", allTasks);
      });
    });
  };
  


    const [PositionRoles, setPositionRoles] = useState(['']); // لإضافة أدوار الوظائف ديناميكيًا

    const addPositionRole = () => {
      setPositionRoles([...PositionRoles, '']);
    };
  
    const removePositionRole = (index) => {
      const updatedRoles = PositionRoles.filter((_, i) => i !== index);
      setPositionRoles(updatedRoles);
    };
  
    const handlePositionRoleChange = (index, text) => {
      const updatedRoles = [...PositionRoles];
      updatedRoles[index] = text;
      setPositionRoles(updatedRoles);
    };

    const [selectedSkillsText, setSelectedSkillsText] = useState('');
  // دالة لتحديث المهارات المختارة
  const handleSkillSelection = (selectedItems) => {
    const updatedSkills = selectedItems.map((itemId) => {
      const existingSkill = selectedSkills.find((skill) => skill.id === itemId);
      return existingSkill || {
        id: itemId,
        name: Skills.find((s) => s.id === itemId).name,
        rating: 0, // التقييم الافتراضي
        Rate: 0, // إضافة خاصية التقييم
      };
    });
    setSelectedSkills(updatedSkills);
  };

  // دالة لحفظ المهارات المختارة
  const saveSkills = () => {
    const skillNamesWithRating = selectedSkills
      .map((skill) => `${skill.name} (Rating: ${skill.rating})`)
      .join(', '); // دمج المهارات مع التقييم
    setSelectedSkillsText(skillNamesWithRating);
    closeModal(); // إغلاق المودال بعد حفظ المهارات
  };
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const scaleValue = useState(new Animated.Value(0))[0]; // قيمة للأنميشن
  
    // تفعيل الأنميشن عند إغلاق المودال
    const animateCheckMark = () => {
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      
      ]).start();
    };
  
    const handleProjectCreation = () => {
      setShowSuccessMessage(true);
      animateCheckMark(); // بدء الأنميشن عند إنشاء المشروع
    };


  const [selectedSkills, setSelectedSkills] = useState([]);
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
  const [modalVisibleProject, setModalVisibleProject] = useState(false);


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
    const closeModalProject = () => {
        setModalVisibleProject(false);
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

          // دالة المعالجة للعمليات التلقائية
  const handleAutomaticAddition = (number) => {
    // إضافة الكود المطلوب لمعالجة الرقم التلقائي
    console.log("Automatic number:", number);
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
   
  const [scrollY] = useState(new Animated.Value(0));


    if (!fontsLoaded) {
        return <View><Text>Loading...</Text></View>;
    }

    // Load custom fonts
    const bottomBarTranslate = scrollY.interpolate({
      inputRange: [0, 50],
      outputRange: [0, 100], // 100 to move it off-screen
      extrapolate: 'clamp',
    });
  const [searchQuery, setSearchQuery] = useState('');
  const [borderColor, setBorderColor] = useState(new Animated.Value(0));
  const colors = [Colors.secondary, Colors.fourhColor, Colors.fifthColor,Colors.darkLight,Colors.secColor,Colors.careysPink];

  useEffect(() => {
    const changeBorderColor = () => {
        let index = 0;
        setInterval(() => {
          setBorderColor(new Animated.Value(index)); // تغيير قيمة التفاعل
          index = (index + 1) % colors.length;
        }, 1000); // التغيير كل ثانية
      };
  
    changeBorderColor();
    handleViewProfile();
  //  handleGetFeilds();
  //  handleGetUserFeild();
 //   handleGetSkills ();
  }, []);
  






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
          const convertFileToBase64 = async (fileUri) => {
            console.log("filebefore",fileUri)
            try {
                // Fetch the file from its URI
                const response = await fetch(fileUri);
                const blob = await response.blob();
        
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    
                    // Triggered when the reading is completed
                    reader.onloadend = () => {
                        resolve(reader.result); // Base64 data
                    };
        
                    // Triggered on error
                    reader.onerror = (error) => {
                        reject(`Error converting file to Base64: ${error}`);
                    };
        
                    // Read the blob as a Base64 string
                    reader.readAsDataURL(blob);
                });
            } catch (error) {
                console.error('Error fetching or converting file:', error);
                throw error;
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
        }
        
        const handleAddProject = async () => {
          console.log(inputMode, isAutoApproval, maxAutoApproved);
        
          if (!validateFields()) {
            return; // Stop execution if validation fails
          }
        
          transformPhasesToTasks(phases);
        
          try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) throw new Error('No token found');
        
            const baseUrl = Platform.OS === 'web'
              ? 'http://localhost:3000'
              : 'http://192.168.1.239:3000';
            console.log("Thefile", project);
        
            if (file) {
              console.log("Thefile", file);
        
              const fileUri = file.uri.startsWith('file://') ? file.uri : `file://${file.uri}`;
        
              // إذا كان التطبيق على الويب
              if (Platform.OS === 'web') {
                // تحويل البيانات إلى Blob (بيانات الـ PDF المشفرة بتنسيق Base64)
                const pdfBlob = base64ToBlob(file.uri, 'application/pdf');
                project.append('FileProject', pdfBlob, 'ProjectFile.pdf');  // اسم الملف الذي سيتم حفظه
        
              } else {
                project.append('FileProject', {
                  uri: fileUri,
                  name: file.name,
                  type: file.mimeType || 'application/pdf',
                });
              }
            }
        
            console.log("Thefile", project);
        
            allTasks.forEach((task, index) => {
              project.append(`Tasks[${index}].PhaseName`, task.PhaseName);
              project.append(`Tasks[${index}].TaskName`, task.TaskName);
              project.append(`Tasks[${index}].Description`, task.Description);
              project.append(`Tasks[${index}].TaskRoleName`, task.TaskRoleName);
              project.append(`Tasks[${index}].TaskStatus`, task.TaskStatus);
              project.append(`Tasks[${index}].Priority`, task.Priority);
              project.append(`Tasks[${index}].StartDate`, task.StartDate);
              project.append(`Tasks[${index}].EndDate`, task.EndDate);
              project.append(`Tasks[${index}].BenefitFromPhase`, task.BenefitFromPhase);
            });
        
            // إضافة القيم الجديدة عند إرسال البيانات
            project.append('isAutoApproval', isAutoApproval);
            project.append('maxAutoApproved', maxAutoApproved);
        
            const response = await fetch(`${baseUrl}/project/createproject`, {
              method: 'POST',
              headers: {
                'Authorization': `Wasan__${token}`,
              },
              body: project,
            });
        
            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || 'Something went wrong');
            }
        
            // عرض رسالة النجاح
            setShowSuccessMessage(true);
            setModalVisibleProject(true);
            animateCheckMark(); // تفعيل الأنميشن
        
            // إخفاء البطاقة بعد 7 ثوانٍ
            setTimeout(() => {
              setModalVisibleProject(false);
            },9000); // 7 ثواني
        
            const result = await response.json();
            console.log('Add Project successfully');
            nav.navigate('ProjectsSeniorPage');
        
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
            <View style={{ alignItems: 'center', flexDirection: 'row',marginRight:10 }}>  
  <Animatable.View
    animation="bounceIn" // تأثير الدخول
    duration={2000} // مدة التأثير
    style={[styles.fieldContainer,{ flex: 1,}]}
  >
    <Text style={styles.fieldText}>
      Create a {duration ? `${duration}-month` : "Unknown Field"} project plan
    </Text>
    <AntDesign 
      name="caretdown" 
      size={12} 
      color={isNightMode ? primary : '#000'} 
      style={{ marginLeft: 5 }}  // المسافة بين النص والأيقونة
    />
  </Animatable.View>

  {/* زر كانسل */}
  <View style={styles.cancelContainer}>
    <TouchableOpacity 
      style={styles.cancelButton} 
      onPress={() => nav.goBack()} // العودة إلى الصفحة السابقة عند الضغط على الإلغاء
    >
      <Text style={styles.cancelButtonText}>Cancel</Text>
    </TouchableOpacity>
  </View>
</View>

            <View style={styles.divider1} />
    
            <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
  {phases.map((phase, phaseIndex) => (
    <View key={phaseIndex}>
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
      <Text style={styles.label}>Phase Name</Text>
      <TouchableOpacity onPress={() => removePhase(phaseIndex)}>
          <AntDesign
            name="minuscircle"
            size={20}
            color={isNightMode ? primary : '#000'}
            style={{ marginLeft: 5 }} // المسافة بين النص والأيقونة
          />
        </TouchableOpacity>
        </View>

        <TextInput
          style={[
            styles.input,
            {
              flex: 1, // جعل النص يأخذ أكبر مساحة ممكنة
              borderWidth: 1,
              padding: 10,
              marginRight: 10,
            },
          ]}
          value={phase.phaseName}
          onChangeText={(text) => handlePhaseChange(phaseIndex, text)}
          placeholder={`Enter Phase ${phaseIndex + 1} Name`}
        />
       

      {/* إدخال النتيجة المتوقعة */}
      <Text style={styles.label}>Expected Result</Text>
      <TextInput
        style={[
          styles.input,
          {
            height: 100, // زيادة ارتفاع الصندوق ليكون أكبر
            borderWidth: 1,
            padding: 10,
            textAlignVertical: 'top', // لضبط النص في الجزء العلوي من الصندوق
          },
        ]}
        value={phase.BenefitFromPhase}
        onChangeText={(text) => handleExpectedResultChange(phaseIndex, text)}
        placeholder="Expected result for this phase"
        multiline={true} // للسماح بإدخال نص متعدد الأسطر
      />


        <View style={styles.divider}/>

            {phase.tasks.map((task, taskIndex) => (
              <View key={taskIndex} style={styles.inputContainer}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
           
           <Text style={styles.label}>Task Name</Text>
           <TouchableOpacity onPress={() => removeTask(phaseIndex, taskIndex)}>
             
             <AntDesign 
               name="minuscircle" 
               size={20} 
               color={isNightMode ? primary  : "red"} 
               style={{ marginLeft:5}}  // المسافة بين النص والأيقونة
             />
             </TouchableOpacity>

</View>
                <TextInput
                  style={styles.input}
                  value={task.taskName}
                  onChangeText={(text) => handleTaskChange(phaseIndex, taskIndex, 'taskName', text)}
                  placeholder={`Task ${taskIndex + 1} Name`}
                />
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={styles.input}
                  value={task.description}
                  onChangeText={(text) => handleTaskChange(phaseIndex, taskIndex, 'description', text)}
                  placeholder="Task Description"
                />


                <Text style={styles.label}>Role</Text>
              {/* استخدم Picker لعرض قائمة الأدوار */}
              <View style={styles.pickerContainer}>

              <Picker
  selectedValue={task.role} // القيمة الحالية للدور
  style={styles.input} // نفس ستايل الـ TextInput
  onValueChange={(itemValue) => handleTaskChange(phaseIndex, taskIndex, 'role', itemValue)} // تحديث الدور عند اختيار المستخدم
>
  {/* إضافة عنصر "اختيار الدور" */}
  <Picker.Item label="Select Role" value="" />

  {/* إنشاء عناصر Picker بناءً على المصفوفة roles */}
  {role.map((roleObject, index) => (
    <Picker.Item
      key={index}
      label={roleObject.roleName}  // استخدام roleName من الكائن
      value={roleObject.roleName}  // تعيين قيمة الدور أيضًا
    />
  ))}
</Picker></View>

                <Text style={styles.label}>Status</Text>
                <TextInput
                  style={styles.input}
                  value={task.status}
                  onChangeText={(text) => handleTaskChange(phaseIndex, taskIndex, 'status', text)}
                  placeholder="Task Status"
                />
              <Text style={styles.label}>Priority</Text>
<View style={styles.pickerContainer}>
  <Picker
    selectedValue={task.Priority}
    onValueChange={(value) => handleTaskChange(phaseIndex, taskIndex, 'Priority', value)}
  >
    <Picker.Item label="Select Priority" value="" />
    <Picker.Item label="Low" value="Low" />
    <Picker.Item label="Medium" value="Medium" />
    <Picker.Item label="High" value="High" />
  </Picker>
</View>
                <Text style={styles.label}>Start Date</Text>


                
                <TextInput
                  style={styles.input}
                  value={task.startDate}
                  onChangeText={(text) => handleTaskChange(phaseIndex, taskIndex, 'startDate', text)}
                  placeholder="Start Date"
                />
                <Text style={styles.label}>End Date</Text>
                <TextInput
                  style={styles.input}
                  value={task.endDate}
                  onChangeText={(text) => handleTaskChange(phaseIndex, taskIndex, 'endDate', text)}
                  placeholder="End Date"
                />
              


                
              </View>
            ))}
            <TouchableOpacity onPress={() => addTask(phaseIndex)} style={styles.addButton}>
              <Text style={styles.addButtonText}>Add Task</Text>
            </TouchableOpacity>
            <View style={styles.divider1} />
          </View>
        ))}

        <TouchableOpacity onPress={addPhase} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add Phase</Text>
        </TouchableOpacity>


 {/* اختيار وضع الإدخال */}
 <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}>
    <Text style={{ color: isNightMode ? "#fff" : "#000", marginRight: 10 }}>
      Select Input Mode:
    </Text>
    <TouchableOpacity
      onPress={() => setInputMode("manual")}
      style={[
        styles.radioButton,
        inputMode === "manual" && styles.radioButtonSelected,
      ]}
    >
      <Text style={{ color: inputMode === "manual" ? primary : "#000" }}>
        Manual
      </Text>
    </TouchableOpacity>
    <TouchableOpacity
      onPress={() => setInputMode("automatic")}
      style={[
        styles.radioButton,
        inputMode === "automatic" && styles.radioButtonSelected,
      ]}
    >
      <Text style={{ color: inputMode === "automatic" ? primary : "#000" }}>
        Automatic
      </Text>
    </TouchableOpacity>
  </View>

  {/* إدخال الرقم إذا كان الوضع تلقائي */}
  {inputMode === "automatic" && (
    <View style={{ marginHorizontal: 20, marginBottom: 20 }}>
      <Text style={styles.label}>Enter the number of items:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric" // استبدال inputMode بـ keyboardType
        placeholder="Enter a number"
        value={maxAutoApproved}
        onChangeText={(text) => {
          setMaxAutoApproved(text);  // تحديث قيمة automaticNumber
          setIsAutoApproval(true);  // تعيين isAutoApproval إلى false
        }}      />
    </View>
  )}



        <View style={[styles.addButtonText, { marginBottom: 40 }]}>
  {Platform.OS === 'web' ? (
    <>
      <Text style={color="red"} >{erorWep}</Text>
      <TouchableOpacity style={styles.submitButton} onPress={handleAddProject}>
        <Text style={styles.submitText}>Create Project</Text>
      </TouchableOpacity>
    </>
  ) : (
    <TouchableOpacity style={styles.submitButton} onPress={handleAddProject}>
      <Text style={styles.submitText}>Create Project</Text>
    </TouchableOpacity>
  )}
</View>




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
                <TouchableOpacity onPress={saveSkills} style={styles.saveButton}>
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


            <Modal animationType="slide" transparent={true} visible={modalVisibleProject} onRequestClose={closeModalProject}>
      <View style={styles.modalContainerp}>
        <View style={[styles.modalContentp, { backgroundColor: isNightMode ? '#000' : '#fff' }]}>
          <Text style={[styles.modalTitlep, { marginTop: 0 }]}>{ProjectName || ''}</Text>
          
          {showSuccessMessage && (
            <View style={styles.successContainer}>
              <Animated.View style={[styles.checkmark, { transform: [{ scale: scaleValue }] }]}>
                <MaterialCommunityIcons name="check-circle" size={30} color="#28a745" />
              </Animated.View>
              <Text style={styles.successMessage}>
                created successfully! You will find it in your project list.
              </Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
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
      
        inputContainer: {
            margin: 5,
            paddingHorizontal: 10,padding:5,
            borderWidth:2, // إضافة الحدود
            borderColor: Colors.fifthColor, // لون الحدود
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

 
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
    color: '#333',marginTop:3,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dynamicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  removeButton: {
    marginLeft: 10,
    backgroundColor: '#ff4d4d',
    borderRadius: 8,
    padding: 5,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  addButton: {
    marginTop: 10,    marginBottom: 10,

    borderRadius: 8,
    paddingVertical: 10,
    padding:5,
      backgroundColor: Colors.secondary, // لون خلفية متناسق
      elevation: 10,               // تأثير ظل خفيف لتحسين العمق
      shadowColor: '#000',         // لون الظل
    alignItems: 'center',
  },
  addButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
fieldContainer: {
    flexDirection: 'row',  // عرض النص والأيقونة بشكل أفقي
    alignItems: 'center',  // محاذاة النص والأيقونة عموديًا
  margin: 10, justifyContent:'center',         // تقليل المسافة العمودية قليلاً لجعل التصميم أكثر تناسقًا
  borderRadius: 5, marginHorizontal:20,           // زيادة الزوايا المنحنية لجعل التصميم أكثر انسيابية
padding:5,
  backgroundColor: Colors.secondary, // لون خلفية متناسق
  elevation: 10,               // تأثير ظل خفيف لتحسين العمق
  shadowColor: '#000',         // لون الظل
  shadowOffset: {              // إزاحة الظل
    width: 0,
    height: 5,
  },
  shadowOpacity: 0.2,          // شفافية الظل
  shadowRadius: 10,            // حجم التمويه للظل
},
divider: {
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
  fieldText: {
    fontSize: 13,
    fontWeight: "bold",
    color: Colors.fifthColor,
  },


  text: {
    fontSize: 18,
    color: '#333',
  },
  dynamicItem: {
    flexDirection: 'row', // جعل العناصر تظهر أفقياً
    alignItems: 'center', // محاذاة عمودية
    marginVertical: 10, // مسافة عمودية بين العناصر
    width: '100%', // العرض الكامل
  },
  inputFullWidth: {
    flex: 1, // يتمدد لملء المساحة المتبقية
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginRight: 10, // مسافة بين الـ Input والزر
  },
  removeButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
    container1: {
        padding: 20,
        marginVertical: 20,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        elevation: 5,
      },
      row: {
        flexDirection: 'row', // ترتيب أفقي للعناصر
        alignItems: 'center', // محاذاة العناصر عموديًا
        justifyContent: 'space-between', // توزيع متوازن بين النص والزر
      },
      label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        flex: 1, // يسمح بتوسيع النص إذا لزم الأمر
        margin: 5, // مسافة بين النص والزر
      },
      fileButton: {
        backgroundColor: Colors.fourhColor,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
      },
      submitText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
      },
      fileInfo: {
        marginTop: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        backgroundColor: '#f5f5f5',
        width: '100%',
        alignItems: 'center',
      },
      fileName: {
        fontSize: 16,
        color: '#555',
      },
      successMessage: {
        fontSize: 15,
        color: Colors.fifthColor,
        fontWeight: 'bold',
      },
   modalContainerp: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContentp: {
    width: '80%',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',borderWidth:3,borderColor:Colors.fifthColor,
  },
  modalTitlep: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkmark: {
    marginRight: 2,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: Colors.brand,
    borderRadius: 4,
    marginBottom: 16,
  },

  cancelContainer: {
    alignItems: 'center', // محاذاة الزر إلى المنتصف
  },
  cancelButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: 'gray', // لون خلفية الزر
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  cancelButtonText: {
    color: 'white', // لون النص في الزر
    fontSize: 16,
  },radioButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 20,
    marginRight: 10,
  },
  radioButtonSelected: {
    backgroundColor: "#ddd",
  },
  
});

