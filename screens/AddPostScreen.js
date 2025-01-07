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
    
        {/* الشريط العلوي - Back and Post buttons */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, paddingVertical: 20, backgroundColor: fourhColor, elevation: 3 }}>
          <TouchableOpacity onPress={() => nav.navigate('HomeScreen')}>
            <FontAwesome6 name="circle-left" size={25} color={careysPink} style={{ position: 'absolute', top: -15 }} />
            <Text style={{ fontSize: 17, fontWeight: 'bold', color: primary, position: 'absolute', top: -15, left: 30 }}>
              Back
            </Text>
          </TouchableOpacity>
    
          <TouchableOpacity onPress={() => nav.navigate('HomeScreen')}>
            <FontAwesome6 name="circle-right" size={25} color={careysPink} style={{ position: 'absolute', top: -15, left: -25 }} />
            <Text style={{ fontSize: 17, fontWeight: 'bold', color: primary, position: 'absolute', top: -15, left: -65 }}>
              Post
            </Text>
          </TouchableOpacity>
        </View>
    
        {/* Main Content */}
        <StyledContainer style={{ backgroundColor: isNightMode ? Colors.black : Colors.primary }}>
          <InnerContainer>
            <PageTitle>Add New Post</PageTitle>
    
            {/* Post Body Input */}
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 8,
            padding: 12,
            marginBottom: 20,
            fontSize: 16,
            textAlignVertical: "top",
            backgroundColor: '#f9f9f9',
            color: primary
          }}
          placeholder="Write your post here..."
          onChangeText={setBody}
          placeholderTextColor="#bbb"
          multiline
        />

        {/* Upload Type Buttons */}
        <View style={{ flexDirection: 'row', marginVertical: 20, justifyContent: 'center' }}>
          {['image', 'video', 'file'].map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => setUploadType(type)}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 15,
                margin: 8,
                borderRadius: 30,
                backgroundColor: uploadType === type ? Colors.primary : '#f1f1f1',
                shadowColor: '#000',
                shadowOpacity: 0.1,
                shadowOffset: { width: 0, height: 2 },
                elevation: 5,
              }}>
              <Text style={{ fontSize: 14, color: uploadType === type ? Colors.white : Colors.primary }}>
                Upload {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Choose File Section */}
        {uploadType === 'image' && (
          <StyledButton onPress={pickImage} style={{ backgroundColor: Colors.primary, padding: 12, borderRadius: 8 }}>
            <ButtonText>Choose Image</ButtonText>
          </StyledButton>
        )}
        {uploadType === 'video' && (
          <StyledButton onPress={pickVideo} style={{ backgroundColor: Colors.primary, padding: 12, borderRadius: 8 }}>
            <ButtonText>Choose Video</ButtonText>
          </StyledButton>
        )}
        {uploadType === 'file' && (
          <StyledButton onPress={pickFile} style={{ backgroundColor: Colors.primary, padding: 12, borderRadius: 8 }}>
            <ButtonText>Choose File</ButtonText>
          </StyledButton>
        )}

        {/* Preview the uploaded content */}
        {Images && (
          <Text style={{ marginVertical: 20, fontSize: 16, color: '#555' }}>
            {Images.name}
          </Text>
        )}
        {Videos && (
          <Video
            source={{ uri: Videos }}
            style={{ width: '100%', height: 200, marginVertical: 20 }}
            useNativeControls
            resizeMode="cover"
            isLooping
          />
        )}
        {Files && (
          <Text style={{ marginVertical: 20 }}>
            {Files.split('/').pop()}
          </Text>
        )}

        {/* Post Button */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 30 }}>
          <StyledButton onPress={handleAddPost} style={{ backgroundColor: Colors.primary, paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8 }}>
            <ButtonText>Add Post</ButtonText>
          </StyledButton>
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
    
  }    

export default AddPostScreen;
