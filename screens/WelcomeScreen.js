import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
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

} from './../compnent/Style';
//icon 
import {
  FontAwesome, Ionicons, AntDesign
  , FontAwesome6, MaterialCommunityIcons, FontAwesome5Brands
} from '@expo/vector-icons';

//formik
import { Formik } from 'formik';
import styled from 'styled-components/native';

//color
const { brand, darkLight, careysPink, firstColor, secColor, thirdColor, fourhColor, fifthColor, primary, tertiary } = Colors; import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'space-between', backgroundColor: '#ffff' }}>
      {/* Navbar */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#F7F1EF', elevation: 3 }}>
        {/* Logo */}
        <Image
          source={require('./../assets/Talent_Bridge_logo_with_black_border3.png')}
          style={{ width: 150, height: 100, resizeMode: 'contain' }}
        />
        {/* Login and Register buttons */}
        <View style={{ flexDirection: 'row' }}>
          <StyledButton onPress={() => navigation.navigate('Login')}>
            <ButtonText>Login</ButtonText>
          </StyledButton>
          <StyledButton onPress={() => navigation.navigate('Signup')} style={{ backgroundColor: fifthColor }}>
            <ButtonText>Sign Up</ButtonText>
          </StyledButton>
        </View>
      </View>

      {/* Main Content */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: brand }}>
          TalentBridge is Bridging Skills Between Juniors and Professionals
        </Text>
      </View>

      {/* Footer */}
      <View style={{ flexDirection: width < 768 ? 'column' : 'row', justifyContent: width < 768 ? 'center' : 'space-between', alignItems: 'center', padding: 15, backgroundColor: '#F7F1EF' }}>
        <Text style={{ color: fifthColor, textAlign: 'center', marginVertical: 5 }}>Contact: +123456789</Text>
        <Text style={{ color: fifthColor, textAlign: 'center', marginVertical: 5 }}>© 2024 Your Company TalentBridge</Text>
        {/* Social Media Icons */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 10 }}>
          <TouchableOpacity>
            <Ionicons name="logo-facebook" size={24} color="#4267B2" />
          </TouchableOpacity>
          <TouchableOpacity style={{ marginHorizontal: 15 }}>
            <FontAwesome name="twitter" size={24} color="#1DA1F2" />
          </TouchableOpacity>
          <TouchableOpacity style={{ marginHorizontal: 15 }}>
            <FontAwesome name="instagram" size={24} color="#C13584" />
          </TouchableOpacity>
          <TouchableOpacity style={{ marginHorizontal: 15 }}>
            <FontAwesome name="linkedin" size={24} color="#0077B5" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default WelcomeScreen;
///