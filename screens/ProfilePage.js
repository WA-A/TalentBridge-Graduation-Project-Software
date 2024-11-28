import React, { useState, useContext } from 'react';
import { View, Text, Image, TouchableOpacity,TextInput, StyleSheet, FlatList,ScrollView, Animated, Button, Alert, Platform, } from 'react-native';
import { Ionicons, Feather, FontAwesome5, EvilIcons, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Dimensions } from 'react-native';
import { useFonts } from 'expo-font';
import { NightModeContext } from './NightModeContext';
import './../compnent/webCardStyle.css'
import * as ImagePicker from 'expo-image-picker';
import { Linking } from 'react-native';
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
// Color constants
const { secondary, primary, careysPink, darkLight, fourhColor, tertiary, fifthColor } = Colors;
const { width } = Dimensions.get('window');

const ProfilePage = () => {
    const nav = useNavigation();
    const { isNightMode, toggleNightMode } = useContext(NightModeContext);
    const [scrollY] = useState(new Animated.Value(0));
    const [uploadType, setUploadType] = useState('link'); // "link" أو "image"
    const [image, setImage] = useState(null); // لتخزين الصورة
  
    // وظيفة اختيار الصورة
    const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    
      if (!result.canceled) {
        setImage(result.uri);
      }
    }; 


    const [skill, setSkill] = useState(''); // لتخزين المهارة الحالية
    const [skillsList, setSkillsList] = useState([]); // قائمة المهارات

    // وظيفة لإضافة المهارة للقائمة
    const addSkill = () => {
        if (skill.trim()) {
            setSkillsList([...skillsList, skill]); // إضافة المهارة
            setSkill(''); // مسح حقل الإدخال
        }
    };


    const [githubLink, setGithubLink] = useState(''); // لحفظ الرابط الذي يُدخله المستخدم  
    const [isEditing, setIsEditing] = useState(false); // حالة للتحكم في إظهار/إخفاء الإدخال



    // Load custom fonts
    const bottomBarTranslate = scrollY.interpolate({
        inputRange: [0, 50],
        outputRange: [0, 100], // 100 to move it off-screen
        extrapolate: 'clamp',
    });


    const [UniversityName, setUniversityName] = useState('Najah');
  const [Degree, setDegree] = useState('BS');
  const [FieldOfStudy, setFieldOfStudy] = useState('CE');
 

  const handleSubmit = () => {
    // هنا يمكنك معالجة البيانات أو إرسالها إلى الخادم
    console.log({
      SchoolName,
      Degree,
      FieldOfStudy,
     
    });
  };
    return (
        <View style={{ flex: 1 }}>
            <View style={{
                height: 20, backgroundColor: isNightMode ? "#000" : secondary,

            }} />

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

                <TouchableOpacity onPress={() => nav.navigate('Chat')}>
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
                 width: '100%',
                height: 60, // ارتفاع الجزء البنفسجي
              }}>
           {/* صورة البروفايل */}
           <TouchableOpacity  style={{ position: 'absolute', top: 20, left: 20}}>
    <View style={{
        width: 80, // حجم الدائرة
        height: 80, // حجم الدائرة
        borderRadius: 40, // الشكل الدائري
        overflow: 'hidden', // يجعل الصورة داخل الشكل الدائري
        borderColor: '#000', // لون الإطار
        borderWidth: 2, // عرض الإطار
    }}>
        <Image 
            source={require('./../assets/img3.jpg')}
            style={{
                width: '100%',  // تأكد من تغطية المساحة الكاملة
                height: '100%', // تأكد من تغطية المساحة الكاملة
                objectFit: 'cover', // التأكد من ملاءمة الصورة داخل الدائرة
              
            }}
            resizeMode="cover" // لتغطية الخلفية بالكامل
        />
    </View>

