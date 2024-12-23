import React, { useState ,useContext} from 'react';
import { View, Text,TextInput, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, Feather, FontAwesome5, EvilIcons,FontAwesome6 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Dimensions } from 'react-native';
import { useFonts } from 'expo-font';
import * as DocumentPicker from 'expo-document-picker';
import { launchImageLibrary } from 'react-native-image-picker'; // لإختيار الصور
//import { Video } from 'react-native-video'; // لإختيار الفيديوهات إذا كنت تريد عرض الفيديوهات
import { Video } from 'expo-av';

import { NightModeProvider, NightModeContext } from './NightModeContext';

import {
    StyledContainer,
    InnerContainer,
    PageLogo,
    PageTitle,
    StatusBarHeight,
    StyledFormArea,
    SubTitle,
    LeftIcon,
    ButtonText,
    StyledButton,
    StyleInputLable,
    StyledInputLable,
    StyledTextInput,
    Colors,
    RightIcon,
    Circle,
    Rectangle,
    StyledLine,
    Circle1,
    Circle2,
    Container,
    Switch,
    Text2,

} from './../compnent/Style';
//color
const { brand, darkLight, careysPink, firstColor, secColor, thirdColor, fourhColor, fifthColor, primary, tertiary, secondary } = Colors;
const { width } = Dimensions.get('window');

