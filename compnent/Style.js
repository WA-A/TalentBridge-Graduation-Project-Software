// Style.js
import styled from 'styled-components/native';
import Constants from 'expo-constants';
import { Animated } from 'react-native';
export const Colors = {
    primary: "#ffffff",
    primaryDark: "#334664",
    secondary: "#E5E7Eb",
    tertiary: "#334664",
    darkLight: "#9EABCB",
    brand: "#C99FA9",
    careysPink: "#C99FA9",
    wildBlueYonder: "#9EABCB",
    firstColor:"#F7F1EF",
    secColor:"#DACACB",
    thirdColor:"#D2C6C7",
    fourhColor:"#CAC5D8",
    fifthColor:"#7C7692",
    black:"#000000",
};

const { primary, secondary, tertiary, darkLight, brand , careysPink,wildBlueYonder,
    firstColor,secColor,thirdColor,fifthColor,fourhColor,black
} = Colors;

// حساب ارتفاع شريط الحالة
export const StatusBarHeight = Constants.statusBarHeight;

// تعريف StyledContainer
export const StyledContainer = styled.View`
    flex: 1;
    padding: 25px;
    padding-top: ${StatusBarHeight + 10}px;
    background-color: ${primary};
`;

// تعريف InnerContainer
export const InnerContainer = styled.View`
    flex: 1;
    width: 100%;
    align-items: center;
`;

// تعريف PageLogo
export const PageLogo = styled.Image`
    width: 200px;
    height: 200px;
`;

// تعريف PageTitle
export const PageTitle = styled.Text`
    font-size: 30px;
    text-align: center;
    font-weight: bold;
    color: ${brand};
    padding: 10px;
`;

// تعريف SubTitle
export const SubTitle = styled.Text`
    font-size: 18px;
    margin-bottom: 5px;
    letter-spacing: 1px;
    font-weight: bold;
    color: ${tertiary};
    
`;

export const Talent  = styled.Text`
    font-size: 18px;
    margin-bottom: 5px;
    letter-spacing: 1px;
    font-weight: bold;
    color: ${tertiary};
    
`;
export const Bridg = styled.Text`
    font-size: 18px;
    margin-bottom: 5px;
    letter-spacing: 1px;
    font-weight: bold;
    color: ${tertiary};
    
`;
// تعريف StyledFormArea
export const StyledFormArea = styled.View`
    width: 90%;
    
`;

export const StyledTextInput = styled.TextInput`
    background-color: ${secondary};
    padding: 15px;
    padding-left: 55px;
    padding-right: 55px;
    border-radius: 30px;
    font-size: 16px;
    height: 60px;
    margin-top: 3px;
    margin-bottom: 10px;
    color: ${black};
`;

// تعريف StyleInputLabel
export const StyleInputLable = styled.Text`
    color: ${tertiary};
    font-size: 13px;
    text-align: left;
    margin-bottom: 10px;
`;

// تعريف LeftIcon
export const LeftIcon = styled.View`
    left: 8px;
    top: 15px;
    position: absolute;
    z-index: 1;
    height: 40px;  
    width: 40px;
    align-items: center;
    justify-content: center;
`;

// تعريف RightIcon
export const RightIcon = styled.TouchableOpacity`
    right: 12px;
    top: 15px;
    position: absolute;
    z-index: 1;
    align-items: center;
    justify-content: center;
    height: 40px;  
    width: 40px; 
    
`;

// تعريف StyledButton
export const StyledButton = styled.TouchableOpacity`
    padding: 15px;
    background-color: ${brand};
    justify-content: center;
    border-radius: 30px;
    margin-top: 3px;
    margin-bottom: 10px;
        height: 60px;
`;

// تعريف ButtonText
export const ButtonText = styled.Text`
    color: ${primary};
    font-size: 16px;
    font-weight: bold;
    text-align: center;
`;


export const Circle = styled.View`
    width: 100px;
    height: 100px;
    background-color: ${brand}; /* يمكنك تغيير اللون هنا */
    border-radius: 50px; /* لجعل الشكل دائري */
    position: absolute;
    top: ${({ top }) => top || '10px'};
    left: ${({ left }) => left || '10px'};
    right: ${({ right }) => right || 'auto'};
    bottom: ${({ bottom }) => bottom || 'auto'};
    opacity: 0.5; /* يمكنك التحكم في الشفافية */
`;
export const Rectangle = styled.View`
    width: 400px;
    height: 425px;
    background-color: ${brand}; /* يمكنك تغيير اللون هنا */
    border-radius: 5px; /* لجعل الشكل دائري */
    position: absolute;
    top: ${({ top }) => top || '10px'};
    left: ${({ left }) => left || '10px'};
    right: ${({ right }) => right || 'auto'};
    bottom: ${({ bottom }) => bottom || 'auto'};
    opacity: 0.5; /* يمكنك التحكم في الشفافية */
`;
export const StyledLine = styled.View`
    border-bottom-color: ${props => props.color || '#000'}; /* لون الخط الافتراضي هو الأسود */
    border-bottom-width: ${props => props.width || '1px'}; /* سمك الخط الافتراضي هو 1px */
    margin: ${props => props.margin || '10px 0'}; /* المسافة الافتراضية حول الخط */
    width: ${props => props.width || '7%'}; /* طول الخط */
`;
