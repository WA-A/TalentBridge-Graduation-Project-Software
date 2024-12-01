import React, { useState, useContext,useRef,useEffect } from 'react';
import { View, Text, Image,TextInput,TouchableOpacity, StyleSheet, ScrollView, Animated, Button, Alert, Platform,TouchableWithoutFeedback,Keyboard, FlatList,KeyboardAvoidingView,flatListRef} from 'react-native';
import { Ionicons, Feather, FontAwesome5, EvilIcons, FontAwesome,Entypo
} from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Dimensions } from 'react-native';
import { useFonts } from 'expo-font';
import { NightModeContext } from './NightModeContext';
import './../compnent/webCardStyle.css'
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
import AsyncStorage from '@react-native-async-storage/async-storage';

// Color constants
// Color constants
const { secondary, primary, careysPink, darkLight, fourhColor, tertiary, fifthColor } = Colors;
const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation, route }) {


  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);  // لتحديد الشخص المختار
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible); // تبديل حالة الشريط الجانبي
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { id: Math.random().toString(), text: newMessage, sender: 'user' }]);
      setNewMessage('');
    }
  };

  const peopleList = [
    { id: '1', name: 'Person 1' },
    { id: '2', name: 'Person 2' },
    { id: '3', name: 'Person 3' },
    { id: '4', name: 'Person 4' },
    { id: '5', name: 'Person 5' },
    { id: '6', name: 'Person 6' },
    { id: '7', name: 'Person 7' },
    { id: '8', name: 'Person 8' },
    { id: '9', name: 'Person 9' },
    { id: '10', name: 'Person 10' },
    { id: '11', name: 'Person 11' },
    { id: '12', name: 'Person 12' },
    { id: '13', name: 'Person 13' },
    { id: '14', name: 'Person 14' },
    { id: '15', name: 'Person 15' },

  ];

  const postsList = [
    { id: '1', title: 'Post 1', content: 'This is the content of Post 1.' },
    { id: '2', title: 'Post 2', content: 'This is the content of Post 2.' },
    { id: '3', title: 'Post 3', content: 'This is the content of Post 3.' },
  ];

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
      position: 'fixed', // تثبيت القائمة
      width: '30%',  // تخصيص العرض بالنسبة للشريط الجانبي
      height: '100%',
      backgroundColor: isNightMode ? '#333' : '#fff',
      padding: 10,
      zIndex: 5,
      borderRightWidth: 1,
      borderColor: '#ccc',
      overflow: 'auto',  // لمنع المحتوى من الخروج خارج الشريط الجانبي
      paddingVertical: 10,
      marginTop: Platform.OS === 'web' ? 80 : 0,
      marginBottom: Platform.OS === 'web' ? 80 : 0,
      overflowY: 'scroll', // إضافة شريط التمرير العمودي داخل القائمة
     transform: `translateY(0)`, // تحريك القائمة من الأعلى
      transition: 'transform 0.5s ease', // إضافة انتقال ناعم لتحريك القائمة
    }}>
      <Text style={{ color: isNightMode ? '#fff' : '#000', fontSize: 18, marginBottom: 10 }}>الأشخاص</Text>
      <FlatList
        data={peopleList}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setSelectedPerson(item)} style={{
            padding: 10,
            borderBottomWidth: 1,
            borderBottomColor: '#ccc',
          }}>
            <Text style={{ color: isNightMode ? '#fff' : '#000' }}>{item.name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  )}

  {/* المحتوى الرئيسي (المنشورات) */}
  <Animated.ScrollView
    style={{
      flex: 1,
      backgroundColor: isNightMode ? "#000" : primary,
      marginLeft: Platform.OS === 'web' && isSidebarVisible ? '0%' : 0,  // تحديد المسافة في حالة وجود الشريط الجانبي
    }}
    contentContainerStyle={{
      flexGrow: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingVertical: 10,
      marginTop: Platform.OS === 'web' ? 50 : 0,
      marginBottom: Platform.OS === 'web' ? 50 : 0,
    }}
    onScroll={Animated.event(
      [{ nativeEvent: { contentOffset: { y: scrollY } } }],
      { useNativeDriver: false }
    )}
    scrollEventThrottle={16}
  >
    {Array(5)
      .fill()
      .map((_, index) => (
        <View
          key={index}
          className={Platform.OS === 'web' ? 'container-card' : ''}  // استخدام className للويب فقط
          style={Platform.OS === 'web' 
      ? (isSidebarVisible ? { marginTop: 30, width: '50%',marginLeft: '35%' 
      } : { marginTop: 30, width: '50%' }) 
      : { width: '100%', alignItems: 'center', marginBottom: 10 }} 
       // عرض المنشورات في الموبايل أو بدون الشريط الجانبي  // تعديل الحجم في الويب
        >
          <View
            className={Platform.OS === 'web' ? 'card' : ''}  // استخدام className للويب فقط
            style={Platform.OS === 'web' ? {
              backgroundColor: secondary,
              padding: 10,
              borderRadius: 15,
              width: '100%',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',  // إضافة تأثير الظل في الويب
              backgroundColor: isNightMode ? "#454545" : secondary,
            } : {
              backgroundColor: isNightMode ? "#454545" : secondary,
              width: '95%',
              borderRadius: 10,
              margin:10
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
              <Image
                source={require('./../assets/img1.jpeg')}
                style={{
                  width: Platform.OS === 'web' ? 80 : 40,  // تعديل حجم الصورة للويب
                  height: Platform.OS === 'web' ? 80 : 40, // تعديل حجم الصورة للويب
                  borderRadius: Platform.OS === 'web' ? 40 : 25, // تعديل شكل الصورة
                  marginRight: 10,
                  marginTop: 10,
                  objectFit: 'cover', // التأكد من ملاءمة الصورة
                  borderWidth :1,
                  bottom:3
                }}
              />
              <View>
                <Text style={{ color: isNightMode ? primary : '#000', fontWeight: 'bold', fontSize: 16 }}>
                  Sama Abosair
                </Text>
                <Text style={{ color: darkLight, fontSize: 12 }}>
                  4 hours ago
                </Text>
              </View>
            </View>
            <Text style={{ color: isNightMode ? primary : '#000', padding: 15 }}>
              Hello This is a test post
            </Text>
            <Image
              source={require('./../assets/img1.jpeg')}
              style={{
                width: Platform.OS === 'web' ? '90%' : '100%',
                height: Platform.OS === 'web' ? 500 : 320,
                objectFit: 'fill',  // التأكد من تغطية الصورة بشكل مناسب
                alignSelf: 'center', // توسيط الصورة بدون التأثير على العناصر الأخرى
              }}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingTop: 7 }}>
              <Interaction>
                <Ionicons
                  style={{
                    color: isNightMode ? secondary : 'rgba(0, 0, 0, 0.2)',
                  }}
                  name="heart-circle"
                  size={25}
                />
                <InteractionText style={{ color: isNightMode ? primary : '#000' }}>
                  Like
                </InteractionText>
              </Interaction>
              <Interaction>
                <Ionicons
                  style={{
                    color: isNightMode ? secondary : 'rgba(0, 0, 0, 0.2)',
                  }}
                  name="chatbubbles"
                  size={23}
                />
                <InteractionText style={{ color: isNightMode ? primary : '#000' }}> 
                  Comment
                </InteractionText>
              </Interaction>
            </View>
          </View>
        </View>
      ))}

  </Animated.ScrollView>