const AddPostScreen = () => {
    const nav = useNavigation();
    let [fontsLoaded] = useFonts({
        'Updock-Regular': require('./../compnent/fonts/Updock-Regular.ttf'),
    });

    if (!fontsLoaded) {
        return <View><Text>Loading...</Text></View>; // Optionally show a loading indicator
    }
    const { isNightMode, toggleNightMode } = useContext(NightModeContext);

    const [Body, setBody] = useState('');
    const [uploadType, setUploadType] = useState('image'); // الافتراضي هو الصورة
    const [Images, setImages] = useState(null);
    const [Files, setFiles] = useState(null);
    const [Videos, setVideos] = useState(null);
    
  
    const pickImage = () => {
  launchImageLibrary({ mediaType: 'photo', quality: 1 }, response => {
    if (response.assets) {
      const imageUri = response.assets[0].uri; // الرابط الكامل للصورة
      const imageName = imageUri.split('/').pop(); // استخراج اسم الصورة مع الامتداد
      setImages({ uri: imageUri, name: imageName }); // تخزين الرابط الكامل والاسم
      setFiles(null); 
      setVideos(null);
    }
  });
};
    
  
    const pickFile = async () => {
      try {
        const result = await DocumentPicker.getDocumentAsync({
          type: '*/*', // جرب أنواع أخرى إذا لزم الأمر
        });
        if (result.type === 'success') {
          setFiles(result.uri);
          console.log('File URI:', result.uri);
        }
      } catch (err) {
        console.error('Error picking file:', err);
      }
    };
    
  
    const pickVideo = async () => {
      try {
        const res = await DocumentPicker.getDocumentAsync({
          type: 'video/*', // تحديد نوع الملفات ليكون فيديو
        });
    
        if (res.type === 'success') {
          setVideos(res.uri); // حفظ رابط الفيديو
          setImages(null); // مسح الصورة
          setFiles(null); // مسح الملفات الأخرى
          console.log('Video selected: ', res.uri);
        }
      } catch (err) {
        console.log('Error picking video: ', err);
      }
    };
    
    const handleAddPost = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) throw new Error('No token found');
    
        const baseUrl = Platform.OS === 'web'
          ? 'http://localhost:3000'
          : 'http://192.168.1.239:3000';
    
        const formData = new FormData();
    
        // إضافة البودي إذا كان موجودًا
        if (Body.trim()) {
          formData.append('Body', Body);
        }
    
        // التحقق من نوع المحتوى وإضافته إذا كان موجودًا
        if (uploadType === 'image' && Images) {
          const fileUri = Images.uri.startsWith('file://') ? Images.uri.replace('file://', '') : Images.uri;
          formData.append('Images', {
            uri: fileUri,
            name: Images.name || 'image.jpg',
            type: 'image/jpeg',
          });
        } else if (uploadType === 'video' && Videos) {
          const fileUri = Videos.startsWith('file://') ? Videos.replace('file://', '') : Videos;
          formData.append('Videos', {
            uri: fileUri,
            name: Videos.split('/').pop() || 'video.mp4',
            type: 'video/mp4',
          });
        } else if (uploadType === 'file' && Files) {
          const fileUri = Files.startsWith('file://') ? Files.replace('file://', '') : Files;
          formData.append('Files', {
            uri: fileUri,
            name: Files.split('/').pop() || 'file.pdf',
            type: 'application/pdf',
          });
        }
    
        // التأكد من وجود محتوى للإرسال
        if (!Body.trim() && !Images && !Videos && !Files) {
          throw new Error('Please add content or upload a file');
        }
    
        console.log('FormData before sending:', formData);
    
        const response = await fetch(`${baseUrl}/post/createpost`, {
          method: 'POST',
          headers: {
            'Authorization': `Wasan__${token}`,
          },
          body: formData,
        });
    
        const responseText = await response.text();
        console.log('Server Response:', responseText);
    
        if (!response.ok) {
          const errorData = JSON.parse(responseText);
          throw new Error(errorData.message || 'Something went wrong');
        }
    
        const result = JSON.parse(responseText);
        console.log('Post added successfully:', result);
      } catch (error) {
        console.error('Error adding post:', error);
        alert(error.message);
      }
    };
    
    return (
        <View style={{ flex: 1, backgroundColor: secondary, paddingTop: 20 }}>
        {/* الشريط العلوي */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, paddingVertical: 25, backgroundColor: secondary }}>

            <Text style={{ fontFamily: 'Updock-Regular', fontSize: 30, position: 'absolute', left: 0, right: 0, textAlign: 'center' }}>
                Talent Bridge
            </Text>

        </View>

           
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, paddingVertical: 20, backgroundColor: fourhColor, elevation: 3 }}>

            <TouchableOpacity onPress={() => nav.navigate('HomeScreen')}>
                <FontAwesome6 name="circle-left" size={25} color={careysPink} style={{ position: 'absolute', top: -15 }} />
                <Text style={{ fontSize: 17,fontWeight:'bold',color:primary ,position: 'absolute',top: -15,left:30 }}>
               Back
            </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => nav.navigate('HomeScreen')}>
                <FontAwesome6 name="circle-right" size={25} color={careysPink} style={{ position: 'absolute', top: -15,left:-25 }} />
                <Text style={{fontSize: 17,fontWeight:'bold',color:primary ,position: 'absolute',top: -15,left:-65 }}>
               Post
            </Text>
            </TouchableOpacity>
            </View>
                   
                    {/* Main Contant */}
        
            <StyledContainer style={{ backgroundColor: isNightMode ? Colors.black : Colors.primary }}>
      <InnerContainer>
        {/* Title for the post */}
        <PageTitle>Add New Post</PageTitle>

       {/* Post Body Input */}
       <TextInput
  style={{
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    height: 100,
    textAlignVertical: "top",
  }}
  placeholder="Post Body"
  onChangeText={setBody}
  placeholderTextColor="#999"
  multiline
