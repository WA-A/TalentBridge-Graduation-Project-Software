import React, { useState, useContext,useEffect } from 'react';
import { View, Text, TouchableOpacity,StyleSheet, Modal, FlatList, ScrollView, Image,Platform,Animated} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { NightModeContext } from './NightModeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from './../compnent/Style';
import { TextInput } from 'react-native-gesture-handler';
const { tertiary, firstColor, secColor,fifthColor,secondary, primary, darkLight, fourhColor, careysPink} = Colors;
import { EvilIcons,AntDesign,Feather,FontAwesome5,FontAwesome,MaterialCommunityIcons,Fontisto
} from '@expo/vector-icons';
import MultiSelect from 'react-native-multiple-select';
import { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { Dimensions } from "react-native";
import * as Animatable from "react-native-animatable";
import Slider from '@react-native-community/slider';
const { width } = Dimensions.get("window");
import moment from 'moment/moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import { color } from 'react-native-elements/dist/helpers';
import * as DocumentPicker from "expo-document-picker";
import { use } from 'i18next';
import * as WebBrowser from 'expo-web-browser'



export default function  TheSubmission({ navigation, route }) {
  const [selectedSkills, setSelectedSkills] = useState([]);

    const [modalVisibleProject, setModalVisibleProject] = useState(false);
    const closeModalProject = () => {
      setModalVisibleProject(false);

    };
    
    const [recommendation, setRecommendation] = useState("");

    const handleRecommendationChange = (text) => {
      setRecommendation(text);
      console.log("Recommendation text:", text);
    };
        const [selectedSkillsText, setSelectedSkillsText] = useState('');
    
  const [Skills, setSkills] = useState([]);
  const saveSkills = () => {
    console.log("sss");
    const skillNamesWithRating = selectedSkills
      .map((skill) => `${skill.name} (Rating: ${skill.rating})`)
      .join(', '); // دمج المهارات مع التقييم
    setSelectedSkillsText(skillNamesWithRating);
    closeModal(); // إغلاق المودال بعد حفظ المهارات
  };
  const { projectId,taskIDD} = route.params;  // الحصول على projectId من التنقل
  const [showJuniorList, setShowJuniorList] = useState(false);
  const [selectedJuniors, setSelectedJuniors] = useState([]);
    const [file, setFile] = useState(null);
    const [deliveryType, setDeliveryType] = useState("Online");

    const [showStartTaskModal, setShowStartTaskModal] = useState(false); // لتحديد حالة ظهور المودال
// دالة لإغلاق المودال

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
      const openFileInBrowser = async (uri) => {
        console.log("sama",uri);
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
        

        const [reviews, setReviews] = useState({}); // تخزين المراجعات لكل تسليم

const handleReviewChange = (text, submissionId) => {
  setReviews((prev) => ({
    ...prev,
    [submissionId]: { ...prev[submissionId], review: text },
  }));
};

const handleRatingChange = (text, submissionId) => {
  setReviews((prev) => ({
    ...prev,
    [submissionId]: { ...prev[submissionId], rating: text },
  }));
};

const handleSubmitRecommendation = async (text,userId) => {
  if (!text) {
    alert("Please enter text!");
    return;
  }
console.log("texxxxxxxxxxx",text,userId);
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) {
      console.error("Token not found");
      alert("You are not authorized. Please log in.");
      return;
    }

    // إعداد البيانات لإرسالها
    const payload = { "text":text,"juniorID":userId }; // إرسال النص ككائن

    // إرسال الطلب إلى الخادم
    const response = await fetch(`${baseUrl}/user/addrecommendations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Wasan__${token}`,
      },
      body: JSON.stringify(payload), // إرسال النص كجزء من كائن
    });

    // التحقق من نجاح الطلب
    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(responseData.message || "Failed to submit the recommendation.");
    }

    // عرض رسالة النجاح
    alert("Recommendation submitted successfully!");
    console.log("Recommendation response:", responseData);
  } catch (error) {
    console.error("Error while submitting recommendation:", error.message);
    alert(`Error: ${error.message}`);
  }
};
const handleSubmitSkillsRating = async (skills,juniorUserId) => {
  console.log("ssss",skills);
  if (!skills || skills.length === 0) {
    alert("Please select skills and provide ratings!");
    return;
  }

  try {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) {
      console.error("Token not found");
      alert("You are not authorized. Please log in.");
      return;
    }

    // تحقق من وجود الـ JuniorUserId
    if (!juniorUserId) {
      alert("Junior user ID is required!");
      return;
    }

    // إنشاء البيانات لإرسالها
    const skillRatings = skills.map(skill => ({
      "SkillId": skill.id,
      "NewRatingSkill": skill.rating,
      "SkillName": skill.name,
    }));

    // إرسال الطلب إلى الخادم
    const response = await fetch(`${baseUrl}/tasks/reviewskills/${projectId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Wasan__${token}`,
      },
      body: JSON.stringify({ "SkillsRatings": skillRatings,"JuniorUserId":juniorUserId }),
       // إرسال التقييمات ككائن
    });

    // التحقق من نجاح الطلب
    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(responseData.message || "Failed to submit skill ratings.");
    }

    alert("Skill ratings submitted successfully!");
    console.log("Skill ratings response:", responseData);
  } catch (error) {
    console.error("Error while submitting skill ratings:", error.message);
    alert(`Error: ${error.message}`);
  }
};


