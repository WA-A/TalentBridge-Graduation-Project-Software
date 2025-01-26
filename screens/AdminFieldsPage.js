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
    Card,
    ContainerCard,
    UserIMg,
    UserInfo,
    UserName,
    UserInfoText,
    PostTime,
    PostText,
    PageTitle,
    PostIMg,
    ReactionOfPost,
    Interaction,
    InteractionText,
} from './../compnent/Style'
import ImageViewer from 'react-native-image-zoom-viewer';
// Color constants
const { secondary, primary, careysPink, darkLight, brand,fourhColor, tertiary, fifthColor } = Colors;
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
import Skills from './../GraduationProject1-BackEnd/ExternalApiSkills/ExternealApiSkills.controller';

export default function AdminFieldsPage({ navigation, route}) {
       const { isNightMode, toggleNightMode } = useContext(NightModeContext);
         const [isSidebarVisible, setIsSidebarVisible] = useState(false);
       
       const toggleSidebar = () => {
        setIsSidebarVisible(!isSidebarVisible); // تبديل حالة الشريط الجانبي
      
      };


          const nav = useNavigation();


          const [sub_specialization, setsub_specialization] = useState('');
              const [Code, setCode] = useState('');
              const [Skill, setSkill] = useState('');
      


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

              
<View style={{ flex: 1,  backgroundColor: isNightMode ? "#000" : primary }}>
                    
    
            <ScrollView style={{ flex: 1, padding: 70 }}>
                   
        <PageTitle>Add New Fields</PageTitle>


        <Text style={styles.label}>New Fields Name</Text>   {/* sub_specialization */}
                <View style={styles.inputContainer}>
                        {/* Add New Fields */}
                    <TextInput
                        style={styles.input}
                        value={sub_specialization}
                        onChangeText={setsub_specialization}
                        placeholder="Enter Fields Name"
                    />
                </View>
                    
                <Text style={styles.label}>New Fields Code</Text>   {/* code */}

                <View style={styles.inputContainer}>
            
                    <TextInput
                        style={styles.input}
                        value={Code}
                        onChangeText={setCode}
                        placeholder="Enter Fields Code"
                    />
                </View>
                    <View style={[styles.addButtonText,{marginBottom:40}]}>
                <TouchableOpacity style={styles.submitButton} >
                    <Text style={styles.submitText}>Add New Fields</Text>
                </TouchableOpacity></View>

                <View style={styles.divider} />

                <PageTitle>Add New Skills</PageTitle>
                       
                <Text style={styles.label}>New Skill Name</Text>   {/* sub_specialization */}

                <View style={styles.inputContainer}>
                        {/* Add New Skills */}
                    
                    <TextInput
                        style={styles.input}
                        value={Skill}
                        onChangeText={setSkill}
                        placeholder="Enter Skills Name"
                    />
                </View>

                <Text style={styles.label}>New Skill Code</Text>   {/* code */}

                <View style={styles.inputContainer}>
            
                    <TextInput
                        style={styles.input}
                        value={Code}
                        onChangeText={setCode}
                        placeholder="Enter Skill Code"
                    />
                </View>
<View style={[styles.addButtonText,{marginBottom:40}]}>
                <TouchableOpacity style={styles.submitButton} >
                    <Text style={styles.submitText}>Add New Skills</Text>
                </TouchableOpacity></View>
            </ScrollView>
  </View>

        </View>
    </TouchableWithoutFeedback>
    
    );
};

const styles = StyleSheet.create({ 
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
  divider: {
    height: 3,
    backgroundColor: '#ddd',
    marginVertical: 8,
  },
  divider2: {
    height: 1,
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
  title: {
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom:10,
    color: brand,
},
inputContainer: {
  marginTop: 12,
  marginBottom: 15,
  paddingHorizontal: 10,
  borderWidth: 1, // إضافة الحدود
  borderColor: "fff", // لون الحدود
  borderRadius: 5, // تقويس الحواف
  borderRadius: 8,

},
input: {
  height: 40,
  fontSize: 16,
  color: "#000",
  paddingHorizontal: 10,
  width: '100%',

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
  textAlign: 'center',

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
  marginRight: 10, // مسافة بين النص والزر
},
fileButton: {
  backgroundColor: Colors.fourhColor,
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 5,
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
});
 
  