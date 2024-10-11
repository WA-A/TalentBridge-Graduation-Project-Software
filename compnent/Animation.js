// Animation.js
import React, { useEffect, useRef ,useState} from 'react';
import { Animated, View, StyleSheet } from 'react-native';
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
const { brand, darkLight,careysPink,firstColor,secColor,thirdColor,fourhColor,fifthColor } = Colors;

export const useLineEffect = () => {
    const width = useRef(new Animated.Value(0)).current; // Create an animated value

    useEffect(() => {
        const loopAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(width, {
                    toValue: 30, // final width
                    duration: 2000, // duration of appearance
                    useNativeDriver: false,
                }),
                Animated.timing(width, {
                    toValue: 0, // reset width to 0 (hide line)
                    duration: 3000, // duration of disappearance
                    useNativeDriver: false,
                }),
                Animated.delay(2000),
            ])
        );
        loopAnimation.start();

        // Clean up on unmount
        return () => loopAnimation.stop();
    }, [width]);

    return width; // Return the animated width
};

// دالة تأثير الكتابة
export const useTypingEffect = (fullText, typingSpeed = 200) => {
    const [text, setText] = useState('');
    const [index, setIndex] = useState(0);
    const animationValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const interval = setInterval(() => {
            if (index < fullText.length) {
                setText((prev) => prev + fullText[index]);
                setIndex((prev) => prev + 1);
            } else {
                clearInterval(interval);
                Animated.timing(animationValue, {
                    toValue: -300,
                    duration: 2000,
                    useNativeDriver: true,
                }).start(() => {
                    setText('');
                    setIndex(0);
                    animationValue.setValue(0);
                });
            }
        }, typingSpeed);

        return () => clearInterval(interval);
    }, [index]);

    return { text, animationValue };
};



export const AnimatedCircles = () => {
    const opacity1 = useRef(new Animated.Value(0)).current; // دائرة 1
    const opacity2 = useRef(new Animated.Value(0)).current; // دائرة 2
    const opacity3 = useRef(new Animated.Value(0)).current; // دائرة 3
    const opacity4 = useRef(new Animated.Value(0)).current; // دائرة 4

    // دالة لتحريك الدوائر
    const animateCircles = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(opacity1, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true
          }),
          Animated.timing(opacity1, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(opacity2, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(opacity2, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
  
        ])
      ).start();
    };
  
    useEffect(() => {
      animateCircles();
    }, []);
  
    return (
      <>

<Animated.View style={{ opacity: opacity1 }}>
  <Circle top="10px" left="-160px" />
  <Circle1 top="10px" left="170px" />
  <Circle2 top="50px" left="-180px" />
  <Circle2 top="50px" left="100px" />
  <Circle top="150px" left="-100px" />
  <Circle1 top="250px" left="0px" />
  <Circle2 top="250px" left="-100px" />
   <Circle3 top="10px" left="-100px" />
  <Circle top="10px" left="50px" />
  <Circle1 top="50px" left="-100px" />
  <Circle2 top="50px" left="200px" />
  <Circle3 top="150px" left="0px" />
  <Circle top="150px" left="170px" />
  <Circle1 top="220px" left="100px" />
  <Circle top="10px" left="0px" />
  <Circle1 top="50px" left="0px" />
  <Circle2 top="150px" left="-180px" />
  <Circle top="150px" left="100px" />
  <Circle1 top="250px" left="-180px" />
  <Circle3 top="250px" left="170px" />
  <Circle top="150px" left="-100px" />
  <Circle top="250px" left="0px" />
  <Circle2 top="250px" left="-100px" />
   <Circle3 top="10px" left="-100px" />
   <Circle1 top="280px" left="70px" />
  <Circle top="300px" left="100px" />
  <Circle3 top="300px" left="-170px" />
   <Circle1 top="320px" left="20px" />
  
</Animated.View>

<Animated.View style={{ opacity: opacity2 }}>
<Circle top="10px" left="-150px" />
  <Circle2 top="10px" left="130px" />
  <Circle1 top="10px" left="90px" />
  <Circle top="10px" left="10px" />
  <Circle3 top="50px" left="-150px" />
  <Circle1 top="120px" left="0px" />
  <Circle2 top="250px" left="-100px" />
   <Circle3 top="250px" left="-100px" />
  <Circle top="250px" left="50px" />
  <Circle1 top="50px" left="-100px" />
  <Circle2 top="50px" left="180px" />
  <Circle3 top="150px" left="0px" />
  <Circle top="150px" left="170px" />
  <Circle1 top="220px" left="100px" />
  <Circle1 top="50px" left="0px" />
  <Circle2 top="150px" left="-180px" />
  <Circle top="150px" left="100px" />
  <Circle1 top="150px" left="-10px" />
  <Circle top="150px" left="-100px" />
  <Circle1 top="250px" left="150px" />
  <Circle2 top="230px" left="-170px" />
   <Circle top="150px" left="100px" />
  <Circle2 top="300px" left="0px" />
  <Circle3 top="300px" left="170px" />
  <Circle3 top="280px" left="70px" />
  <Circle top="300px" left="100px" />
  <Circle3 top="300px" left="-170px" />
   <Circle1 top="320px" left="20px" />
  
</Animated.View>

        {/* أضف المزيد من ا
        لدوائر حسب الحاجة */}
      </>
    );
  };
  