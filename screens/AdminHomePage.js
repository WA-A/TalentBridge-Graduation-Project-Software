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

    <View style={{ height: 0, backgroundColor: isNightMode ? "#000" : secondary,marginTop:5 }} />
    {/* Header */}
    <View style={{
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingHorizontal: 15, paddingVertical: 20, backgroundColor: isNightMode ? "#000" : secondary,
      position: Platform.OS === 'web' ? 'fixed' : 'relative',
     marginTop:10,paddingVertical: 15
    }}>
 <Text style={{ fontFamily: 'Updock-Regular', fontSize: 30, position: 'absolute', left: 0, right: 0, textAlign: 'center', color: isNightMode ? primary : "#000", }}>
                  Talent Bridge
                </Text>
  
   
       {/* زر الإعدادات وزر المشاريع */}
       <View style={{ flexDirection: 'row', alignItems: 'center',left: '10%',
    }}>
     <TouchableOpacity onPress={() => nav.navigate('AdminHomePage')} style={{ position: 'absolute', width: 50, height: 50 ,left:0}}>
           <Ionicons name="stats-chart" size={20} color= {isNightMode ? primary : "#000"} />
         </TouchableOpacity>
       
   

         <TouchableOpacity onPress={() => nav.navigate('AdminRequestPage')} style={{ position: 'absolute', width: 50, height: 50,right:90 }}>
  <Ionicons name="document-text" size={20} color={isNightMode ? primary : "#000"} />
</TouchableOpacity>

         <TouchableOpacity onPress={() => nav.navigate('AdminFieldsPage')} style={{ position: 'absolute', width: 50, height: 50,right:0 }}>
           <Ionicons name="trending-up-outline" size={25} color= {isNightMode ? primary : "#000"} />
         </TouchableOpacity>
   
   
         <TouchableOpacity style={{ position: 'absolute', width: 50, height: 50,left:300 }}
       onPress={() => nav.navigate('Notification')}>
               <Ionicons  name="notifications" size={20} color= {isNightMode ? primary : "#000"} />
       </TouchableOpacity>
       <TouchableOpacity onPress={() => setMenuVisible(true)}style={{ position: 'absolute', width: 50, height: 50,left:250 }}>
           <Ionicons name="settings" size={20} color= {isNightMode ? primary : "#000"} />
         </TouchableOpacity>
      
       </View>
     
       {/* عنوان التطبيق */}
     
   
      
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
  <View style={{ flex: 1, padding: 20,  }}>
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
  <View >
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
           87,
            90,
            80,
            85,
            66,   
            78
          ]
        }
      ]
    }}

    width={Dimensions.get("window").width} // from react-native
    height={220}
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
      marginVertical: 5,
      borderRadius: 16,padding:5
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
            color: () => '#1AFF92',
            strokeWidth: 2,
            barPercentage: 0.7,
          }}
          style={styles.barChart}
        />

      </View>
    </ScrollView>
 </View>
    
    );
};

const styles = StyleSheet.create({
 
});
 
  