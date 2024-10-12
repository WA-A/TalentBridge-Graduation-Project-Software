import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons'; 
import {
    ButtonText,
    StyledButton,
} from './../compnent/Style';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Navbar */}
      <View style={styles.navbar}>
        {/* Logo */}
        <Image 
          source={require('./../assets/Talent_Bridge_logo_with_black_border3.png')} 
          style={styles.logo}
        />
        {/* Login and Register buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <StyledButton>
              <ButtonText>Login</ButtonText>
            </StyledButton>
          </TouchableOpacity>
          <TouchableOpacity style={styles.signupButton} onPress={() => navigation.navigate('Signup')}>
            <StyledButton>
              <ButtonText>Sign Up</ButtonText>
            </StyledButton>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#7C7692' }}>
        TalentBridge is Bridging Skills Between Juniors and Professionals
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.contactText}>Contact: +123456789</Text>
        <Text style={styles.footerText}>© 2024 Your Company TalentBridge</Text> 
        {/* Social Media Icons */}
        <View style={styles.socialMediaIcons}>
          <TouchableOpacity>
            <Ionicons name="logo-facebook" size={24} color="#4267B2" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconSpacing}>
            <FontAwesome name="twitter" size={24} color="#1DA1F2" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconSpacing}>
            <FontAwesome name="instagram" size={24} color="#C13584" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconSpacing}>
            <FontAwesome name="linkedin" size={24} color="#0077B5" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 10,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F7F1EF',
    elevation: 3,
  },
  logo: {
    width: 150, 
    height: 100,
    resizeMode: 'contain',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  StyledButton: {
    marginHorizontal: 10, 
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#D2C6C7',
    borderRadius: 5,
  },
  signupButton: {
    marginLeft: 15, 
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flexDirection: width < 768 ? 'column' : 'row',
    justifyContent: width < 768 ? 'center' : 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#F7F1EF',
  },
  footerText: {
    color: '#7C7692',
    textAlign: 'center',
    marginVertical: 5,
  },
  contactText: {
    color: '#7C7692',
    textAlign: width < 768 ? 'center' : 'left',
    marginVertical: 5,
    marginRight: width < 768 ? 0 : 20,
  },
  socialMediaIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  iconSpacing: {
    marginHorizontal: 15,
  },
});

export default WelcomeScreen;
