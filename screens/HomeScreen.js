import React, { useState, useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Animated } from 'react-native';
import { Ionicons, Feather, FontAwesome5, EvilIcons, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Dimensions } from 'react-native';
import { useFonts } from 'expo-font';
import { NightModeContext } from './NightModeContext';

import { Colors,
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
    InteractionText,} from './../compnent/Style'
// Color constants
const { secondary, primary, careysPink, darkLight, fourhColor,tertiary ,fifthColor} = Colors;
const { width } = Dimensions.get('window');

const HomeScreen = () => {
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
            <View style={{ height: 20, backgroundColor: isNightMode ? "#000" :secondary }} />

            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, paddingVertical: 10,backgroundColor: isNightMode ? "#000" :secondary }}>
            <Text style={{ fontFamily: 'Updock-Regular', fontSize: 30, position: 'absolute', left: 0, right: 0, textAlign: 'center',color: isNightMode ? primary :"#000" }}>
                    Talent Bridge
                </Text>


                <TouchableOpacity onPress={() => nav.navigate('Chat')}>
                    <EvilIcons name="sc-telegram" size={39} color={careysPink} style={{ position: 'absolute', top: -20,left:10 }} />
                    <EvilIcons name="sc-telegram" size={37} color={darkLight} style={{ position: 'absolute', top: -20,left:10  }} />
                </TouchableOpacity>


                <TouchableOpacity onPress={toggleNightMode}>
                    <View style={{ position: 'relative', width: 50, height: 50 }}>
                        <Ionicons name={isNightMode ? "sunny" : "moon"} size={25} color={darkLight} style={{ position: 'absolute', top: 9, right: 20 }} />
                        <Ionicons name="cloud" size={30.7} color={ isNightMode ? "#000" :secondary} style={{ position: 'absolute', top: 8.7, left: -12 }} />
                        <Ionicons name="cloud" size={27} color={careysPink} style={{ position: 'absolute', top: 11, left: -11 }} />
                    </View>
                </TouchableOpacity>
            </View>

            {/* Icon Navigation */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, paddingVertical: 10, backgroundColor: fourhColor, elevation: 3 }}>
                <TouchableOpacity onPress={() => nav.navigate('Search')}>
                    <Ionicons name="search" size={25} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => nav.navigate('notifications')}>
                    <Ionicons name="notifications" size={25} color={secondary} />
                </TouchableOpacity>
            </View>

            {/* Main Content */}
            <Animated.ScrollView
                style={{ flex: 1, backgroundColor: isNightMode ? "#000" : primary }}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
            >
                {Array(5).fill().map((_, index) => (
                    <ContainerCard key={index}>
                        <Card style={{ backgroundColor: isNightMode ? "#454545" :secondary  }}>
                            <UserInfo>
                                <UserIMg source={require('./../assets/img1.jpeg')} />
                                <UserInfoText>
                                    <UserName style={{ color: isNightMode ? primary : "#000" }} >Sama Abosair</UserName>
                                    <PostTime>4 hours ago</PostTime>
                                </UserInfoText>
                            </UserInfo>
                            <PostText style={{ color: isNightMode ? primary : "#000" }} >Hello This is a test post</PostText>
                            <PostIMg source={require('./../assets/img1.jpeg')} />
                            <ReactionOfPost>
                                <Interaction>
                                    <Ionicons style={{ color: isNightMode ? secondary : 'rgba(0, 0, 0, 0.2)' }}  name="heart-circle" size={25} />
                                    <InteractionText style={{ color: isNightMode ? primary : "#000" }}>Like</InteractionText>
                                </Interaction>
                                <Interaction>
                                    <Ionicons style={{ color: isNightMode ? secondary : 'rgba(0, 0, 0, 0.2)' }} name="chatbubbles" size={23} />
                                    <InteractionText style={{ color: isNightMode ? primary : "#000" }}>Comment</InteractionText>
                                </Interaction>
                            </ReactionOfPost>
                        </Card>
                    </ContainerCard>
                ))}
            </Animated.ScrollView>

            {/* Bottom Navigation Bar */}
            <Animated.View
                style={{
                    transform: [{ translateY: bottomBarTranslate }],
                    backgroundColor: isNightMode ? "#454545" :secondary ,
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    padding: 10,
                    elevation: 3,
                    position: 'absolute',
                    bottom: 0,
                    width: '100%',
                }}
            >
                <TouchableOpacity onPress={toggleNightMode}>
                    <Ionicons name="settings" size={25} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => nav.navigate('Projects')}>
                    <Ionicons name="folder" size={25} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => nav.navigate('Profile')}>
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

export default HomeScreen;
