import { React, useState, useEffect } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { auth, db } from './../FirebaseConfig'
import { sendPasswordResetEmail } from 'firebase/auth'
import { collection, getDocs, query, where } from 'firebase/firestore'

const ForgotPassword = ({ navigation }) => {

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');

    const btnPasswordResetPressed = async () => {

        //check if email field is empty or not
        if (email === '') {
            setEmailError('Email is required.');
            return;
        }

        //check if email already exists in database or not
        const userCollectionRef = collection(db, 'users');
        const userQuery = query(userCollectionRef, where('email', '==', email))
        const getUser = await getDocs(userQuery);
        if (getUser.docs.length === 0) {
            setEmailError('Email is not register.');
            return;
        } else {
            setEmailError('');
            try {
                await sendPasswordResetEmail(auth, email);
                alert('Go to your email inbox and follow the link to reset your password.');
            } catch (error) {
                console.error('Error sending password reset email:', error);
                alert('Failed to send password reset email.');
            }
        }

    }

    return (
        <View style={styles.container}>

            {/* Reset Password Header */}
            <Text style={styles.title}>Reset Password</Text>

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

            {/* Reset Password Email Send Button */}
            <TouchableOpacity style={styles.button} onPress={btnPasswordResetPressed}>
                <Text style={styles.buttonText}>Send</Text>
            </TouchableOpacity>
        </View>
    )
};

export default ForgotPassword;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        padding: 20,
        backgroundColor: '#121212', // Dark background color
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
});