</TouchableOpacity>


    {/* أيقونة الإشعارات */}
    <TouchableOpacity onPress={() => nav.navigate('notifications')} style={{ position: 'absolute', top: 20, right: 20 }}>
        <Ionicons name="notifications" size={25} color="#FFF" />
    </TouchableOpacity>

   {/* أيقونة GitHub */}
   {isEditing ? (
                // عرض حقل الإدخال
                <View style={{ position: 'absolute', top: 60, right: 20, flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput
                        placeholder="Enter GitHub URL"
                        value={githubLink}
                        onChangeText={setGithubLink}
                        style={{
                            backgroundColor: '#f0f0f0',
                            padding: 10,
                            borderRadius: 5,
                            width: 200,
                            marginRight: 10,
                        }}
                    />
                    <TouchableOpacity
                        onPress={() => {
                            if (githubLink) {
                                setIsEditing(false); // إخفاء الإدخال
                            } else {
                                alert('Please enter a valid URL');
                            }
                        }}
                        style={{
                            backgroundColor: '#000',
                            padding: 10,
                            borderRadius: 5,
                        }}>
                        <Text style={{ color: '#fff' }}>Save</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                // عرض أيقونة GitHub أو زر الرابط
                <TouchableOpacity 
                    onPress={() => {
                        if (githubLink) {
                            Linking.openURL(githubLink);
                        } else {
                            setIsEditing(true); // إظهار الإدخال إذا لم يتم إدخال الرابط
                        }
                    }}
                    style={{ marginVertical:20 ,position: 'absolute', top: 60, right: 20,borderRadius:25 }}>
                    <Ionicons name="logo-github" size={30} color="#000" />
                </TouchableOpacity>
            )}

              </View>
           


                       {/* Main Content */}
                       <View style={{ flex: 1 }}>
     
      {/* Animated.ScrollView - يحتوي على النصوص والأزرار */}
      <Animated.ScrollView
        style={{
          flex: 1,
          backgroundColor: "#FFFFFF", // تغيير الخلفية إلى الأبيض
        }}
        contentContainerStyle={{
          flexGrow: 1,
          paddingVertical: 20,
          paddingHorizontal: 20,
        }}
      >
        {/* النصوص تحت الصورة */}
        <View style={{ marginTop: 60,padding: 60, alignItems: 'flex-start'}}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#000', marginBottom: 10 }}>
            Full Name
          </Text>

          <Text style={{ fontSize: 18, fontWeight: '500', color: '#000', marginBottom: 10 }}>
            UserName
          </Text>

          <Text style={{ fontSize: 18, fontWeight: '500', color: '#000', marginBottom: 10 }}>
            Bio
          </Text>

          <Text style={{ fontSize: 12, color: '#000', marginBottom: 10 }}>
            Location
          </Text>

          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#000', marginBottom: 5 }}>
            About
          </Text>

          <Text style={{ fontSize: 12, color: '#000' }}>
            This is a sample about paragraph. It gives additional information about the user.
          </Text>
        </View>

        {/* أزرار البوستات والتعليقات */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'center',
          width: '100%',
          marginTop: 30,
          marginBottom: 20, // إضافة مساحة أسفل الأزرار
        }}>
          {/* زر البوستات */}
          <TouchableOpacity 
            onPress={() => console.log('Go to Posts')} // فعّل الحدث المناسب
            style={{
              backgroundColor: '#C99FA9',
              padding: 15, 
              borderRadius: 25, 
              flexDirection: 'row', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: '40%', 
              marginHorizontal: 10,
              shadowColor: '#000', 
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 5,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#000' }}>
              Posts
            </Text>
          </TouchableOpacity>

          {/* زر التعليقات */}
          <TouchableOpacity 
            onPress={() => console.log('Go to Comments')} // فعّل الحدث المناسب
            style={{
              backgroundColor: '#C99FA9',
              padding: 15, 
              borderRadius: 25, 
              flexDirection: 'row', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: '40%', 
              marginHorizontal: 10,
              shadowColor: '#000', 
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 5,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#000' }}>
              Comments
            </Text>
          </TouchableOpacity>
        </View>

                  

              {/* 1- Card Add Experince*/}
              <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Add Experience</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                onPress={() => console.log('Add Experience')}
                style={styles.smallButton}
              >
                <Text style={styles.smallButtonText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => console.log('Edit Experience')}
                style={styles.smallButton}
              >
                <Text style={styles.smallButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TextInput
            placeholder="Institution Name"
            placeholderTextColor="#888"
            style={styles.input}
          />
          <TextInput
            placeholder="Job Title"
            placeholderTextColor="#888"
            style={styles.input}
          />
          <TextInput
            placeholder="Duration (e.g., 2 years)"
            placeholderTextColor="#888"
            style={styles.input}
          />
        </View>
              {/* 1- Card Add Eduction*/}
              <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Add Eduction</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                onPress={() => console.log('Add Eduction')}
                style={styles.smallButton}
              >
                <Text style={styles.smallButtonText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => console.log('Edit Eduction')}
                style={styles.smallButton}
              >
                <Text style={styles.smallButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TextInput
            placeholder="University Name"
            placeholderTextColor="#888"
            style={styles.input}
          />
          <TextInput
            placeholder="Degree"
            placeholderTextColor="#888"
            style={styles.input}
          />
          <TextInput
            placeholder="Field Of Study"
            placeholderTextColor="#888"
            style={styles.input}
          />
        </View>

         {/* 3- Card Add Certification*/}
         <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Add Certification</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            onPress={() => console.log('Add Certification')}
            style={styles.smallButton}
          >
            <Text style={styles.smallButtonText}>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => console.log('Edit Certification')}
            style={styles.smallButton}
          >
            <Text style={styles.smallButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Title */}
      <TextInput
        placeholder="Certificate Title"
        placeholderTextColor="#888"
        style={styles.input}
      />
      {/* Issuing Organization */}
      <TextInput
        placeholder="Issuing Organization"
        placeholderTextColor="#888"
        style={styles.input}
      />
      {/* Issue Date */}
      <TextInput
        placeholder="Issue Date (e.g., 01/2024)"
        placeholderTextColor="#888"
        style={styles.input}
      />
      {/* Expiration Date */}
      <TextInput
        placeholder="Expiration Date (optional)"
        placeholderTextColor="#888"
        style={styles.input}
      />

      {/* Credential Options */}
      <View style={styles.switchContainer}>
        <TouchableOpacity
          onPress={() => setUploadType('link')}
          style={[
            styles.switchButton,
            uploadType === 'link' && styles.activeSwitchButton,
          ]}
        >
          <Text style={uploadType === 'link' ? styles.activeSwitchText : styles.switchText}>
            Link
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setUploadType('image')}
          style={[
            styles.switchButton,
            uploadType === 'image' && styles.activeSwitchButton,
          ]}
        >
          <Text style={uploadType === 'image' ? styles.activeSwitchText : styles.switchText}>
            Upload Image
          </Text>
        </TouchableOpacity>
      </View>

      {uploadType === 'link' ? (
        <TextInput
          placeholder="Credential URL"
          placeholderTextColor="#888"
          style={styles.input}
        />
      ) : (
        <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
          <Text style={styles.uploadButtonText}>Choose Image</Text>
        </TouchableOpacity>
      )}

      {image && (
        <Image source={{ uri: image }} style={styles.previewImage} />
      )}
    </View>
       

       {/* 4- Card Add Projects*/}
       <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Add Projects</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            onPress={() => console.log('Add Projects')}
            style={styles.smallButton}
          >
            <Text style={styles.smallButtonText}>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => console.log('Edit Projects')}
            style={styles.smallButton}
          >
            <Text style={styles.smallButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Title */}
      <TextInput
        placeholder="Projects Title"
        placeholderTextColor="#888"
        style={styles.input}
      />
      <TextInput
        placeholder="Projects Discription"
        placeholderTextColor="#888"
        style={styles.input}
      />

      {/* Projects Options */}
      <View style={styles.switchContainer}>
        <TouchableOpacity
          onPress={() => setUploadType('link')}
          style={[
            styles.switchButton,
            uploadType === 'link' && styles.activeSwitchButton,
          ]}
        >
          <Text style={uploadType === 'link' ? styles.activeSwitchText : styles.switchText}>
            Link
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setUploadType('image')}
          style={[
            styles.switchButton,
            uploadType === 'image' && styles.activeSwitchButton,
          ]}
        >
          <Text style={uploadType === 'image' ? styles.activeSwitchText : styles.switchText}>
            Upload Image
          </Text>
        </TouchableOpacity>
      </View>

      {uploadType === 'link' ? (
        <TextInput
          placeholder="Projects URL"
          placeholderTextColor="#888"
          style={styles.input}
        />
      ) : (
        <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
          <Text style={styles.uploadButtonText}>Choose Image</Text>
        </TouchableOpacity>
      )}

      {image && (
        <Image source={{ uri: image }} style={styles.previewImage} />
      )}
    </View>
                         {/* Add Skills */}
                         <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Add Skills</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                onPress={() => console.log('Add Skills')}
                style={styles.smallButton}
              >
                <Text style={styles.smallButtonText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity
            onPress={() => console.log('Delete Skills')}
            style={styles.smallButton}
          >
            <Text style={styles.smallButtonText}>Delete</Text>
          </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Text style={styles.input}>{ "Add Skills"}</Text>
                </TouchableOpacity>
        </View>



              {/* Add Language */}
              <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Add Language</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                onPress={() => console.log('Add Language')}
                style={styles.smallButton}
              >
                <Text style={styles.smallButtonText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity
            onPress={() => console.log('Delete Language')}
            style={styles.smallButton}
          >
            <Text style={styles.smallButtonText}>Delete</Text>
          </TouchableOpacity>
              
            </View>
          </View>

          <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Text style={styles.input}>{ "Add Language"}</Text>
                </TouchableOpacity>
        </View>

         {/* Add Recommendation */}
         <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Add Recommendation</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                onPress={() => console.log('Add Recommendation')}
                style={styles.smallButton}
              >
                <Text style={styles.smallButtonText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity
            onPress={() => console.log('Delete Recommendation')}
            style={styles.smallButton}
          >
            <Text style={styles.smallButtonText}>Delete</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => console.log('Edit Recommendation')}
            style={styles.smallButton}
          >
            <Text style={styles.smallButtonText}>Edit</Text>
          </TouchableOpacity>
              
            </View>
          </View>

          <TextInput
        placeholder="Add Recommendation"
        placeholderTextColor="#888"
        style={styles.input}
      />
                   
               
        </View>

      </Animated.ScrollView>
    </View>
                 
              

                      {/* Bottom Navigation Bar */}
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
                <TouchableOpacity onPress={toggleNightMode}>
                    <Ionicons name="settings" size={25} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => nav.navigate('ProjectsSeniorPage')}>
                    <Ionicons name="folder" size={25} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => nav.navigate('ProfilePage')}>
                    <Image
                        source={require('./../assets/img1.jpeg')}
                        style={{
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


        </View>
    );
};

    

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#CAC5D8',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
    marginVertical: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  smallButton: {
    backgroundColor: '#C99FA9',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginLeft: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  smallButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    borderColor: '#E0E0E0',
    borderWidth: 1,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  switchButton: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 5,
    alignItems: 'center',
  },
  activeSwitchButton: {
    backgroundColor: '#D1CFE9',
  },
  switchText: {
    color: '#555',
    fontSize: 16,
  },
  activeSwitchText: {
    color: '#000',
    fontWeight: 'bold',
  },
  uploadButton: {
    backgroundColor: '#E6E6E6',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  previewImage: {
    width: '100%',
    height: 150,
    marginTop: 15,
    borderRadius: 10,
  },
  cardContent: {
    marginTop: 10,
},
skillText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
},
});

export default ProfilePage;