const handleSubmitReview = async (submissionId) => {
  const { review, rating } = reviews[submissionId] || {};
  if (!review || !rating) {
    alert("Please enter both review and rating!");
    return;
  }

  try {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) {
      console.error("Token not found");
      alert("You are not authorized. Please log in.");
      return;
    }

    // إعداد بيانات المراجعة
    const reviewData = {
      "SubmissionId":submissionId,
     "TaskId":taskIDD, // قم بتحديث هذا المتغير إذا كان غير موجود في السياق
      "TaskRating":rating,
      "Feedback":review,
    };
  

    // إرسال الطلب إلى الخادم
    const response = await fetch(`${baseUrl}/tasks/addreviewtosubmit/${projectId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Wasan__${token}`,
      },
      body: JSON.stringify(reviewData),
    });

    // التحقق من نجاح الطلب
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to submit the review.");
    }

    alert("Review submitted successfully!");
    console.log(`Review for ${submissionId}:`, reviewData);
  } catch (error) {
    console.error("Error while submitting review:", error.message);
    alert(`Error: ${error.message}`);
  }
};


const handleCloseModal = () => {
  setShowStartTaskModal(false); // إغلاق المودال
};
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
          
  const handleSelectJuniors = (id) => {
    setSelectedJuniors((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((item) => item !== id); // Deselect if already selected
      }
      return [...prevSelected, id]; // Add new selection
    });
  };
  const handleSelectJunior = (id) => {
    setSelectedJuniors((prevSelected) => {
      if (prevSelected.includes(id)) {
        // إذا كان الشخص موجودًا بالفعل في القائمة، نقوم بإزالته
        return prevSelected.filter((item) => item !== id);
      }
      // إضافة الشخص إلى القائمة إذا لم يكن موجودًا
      return [...prevSelected, id];
    });
  };

  const handleSaveSelection = () => {
    console.log("save juniors", selectedJuniors);
    setShowJuniorList(false); // إغلاق المودال بعد الحفظ
  };

  const handleFileUpload = (event, taskId) => {
    const file = event.target.files[0];
    if (file) {
      console.log(`File uploaded for task ${taskId}:`, file);
      // هنا يمكنك التعامل مع الملف مثل رفعه إلى الخادم أو حفظه محلياً
    }
  };
  
  

// تعريف الحالات بشكل منفصل
const [startDate, setStartDate] = useState(new Date());
const [endDate, setEndDate] = useState(new Date());

const [showStartPicker, setShowStartPicker] = useState(false);
const [showEndPicker, setShowEndPicker] = useState(false);

