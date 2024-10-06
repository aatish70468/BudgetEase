import { React, useState, useEffect } from "react"
import { KeyboardAvoidingView, SafeAreaView, StyleSheet, Text, TextInput, View, TouchableOpacity, Platform, Image } from "react-native"
import { auth, db } from './../FirebaseConfig'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { collection, doc, setDoc, query, where, getDocs } from 'firebase/firestore'
import { Ionicons } from '@expo/vector-icons'

const SignUp = ({ navigation }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cnfPassword, setCnfPassword] = useState('');
    const [name, setName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [cnfPasswordError, setCnfPasswordError] = useState('')
    const [nameError, setNameError] = useState('');
    const [phoneNumberError, setPhoneNumberError] = useState('');


    useEffect(() => {
        checkPasswordAndCnfPasswordSame();
    }, [name, email, password, cnfPassword, phoneNumber])

    useEffect(() => {
        checkAlreadyEmailInDatabase();
    }, [email])

    const checkPasswordAndCnfPasswordSame = () => {
        if (!email.includes('@')) {
            setEmailError('Please enter a valid email address');
        } else {
            setEmailError('');
        }

        if (password.length < 6) {
            setPasswordError('Password must be at least 6 characters long');
        } else {
            setPasswordError('');
        }

        if (!name.match(/^[a-zA-Z ]+$/)) {
            setNameError('Name should only contain letters and spaces');
        } else {
            setNameError('');
        }

        if (!phoneNumber.match(/^\+1[- ]\d{3}[- ]\d{3}[- ]\d{4}$/)) {
            setPhoneNumberError('Please enter a valid phone number (+1-XXX-XXX-XXXX)');
        } else {
            setPhoneNumberError('');
        }

        if (password !== cnfPassword) {
            setCnfPasswordError('Passwords do not match');
        } else {
            setCnfPasswordError('');
        }
    }

    //check if the email is already signUp or not
    const checkAlreadyEmailInDatabase = async () => {
        const userCollectionRef = collection(db, 'users');
        const userQuery = query(userCollectionRef, where('email', '==', email))
        const getUser = await getDocs(userQuery);
        if (getUser.docs.length > 0) {
            setEmailError('Email is already registered');
        }
    }

    //signUp button pressed
    const btnSignUpPressed = async () => {

        checkPasswordAndCnfPasswordSame();

        try {
            if (emailError === '' && passwordError === '' && cnfPasswordError === '' && nameError === '' && phoneNumberError === '') {

                //create user
                setEmailError('');
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const userID = userCredential.user.uid;
                const userCollectionRef = collection(db, 'users');
                const userDocRef = doc(userCollectionRef, email);

                const addUserData = {
                    id: userID,
                    name: name,
                    email: email,
                    phoneNumber: phoneNumber
                }

                await setDoc(userDocRef, addUserData)
                console.log(`Signed up successfully with id: ${userID}`)
                navigation.navigate('Home');
            }
        } catch (err) {
            console.error('Failed to sign up:', err);
        }
    }

    //user already has an account then navigate to signIn screen
    const btnAlreadyHaveAccount = () => (
        navigation.replace('SignIn')
    )

    return (
        <View style={styles.container}>

            {/* Logo */}
            <Image source={require('./../assets/logo.png')} style={styles.logo} />

            {/* SignUp Header */}
            <Text style={styles.title}>Create Account</Text>

            {/* Input Fields*/}

            <View style={[styles.inputContainer, nameError ? styles.inputError : null]}>
                <Ionicons name="person" size={24} color="#333" style={styles.icon} />
                <TextInput
                    placeholder="Enter your name"
                    placeholderTextColor="#999"
                    style={styles.input}
                    textContentType="familyName"
                    autoCapitalize="none"
                    returnKeyType="next"
                    onChangeText={text => setName(text)}
                    value={name}
                />
            </View>
            {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

            <View style={[styles.inputContainer, emailError ? styles.inputError : null]}>
                <Ionicons name="mail" size={24} color="#333" style={styles.icon} />
                <TextInput
                    placeholder="Enter email"
                    placeholderTextColor="#999"
                    style={styles.input}
                    textContentType="emailAddress"
                    autoCapitalize="none"
                    returnKeyType="next"
                    onChangeText={text => setEmail(text)}
                    value={email}
                />
            </View>
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

            <View style={[styles.inputContainer, passwordError ? styles.inputError : null]}>
                <Ionicons name="lock-closed" size={24} color="#333" style={styles.icon} />
                <TextInput
                    placeholder="Enter password"
                    placeholderTextColor="#999"
                    style={styles.input}
                    textContentType="password"
                    autoCapitalize="none"
                    returnKeyType="next"
                    secureTextEntry={true}
                    onChangeText={text => setPassword(text)}
                    value={password}
                />
            </View>
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

            <View style={[styles.inputContainer, cnfPasswordError ? styles.inputError : null]}>
                <Ionicons name="lock-closed" size={24} color="#333" style={styles.icon} />
                <TextInput
                    placeholder="Confirm your password"
                    placeholderTextColor="#999"
                    style={styles.input}
                    textContentType="password"
                    autoCapitalize="none"
                    returnKeyType="next"
                    secureTextEntry={true}
                    onChangeText={text => setCnfPassword(text)}
                    value={cnfPassword}
                />
            </View>
            {cnfPasswordError ? <Text style={styles.errorText}>{cnfPasswordError}</Text> : null}

            <View style={[styles.inputContainer, phoneNumberError ? styles.inputError : null]}>
                <Ionicons name="call" size={24} color="#333" style={styles.icon} />
                <TextInput
                    placeholder="Enter your phone number (+1-123-456-7890)"
                    placeholderTextColor="#999"
                    style={styles.input}
                    textContentType="telephoneNumber"
                    autoCapitalize="none"
                    returnKeyType="next"
                    onChangeText={text => setPhoneNumber(text)}
                    value={phoneNumber}
                />
            </View>
            {phoneNumberError ? <Text style={styles.errorText}>{phoneNumberError}</Text> : null}

            <TouchableOpacity onPress={btnSignUpPressed} style={styles.button}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            {/* SignIn Link */}
            <TouchableOpacity onPress={btnAlreadyHaveAccount}>
                <Text style={styles.signInText}>Already have an account? Sign In</Text>
            </TouchableOpacity>


        </View>
    )
};

export default SignUp;

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
        marginBottom: 30,
        alignSelf: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
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
        color: '#fff'
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
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    signInText: {
        textAlign: 'center',
        color: '#fff',
        marginTop: 20,
    },
});
