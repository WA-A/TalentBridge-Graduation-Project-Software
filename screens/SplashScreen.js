
// Animation.js
import React, { useEffect, useRef, useState } from 'react';
import { Text, Animated, View, StyleSheet } from 'react-native';

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
  Rectangle,
  StyledLine,
  Circle,
  Circle1,
  Circle2,
  Circle3,
} from './../compnent/Style';
const { brand, darkLight, careysPink, firstColor, secColor, thirdColor, fourhColor, fifthColor } = Colors;


const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('WelcomeScreen');
    }, 3000);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to My App</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: thirdColor
  },
  text: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',

  },
});

export default SplashScreen;
