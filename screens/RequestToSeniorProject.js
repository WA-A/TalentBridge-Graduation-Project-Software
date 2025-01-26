import React, { useEffect, useState,useContext } from 'react';
import { View, Text, Image, Pressable, TouchableOpacity, TextInput,Modal ,StyleSheet, Switch, FlatList, ScrollView, Animated, Button, Alert, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from './../compnent/Style';
import { Dimensions } from 'react-native';
import { NightModeContext } from './NightModeContext';
import { jwtDecode } from "jwt-decode";
import {
    Ionicons, Feather, FontAwesome5, EvilIcons, FontAwesome, MaterialIcons, MaterialCommunityIcons, Entypo
  
  } from '@expo/vector-icons';
const { width } = Dimensions.get('window');
import * as Animatable from "react-native-animatable";

const { secondary, primary, careysPink, darkLight, fourhColor, tertiary, fifthColor,brand } = Colors;

const RequestToSeniorProject = () => {
      const { isNightMode, toggleNightMode } = useContext(NightModeContext);
    
  const baseUrl = Platform.OS === 'web'
    ? 'http://localhost:3000'
    : 'http://192.168.1.239:3000' || 'http://192.168.0.107:3000';
    const [searchQuery, setSearchQuery] = useState('');
      const [scrollY] = useState(new Animated.Value(0));
      const fetchApplications = async () => {
        const token = await AsyncStorage.getItem('userToken'); // الحصول على التوكن من التخزين
        console.log(token);
        if (!token) {
          console.error('Token not found');
          return;
        }
    
        try {
          const response = await fetch(`${baseUrl}/applicationtrain/getApplicationsByProject/${projectId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Wasan__${token}`, // تضمين التوكن في الهيدر
            },
          });
    
          if (!response.ok) {
            const errorData = await response.json(); // إذا كان هناك خطأ في الرد
            throw new Error(errorData.message || 'Failed to fetch Application');
          }
    
          const data = await response.json();  // استخراج البيانات بشكل صحيح
          setApplications(data.applications); // تعيين البيانات في الحالة
        } catch (error) {
      //    console.error("Error fetching applications:", error);
        }
      };
    // Load custom fonts
    const bottomBarTranslate = scrollY.interpolate({
        inputRange: [0, 50],
        outputRange: [0, 100], // 100 to move it off-screen
        extrapolate: 'clamp',
      });
      const isMobile = width <= 768;

      const [profile,setprofileimg] = useState('');
      const [profileUser,setOtherProfile] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const { projectId,status } = route.params;  // الحصول على projectId من التنقل
  const [applications, setApplications] = useState([]);
    const nav = useNavigation();
  
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
    //  console.error('Error fetching ProfileData:', error);
    }
  };


  //////////////////



  const startProject = async () => {
console.log(projectId);
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.error('Token not found');
        return;
      }
      // جلب بيانات المستخدم الحالية من السيرفر
      const response = await fetch(`${baseUrl}/project/UpdateProjectStatusToInProgress/${projectId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Wasan__${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text(); // جلب نص الخطأ
        console.error('Server Response:', errorText);
        throw new Error('Failed to Start Project');
      }
      
      const data = await response.json();

      console.log(data.project);
      navigation.navigate('ThePlaneProjectSenior',{ projectId: projectId });
    } catch (error) {
      console.error('Error updating Project :', error);
    }
  };



  const handleDeleteApplication = async (CommentId) => {
    try {
      const token = await AsyncStorage.getItem('userToken'); // استرجاع التوكن
      if (!token) {
        console.error('Token not found');
        return;
      }
      const response = await fetch(`${baseUrl}/applicationtrain/RejectApplication/${CommentId}`, { // تأكد من المسار الصحيح
        method: 'DELETE',  // طريقة الحذف يجب أن تكون DELETE
        headers: {
          'Authorization': `Wasan__${token}`, // تضمين التوكن في الهيدر
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json(); // إذا كان هناك خطأ في الرد
      }
      console.log('delete App'); // تحقق من البيانات
      fetchApplications();
    } catch (error) {
    //  console.error('Error deleting commen:', error.message);
    }
  };

  
  
  useEffect(() => {
    handleViewProfile();
    // جلب بيانات الطلبات للمشروع
   

    fetchApplications();
  }, [projectId]);

  const handleAccept = (applicationId, userName) => {
    Alert.alert("Accepted", `${userName}'s request has been accepted!`);
    // إضافة منطق القبول (مثلاً تحديث حالة الطلب في قاعدة البيانات)
  };

  const handleReject = (applicationId,userName) => {
    handleDeleteApplication(applicationId); 
    Alert.alert("Rejected", `${userName}'s request has been rejected.`);
    // إضافة منطق الرفض (مثلاً حذف الطلب أو تحديث حالته)
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

  const navigateToSeniorProfile = async (senior) => {
    await handleViewOtherProfile(senior);  // الانتظار حتى يتم تحميل البيانات
    // التأكد من تحميل البيانات قبل الانتقال
    if (profileUser) {
      console.log('Navigate to Senior Profile:',profileUser);
      navigation.navigate('ViewOtherProfile', { userData: profileUser });
    } else {
      console.log('No profile data available');
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


    {/* Main Content */}
<View style={{ flex: 1, backgroundColor: isNightMode ? "#000" : "#fff" }}>
  <View style={styles.divider1} />

  <ScrollView 
    contentContainerStyle={[
      styles.scrollContainer, 
      { backgroundColor: isNightMode ? "#000" : "#fff" }
    ]}
  >
    <View
      style={{
        justifyContent: "flex-start",
        paddingHorizontal: isMobile ? 15 : 30,
        backgroundColor: isNightMode ? "#000" : Colors.primary,
      }}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.requestsCount}>
          Total Requests: {applications ? applications.length : 0}/4
        </Text>
      </View>
      <View style={styles.divider3}></View>

   {/* Project Status */}
<View
  style={[
    styles.cardDetails,
    {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 15,
    },
  ]}
>
  <Text style={styles.projectStatus}>
    {status === 'In Progress'
      ? 'Project is in progress. Open it?'
      : status === 'Open'
      ? 'Start the project?'
      : status === 'Completed'
      ? 'View the project?'
      : 'Unknown status'}
  </Text>

  <TouchableOpacity
    style={styles.applyButton}
    onPress={() => {
      if (status === 'In Progress') {
        navigation.navigate('ThePlaneProjectSenior', { projectId: projectId,juniors:applications}); // شاشة عرض المشروع

      } else if (status === 'Open') {
        startProject(); // تنفيذ بدء المشروع
      } else if (status === 'Completed') {
      } else {
        console.warn('Invalid project status');
      }
    }}
  >
    <Text style={styles.applyButtonText}>
      {status === 'In Progress'
        ? 'Open'
        : status === 'Open'
        ? 'Start'
        : status === 'Completed'
        ? 'View'
        : 'N/A'}
    </Text>
  </TouchableOpacity>
</View>

      <View style={styles.divider}></View>

      {/* Applications Grid */}
      <View style={styles.container}>
        {applications && applications.length > 0 ? (
          <View
            style={[
              styles.grid,
              {
                flexDirection: isMobile ? "column" : "row",
                flexWrap: "wrap",
                justifyContent: isMobile ? "flex-start" : "space-evenly",
                padding: isMobile ? 10 : 20,
              },
            ]}
          >
            {applications.map((item, index) => (
              <Animatable.View
                key={item._id || index}
                animation="fadeInUp"
                delay={index * 100}
                duration={500}
                style={[isMobile ? styles.cardMobile : styles.cardWeb]}
              >
                <View style={isMobile ? styles.cardMobileContent : styles.cardWebContent}>
                  <View style={styles.cardDetails}>
                    <TouchableOpacity
                      onPress={() => navigateToSeniorProfile(item.userId._id)}
                    >
                      <View style={styles.row}>
                        <Image
                          source={{
                            uri: item.userId.PictureProfile?.secure_url || "https://via.placeholder.com/80",
                          }}
                          style={styles.seniorAvatar}
                        />
                        <Text style={styles.seniorName}>{item.userId.FullName}</Text>
                      </View>
                    </TouchableOpacity>
                    <View style={styles.divider}></View>

                    <Text style={styles.roleName}>Role Name: {item.roleName}</Text>
                    <Text style={styles.statusText}>Request Status: {item.Status}</Text>
                    <Text style={styles.notesText}>Junior Note: {item.notes}</Text>

                    {/* Action Buttons */}
                    <View style={styles.actionButtonsContainer}>
                      {item.Status !== "Accepted" && (
                        <TouchableOpacity
                          style={[styles.actionButton, { backgroundColor: "#28a745" }]}
                          onPress={() => handleAccept(item._id, item.userId.FullName)}
                        >
                          <Text style={styles.actionButtonText}>Accept</Text>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: "#dc3545" }]}
                        onPress={() => handleReject(item._id, item.userId.FullName)}
                      >
                        <Text style={styles.actionButtonText}>Reject</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Animatable.View>
            ))}
          </View>
        ) : (
          <Text style={styles.noDataText}>No data available</Text>
        )}
      </View>
    </View>
  </ScrollView>
</View>

    
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
                uri: profile || 'https://via.placeholder.com/80', // استخدام الصورة المختارة أو صورة بروفايل أو صورة افتراضية
              }}  style={{
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
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
      },
 

    // إضافة هذا لتجنب المسافة البيضاء الكبيرة أسفل منطقة الإدخال:

 
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
        marginBottom: 20,width:330
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
      
      actionButtonsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
      },
      actionButton: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
      },
      actionButtonText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "bold",
      },
      noDataText: {
        textAlign: "center",
        color: "#999",
        fontSize: 16,
        marginTop: 20,
      },  roleName: {
        fontSize: 14,
        marginBottom: 5,fontWeight:'bold',color:Colors.fifthColor,
      },
      statusText: {
        fontSize: 14,
        marginBottom: 5,fontWeight:'bold',color:Colors.fifthColor,
      },

      notesText: {
        fontSize: 12,
        color: "#cc",
        marginBottom: 5,
      },
      contactText: {
        fontSize: 12,
        color: "#444",
        marginBottom: 5,
      },  seniorAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginBottom: 10,
      },
      seniorName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
      },
      requestsCount: {
        fontSize: 15,
        fontWeight: "bold",
      }, row: {
        flexDirection: "row",
        alignItems: "center", // لضبط النص عموديًا مع الصورة
        marginBottom: 10, // مسافة بين الصف والعناصر الأخرى
      },
      seniorAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25, // لجعل الصورة دائرية
        marginRight: 10, // مسافة بين الصورة والنص
      },
      seniorName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333", // لون النص
      },applyButtonText: {
  color: "#fff",
  fontSize: 13,
  fontWeight: "bold",
  textAlign: "center",
},  applyButton: {
    alignSelf: "flex-end",
    backgroundColor:"green", // لون الزر
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 0,
  }, projectStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'green',
    marginTop: 10,
},

});

export default RequestToSeniorProject;