</View>

    {/* إخفاء جزئية الرسائل في الموبايل */}
    {/*Platform.OS == 'web' && (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={({ item }) => (
                    <View style={item.sender === 'user' ? styles.userMessage : styles.otherMessage}>
                        <Text style={styles.messageText}>{item.text}</Text>
                    </View>
                )}
                keyExtractor={(item) => item.id}
                inverted // تجعل الرسائل الأحدث في الأسفل
                style={styles.messagesList}
            />

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="اكتب رسالتك..."
                    value={newMessage}
                    onChangeText={setNewMessage}
                />
                <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                    <Text style={styles.sendButtonText}>إرسال</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )*/}


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
        </View>
    </TouchableWithoutFeedback>);

};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'space-between',
    },
    messagesList: {
      padding: 10,
    },
    userMessage: {
      alignSelf: 'flex-end',
      backgroundColor: '#0078D4',
      padding: 10,
      borderRadius: 10,
      marginBottom: 10,
      maxWidth: '75%',
    },
    otherMessage: {
      alignSelf: 'flex-start',
      backgroundColor: '#E4E6EB',
      padding: 10,
      borderRadius: 10,
      marginBottom: 10,
      maxWidth: '75%',
    },
    messageText: {
      color: '#fff',
      fontSize: 16,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      borderTopWidth: 1,
      borderColor: '#ddd',
      backgroundColor: '#fff',
    },
    input: {
      flex: 1,
      height: 40,
      borderColor: '#ddd',
      borderWidth: 1,
      borderRadius: 20,
      paddingHorizontal: 15,
      marginRight: 10,
    },
    sendButton: {
      backgroundColor: '#0078D4',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 20,
    },
    sendButtonText: {
      color: '#fff',
      fontSize: 16,
    },
  });
  