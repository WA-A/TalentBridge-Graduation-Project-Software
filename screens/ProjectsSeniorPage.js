import React, { useState, useContext,useEffect } from 'react';
import { View, Text, TouchableOpacity,StyleSheet, Modal, FlatList, ScrollView, Image,Platform,Animated} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { NightModeContext } from './NightModeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from './../compnent/Style';
import { Card,UserInfoText, UserName, ContainerCard, PostText, UserInfo, ButtonText, StyledButton} from './../compnent/Style.js';
import { TextInput } from 'react-native-gesture-handler';
const { tertiary, firstColor, secColor,fifthColor,secondary, primary, darkLight, fourhColor, careysPink} = Colors;
import { EvilIcons,AntDesign,MaterialIcons,MaterialCommunityIcons,Feather,FontAwesome} from '@expo/vector-icons';
import MultiSelect from 'react-native-multiple-select';
import { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { Dimensions } from "react-native";
import * as Animatable from "react-native-animatable";
import Slider from '@react-native-community/slider';
const { width } = Dimensions.get("window");


export default function  ProjectsJuniorPage ({ navigation, route }) {

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
    const [isDropdownVisible, setDropdownVisible] = useState(false);
  
    const toggleDropdown = () => {
      setDropdownVisible(!isDropdownVisible);
    };







    /////////////////////////////////////////// Filter /////////////////////////////////////////////////////
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalSEnoir, setIsSenior] = useState(false);

  
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
    


const [userRoless,setRoleUser]=useState('');






    const handleSave = async (selectedFeilds) => {

      if (currentModal === 'Feild') {
   console.log(selectedFeilds);
//   GetProjectsByField(selectedFeilds[0]);
   setSelectedFilters((prev) => ({
    ...prev,
   field:selectedFeilds[0] ,
  }))
  console.log(selectedFilters.field);
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
        setProject(data.projects.filteredProjects);
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
      setIsSenior(false);
      console.log('Filters applied:', selectedFilters);
      handleFilter(); // استدعاء دالة الفلترة التي تقوم بإرسال الفلاتر إلى الخادم
      toggleModal(); // إغلاق المودال بعد تطبيق الفلاتر
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
     //       console.log('Fetched Feilds:', data.Fields); // تحقق من البيانات
          } catch (error) {
            console.error('Error fetching Feilds:', error.message);
          }
        };
      
        const viewownprojectcreated = async () => {
          setIsSenior(true);

          try {
            const token = await AsyncStorage.getItem('userToken'); // استرجاع التوكن
            console.log('Retrieved Token:', token); // تحقق من التوكن
            if (!token) { 
              console.error('Token not found');
              return;
            }
        
            const response = await fetch(`${baseUrl}/project/viewownprojectcreated`, {
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

            if (data.projects && data.projects.length > 0) {
              setProject(data.projects);
              console.log('Fetched Project:', data.projects); // تحقق من البيانات
            } else {
              console.log('No projects found'); // يمكن إضافة رسالة هنا إذا أردت إظهار إشعار بعدم وجود مشاريع
            }
        
          } catch (error) {
          //  console.error('Error fetching Project:', error.message);
          }
        };


        const handleDeleteProhect= async (CommentId) => {
          console.log(CommentId);
          try {
            const token = await AsyncStorage.getItem('userToken'); // استرجاع التوكن
            if (!token) {
              console.error('Token not found');
              return;
            }
            const response = await fetch(`${baseUrl}/project/deleteownprojectcreated/${CommentId}`, { // تأكد من المسار الصحيح
              method: 'DELETE',  // طريقة الحذف يجب أن تكون DELETE
              headers: {
                'Authorization': `Wasan__${token}`, // تضمين التوكن في الهيدر
                'Content-Type': 'application/json',
              },
            });
        if(response){
          console.log(response.message);
        }
            if (!response.ok) {
              const errorData = await response.json(); // إذا كان هناك خطأ في الرد
              throw new Error(errorData.message || 'Failed to delete project');
            }
            viewownprojectcreated();
          } catch (error) {
            console.error('Error deleting project:', error.message);
          }
        };


        const handleShowApplication= async (ApptId,status) => {

          navigation.navigate('RequestToSeniorProject', { projectId:ApptId,status:status});

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
        
        const GetProjectsByField = async (id) => {
          console.log("Feild",id);
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

        const navigateToProjectDetails = (project,userRoless) => {
          // Implement navigation logic here, e.g., navigation.navigate('ProjectDetails', { project });
          console.log('Navigate to Project Details:', project,userRoless);

          navigation.navigate('ProjectPage', { userData: project,RoleUser:userRoless});
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
    viewownprojectcreated();
  }, []);
  


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
         
          <TouchableOpacity onPress={() => nav.navigate('AddProjects')}>
<Ionicons name="create-outline" size={28} color="#000"   style={{ marginRight: 100 }}
 />
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
               
        <View style={{
  top: 5,
  left: 0,  // يحدد أن يكون العنصر عند أقصى اليسار
  marginBottom: 15,  // المسافة بين العناصر الأخرى
  flexDirection: 'row',  // عرض النص والأيقونة بشكل أفقي
  alignItems: 'center',  // محاذاة النص والأيقونة عموديًا
}}>
  <TouchableOpacity onPress={() => viewownprojectcreated()}>
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
     Your Projects
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
 <TouchableOpacity onPress={() => nav.navigate('ProjectYouAreIN')} >
  <FontAwesome
    name="folder-open"
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
  contentContainerStyle={[styles.container, { backgroundColor: isNightMode ? "#000" : "#fff" }]}
>
  {project && project.length > 0 ? (
    <View
      style={[
        styles.grid,
        { flexDirection: isMobile ? "column" : "row", justifyContent: isMobile ? "flex-start" : "space-between" },{backgroundColor: isNightMode ? "#000" : Colors.primary }
      ]}
    >
      {project.map((project, index) => (
        <Animatable.View
          key={project._id}
          animation="zoomIn"
          delay={index * 100} // تأخير كل بطاقة 100ms لتظهر بالتتابع
          duration={500} // مدة تأثير الزوم
          style={[isMobile ? styles.cardMobile : styles.cardWeb]} // تنسيق مخصص لكل منصة
        >
          <TouchableOpacity
            style={isMobile ? styles.cardMobileContent : styles.cardWebContent}
            onPress={() => navigateToProjectDetails(project,project.senior.role)}
          >
          
        
            <View style={styles.cardDetails}>
            <View style={styles.experienceHeader}>
            <TouchableOpacity
    onPress={() => handleDeleteProhect(project._id)}
    style={styles.deleteButton}
  >
    <MaterialCommunityIcons
      name="minus-circle"
      size={20}
      color={isNightMode ? Colors.primary : Colors.black}
    />
  </TouchableOpacity>
  {isModalSEnoir && (
    <TouchableOpacity     onPress={() => handleShowApplication(project._id,project.Status)} style={styles.editButton}>
      <Ionicons
        name="people-sharp"
        size={20}
        color={isNightMode ? Colors.primary : Colors.black}
      />
    </TouchableOpacity>
  )}
 
</View>

            <Text style={styles.projectName}>{project.ProjectName}</Text>

              <Text style={styles.projectDescription}>
                {project.Description.slice(0, 50)}...
              </Text>
              <Text style={styles.projectCreatedAt}>
                Created on: {new Date(project.created_at).toLocaleDateString('en-US')}
              </Text>
              <Text style={styles.projectStatus}>
                Status: {project.Status}
              </Text>
              <Text style={styles.projectPrice}>
                Price: ${project.Price}
              </Text>
                       <View style={styles.divider} />
           

              <View style={styles.seniorInfo}>
              <TouchableOpacity style={styles.seniorInfo}
  onPress={() => navigateToSeniorProfile(project.CreatedBySenior)}
>
<Image
  source={{
    uri: project.CreatedBySenior?.PictureProfile?.secure_url || "https://via.placeholder.com/50",
  }}
  style={styles.seniorAvatar}
/>

  <Text style={styles.seniorName}>
    {project.CreatedBySenior ? project.CreatedBySenior.FullName : "Unknown Senior"}
  </Text>
</TouchableOpacity>

</View>
              {/* "See More" Button */}
            
            </View>
          </TouchableOpacity>
        </Animatable.View>
      ))}
    </View>
  ) : (
    <Text style={styles.noProjects}>
      No projects available.
    </Text>
  )}
</ScrollView>



  



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
          <TouchableOpacity onPress={() => nav.navigate('AddProjects')}>
<Ionicons name="create-outline" size={28} color="#000" />
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
       

      {/*///////////////////////////////////////////////Show Feild////////////////////////////*/}

</View>
    );
};


const styles = StyleSheet.create({
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
      flexWrap: "wrap",
      alignItems: "flex-start",marginBottom:40,
    },
    cardMobile: {
      marginBottom: 20,
      marginHorizontal: 5, // تقليل المسافة بين البطاقات
      width: width - 20, // تأكيد أن عرض البطاقة يتناسب مع عرض الشاشة
    },
    cardWeb: {
      marginBottom: 20,
      marginHorizontal: 10,
      width: "22%", // تحديد عرض ثابت للبطاقات في الويب
      height: 300, // تثبيت الارتفاع للويب
      width:400,
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
    }, experienceHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 13,marginTop:9,
    },editButton: {
    position: 'absolute',
    right: 0, /* موقع الأيقونة من اليمين */
    cursor: 'pointer',
  },
  deleteButton: {
    position: 'absolute',
    right: 25, /* موقع الأيقونة من اليمين */
    cursor: 'pointer',
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
  
  });