const handleDateChange = (selectedDate, isStartDate) => {
  if (selectedDate) {
    if (isStartDate) {
      setStartDate(selectedDate); // تحديث StartDate
    } else {
      setEndDate(selectedDate); // تحديث EndDate
    }
  }

  // إخفاء DatePicker بناءً على نوع التاريخ
  isStartDate ? setShowStartPicker(false) : setShowEndPicker(false);
};



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
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [daysLeft,setdaysLeft]=useState('');
    const [newTask, setNewTask] = useState({
      PhaseName: "",
      TaskName: "",
      Description: "",
      TaskRoleName: "",
      StartDate: "",
      EndDate: "",
      Priority: "",
    });
    const [TaskName, setTaskName] = useState('');

    const addTask = () => {
      // Logic to add the new task (e.g., updating state or sending data to an API)
      console.log("New Task:", newTask);
    };
  
    const calculateDaysLeft = (currentDate, endDate) => {
      const current = moment(currentDate).startOf('day'); // ضبط الوقت إلى بداية اليوم
      const end = moment(endDate).startOf('day'); // ضبط الوقت إلى بداية اليوم
      const difference = end.diff(current, "days");
      return difference > 0 ? difference : "Deadline passed";
    };
    
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

  const handleShowAllTaskToJunior = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken'); // استرجاع التوكن
      console.log('Retrieved Token:', token, projectId); // تحقق من التوكن
      if (!token) { 
        console.error('Token not found');
        return;
      }
  
      const response = await fetch(`${baseUrl}/tasks/getallsubmissionsbysenior/${projectId}?TaskId=${taskIDD}`, {
        method: 'GET',
        headers: {
          'Authorization': `Wasan__${token}`, // التأكد من التنسيق الصحيح هنا
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json(); // إذا كان هناك خطأ في الرد
        throw new Error(errorData.message || 'Failed to fetch tasks');
      }
  
      const data = await response.json(); // تحويل الرد إلى JSON
      console.log('Fetched Task:', data.task); // تحقق من البيانات
      setTaskName(data.task.TaskName);
      // إذا كنت تحتاج إلى Submissions
      if (data.task && data.task.Submissions) {
        setProject(data.task.Submissions); // تعيين البيانات بشكل صحيح
      } else {
        setProject([]); // إذا لم توجد بيانات، تعيين المصفوفة فارغة
      }
  
    } catch (error) {
      console.error('Error fetching tasks:', error.message);
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
    const [taskID,setTaskId]=useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  function  consthandleshowModalTas  ()  {
    setShowStartTaskModal(true)    
    console.log(taskID);
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
        
       

        const handleAddTaskAssigneesAndFile = async (values) => {
          const token = await AsyncStorage.getItem('userToken');
          if (!token) {
            console.error('Token not found');
            return;
          }
          try {
   
          
          for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
          }
          // إرسال الطلب إلى الخادم لإضافة المرفقات والمكلفين
          const response = await fetch(`${baseUrl}/tasks/submittask/${projectId}`, {
            method: 'POST',
            headers: {
              'Authorization': `Wasan__${token}`,
              'Accept': 'application/json',
            },
            body: formData,
          });
        
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to add languages');
          }
      

        }
          catch (error) {
             console.error('Error Add:', error.message);
          }
        };    
        
        
        const handleUpdateTask = async (values) => {
          console.log("taskID",taskID);
          const token = await AsyncStorage.getItem('userToken');
          if (!token) {
              console.error('Token not found');
              return;
          }
      
          try {
              // إرسال البيانات كـ JSON بدلاً من FormData
              const requestData = {
                  TaskId: taskID,          // تأكد من استخدام TaskId بشكل صحيح
                  StartDate: startDate.toISOString(),  // تأكد من تنسيق StartDate بشكل صحيح
                  EndDate: endDate.toISOString(),    // تأكد من تنسيق EndDate بشكل صحيح
              };
      
              console.log('Sending updated task data:', requestData);
      
              // إرسال الطلب إلى الخادم
              const response = await fetch(`${baseUrl}/tasks/UpdateTaskinformations/${projectId}`, {
                  method: 'PUT',
                  headers: {
                      'Authorization': `Wasan__${token}`,
                      'Accept': 'application/json',
                      'Content-Type': 'application/json', // نحدد نوع المحتوى كـ JSON
                  },
                  body: JSON.stringify(requestData), // تحويل البيانات إلى JSON
              });
      
              // التحقق من استجابة الخادم
              console.log('Response status:', response.status);
      
              if (!response.ok) {
                  const errorData = await response.json();
                  throw new Error(errorData.message || 'Failed to update task');
              }
              const result = await response.json();
              console.log('Add Project successfully',result.task);

        await handleAddTaskAssigneesAndFile (taskID);
               // في حال نجاح العملية، يمكنك إضافة خطوات إضافية هنا إذا كانت مطلوبة
          } catch (error) {
              console.error('Error Update:', error.message);
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
    
  useEffect(() => {
    handleViewProfile();
    handleGetFeilds();
    handleShowAllTaskToJunior();
    handleGetSkills ();

  }, []);
  


  const cardScale = useSharedValue(1);
  const handlePress = (id,taskid) => {
    
   
    console.log("sama",id,taskid);
    // إذا كان الدور Junior، انتقل إلى الصفحة التي تريدها
      navigation.navigate('TheSubmission',{projectId:id,taskIDD:taskid}); // استبدل 'YourTargetScreen' باسم الصفحة
  
};
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
               
              

        <View style={{
  top: 5,
  left: 0,  // يحدد أن يكون العنصر عند أقصى اليسار
  marginBottom: 15,  // المسافة بين العناصر الأخرى
  flexDirection: 'row',  // عرض النص والأيقونة بشكل أفقي
  alignItems: 'center',  // محاذاة النص والأيقونة عموديًا
}}>
  <TouchableOpacity onPress={() => handleGetProjectByFeildOrSkills()}>
    <Text style={{
      fontSize: 16,
      fontWeight: 'bold',
      color: isNightMode ? primary : '#000',
      backgroundColor: isNightMode ? '#000' : '#f9f9f9',
      paddingHorizontal: 10,
      paddingVertical: 3,
      borderRadius: 20,
      opacity: 0.7,
    }}>
     Project Task
    </Text>
    
  </TouchableOpacity>

  <TouchableOpacity onPress={toggleDropdown}>
    <AntDesign 
      name="caretdown" 
      size={16} 
      color={isNightMode ? primary : '#000'} 
      style={{ marginLeft: 1 }}  // المسافة بين النص والأيقونة
    />
  </TouchableOpacity>

  {/* أيقونة الفلتر */}
  <View style={{ position: 'absolute', right: 10,  flexDirection: 'row',  // عرض النص والأيقونة بشكل أفقي
  alignItems: 'center', }}>
 <TouchableOpacity  onPress={toggleModal}>
  <Fontisto
    name="preview"
    size={25}
    color={fourhColor}
    style={{ marginRight: 6 }}  // المسافة بين النص والأيقونة

  />
</TouchableOpacity>

    <TouchableOpacity onPress={toggleModal}>
      <Feather
        name="sliders"
        size={25}
        color={fifthColor}
        style={{ rotate: '90deg' }} // تحويل الأيقونة لتكون عمودية
      />

    </TouchableOpacity>
  </View>
</View>
<View style={styles.divider1} />

<ScrollView
  contentContainerStyle={[
    styles.container,
    { backgroundColor: isNightMode ? "#000" : "#fff" },
  ]}
>
  {project?.length > 0 ? (
    project.map((submission, index) => (
      <Animatable.View
        key={submission._id}
        animation="zoomIn"
        delay={index * 100}
        duration={500}
        style={isMobile ? styles.cardMobile : styles.cardWeb}
      >
        <TouchableOpacity onPress={() => handlePress(projectId, task._id)}>
          <View style={isMobile ? styles.cardMobileContent : styles.cardWebContent}>
            {/* اسم المهمة */}
            <Text style={styles.projectName}>{TaskName}</Text>
            <Text style={styles.projectName}>{submission.UserFullName}</Text>

            {/* تاريخ ووقت التسليم */}
            <Text style={styles.taskMethode}>
              Submitted At:{" "}
              {moment(submission.SubmittedAt).format("YYYY-MM-DD HH:mm")}
            </Text>

            {/* عرض رابط الملف المرفق */}
            {submission.SubmitFile && submission.SubmitFile.length > 0 && (
              <Text style={styles.taskMethode}>
                File:{" "}
                <Text
                  onPress={() =>
                    openFileInBrowser(submission.SubmitFile[0]?.secure_url)
                  } // تمرير secure_url و originalname
                  style={styles.fileLink}
                >
                  {submission.SubmitFile[0].originalname}
                </Text>
              </Text>
            )}

            {/* إضافة المراجعة والتقييم */}
            <View style={styles.reviewContainer}>
              <TextInput
                placeholder="Write your review here..."
                style={styles.reviewInput}
                onChangeText={(text) => handleReviewChange(text, submission._id)}
              />
              <TextInput
                placeholder="Rating"
                keyboardType="numeric"
                style={styles.ratingInput}
                onChangeText={(text) => handleRatingChange(text, submission._id)}
              />
             

            {/* إضافة خانة التوصيات */}
            <View style={styles.reviewInput}>
              <TextInput
                placeholder="Write your recommendation..."
                style={styles.recommendationInput}
                onChangeText={(text) =>
                  handleRecommendationChange(text)
                }
              />
            </View>

            {/* تحديد المهارات */}
            <View style={styles.skillsContainer}>
              <TouchableOpacity
                onPress={() => openModal("skills")}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  style={[
                    styles.label,
                    {
                      marginRight: 5,
                      fontSize: 16,
                      color: isNightMode ? Colors.primary : "#000",
                    },
                  ]}
                >
                  Select Skills
                </Text>
                <AntDesign
                  name="caretdown"
                  size={14}
                  color={isNightMode ? Colors.primary : "#000"}
                />
              </TouchableOpacity>

              {/* عرض المهارات المختارة */}
              {selectedSkills?.length > 0 && (
                <View style={{ marginTop: 10 }}>
                  {selectedSkills.map((skill, index) => (
                    <View
                      key={skill.id}
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          color: isNightMode ? "#FFF" : "#000",
                          flex: 1,
                        }}
                      >
                        {skill.name}
                      </Text>

                      {/* عرض التقييم باستخدام النجوم */}
                      <View style={{ flexDirection: "row" }}>
                        {[1, 2, 3, 4, 5].map((starIndex) => (
                          <MaterialCommunityIcons
                            key={starIndex}
                            name={
                              starIndex <= skill.rating
                                ? "star"
                                : "star-outline"
                            }
                            size={20}
                            color={
                              starIndex <= skill.rating ? "#F7A8B8" : "#C0C0C0"
                            }
                          />
                        ))}
                      </View>

                      {/* فاصل بين المهارات */}
                      {index < selectedSkills.length - 1 && (
                        <View style={styles.divider1} />
                      )}
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
          <TouchableOpacity
                style={styles.submitButton}
                onPress={() => {
    handleSubmitReview(submission._id); // إرسال مراجعة النص والتقييم
    handleSubmitRecommendation(recommendation,submission.UserId); // إرسال التوصيات
    handleSubmitSkillsRating(selectedSkills,submission.UserId); // إرسال تقييم المهارات
  }}              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
        </TouchableOpacity>
      </Animatable.View>
    ))
  ) : (
    <Text style={styles.noSubmissionsText}>No submissions available</Text>
  )}
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

    
    <Modal animationType="slide" transparent={true} visible={modalVisibleProject} onRequestClose={closeModalProject}>
      <View style={styles.modalContainerp}>
        <View style={[styles.modalContentp, { backgroundColor: isNightMode ? '#000' : '#fff' }]}>          
          {showSuccessMessage && (
            <View style={styles.successContainer}>
              <Animated.View style={[styles.checkmark, { transform: [{ scale: scaleValue }] }]}>
                <MaterialCommunityIcons name="check-circle" size={30} color="#28a745" />
              </Animated.View>
              <Text style={styles.successMessage}>
                Submission send successfully!
              </Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
      {/*///////////////////////////////////////////////Show Feild////////////////////////////*/}
  

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
            marginBottom: 10,fontWeight:'bold',
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
    marginBottom: 10,
    width: width - 20, // تأكيد أن عرض البطاقة يتناسب مع عرض الشاشة
  },
cardWeb: {
  marginBottom: 10,
  flexBasis: "30%", // تحديد نسبة العرض للبطاقة
  width: '50%',
  height: "auto", // السماح للارتفاع بالتكيف مع المحتوى
  flex: 1, 
},


  cardMobileContent: {
    backgroundColor: Colors.primary,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
    overflow: "hidden",
    justifyContent: "space-between",padding:5
  },
cardWebContent: {
  height: "auto", // السماح للارتفاع بالتكيف
  padding: 10,
  backgroundColor:  Colors.primary,
  borderRadius: 10,
  shadowColor: "#000",
  shadowOpacity: 0.2,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 5 },
  elevation: 5,padding:5
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
    marginBottom: 10,fontWeight:'bold'
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
    marginBottom: 5,fontWeight:'bold'
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
    backgroundColor: Colors.brand,
    marginVertical: 8,
  },
  divider1: {
    height: 3,
    backgroundColor: Colors.darkLight,
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
  taskActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  taskActionsDate: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  actionButton: {
    backgroundColor: Colors.darkLight,
    paddingVertical: 8,
    paddingHorizontal: 30,
    borderRadius: 10,alignItems:'center',marginBottom:5
  },
  actionButtonSelect: {
    backgroundColor: Colors.fifthColor,
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderRadius: 10,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",fontWeight:'bold',
  },
taskDates: {
    fontSize: 13,
    color: "#2c3e50",
    marginBottom: 6,
  },
  taskPriority: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#e74c3c",
    marginTop: 6,
  },
  taskMethode: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.fifthColor,
    marginTop: 1,    marginBottom: 6,
  }, modalContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  juniorItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  juniorText: {
    fontSize: 16,
  },
  juniorRole: {
    fontSize: 14,
    color: 'gray',
  },
  closeButton: {
    backgroundColor: 'red',
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  selectedText: {
    marginTop: 10,
    fontSize: 16,
    color: 'gray',
  }, 
  
   saveButton: { backgroundColor: '#28a745', padding: 10, borderRadius: 5, marginTop: 20 },
  saveButtonText: { color: '#fff' },
  closeButton: { backgroundColor: '#dc3545', padding: 10, borderRadius: 5, marginTop: 10 },
  closeButtonText: { color: '#fff' },
  uploadButton: {
    paddingVertical: 3,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  uploadButtonText: {
    color: Colors.fifthColor,
    fontSize: 16,
    fontWeight: "bold",
  },
  fileNameContainer: {
marginBottom: 8,
    padding: 10,
    backgroundColor: "#f8f8f8",
    borderRadius: 5,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  fileNameText: {
    fontSize: 16,
    color: "#333",
  },
  noFileText: {
    fontSize: 16,
    color: "#aaa",
  }, modalWrapper: {
    flex: 1,
    justifyContent: "flex-start",
    padding: 20,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
  },
  dateText: {
    fontSize: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },

  fileNameContainer: {
    marginTop: 10,
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  fileNameText: {
    fontSize: 14,
    marginBottom: 5,
  },
  noFileText: {
    fontSize: 14,
    color: "gray",
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 20,
  },
  taskActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },

  actionButtonText: {
    color: "white",
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: "#dc3545",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
  },deliveryTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  deliveryTypeButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: Colors.firstColor,
    width: "45%",
    alignItems: "center",
  },
  selectedDeliveryTypeButton: {
    backgroundColor: Colors.darkLight,
  },
  deliveryTypeText: {
    fontSize: 16,
    color: "#333",
  },  successMessage: {
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
},reviewContainer: {
  marginTop: 10,
  padding: 10,
  borderTopWidth: 1,
  borderTopColor: '#ddd',
},
reviewInput: {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  padding: 8,
  marginBottom: 10,
  fontSize: 14,
},
ratingInput: {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  padding: 8,
  marginBottom: 10,
  fontSize: 14,
  width: 100,
},
submitButton: {
  backgroundColor: Colors.fifthColor,
  padding: 10,
  borderRadius: 8,
  alignItems: 'center',
},
submitButtonText: {
  color: '#fff',
  fontWeight: 'bold',
},scrollableItemsContainer: {
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
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
    color: '#333',
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
  inputContainer: {
    marginTop: 20,
    padding: 10,
  },
  label: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
  inputContainer: {
    padding: 10,
    borderRadius: 8,
    margin: 10,
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
});