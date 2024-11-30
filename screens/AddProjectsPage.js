import React, { useState ,useContext} from 'react';
import {View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons, Feather, FontAwesome5, EvilIcons,FontAwesome6 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Dimensions } from 'react-native';
import { useFonts } from 'expo-font';
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

    const [projectName, setProjectName] = useState('');
    const [description, setDescription] = useState('');
    const [requiredSkills, setRequiredSkills] = useState('');
    const [field, setField] = useState('');
    const [duration, setDuration] = useState('');
    const [positionRole, setPositionRole] = useState('');

        
    const nav = useNavigation();
    let [fontsLoaded] = useFonts({
        'Updock-Regular': require('./../compnent/fonts/Updock-Regular.ttf'),
    });

    if (!fontsLoaded) {
        return <View><Text>Loading...</Text></View>; // Optionally show a loading indicator
    }
    const { isNightMode, toggleNightMode } = useContext(NightModeContext);
         

    const handleAddProject = () => {
        // Handle adding the project here
        // You may want to call an API to save the project in your backend
        console.log({
            projectName,
            description,
            requiredSkills,
            field,
            status,
            duration,
            positionRole
        });
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
                        value={projectName}
                        onChangeText={setProjectName}
                        placeholder="Enter project name"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                        style={styles.input}
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Enter project description"
                        multiline
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Required Skills</Text>
                    <TextInput
                        style={styles.input}
                        value={requiredSkills}
                        onChangeText={setRequiredSkills}
                        placeholder="Enter required skills"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Field</Text>
                    <TextInput
                        style={styles.input}
                        value={field}
                        onChangeText={setField}
                        placeholder="Enter project field"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Duration (Months)</Text>
                    <TextInput
                        style={styles.input}
                        value={duration}
                        onChangeText={setDuration}
                        placeholder="Enter duration in months"
                        keyboardType="numeric"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Position Role</Text>
                    <TextInput
                        style={styles.input}
                        value={positionRole}
                        onChangeText={setPositionRole}
                        placeholder="Enter position role"
                    />
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
            color: fourhColor,
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

});
export default AddProjectsPage;
