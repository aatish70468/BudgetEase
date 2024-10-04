import React from "react"
import { useEffect, useState, useRef} from "react"
import { StyleSheet, Dimensions, ImageBackground, Easing, Animated, View } from "react-native"

const { width } = Dimensions.get('window');

const Splash = ({ navigation }) => {
    const logoAnim = useRef(new Animated.Value(width)).current;
    const logoScale = useRef(new Animated.Value(1)).current;
    const textAnim = useRef(new Animated.Value(0)).current;
  
    useEffect(() => {
      Animated.sequence([
        // Move car from right to center
        Animated.timing(logoAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
        // Enlarge car
        Animated.timing(logoScale, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: true,
        }),
        // Animate text
        Animated.timing(textAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.elastic(1),
          useNativeDriver: true,
        }),
      ]).start();
  
      const timeout = setTimeout(() => {
        navigation.replace('SignIn');
      }, 3800);
  
      return () => clearTimeout(timeout);
    }, [logoAnim, logoScale, textAnim, navigation]);
  
    const textStyle = {
      opacity: textAnim,
      transform: [
        {
          translateY: textAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [50, 0],
          }),
        },
        {
          scale: textAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.5, 1],
          }),
        },
      ],
    };
  
    return (
  <ImageBackground
            source={require('../assets/main.png')}
            style={styles.backgroundImage}
            resizeMode="cover"
          >
            <View style={styles.container}>
          <Animated.Image
            source={require('../assets/logo.png')}
            style={[
                styles.logo,
              {
                transform: [
                  { translateX: logoAnim },
                  { scale: logoScale }
                ],
              },
            ]}
          />
           
      <Animated.Text style={[styles.title, textStyle, {backgroundColor: 'transparent'}]}>
        Welcome To Budgetease
      </Animated.Text>
      </View>
      </ImageBackground>
        
    );
  };
  
  export default Splash;

  const styles = StyleSheet.create({
      backgroundImage: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          width: '100%'
      },
      container: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
      },
      logo: {
          width: 300,
          height: 200,
          resizeMode: 'contain',
      },
      title: {
          fontSize: 35,
          color: 'white'
      },
  });