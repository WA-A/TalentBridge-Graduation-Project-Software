import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { NightModeContext } from './NightModeContext';
import { Colors } from './../compnent/Style';

const { secondary, primary, darkLight, fourhColor, careysPink } = Colors;
const fields = [
    'IT',
    'Digital Marketing',
    'Graphic Design',
    'Data Science',
    'Web Development',
    'Mobile Development',
    'Cybersecurity',
    'Machine Learning',
    'Blockchain',
    'Cloud Computing',
    'Artificial Intelligence',
    'Project Management',
    'Content Writing',
];

const projects = [
    { id: '1', title: 'Project Alpha', description: 'An AI-based project' },
    { id: '2', title: 'Beta Marketing', description: 'Digital Marketing Strategies' },
    { id: '3', title: 'Gamma Design', description: 'UI/UX Design Concepts' },
    { id: '4', title: 'Delta Data', description: 'Data Science Analysis' },
];

export default function  ProjectsSeniorPage ({ navigation, route }) {
    const nav = useNavigation();
    const { isNightMode, toggleNightMode } = useContext(NightModeContext);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedField, setSelectedField] = useState('');

    let [fontsLoaded] = useFonts({
        'Updock-Regular': require('./../compnent/fonts/Updock-Regular.ttf'),
        'Lato-Bold': require('./../compnent/fonts/Lato-Bold.ttf'),
        'Lato-Regular': require('./../compnent/fonts/Lato-Regular.ttf'),
    });

    if (!fontsLoaded) {
        return <View><Text>Loading...</Text></View>;
    }

    const handleFieldSelect = (field) => {
        setSelectedField(field);
        setModalVisible(false);
    };

    return (
        <View style={{ flex: 1, backgroundColor: isNightMode ? darkLight : '#FFF' }}>
            <View style={{ height: 20, backgroundColor: isNightMode ? "#000" : secondary }} />

            <View style={{
                flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
                paddingHorizontal: 10, paddingVertical: 10, backgroundColor: isNightMode ? "#000" : secondary
            }}>
                <Text style={{
                    fontFamily: 'Updock-Regular', fontSize: 30, position: 'absolute', 
                    left: 0, right: 0, textAlign: 'center', color: isNightMode ? primary : "#000"
                }}>
                    Talent Bridge
                </Text>
                <TouchableOpacity onPress={() => nav.navigate('notifications')}>
                    <Ionicons name="notifications" size={25} color={secondary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleNightMode}>
                    <View style={{ position: 'relative', width: 50, height: 50 }}>
                        <Ionicons name={isNightMode ? "sunny" : "moon"} size={25} color={darkLight} style={{ position: 'absolute', top: 9, right: 20 }} />
                        <Ionicons name="cloud" size={30.7} color={isNightMode ? "#000" : secondary} style={{ position: 'absolute', top: 8.7, left: -12 }} />
                        <Ionicons name="cloud" size={27} color={careysPink} style={{ position: 'absolute', top: 11, left: -11 }} />
                    </View>
                </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, paddingVertical: 10, backgroundColor: fourhColor, elevation: 3 }}>
                <TouchableOpacity onPress={() => nav.navigate('Search')}>
                    <Ionicons name="search" size={25} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Text style={{ color: "#000", fontSize: 18 }}>{selectedField || "Select Field"}</Text>
                </TouchableOpacity>
            </View>

            {/* Projects List in Center */}
            <ScrollView contentContainerStyle={styles.projectsContainer}>
                {projects.map((project) => (
                    <View key={project.id} style={styles.projectCard}>
                        <Text style={styles.projectTitle}>{project.title}</Text>
                        <Text style={styles.projectDescription}>{project.description}</Text>
                    </View>
                ))}
            </ScrollView>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <FlatList
                            data={fields}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => handleFieldSelect(item)} style={styles.fieldItem}>
                                    <Text style={styles.fieldText}>{item}</Text>
                                </TouchableOpacity>
                            )}
                        />
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Bottom Navigation Bar */}
            <View style={{
                backgroundColor: isNightMode ? "#454545" : secondary,
                flexDirection: 'row', justifyContent: 'space-around',
                padding: 10, elevation: 3, position: 'absolute', bottom: 0, width: '100%'
            }}>
                <TouchableOpacity onPress={toggleNightMode}>
                    <Ionicons name="settings" size={25} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => nav.navigate('Profile')}>
                    <Image
                        source={require('./../assets/img1.jpeg')}
                        style={{
                            width: 30, height: 30, borderRadius: 30,
                            borderColor: primary, borderWidth: 1
                        }}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => nav.navigate('AddProjectScreen')}>
                    <Ionicons name="create-outline" size={28} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => nav.navigate('HomeScreen')}>
                    <Ionicons name="home" size={25} color="#000" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    projectsContainer: {
        padding: 15,
    },
    projectCard: {
        backgroundColor: Colors.secondary,
        padding: 20,
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    projectTitle: {
        fontFamily: 'Lato-Bold',
        fontSize: 18,
        color: Colors.primary,
        marginBottom: 5,
    },
    projectDescription: {
        fontFamily: 'Lato-Regular',
        fontSize: 14,
        color: Colors.darkLight,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
    },
    fieldItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    fieldText: {
        fontSize: 18,
    },
    closeButton: {
        marginTop: 20,
        alignItems: 'center',
        backgroundColor: careysPink,
        padding: 10,
        borderRadius: 5,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
    },
});

