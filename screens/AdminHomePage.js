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
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";
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
import { use } from 'react';

export default function AdminHomePage({ navigation, route}) {
       const { isNightMode, toggleNightMode } = useContext(NightModeContext);
         const [isSidebarVisible, setIsSidebarVisible] = useState(false);
       
       const toggleSidebar = () => {
        setIsSidebarVisible(!isSidebarVisible); // تبديل حالة الشريط الجانبي
      
      };
            const nav = useNavigation();
        
      const screenWidth = Dimensions.get('window').width;

      const pieData = [
        { name: 'Famale', population: 60, color: '#F7A8B8', legendFontColor: '#000', legendFontSize: 12 },
        { name: 'Male', population: 40, color: '#334664', legendFontColor: '#000', legendFontSize: 12 },
      ];
    
      const barData = {
        labels: ['22', '27', '35', '23','19','40'],
        datasets: [
          {
            data: [50, 80, 60, 90, 25, 40],
          },
        ],
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
       
</View>
</>
      )}

        

<ScrollView style={[styles.container, { marginTop: Platform.OS === 'web' ? 70 : 20 }]}>
  <View style={{ flex: 1, padding: 20, backgroundColor: isNightMode ? '#333' : 'transparent' }}>
    {/* الكروت */}
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, marginTop: 20 }}>
      {/* كارت عدد السينير */}
      <View style={{
        flex: 1,
        backgroundColor: isNightMode ? '#444' : '#fff',
        borderRadius: 16,
        padding: 20,
        marginHorizontal: 5,
        elevation: 3, // للظل
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        alignItems: 'center'
      }}>
        <Text style={{ fontSize: 18, color: isNightMode ? '#fff' : '#334664', marginBottom: 10,fontWeight: 'bold' }}>Number of Senior </Text>
        <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#7C7692' }}>150</Text>
      </View>

      {/* كارت عدد الجينيور */}
      <View style={{
        flex: 1,
        backgroundColor: isNightMode ? '#444' : '#fff',
        borderRadius: 16,
        padding: 20,
        marginHorizontal: 5,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        alignItems: 'center'
      }}>
        <Text style={{ fontSize: 18, color: isNightMode ? '#fff' : '#334664', marginBottom: 10,fontWeight: 'bold' }}>Number of Junior </Text>
        <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#F7A8B8' }}>250</Text>
      </View>

      {/* كارت الأرباح */}
      <View style={{
        flex: 1,
        backgroundColor: isNightMode ? '#444' : '#fff',
        borderRadius: 16,
        padding: 20,
        marginHorizontal: 5,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        alignItems: 'center'
      }}>
        <Text style={{ fontSize: 18, color: isNightMode ? '#fff' : '#334664', marginBottom: 10 ,fontWeight: 'bold'}}>Profits</Text>
        <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#9EABCB' }}>$10K</Text>
      </View>
    </View>
  </View>

  {/* chart */}
  <View style={styles.chartContainer}>
        {/* Pie Chart */}
        <Text style={styles.title}>Gender</Text>
        <PieChart
          data={pieData}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            color: () => '#000',
            strokeWidth: 2,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
        />
        

        <Text>Fields</Text>
  <LineChart
    data={{
      labels:['Software Engineering', 'Data Science', 'Accounting and Finance', 'Psychology','Social Work','Graphic Design'],
      datasets: [
        {
          data: [
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100
          ]
        }
      ]
    }}
    width={Dimensions.get("window").width} // from react-native
    height={220}
    yAxisLabel="$"
    yAxisSuffix="k"
    yAxisInterval={1} // optional, defaults to 1
    chartConfig={{
      backgroundColor: "#e26a00",
      backgroundGradientFrom: "#fb8c00",
      backgroundGradientTo: "#ffa726",
      decimalPlaces: 2, // optional, defaults to 2dp
      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      style: {
        borderRadius: 16
      },
      propsForDots: {
        r: "6",
        strokeWidth: "2",
        stroke: "#ffa726"
      }
    }}
    bezier
    style={{
      marginVertical: 8,
      borderRadius: 16
    }}
  />


  {/* Bar Chart */}
  <Text style={[styles.title, { marginTop: 20 }]}>Age</Text>
        <BarChart
          data={barData}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#7C7692',
            backgroundGradientFrom: '#7C7692',
            backgroundGradientTo: '#7C7692',
            color: () => '#1AFF92',
            strokeWidth: 2,
            barPercentage: 0.7,
          }}
          style={styles.barChart}
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
 
  