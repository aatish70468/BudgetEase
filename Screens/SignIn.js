import { auth } from './../FirebaseConfig'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';

const SignInScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);

    //signIn button pressed
    const btnSignInPressed = async () => {

        if (!email.includes('@')) {
            setEmailError('Please enter a valid email.');
        } else {
            setEmailError('');
        }

        if (password.length < 6) {
            setPasswordError('Password must be at least 6 characters.');
        } else {
            setPasswordError('');
        }

        try {
            if (emailError === '' && passwordError === '') {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                if (userCredential.user) {
                    navigation.navigate('Home');
                }
            }
        } catch (err) {
            console.error('Failed to sign in:', err);
            alert('Invaild Credential')
        }
    }

    //button to navigate to signUp page for creating account
    const btnSignUpPressed = () => {
        navigation.replace('SignUp');
    }

    //button to navigate to forgotPassword page
    const btnForgotPasswordPressed = () => {
        navigation.navigate('ForgotPassword');
    }

    return (
        <View style={styles.container}>
            {/* Logo */}
            <Image source={require('./../assets/logo.png')} style={styles.logo} />

            {/* Sign In Header */}
            <Text style={styles.title}>Sign In</Text>

            {/* Input Fields */}
            <View style={[styles.inputContainer, emailError ? styles.inputError : null]}>
                <Ionicons name="mail" size={20} color="#888" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#888"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                />
            </View>
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

            <View style={[styles.inputContainer, passwordError ? styles.inputError : null]}>
                <Ionicons name="lock-closed" size={20} color="#888" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#888"
                    secureTextEntry={!passwordVisible}
                    value={password}
                    onChangeText={setPassword}
                />
                <Ionicons name={ passwordVisible ? 'eye' : 'eye-off' } size={20} color="#888" style={styles.icon} onPress={() => setPasswordVisible(!passwordVisible)} />
            </View>
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

            {/* Sign In Button */}
            <TouchableOpacity style={styles.button} onPress={btnSignInPressed}>
                <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>

            {/* Forgot Password Link */}
            <TouchableOpacity onPress={() => btnForgotPasswordPressed()}>
                <Text style={styles.linkText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
                <View style={styles.line}></View>
                <Text style={styles.orText}>OR</Text>
                <View style={styles.line}></View>
            </View>

            {/* Improved Social Media Login */}
            <View style={styles.socialButtons}>
                <TouchableOpacity style={[styles.socialButton, styles.googleButton]}>
                    <Image source={require('./../assets/google.png')} style={styles.socialIcon} />
                    <Text style={styles.socialText}>Continue with Google</Text>
                </TouchableOpacity>
            </View>

            {/* Sign Up Link */}
            <TouchableOpacity onPress={() => btnSignUpPressed()}>
                <Text style={styles.signUpText}>Don't have an account? Sign Up</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#121212', // Dark background color
    },
    logo: {
        width: 100,
        height: 100,
        alignSelf: 'center',
        marginBottom: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff', // Light text for dark background
        textAlign: 'center',
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#444',
        backgroundColor: '#1C1C1E',
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
    },
    icon: {
        marginRight: 10,
        color: '#fff'
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#fff', // Light text color for inputs
    },
    inputError: {
        borderColor: '#FF4D4F', // Red border for error
    },
    errorText: {
        color: '#FF4D4F',
        fontSize: 12,
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#4285F4',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 5, // For Android shadow
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    linkText: {
        color: '#4285F4',
        textAlign: 'center',
        marginTop: 15,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#333',
    },
    orText: {
        color: '#888',
        marginHorizontal: 10,
        fontSize: 16,
    },
    socialButtons: {
        marginBottom: 30,
    },
    socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 12,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOpacity: 0.7,
        shadowRadius: 8,
        shadowOffset: { width: 10, height: 4 },
        elevation: 3,
    },
    googleButton: {
        backgroundColor: '#fff',
        borderColor: '#ddd',
        borderWidth: 1,
    },
    socialIcon: {
        width: 24,
        height: 24,
        marginRight: 10,
    },
    socialText: {
        color: '#333',
        fontSize: 16,
        fontWeight: '500',
    },
    signUpText: {
        textAlign: 'center',
        color: '#fff',
        marginTop: 10,
    },
});

export default SignInScreen;