import { React, useState } from "react"
import { KeyboardAvoidingView, SafeAreaView, StyleSheet, Text, TextInput, View, TouchableOpacity, Platform } from "react-native"
import { auth, db } from './../FirebaseConfig'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { collection, doc, setDoc } from 'firebase/firestore'
import { Ionicons } from '@expo/vector-icons'

const SignUp = ({ navigation }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cnfPassword, setCnfPassword] = useState('');
    const [error, setError] = useState('');
    const [name, setName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('');

    //signUp button pressed
    const btnSignUpPressed = async () => {
        try {
            if (!email || !password || !name || !phoneNumber) {
                alert('Please fill in all fields');
                return;
            } else if (password !== cnfPassword) {
                alert('Passwords do not match');
                return;
            } else {
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
                navigation.replace('Home');
                setError('');
            }
        } catch (err) {
            console.error('Failed to sign up:', err);
            setError(err.message);
        }
    }

    //user already has an account then navigate to signIn screen
    const btnAlreadyHaveAccount = () => (
        navigation.replace('SignIn')
    )

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}>
                <View style={styles.innerContainer}>
                    <Text style={styles.title}>Create an Account</Text>

                    <View style={styles.inputContainer}>
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

                    <View style={styles.inputContainer}>
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

                    <View style={styles.inputContainer}>
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

                    <View style={styles.inputContainer}>
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

                    <View style={styles.inputContainer}>
                        <Ionicons name="call" size={24} color="#333" style={styles.icon} />
                        <TextInput
                            placeholder="Enter your phone number (+11234567890)"
                            placeholderTextColor="#999"
                            style={styles.input}
                            textContentType="telephoneNumber"
                            autoCapitalize="none"
                            returnKeyType="next"
                            onChangeText={text => setPhoneNumber(text)}
                            value={phoneNumber}
                        />
                    </View>

                    {error && <Text style={styles.error}>{error}</Text>}

                    <Text onPress={btnAlreadyHaveAccount} style={styles.signInText}>
                        Already have an account? Sign In here
                    </Text>

                    <TouchableOpacity onPress={btnSignUpPressed} style={styles.signUpButton}>
                        <Text style={styles.signUpButtonText}>Sign Up</Text>
                    </TouchableOpacity>

                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
};

export default SignUp;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    innerContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 20,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 10,
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 10,
    },
    signInText: {
        color: '#007BFF',
        textAlign: 'center',
        marginVertical: 15,
    },
    signUpButton: {
        backgroundColor: '#007BFF',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    signUpButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
