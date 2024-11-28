// Style.js
import styled from 'styled-components/native';
import Constants from 'expo-constants';
import { Dimensions } from 'react-native';

export const Colors = {
    primary: "#ffffff",
    primaryDark: "#334664",
    secondary: "#E5E7Eb",
    tertiary: "#334664",
    darkLight: "#9EABCB",
    brand: "#C99FA9",
    careysPink: "#F7A8B8",
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
    background-color: ${primary};
    padding: 15px;
    padding-left: 55px;
    padding-right: 55px;
    border-radius: 30px;
    font-size: 16px;
    height: 60px;
    margin-top: 3px;
    margin-bottom: 10px;
    color: ${black};
    border: 1px solid ;
`;

export const StyledTextInputSignUp = styled.TextInput`
    background-color: ${secondary};
    color: ${darkLight};  /* لون النص */
    border: 2px solid #ccc;  /* الحدود */
    padding-left: 55px;
    padding-right: 55px;
    border-radius: 30px;
    font-size: 16px;
    height: 53px;
    margin-top: 0px;
    margin-bottom: 0px;
    color: ${black};
    border: 1px solid ;
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
export const RightIcon2 = styled.TouchableOpacity`
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
    background-color: ${fifthColor};
    justify-content: center;
    border-radius: 30px;
    height: 60px;
    border: 1px solid white;
    margin-top: 2pxj;
`;

// تعريف ButtonText
export const ButtonText = styled.Text`
    color: ${primary};
    font-size: 16px;
    font-weight: bold;
    text-align: center;
`;


export const Circle = styled.View`
    width: 5px;
    height: 30px;
    background-color: ${fifthColor}; /* يمكنك تغيير اللون هنا */
    border-radius: 50px; /* لجعل الشكل دائري */
    position: absolute;
    top: ${({ top }) => top || '10px'};
    left: ${({ left }) => left || '10px'};
    right: ${({ right }) => right || 'auto'};
    bottom: ${({ bottom }) => bottom || 'auto'};
    opacity: 0.5; /* يمكنك التحكم في الشفافية */
`;
export const Circle1 = styled.View`
    width: 40px;
    height: 10px;
    background-color: ${primary}; /* يمكنك تغيير اللون هنا */
    border-radius: 10px; /* لجعل الشكل دائري */
    position: absolute;
    top: ${({ top }) => top || '10px'};
    left: ${({ left }) => left || '10px'};
    right: ${({ right }) => right || 'auto'};
    bottom: ${({ bottom }) => bottom || 'auto'};
    opacity: 0.5; /* يمكنك التحكم في الشفافية */
`;
export const Circle2 = styled.View`
    width: 50px;
    height: 50px;
    background-color: ${careysPink}; /* يمكنك تغيير اللون هنا */
    border-radius: 50px; /* لجعل الشكل دائري */
    position: absolute;
    top: ${({ top }) => top || '10px'};
    left: ${({ left }) => left || '10px'};
    right: ${({ right }) => right || 'auto'};
    bottom: ${({ bottom }) => bottom || 'auto'};
    opacity: 0.5; /* يمكنك التحكم في الشفافية */
`;
export const Circle3 = styled.View`
    width: 20px;
    height: 20px;
    background-color: ${tertiary}; /* يمكنك تغيير اللون هنا */
    border-radius: 50px; /* لجعل الشكل دائري */
    position: absolute;
    top: ${({ top }) => top || '10px'};
    left: ${({ left }) => left || '10px'};
    right: ${({ right }) => right || 'auto'};
    bottom: ${({ bottom }) => bottom || 'auto'};
    opacity: 0.5; /* يمكنك التحكم في الشفافية */
`;

const { width, height } = Dimensions.get('window');

export const Rectangle = styled.View`
   width: ${width}px; /* عرض الشاشة */
   height: ${height/1.65}px; /* ارتفاع الشاشة */
    background-color: ${fourhColor}; /* يمكنك تغيير اللون هنا */
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


export const pickerStyle = {
    height: 50,
    width: '30%',
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: secColor,
    marginVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10, // لا تكرر تعيين الـ borderRadius
};


export const labelStyle = {
    fontSize: 16,
    fontWeight: 'bold',
    color: black, 
    marginBottom: 5, 
    left:10 ,

};

export const labelStyleWep = {
    fontSize: 16,
    fontWeight: 'bold',
    color: black, 
    left:10 ,

};

export const Card = styled.View`
width: 100%;
border-radius: 10px;
`;
export const ContainerCard = styled.View`
flex: 1;
align-items: center;
padding: 5px;

`;

export const UserInfo =styled.View`
flex-direction: row;
justify-content: flex-start;
padding: 15px;
`;
export const UserIMg = styled.Image`
width: 50px;
height: 50px;
border-radius: 25px;
`;

export const UserInfoText = styled.View`
flex-direction: column;
justify-content: center;
margin-left: 10px;
`;
export const UserName =styled.Text`
font-size: 14px;
font-weight: bold;
font-family: 'Lato-Regular' ;
`;


export const PostTime = styled.Text`
font-size: 12px;
font-family: 'Lato-Regular' ;
color:${darkLight};
`;

export const PostText =styled.Text`
font-size: 14px;
font-family: 'Lato-Regular' ;
padding-left: 15px;
padding-right: 15px;
`;

export const PostIMg = styled.Image`
    width: 100%;
    height: auto;
    aspect-ratio: 16/9;
    margin-top: 15;
`;


export const ReactionOfPost = styled.View`
flex-direction: row;
justify-content: space-around;
padding: 15px;
`;



export const Interaction = styled.TouchableOpacity`
flex-direction: row;
justify-content: center;
border-radius: 5px;
padding: 10px 5px;
`;

export const InteractionText = styled.Text`
font-size:12px;
font-weight: bold;
font-family: 'Lato-Regular' ;
margin-top: 5px;
margin-left: 5px;
`;

