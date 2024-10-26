import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, Feather, FontAwesome5, EvilIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Dimensions } from 'react-native';
import { useFonts } from 'expo-font';

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

const WelcomeScreen = () => {
    const nav = useNavigation();
    let [fontsLoaded] = useFonts({
        'Updock-Regular': require('./../compnent/fonts/Updock-Regular.ttf'),
    });

    if (!fontsLoaded) {
        return <View><Text>Loading...</Text></View>; // Optionally show a loading indicator
    }

    return (
        <View style={{ flex: 1, backgroundColor: secondary, paddingTop: 30 }}>
            {/* الشريط العلوي */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, paddingVertical: 10, backgroundColor: secondary, }}>
                <TouchableOpacity onPress={() => nav.navigate('nightmood')}>
                    <View style={{ position: 'relative', width: 50, height: 50 }}>
                        <Ionicons name="moon" size={25} color={darkLight} style={{ position: 'absolute', top: 9, left: 30 }} />
                        <Ionicons name="cloud" size={30.7} color={secondary} style={{ position: 'absolute', top: 8.7, left: 10 }} />
                        <Ionicons name="cloud" size={27} color={careysPink} style={{ position: 'absolute', top: 11, left: 12 }} />
                    </View>
                </TouchableOpacity>
                <Text style={{ fontFamily: 'Updock-Regular', fontSize: 30 }}>Talent Bridge</Text>
                <TouchableOpacity onPress={() => nav.navigate('Chat')}>
                    <EvilIcons name="sc-telegram" size={39} color={careysPink} style={{ position: 'absolute', top: -20, left: -42 }} />
                    <EvilIcons name="sc-telegram" size={37} color={darkLight} style={{ position: 'absolute', top: -20, left: -40 }} />

                </TouchableOpacity>
            </View>

            {/* الأيقونات الجديدة لخانات الدردشة والمشاريع */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, paddingVertical: 10, backgroundColor: fourhColor, elevation: 3 }}>

                <TouchableOpacity onPress={() => nav.navigate('Search')}>
                    <Ionicons name="search" size={25} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => nav.navigate('notifications')}>
                    <Ionicons name="notifications" size={25} color={secondary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => nav.navigate('Profile')}>
                    <Image
                        source={require('./../assets/img1.jpeg')}
                        style={{ width: 30, height: 30, borderRadius: 30, borderColor: tertiary, borderWidth: 1 }}
                    />
                </TouchableOpacity>
            </View>
            {/* المحتوى الرئيسي لملء الشاشة */}
            <View style={{ flex: 1, backgroundColor: primary }}>
                {/* محتوى إضافي يمكن إضافته هنا إذا لزم الأمر */}
            </View>

            {/* شريط التنقل السفلي */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 20, backgroundColor: secondary, elevation: 3 }}>
                <TouchableOpacity onPress={() => nav.navigate('Settings')}>
                    <Ionicons name="settings" size={25} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => nav.navigate('Projects')}>
                    <Ionicons name="folder" size={25} color="#000" />
                </TouchableOpacity>


                <TouchableOpacity onPress={() => nav.navigate('AddProject')}>
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

});
export default WelcomeScreen;
