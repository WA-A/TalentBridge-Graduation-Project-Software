// Animation.js
import { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';

// دالة تأثير الخط
export const useLineEffect = () => {
    const width = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const loopAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(width, {
                    toValue: 30, // العرض النهائي
                    duration: 2000, // مدة الظهور
                    useNativeDriver: false,
                }),
                Animated.timing(width, {
                    toValue: 0, // إرجاع العرض إلى 0 (لإخفاء الخط)
                    duration: 3000, // مدة الاختفاء
                    useNativeDriver: false,
                }),
                Animated.delay(2000),
            ])
        );
        loopAnimation.start();
        
        return () => loopAnimation.stop();
    }, [width]);

    return width;
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
