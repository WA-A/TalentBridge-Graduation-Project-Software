import React, { useState, useContext,useRef,useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, Image,TextInput,TouchableOpacity, StyleSheet, ToastAndroid,useColorScheme, PermissionsAndroid, SafeAreaView, ScrollView,Animated, Button, Alert, Platform,TouchableWithoutFeedback,Keyboard, FlatList,KeyboardAvoidingView,flatListRef} from 'react-native';
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
import { decode as atob } from 'base-64'; // إذا كنت تستخدم React Native

import './../compnent/webCardStyle.css';
import {
    Colors,
    ButtonText,
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
    StyledButton,
    InteractionText,
} from './../compnent/Style'
import ImageViewer from 'react-native-image-zoom-viewer';
// Color constants
const { secondary, primary, careysPink, darkLight,brand ,fourhColor, tertiary, fifthColor } = Colors;
const { width } = Dimensions.get('window');
import * as WebBrowser from 'expo-web-browser'

import * as FileSystem from 'expo-file-system';
import Video from 'react-native-video';
//import * as Linking from 'expo-linking';
import CommentsModal from './CommentsModal';
import { setIsEnabledAsync } from 'expo-av/build/Audio';
import { string } from 'prop-types';
import { use } from 'react';
import { PieChart, BarChart } from 'react-native-chart-kit';

export default function AdminRequestPage({ navigation, route}) {
       const { isNightMode, toggleNightMode } = useContext(NightModeContext);
         const [isSidebarVisible, setIsSidebarVisible] = useState(false);
       
       const toggleSidebar = () => {
        setIsSidebarVisible(!isSidebarVisible); // تبديل حالة الشريط الجانبي
      
      };
     
          const nav = useNavigation();
      
      // Test Data
          const seniorData = [
            {
              name: 'Jihad Awwad',
              email: 'jihad165@example.com',
              phone: '+9709876578',
              previousExperiences: '7 years in DevOps',
              motivation: 'Automation enthusiast',
              contribution: 'Optimized CI/CD pipelines',
              certifications: 'AWS DevOps Engineer',
              major: 'Computer Engineering' 
            },
            {
              name: 'Yazan Awwad',
              email: 'yazan187@example.com',
              phone: '+970946829965',
              previousExperiences: '3 years in Mobile Development',
              motivation: 'Enjoys solving complex problems',
              contribution: 'Developed a successful fintech app',
              certifications: 'Google Associate Android Developer',
              major: 'Software Engineering' 
            },
            {
              name: 'Aws Awwad',
              email: 'aws301@example.com',
              phone: '+97094178654',
              previousExperiences: '5 years in Software Development',
              motivation: 'Passionate about AI and ML',
              contribution: 'Led a team of 10 developers',
              certifications: 'AWS Certified Solutions Architect',
              major: 'Computer Science' 
            },
            {
              name: 'Bara Awwad',
              email: 'bara83@example.com',
              phone: '+970999865135',
              previousExperiences: '6 years in Frontend Development',
              motivation: 'Loves UI/UX design',
              contribution: 'Built scalable React applications',
              certifications: 'Certified UI/UX Designer',
              major: 'Information Technology' 
            },
          ];



           const [PreviousExperiences, setPreviousExperiences] = useState('');
                      const [Motivation, setMotivation] = useState('');
                      const [Contribution, setContribution] = useState('');
                      const [Major, setMajor] = useState('');
                      const [file, setFile] = useState(null);
          
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
    
    
                          const handleGetRequestSeniorToAdmin = async () => {
                            try {
                              const baseUrl = Platform.OS === 'web'
                                ? 'http://localhost:3000'
                                : 'http://192.168.1.239:3000';
                          
                              console.log('Sending GET request to fetch all senior requests...');
                          
                              const response = await fetch(`${baseUrl}/admin/getallrequestseniortoadmin`, {
                                method: 'GET', // استخدام GET بدلًا من POST أو PUT
                                headers: {
                                  'Content-Type': 'application/json', // تحديد نوع المحتوى
                                },
                              });
                          
                              if (!response.ok) {
                                const errorData = await response.json();
                                throw new Error(errorData.message || 'Something went wrong');
                              }
                          
                              const result = await response.json();
                              console.log('Requests fetched successfully:', result);
                          
                              // إرجاع البيانات للاستخدام في الواجهة
                              return result.requestseniortoadmin;
                            } catch (error) {
                              console.error('Error fetching requests:', error);
                              throw error; // إعادة رمي الخطأ للتعامل معه في مكان آخر
                            }
                          };

                          useEffect(() => {
                            handleGetRequestSeniorToAdmin
                          }, []);

                          const handleAdminAcceptSeniorRequest = async (UserId) => {
                            try {
                              const baseUrl = Platform.OS === 'web'
                                ? 'http://localhost:3000'
                                : 'http://192.168.1.239:3000';
                          
                              console.log('Sending PUT request to accept senior request...');
                          
                              const response = await fetch(`${baseUrl}/admin/acceptseniorrequest/${UserId}`, {
                                method: 'PATCH', 
                                headers: {
                                  'Content-Type': 'application/json', 
                                },
                              });
                          
                              if (!response.ok) {
                                const errorData = await response.json();
                                throw new Error(errorData.message || 'Something went wrong');
                              }
                          
                              const result = await response.json();
                              console.log('Senior request accepted successfully:', result);
                          
                              alert('Senior request accepted successfully!');
                              return result.user; 
                            } catch (error) {
                              console.error('Error accepting senior request:', error);
                              alert(`Error: ${error.message}`); 
                              throw error; 
                            }
                          };
 return(
  
<TouchableWithoutFeedback >
  <View style={{ flex: 1 }}>

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
     <TouchableOpacity onPress={() => nav.navigate('AdminHomePage')} style={{ marginRight: 100, marginLeft: 80}}>
           <Ionicons name="stats-chart" size={20} color= {isNightMode ? primary : "#000"} />
         </TouchableOpacity>
       
   

         <TouchableOpacity onPress={() => nav.navigate('AdminRequestPage')} style={{ marginRight: 100 }}>
  <Ionicons name="document-text" size={20} color={isNightMode ? primary : "#000"} />
</TouchableOpacity>

         <TouchableOpacity onPress={() => nav.navigate('AdminFieldsPage')} style={{ marginRight:100 }}>
           <Ionicons name="trending-up-outline" size={25} color= {isNightMode ? primary : "#000"} />
         </TouchableOpacity>
   
   
         <TouchableOpacity style={{marginRight: 100 }}
       onPress={() => nav.navigate('Notification')}>
               <Ionicons  name="notifications" size={20} color= {isNightMode ? primary : "#000"} />
       </TouchableOpacity>
       <TouchableOpacity onPress={() => setMenuVisible(true)} style={{ marginRight:100 }}>
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
   
      
     </View>
      ) : (
        <>

    <View style={{ height: 0, backgroundColor: isNightMode ? "#000" : secondary }} />

    {/* Header */}
    <View style={{
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingHorizontal: 15, paddingVertical: 10, backgroundColor: isNightMode ? "#000" : secondary,
      position: Platform.OS === 'web' ? 'fixed' : 'relative',
      top: 0, left: 0, right: 0, zIndex: 10,
    }}>
      

      {/* Sidebar Toggle Button */}
      <TouchableOpacity onPress={toggleSidebar}>
        <EvilIcons name="sc-telegram" size={39} color={careysPink} style={{ position: 'absolute', top: -20, left: 10 }} />
        <EvilIcons name="sc-telegram" size={37} color={darkLight} style={{ position: 'absolute', top: -20, left: 10 }} />
      </TouchableOpacity>

      {/* Night Mode Toggle Button */}
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
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 10,
     backgroundColor: isNightMode ? '#2C2C2C' : '#f0f0f0' , elevation: 3, position: Platform.OS === 'web' ? 'fixed' : 'relative',
      zIndex: 10, width: '100%', top: Platform.OS === 'web' ? 55 : 0, marginBottom: Platform.OS === 'web' ? 20 : 0,
    }}>
       
