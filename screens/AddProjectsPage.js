import React, { useState ,useContext} from 'react';
import {View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet,Button,Platform } from 'react-native';
import { Ionicons, Feather, FontAwesome5, EvilIcons,FontAwesome6 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Dimensions } from 'react-native';
import { useFonts } from 'expo-font';
import { NightModeProvider, NightModeContext } from './NightModeContext';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

const AddProjectsPage = () => {

    const [ProjectName, setProjectName] = useState('');
    const [Description, setDescription] = useState('');
    const [RequiredSkills, setRequiredSkills] = useState('');
    const [Field, setField] = useState('');
    const [DurationInMounths, setDurationInMounths] = useState('');
    const [PositionRole, setPositionRole] = useState('');
    const [WorkLocation, setWorkLocation] = useState('');
    const [Benefits, setBenefits] = useState('');
    const [Price, setPrice] = useState('');
        
    const nav = useNavigation();
    let [fontsLoaded] = useFonts({
        'Updock-Regular': require('./../compnent/fonts/Updock-Regular.ttf'),
    });

    if (!fontsLoaded) {
        return <View><Text>Loading...</Text></View>; // Optionally show a loading indicator
    }
    const { isNightMode, toggleNightMode } = useContext(NightModeContext);
      
    const [selectedFile, setSelectedFile] = useState(null);
    console.log('Selected File:', selectedFile);

    
    const handleFilePicker = async () => {
        try {
            const res = await DocumentPicker.getDocumentAsync({
                type: '*/*',
            });
    
            if (res.type === 'success') {
                setSelectedFile({
                    uri: res.uri,
                    name: res.name,
                    mimeType: res.mimeType || 'application/pdf',
                });
                console.log('Selected file:', res);
            } else {
                console.log('File selection canceled.');
            }
        } catch (err) {
            console.error('Error selecting file:', err);
        }
    };
    
    const handleAddProject = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) throw new Error('No token found');
    
            const baseUrl = Platform.OS === 'web'
                ? 'http://localhost:3000'
                : 'http://192.168.1.239:3000';
    
            const formData = new FormData();
    
            formData.append('ProjectName', ProjectName);
            formData.append('Description', Description);
            formData.append('RequiredSkills', RequiredSkills);
            formData.append('Field', Field);
            formData.append('DurationInMounths', DurationInMounths);
            formData.append('PositionRole', PositionRole);
            formData.append('WorkLocation', WorkLocation);
            formData.append('Benefits', Benefits);
            formData.append('Price', Price);
    
            if (selectedFile) {
                const fileUri = selectedFile.uri.startsWith('file://')
                    ? selectedFile.uri.replace('file://', '') 
                    : selectedFile.uri;
    
                formData.append('FileProject', {
                    uri: fileUri,
                    name: selectedFile.name,
                    type: selectedFile.mimeType || 'application/pdf',
                });
            }
    
            console.log('FormData before sending:', formData);
    
            const response = await fetch(`${baseUrl}/project/createproject`, {
                method: 'POST',
                headers: {
                    'Authorization': `Wasan__${token}`, 
                },
                body: formData,
            });
    

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Something went wrong');
            }
    
            const result = await response.json();
            console.log('Add Project successfully:', result);
        } catch (error) {
            console.error('Error adding project:', error);
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

            </View>
            {/* المحتوى الرئيسي لملء الشاشة */}
            <View style={{ flex: 1,  backgroundColor: isNightMode ? "#000" : primary }}>
            <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Project Name</Text>
                    <TextInput
                        style={styles.input}
                        value={ProjectName}
                        onChangeText={setProjectName}
                        placeholder="Enter project name"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                        style={styles.input}
                        value={Description}
                        onChangeText={setDescription}
                        placeholder="Enter project description"
                        multiline
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Required Skills</Text>
                    <TextInput
                        style={styles.input}
                        value={RequiredSkills}
                        onChangeText={setRequiredSkills}
                        placeholder="Enter required skills"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Field</Text>
                    <TextInput
                        style={styles.input}
                        value={Field}
                        onChangeText={setField}
                        placeholder="Enter project field"
                    />
                </View>


                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Duration (Months)</Text>
                    <TextInput
                        style={styles.input}
                        value={DurationInMounths}
                        onChangeText={setDurationInMounths}
                         placeholder="Enter duration in months"
                    />
                </View>
             
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Position Role</Text>
                    <TextInput
                        style={styles.input}
                        value={PositionRole}
                        onChangeText={setPositionRole}
                        placeholder="Enter position role"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Work Location</Text>
                    <TextInput
                        style={styles.input}
                        value={WorkLocation}
                        onChangeText={setWorkLocation}
                        placeholder="Enter Work Location"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Benefits</Text>
                    <TextInput
                        style={styles.input}
                        value={Benefits}
                        onChangeText={setBenefits}
                        placeholder="Enter Benefits"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Price</Text>
                    <TextInput
                        style={styles.input}
                        value={Price}
                        onChangeText={setPrice}
                        placeholder="Enter Price"
                    />
                </View>

                <View style={styles.container}>
            <Text style={styles.label}>File Project</Text>
            <TouchableOpacity style={styles.fileButton} onPress={handleFilePicker}>
                <Text style={styles.submitText}>Select File</Text>
            </TouchableOpacity>
            {selectedFile && (
    <View style={styles.fileDetails}>
        <Text>File Name: {selectedFile.name}</Text>
        <Text>File Type: {selectedFile.mimeType}</Text>
        <Text>File URI: {selectedFile.uri}</Text>
    </View>
)}

        </View>


                <TouchableOpacity style={styles.submitButton} onPress={handleAddProject}>
                    <Text style={styles.submitText}>Add Project</Text>
                </TouchableOpacity>
            </ScrollView>
                
            </View>

            {/* شريط التنقل السفلي */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 20, backgroundColor: secondary, elevation: 3 }}>
                <TouchableOpacity onPress={() => nav.navigate('Settings')}>
                    <Ionicons name="settings" size={25} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => nav.navigate('ProjectsSeniorPage')}>
                    <Ionicons name="folder" size={25} color="#000" />
                </TouchableOpacity>


                <TouchableOpacity onPress={() => nav.navigate('AddPostScreen')}>
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
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 20,
            backgroundColor: secondary,
        },
        headerText: {
            fontFamily: 'Updock-Regular',
            fontSize: 30,
            color: '#fff',
            textAlign: 'center',
        },
        label: {
            fontSize: 16,
            fontWeight: 'bold',
            marginBottom: 5,
            color: brand,
        },
        inputContainer: {
            marginTop: 10,
            marginBottom: 15,
            paddingHorizontal: 10,
            borderWidth: 1, // إضافة الحدود
            borderColor: "fff", // لون الحدود
            borderRadius: 5, // تقويس الحواف
        },
        input: {
            height: 40,
            fontSize: 16,
            color: "#000",
            paddingHorizontal: 10,
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
        },
        bottomNav: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            padding: 20,
            backgroundColor: secondary,
            elevation: 3,
        },
            fileDetails: {
                marginTop: 10,
            },
       fileButton: {
            backgroundColor: careysPink,
            paddingVertical: 15,
            borderRadius: 8,
            alignItems: 'center',
            marginVertical: 20,
        },

});
export default AddProjectsPage;
