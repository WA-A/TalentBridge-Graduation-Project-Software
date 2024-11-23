import React, { useState, useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Animated, Button, Alert, Platform, } from 'react-native';
import { Ionicons, Feather, FontAwesome5, EvilIcons, FontAwesome } from '@expo/vector-icons';
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
// Color constants
const { secondary, primary, careysPink, darkLight, fourhColor, tertiary, fifthColor } = Colors;
const { width } = Dimensions.get('window');

const ProfilePage = () => {
    const nav = useNavigation();
    const { isNightMode, toggleNightMode } = useContext(NightModeContext);
    const [scrollY] = useState(new Animated.Value(0));

    // Load custom fonts


    const bottomBarTranslate = scrollY.interpolate({
        inputRange: [0, 50],
        outputRange: [0, 100], // 100 to move it off-screen
        extrapolate: 'clamp',
    });

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
           <TouchableOpacity onPress={() => nav.navigate('Profile')} style={{ position: 'absolute', top: 20, left: 20 }}>
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

        {/* النصوص تحت الصورة */}
    {/* النصوص تحت الصورة */}
    <View style={{ marginTop: 20, alignItems: 'flex-start', marginLeft: 1 }}>
        {/* Full Name */}
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#000', marginBottom: 10 }}>
            Full Name
        </Text>

        {/* UserName */}
        <Text style={{ fontSize: 18, fontWeight: '500', color: '#000', marginBottom: 10 }}>
            UserName
        </Text>

        {/* Bio */}
        <Text style={{ fontSize: 18, fontWeight: '500', color: '##000', marginBottom: 10 }}>
            Bio
        </Text>

        {/* Location */}
        <Text style={{ fontSize: 15, color: '##000', marginBottom: 10 }}>
            Location
        </Text>

        {/* About */}
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '##000', marginBottom: 5 }}>
            About
        </Text>

        {/* About Paragraph */}
        <Text style={{ fontSize: 15, color: '#000' }}>
            This is a sample about paragraph. It gives additional information about the user.
        </Text>

        </View>

</TouchableOpacity>


    {/* أيقونة الإشعارات */}
    <TouchableOpacity onPress={() => nav.navigate('notifications')} style={{ position: 'absolute', top: 20, right: 20 }}>
        <Ionicons name="notifications" size={25} color="#FFF" />
    </TouchableOpacity>
              </View>
           


                       {/* Main Content */}
               <Animated.ScrollView
                style={{
                    flex: 1,
                    backgroundColor: isNightMode ? "#000" : primary,
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
             










             </Animated.ScrollView>












    </View>
    )
};

export default ProfilePage;