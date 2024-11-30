import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity,StyleSheet, Modal, FlatList, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { NightModeContext } from './NightModeContext';
import { Colors } from './../compnent/Style';
import { Card,UserInfoText, UserName, ContainerCard, PostText, UserInfo, ButtonText, StyledButton} from './../compnent/Style.js'
const { tertiary, firstColor, secColor,fifthColor,secondary, primary, darkLight, fourhColor, careysPink} = Colors;
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
    { id: '1', title: 'Project Alpha', description: 'An AI-based project', RequiredSkills: ['Python', 'Machine Learning'], DurationInMonths: 6, PositionRole: 'Developer', Field: 'AI', CreatedBySenior: 'John Doe', Status: 'Active' },
    { id: '2', title: 'Beta Marketing', description: 'Digital Marketing Strategies', RequiredSkills: ['SEO', 'Content Writing'], DurationInMonths: 4, PositionRole: 'Marketer', Field: 'Digital Marketing', CreatedBySenior: 'Jane Smith', Status: 'Inactive' },
    { id: '3', title: 'Gamma Design', description: 'UI/UX Design Concepts', RequiredSkills: ['Figma', 'UX Research'], DurationInMonths: 3, PositionRole: 'Designer', Field: 'Design', CreatedBySenior: 'Mark Lee', Status: 'Active' },
    { id: '4', title: 'Delta Data', description: 'Data Science Analysis', RequiredSkills: ['SQL', 'Data Visualization'], DurationInMonths: 12, PositionRole: 'Data Analyst', Field: 'Data Science', CreatedBySenior: 'Sarah Brown', Status: 'Active' },
];

export default function  ProjectsJuniorPage ({ navigation, route }) {
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
         <ScrollView contentContainerStyle={{ padding: 10, backgroundColor: firstColor }}>
  {projects && projects.length > 0 ? (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
      {projects.map((project) => (
        <Card key={project.id} style={styles.card}>
          <UserInfo style={styles.cardContent}>
            <UserInfoText>
              <UserName style={styles.projectTitle}>{project.title}</UserName>
              <PostText style={{ color: darkLight, marginBottom: 10 }}>
                {project.description}
              </PostText>
            </UserInfoText>
          </UserInfo>

          <View style={{ marginBottom: 5 }}>
            <Text style={{ color: tertiary, fontWeight: 'bold' }}>Required Skills:</Text>
            <Text style={{ color: darkLight }}>
              {project.RequiredSkills?.length > 0 ? project.RequiredSkills.join(', ') : 'Not specified'}
            </Text>
          </View>

          <View style={{ marginBottom: 5 }}>
            <Text style={{ color: tertiary, fontWeight: 'bold' }}>Duration:</Text>
            <Text style={{ color: darkLight }}>{project.DurationInMonths || 'N/A'} months</Text>
          </View>

          <View style={{ marginBottom: 5 }}>
            <Text style={{ color: tertiary, fontWeight: 'bold' }}>Role:</Text>
            <Text style={{ color: darkLight }}>{project.PositionRole || 'N/A'}</Text>
          </View>

          <View style={{ marginBottom: 5 }}>
            <Text style={{ color: tertiary, fontWeight: 'bold' }}>Field:</Text>
            <Text style={{ color: darkLight }}>{project.Field || 'N/A'}</Text>
          </View>

          <View style={{ marginBottom: 5 }}>
            <Text style={{ color: tertiary, fontWeight: 'bold' }}>Created By:</Text>
            <Text style={{ color: darkLight }}>{project.CreatedBySenior || 'N/A'}</Text>
          </View>

          <View style={{ marginBottom: 10 }}>
            <Text style={{ color: careysPink, fontWeight: 'bold' }}>Status:</Text>
            <Text style={{ color: darkLight }}>{project.Status || 'N/A'}</Text>
          </View>

          <TouchableOpacity style={styles.styledButton}>
            <Text style={styles.buttonText}>Apply Now</Text>
          </TouchableOpacity>
        </Card>
      ))}
    </View>
  ) : (
    <Text style={{ color: darkLight, textAlign: 'center', marginTop: 20 }}>No projects available.</Text>
  )}
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
                <TouchableOpacity onPress={() => nav.navigate('ProfilePage')}>
                    <Image
                        source={require('./../assets/img1.jpeg')}
                        style={{
                            width: 30, height: 30, borderRadius: 30,
                            borderColor: primary, borderWidth: 1
                        }}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => nav.navigate('AddProjects')}>
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
    card: {
        width: '48%', // يجعل الكروت بحجم أصغر وتكون بجانب بعضها
        marginBottom: 15, // المسافة بين الكروت
        shadowColor: '#7C7692', // اللون البنفسجي للظل
        shadowOffset: { width: 0, height: 4 }, // اتجاه الظل
        shadowOpacity: 0.5, // شدة الظل
        shadowRadius: 6, // طول الظل
        elevation: 5, // لتحسين الظل في Android
        borderRadius: 10, // حواف مستديرة
        padding: 10,
        backgroundColor: '#fff', // خلفية الكارد
        justifyContent: 'center', // توسيط المحتوى عموديًا
        alignItems: 'center', // توسيط المحتوى أفقيًا
      },
      cardContent: {
        alignItems: 'center', // توسيط النص داخل الكارد
        justifyContent: 'center',
        textAlign: 'center', // لضمان أن النص يكون في المنتصف بشكل صحيح
      },
      projectTitle: {
        color: tertiary, // استخدام اللون المخصص للعناوين
        fontWeight: 'bold',
        fontSize: 18, // حجم الخط المناسب للعنوان
        textAlign: 'center', // تأكيد توسيط النص داخل الكارد
        marginBottom: 10,
      },
      styledButton: {
        backgroundColor: '#7C7692', // درجة البنفسجي الغامق
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
      },
      buttonText: {
        color: '#fff', // نص الزر باللون الأبيض
        textAlign: 'center',
      },
    container: {
        padding: 10,
        backgroundColor: '#FFF',
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
      projectsContainer: {
      padding: 10,
      alignItems: 'center',
        },
        projectCard: {
            backgroundColor: '#fff',
            borderRadius: 10,
            padding: 15,
            marginVertical: 10,
            width: '90%',
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 10,
            elevation: 3,
        },
        projectDescription: {
            fontSize: 14,
            color: '#666',
            marginBottom: 10,
        },
        projectField: {
            fontSize: 14,
            marginBottom: 5,
        },
        projectStatus: {
            fontSize: 14,
            fontWeight: 'bold',
            color: 'green',
            marginTop: 10,
        },
});