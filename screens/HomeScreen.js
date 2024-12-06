import React, { useState, useContext,useRef,useEffect } from 'react';
import { View, Text, Image,TextInput,TouchableOpacity, StyleSheet, ScrollView, Animated, Button, Alert, Platform,TouchableWithoutFeedback,Keyboard, FlatList,KeyboardAvoidingView,flatListRef} from 'react-native';
import { Ionicons, Feather, FontAwesome5, EvilIcons, FontAwesome,Entypo} from '@expo/vector-icons';
import { Video as RNVideo } from 'react-native-video'; 
import { useNavigation } from '@react-navigation/native';
import { Dimensions } from 'react-native';
import { useFonts } from 'expo-font';
import { NightModeContext } from './NightModeContext';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Video } from 'react-native-video';

// Color constants
// Color constants
const { secondary, primary, careysPink, darkLight, fourhColor, tertiary, fifthColor } = Colors;
const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation, route}) {

  const [isFocused, setIsFocused] = useState(false);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [selectedPeople, setSelectedPeople] = useState([]); // الأشخاص الذين يتم فتح شات معهم
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible); // تبديل حالة الشريط الجانبي
  };

  const handleMessageChange = (personId, text) => {
    setNewMessage(prevState => ({
      ...prevState,
      [personId]: text, // تحديث النص المدخل في شات هذا الشخص
    }));
  };
  
  const sendMessage = (personId) => {
    setMessages(prevMessages => ({
      ...prevMessages,
      [personId]: [
        ...(prevMessages[personId] || []),
        { sender: 'أنت', text: newMessage[personId] },
      ],
    }));
  
    setNewMessage(prevState => ({
      ...prevState,
      [personId]: '', // مسح النص المدخل بعد الإرسال
    }));
  };
  const handleSelectedPerson = (item) => {
    setSelectedPeople((prevSelectedPeople) => {
      if (!prevSelectedPeople.some(person => person.id === item.id)) {
        return [...prevSelectedPeople, item];
      }
      return prevSelectedPeople;
    });
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
    { id: '16', name: 'Person 16' },
    { id: '17', name: 'Person 17' },
    { id: '18', name: 'Person 18' },
    { id: '19', name: 'Person 19' },
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


   

    const handleGetAllPosts = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          throw new Error('No token found');
        }
    
        const baseUrl = Platform.OS === 'web'
          ? 'http://localhost:3000'
          : 'http://192.168.1.239:3000';
    
        const response = await fetch(`${baseUrl}/post/getallpost`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
    
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
    
        const result = await response.json();
    
        if (Array.isArray(result.posts)) {
          setPosts(result.posts);
        } else {
          console.error('Received data is not an array', result);
        }
    
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setIsLoading(false);
      }
    };
    
    
    useEffect(() => {
      handleGetAllPosts();
    }, []);


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
      height: `calc(100vh - 0px - 150px)`, // تخصيص الارتفاع ليأخذ بعين الاعتبار الشريط العلوي والسفلي
      overflowY : 'auto', // السماح بالتمرير العمودي
    }}>
      <Text style={{ color: isNightMode ? '#fff' : '#000', fontSize: 18, marginBottom: 10 }}>Freind List</Text>
      <FlatList
        data={peopleList}
        renderItem={({ item }) => (
          <TouchableOpacity key={item.id} onPress={() => handleSelectedPerson(item)
          }
           style={{
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


  {/*////chat}
  
    <View
  style={{
    marginLeft: '30%', // المسافة لتجنب تداخل الشات مع القائمة
    width: '10%', // عرض الشات
    padding: 10,
    display: selectedPerson ? 'flex' : 'none',  // عرض الشات فقط عندما يتم اختيار شخص
    zIndex: 40,
  }}
>
  <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
    دردشات   
  </Text>
  
  {/* عرض المحادثة مع الشخص المحدد */}

 
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
      marginTop: Platform.OS === 'web' ? 80 : 0,
      marginBottom: Platform.OS === 'web' ? 50 : 0,
    }}
    onScroll={Animated.event(
      [{ nativeEvent: { contentOffset: { y: scrollY } } }],
      { useNativeDriver: false }
    )}
    scrollEventThrottle={16}
  >
  <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Posts</Text>
  
  {posts && posts.posts && Array.isArray(posts.posts) && posts.posts.map((post, index) => (
  <View
    key={index}
    className={Platform.OS === 'web' ? 'container-card' : ''}
    style={
      Platform.OS === 'web'
        ? isSidebarVisible
          ? { marginTop: 30, width: '50%', marginLeft: '35%' }
          : { marginTop: 30, width: '50%' }
        : { width: '100%', alignItems: 'center', marginBottom: 10 }
    }
  >
    <View
      className={Platform.OS === 'web' ? 'card' : ''}
      style={
        Platform.OS === 'web'
          ? {
              backgroundColor: secondary,
              padding: 10,
              borderRadius: 15,
              width: '100%',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              backgroundColor: isNightMode ? '#454545' : secondary,
            }
          : {
              backgroundColor: isNightMode ? '#454545' : secondary,
              width: '95%',
              borderRadius: 10,
              margin: 10,
            }
      }
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
        <Image
          source={{ uri: post.ProfilePicture }} // صورة المستخدم من البيانات
          style={{
            width: Platform.OS === 'web' ? 80 : 40,
            height: Platform.OS === 'web' ? 80 : 40,
            borderRadius: Platform.OS === 'web' ? 40 : 25,
            marginRight: 10,
            marginTop: 10,
            objectFit: 'cover',
            borderWidth: 1,
            bottom: 3,
          }}
        />
        <View>
          <Text style={{ color: isNightMode ? primary : '#000', fontWeight: 'bold', fontSize: 16 }}>
            UserId {/* أو استخدم حقل آخر إذا كان لديك */}
          </Text>
          <Text style={{ color: darkLight, fontSize: 12 }}>
            {new Date(post.createdAt).toLocaleString()} {/* استخدام تاريخ المنشور */}
          </Text>
        </View>
      </View>

     {/* <Text style={{ color: isNightMode ? primary : '#000', padding: 15 }}>{post.Title}</Text>  عرض العنوان */}
      <Text style={{ color: isNightMode ? primary : '#000', padding: 15 }}>{post.Body}</Text> {/* عرض النص */}

      {/* عرض الصور إذا كانت موجودة */}
      {post.Images && post.Images.length > 0 && (
        <Image
          source={{ uri: post.Images[0].secure_url }} // عرض أول صورة من Images
          style={{
            width: Platform.OS === 'web' ? '90%' : '100%',
            height: Platform.OS === 'web' ? 500 : 320,
            objectFit: 'fill',
            alignSelf: 'center',
          }}
        />
      )}
      {post.Videos && post.Videos.length > 0 && (
  <RNVideo
    source={{ uri: post.Videos[0].secure_url }} 
    style={{
      width: Platform.OS === 'web' ? '90%' : '100%',
      height: Platform.OS === 'web' ? 500 : 320,
      alignSelf: 'center',
    }}
    controls
  />
)}

{post.Files && post.Files.length > 0 && (
  <View style={{ alignItems: 'center', marginVertical: 10 }}>
    <Text style={{ fontWeight: 'bold' }}>File:</Text>
    <TouchableOpacity onPress={() => { /* هنا يمكن أن تضيف أكشن لتحميل أو فتح الملف */ }}>
      <Text style={{ color: 'blue' }}>Click to open/download file</Text>
    </TouchableOpacity>
  </View>
)}

      <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingTop: 7 }}>
        <Interaction>
          <Ionicons
            style={{
              color: isNightMode ? secondary : 'rgba(0, 0, 0, 0.2)',
            }}
            name="heart-circle"
            size={25}
          />
          <InteractionText style={{ color: isNightMode ? primary : '#000' }}>Like</InteractionText>
        </Interaction>
        <Interaction>
          <Ionicons
            style={{
              color: isNightMode ? secondary : 'rgba(0, 0, 0, 0.2)',
            }}
            name="chatbubbles"
            size={23}
          />
          <InteractionText style={{ color: isNightMode ? primary : '#000' }}>Comment</InteractionText>
        </Interaction>
      </View>
    </View>
  </View>
))}


  </Animated.ScrollView>

  <View
  style={{
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 45,
    backgroundColor: 'transparent',
    padding: 10,
    marginLeft: Platform.OS === 'web' && isSidebarVisible ? '30%' : 0,
  }}