</View></>
      )}


<ScrollView style={{ marginTop: Platform.OS === 'web' ? 70 : 20 }}>
      <View style={{ flex: 1, padding: 20, backgroundColor: isNightMode ? '#333' : 'transparent' }}>
        <FlatList
          data={seniorData}
          numColumns={2} // يعرض عنصرين في كل صف
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item: senior }) => (
            <View style={{
              flex: 1,
              margin: 10,
              backgroundColor: isNightMode ? '#444' : '#fff',
              borderRadius: 16,
              padding: 20,
              elevation: 3,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 5
            }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: isNightMode ? '#fff' : '#334664' }}>{senior.name}</Text>
              <Text style={{ fontSize: 16, color: isNightMode ? '#ddd' : '#000' }}>Email: {senior.email}</Text>
              <Text style={{ fontSize: 16, color: isNightMode ? '#ddd' : '#000' }}>Phone: {senior.phone}</Text>
              <Text style={{ fontSize: 16, color: isNightMode ? '#ddd' : '#000' }}>PreviousExperiences: {senior.previousExperiences}</Text>
              <Text style={{ fontSize: 16, color: isNightMode ? '#ddd' : '#000' }}>Motivation: {senior.motivation}</Text>
              <Text style={{ fontSize: 16, color: isNightMode ? '#ddd' : '#000' }}>Contribution: {senior.contribution}</Text>
              <Text style={{ fontSize: 16, color: isNightMode ? '#ddd' : '#000' }}>Major: {senior.major}</Text>
              <TouchableOpacity style={{ marginTop: 10, padding: 10, backgroundColor: '#9EABCB', borderRadius: 8 }}>
                <Text style={{ color: '#fff', textAlign: 'center' }}>View Certifications</Text>
              </TouchableOpacity>

              {/* تصميم أزرار الموافقة والرفض */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    marginRight: 5,
                    padding: 10,
                    backgroundColor: brand,
                    borderRadius: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                    elevation: 2,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.2,
                    shadowRadius: 2
                  }}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold' }} onPress={handleAdminAcceptSeniorRequest}>Accept</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    flex: 1,
                    marginLeft: 5,
                    padding: 10,
                    backgroundColor: fifthColor,
                    borderRadius: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                    elevation: 2,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.2,
                    shadowRadius: 2
                  }}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>Reject</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    </ScrollView>

    
        </View>
    </TouchableWithoutFeedback>
    
    );
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
container: {
},
contentContainer: {
  padding: 0,
},
chartContainer: {
  alignItems: 'center',
},
title: {
  fontSize: 18,
  fontWeight: 'bold',
  textAlign: 'center',
  marginBottom: 10,
},
barChart: {
  marginVertical: 10,
  borderRadius: 8,
},
});
 
  