/>

        {/* Switch between Upload Types */}
        <View style={{ flexDirection: 'row', marginVertical: 20 }}>
          <TouchableOpacity
            onPress={() => setUploadType('image')}
            style={[
              { padding: 10, marginRight: 10, borderRadius: 10, backgroundColor: uploadType === 'image' ? Colors.brand : Colors.secondary },
            ]}
          >
            <Text style={{ color: uploadType === 'image' ? Colors.primary : Colors.tertiary }}>Upload Image</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setUploadType('video')}
            style={[
              { padding: 10, marginRight: 10, borderRadius: 10, backgroundColor: uploadType === 'video' ? Colors.brand : Colors.secondary },
            ]}
          >
            <Text style={{ color: uploadType === 'video' ? Colors.primary : Colors.tertiary }}>Upload Video</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setUploadType('file')}
            style={[
              { padding: 10, marginRight: 10, borderRadius: 10, backgroundColor: uploadType === 'file' ? Colors.brand : Colors.secondary },
            ]}
          >
            <Text style={{ color: uploadType === 'file' ? Colors.primary : Colors.tertiary }}>Upload File</Text>
          </TouchableOpacity>
        </View>

        {/* Choose file section */}
        {uploadType === 'image' && (
  <StyledButton onPress={pickImage}>
    <ButtonText>Choose Image</ButtonText>
  </StyledButton>
)}


        {uploadType === 'video' && (
          <StyledButton onPress={pickVideo}>
            <ButtonText>Choose Video</ButtonText>
          </StyledButton>
        )}
         {uploadType === 'file' && (
          <StyledButton onPress={pickFile}>
            <ButtonText>Choose File</ButtonText>
          </StyledButton>
        )} 

       {/* Preview the uploaded content */}
       {Images && (
        <Text style={{ marginVertical: 20, fontSize: 16, color: '#555' }}>
           {Images.name} {/* اسم الصورة مع الامتداد */}
         </Text>
     )}
  {Videos && (
  <Video
    source={{ uri: Videos }}
    style={{ width: 200, height: 200, marginVertical: 20 }}
    useNativeControls // إضافة عناصر التحكم
    resizeMode="cover" // لضبط الفيديو داخل الإطار
    isLooping // تشغيل الفيديو بشكل متكرر
  />
)}
        {/* File preview*/}
        {Files && (
          <Text style={{ marginVertical: 20 }}>
            {Files.split('/').pop()}
          </Text>
        )}

<View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
  <TouchableOpacity style={{ alignItems: 'center' }} onPress={handleAddPost}>
    <StyledButton style={{ backgroundColor: brand, marginRight: 10 }}>
      <ButtonText>Add Post</ButtonText>
    </StyledButton>
  </TouchableOpacity>
</View>

      </InnerContainer>
    </StyledContainer>



            {/* شريط التنقل السفلي */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 20, backgroundColor: secondary, elevation: 3 }}>
                <TouchableOpacity onPress={() => nav.navigate('Settings')}>
                    <Ionicons name="settings" size={25} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => nav.navigate('Projects')}>
                    <Ionicons name="folder" size={25} color="#000" />
                </TouchableOpacity>


                <TouchableOpacity onPress={() => nav.navigate('ProjectsSeniorPage')}>
                    <Ionicons name="add-circle" size={28} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => nav.navigate('HomeScreen')}>
                    <Ionicons name="home" size={25} color="#000" />
                </TouchableOpacity>
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    lightBackground: {
        position: 'absolute',
        top: 4,
        left: 22,
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#b0c4de',
        opacity: 0.6,
    },
        switchContainer: {
          flexDirection: 'row',
          marginBottom: 20,
        },
        switchButton: {
          padding: 10,
          margin: 5,
          backgroundColor: '#ddd',
          borderRadius: 5,
        },
        activeSwitchButton: {
          backgroundColor: '#4CAF50',
        },
        switchText: {
          color: '#000',
        },
        activeSwitchText: {
          color: '#fff',
        },
        uploadButton: {
          marginTop: 20,
          padding: 15,
          backgroundColor: '#007BFF',
          borderRadius: 5,
        },
        uploadButtonText: {
          color: '#fff',
          fontSize: 16,
        },
        previewImage: {
          width: 100,
          height: 100,
          marginTop: 20,
        },
        previewVideo: {
          width: 200,
          height: 200,
          marginTop: 20,
        },
        previewFileText: {
          marginTop: 20,
          color: '#333',
        },
      
});
export default AddPostScreen;