>
  <ScrollView
    horizontal
    contentContainerStyle={{
      flexDirection: 'row',
      paddingHorizontal: 10,
    }}
  >
    {selectedPeople.map((person) => (
      <View
        key={person.id}
        style={{
          width: 300,
          height: 400,
          marginHorizontal: 5,
          padding: 0,
          borderRadius: 10,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: '#ccc',
          backgroundColor: isNightMode ? '#444' : '#f9f9f9',
        }}
      >
        {/* الشريط العلوي (الهيدر) */}
        <View
          style={{
            backgroundColor: '#3b5998',
            paddingVertical: 10,
            paddingHorizontal: 15,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottomWidth: 2,
            borderBottomColor: isNightMode ? '#222' : '#ccc',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 3,
            elevation: 4,
          }}
        >
          <Text style={{ fontWeight: 'bold', fontSize: 16, color: 'white' }}>
            دردشة مع {person.name}
          </Text>
          <TouchableOpacity
            onPress={() =>
              setSelectedPeople((prevSelectedPeople) =>
                prevSelectedPeople.filter((p) => p.id !== person.id)
              )
            }
          >
            <FontAwesome name="close" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* الرسائل */}
        <ScrollView
          style={{ flex: 1, padding: 10 }}
          contentContainerStyle={{ paddingBottom: 10 }}
        >
          {(messages[person.id] || []).map((msg, idx) => (
            <View
              key={idx}
              style={{
                alignSelf: msg.sender === 'أنت' ? 'flex-end' : 'flex-start',
                backgroundColor: msg.sender === 'أنت' ? '#dcf8c6' : '#f0f0f0',
                padding: 8,
                borderRadius: 10,
                marginBottom: 5,
                maxWidth: '75%',
              }}
            >
              <Text style={{ fontSize: 14 }}>{msg.text}</Text>
            </View>
          ))}
        </ScrollView>

        {/* منطقة الإدخال */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 5,
            backgroundColor: isNightMode ? '#333' : '#fff',
          }}
        >
          <ScrollView
            style={{
              maxHeight: 80, // الحد الأقصى لطول النص
              flex: 1,
              borderRadius:20,
              padding: 5,
              backgroundColor: isNightMode ?  '#333' : secondary,
              
            }}
          >
          <TextInput
  style={{
    flex: 1,
    fontSize: 14,
    lineHeight: 20,padding:5,
    color: isNightMode ? '#fff' : '#000',
    borderWidth: 0, // إزالة الحدود
    outlineWidth: 0, // إزالة الحدود عند التركيز (أحيانًا يكون في بعض المتصفحات)
  }}
  multiline
  placeholder="Write Massage..."
  placeholderTextColor="#888"  // تغيير لون النص عند عدم الكتابة
  value={newMessage[person.id] || ''}
   onChangeText={(text) => handleMessageChange(person.id, text)}
/>

          </ScrollView>

          {/* زر الإرسال بجانب حقل النص */}
          <TouchableOpacity
            onPress={() => sendMessage(person.id)}
          >
            <Ionicons
              name="send" size={20} color= "fifthColor" style={{  marginLeft: 10,
                padding: 10,}}/>
          </TouchableOpacity>
        </View>
      </View>
    ))}
  </ScrollView>
</View>


</View>
  


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
  
});
 
  