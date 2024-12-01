import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity,StyleSheet, Modal, FlatList, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { NightModeContext } from './NightModeContext';
import { Colors } from './../compnent/Style';
import { Card,UserInfoText, UserName, ContainerCard, PostText, UserInfo, ButtonText, StyledButton} from './../compnent/Style.js'
import { TextInput } from 'react-native-gesture-handler';
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

export default function  ProjectsSeniorPage ({ navigation, route }) {
    const nav = useNavigation();
    const { isNightMode, toggleNightMode } = useContext(NightModeContext);
    const [selectFieldModalVisible, setSelectFieldModalVisible] = useState(false); // للتحكم في ظهور موديل Select Field
    const [applyNowModalVisible, setApplyNowModalVisible] = useState(false); // للتحكم في ظهور موديل Apply Now    
    const [selectedField, setSelectedField] = useState('');
    const [NumberOfTrain ,setNumberOfTrain] = useState('');
    const [ProfileLink ,setProfileLink] = useState('');

    let [fontsLoaded] = useFonts({
        'Updock-Regular': require('./../compnent/fonts/Updock-Regular.ttf'),
        'Lato-Bold': require('./../compnent/fonts/Lato-Bold.ttf'),
        'Lato-Regular': require('./../compnent/fonts/Lato-Regular.ttf'),
    });

    if (!fontsLoaded) {
        return <View><Text>Loading...</Text></View>;
    }

    const handleFieldSelect = (field) => {
        selectFieldModalVisible(field);
        setSelectFieldModalVisible(false);
    };

    const handleApplyNow = () => {
      setNumberOfTrain();
      setProfileLink();
      setApplyNowModalVisible(true);
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
                <TouchableOpacity onPress={() => setSelectFieldModalVisible(true)}>
  <Text style={{ color: "#000", fontSize: 18 }}>
    {selectedField || "Select Field"}
  </Text>

  <Modal
    animationType="slide"
    transparent={true}
    visible={selectFieldModalVisible}
    onRequestClose={() => setSelectFieldModalVisible(false)}
  >
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <FlatList
          data={fields}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity 
              onPress={() => handleFieldSelect(item)} 
              style={styles.fieldItem}
            >
              <Text style={styles.fieldText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity 
          onPress={() => setSelectFieldModalVisible(false)} 
          style={styles.closeButton}
        >
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
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

          <TouchableOpacity onPress={() => setApplyNowModalVisible(true)} style={styles.styledButton}>
    <Text style={styles.buttonText}>Apply Now</Text>
    <Modal
        transparent={true}
        visible={applyNowModalVisible}
        onRequestClose={() => setApplyNowModalVisible(false)}
    >
        <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
                <TouchableOpacity style={styles.input}>
                    <TextInput
                        style={styles.inputField}
                        placeholder="Number Of Train"
                        value={NumberOfTrain}
                        onChangeText={setNumberOfTrain}
                    />
                    <TextInput
                        style={styles.inputField}
                        placeholder="Profile Link"
                        value={ProfileLink}
                        onChangeText={setProfileLink}
                    />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setApplyNowModalVisible(false)} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
            </View>
        </View>
    </Modal>
</TouchableOpacity>


        </Card>
      ))}
    </View>
  ) : (
    <Text style={{ color: darkLight, textAlign: 'center', marginTop: 20 }}>No projects available.</Text>
  )}
</ScrollView>

            
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
styledButton: {
  backgroundColor: fifthColor,  // لون خلفية الزر
  paddingVertical: 12,  // زيادة الحشو ليصبح الزر أكبر
  paddingHorizontal: 20,
  borderRadius: 8,  // زوايا دائرية للزر
  alignItems: 'center',  // محاذاة النص في الوسط
  justifyContent: 'center',  // محاذاة النص في الوسط
  marginTop: 20,  // مسافة فوق الزر
},

buttonText: {
  color: '#fff',  // لون النص الأبيض
  fontSize: 18,  // حجم النص
  fontWeight: 'bold',  // جعل النص عريضًا
},

modalContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',  // خلفية مظلمة خفيفة
},

modalContent: {
  width: '80%',  // جعل المودال أصغر في العرض
  backgroundColor: '#fff',  // خلفية بيضاء
  padding: 20,
  borderRadius: 10,  // زوايا دائرية للمودال
  alignItems: 'center',
},

input: {
  width: '100%',
},

inputField: {
  height: 45,
  fontSize: 16,
  color: '#333',
  paddingHorizontal: 10,
  marginBottom: 20,
  borderWidth: 1,  // إضافة حدود حول الحقول
  borderColor: '#ccc',  // لون الحدود
  borderRadius: 5,  // زوايا دائرية
},

closeButton: {
  marginTop: 10,
  backgroundColor: careysPink,  // لون زر الإغلاق
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 8,
},

closeButtonText: {
  color: '#fff',  // لون النص الأبيض
  fontSize: 16,
  fontWeight: 'bold',
},
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
    container: {
        padding: 10,
        backgroundColor: '#FFF',
      },
    fieldItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    fieldText: {
        fontSize: 18,
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