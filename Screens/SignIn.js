import { React, useState, useEffect } from "react"
import { KeyboardAvoidingView, SafeAreaView, StyleSheet, Text, TextInput, View, TouchableOpacity, Platform } from "react-native"
import { auth } from './../FirebaseConfig'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { Ionicons } from '@expo/vector-icons'

const SignIn = ({ navigation }) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState('');

    //signIn button pressed
    const btnSignInPressed = async () => {
        try {
            if (!email || !password) {
                alert('Please fill in all fields');
                return;
            } else {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                if (userCredential.user) {
                    navigation.replace('Home');
                }
                setError('');
            }
        } catch (err) {
            setError(err.message);
        }
    }

    //button to navigate to signUp page for creating account
    const btnSignUpPressed = () => {
        navigation.navigate('SignUp');
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}>
                <View style={styles.innerContainer}>
                    <Text style={styles.title}>Sign In to Continue</Text>

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
                            returnKeyType="done"
                            secureTextEntry={true}
                            onChangeText={text => setPassword(text)}
                            value={password}
                        />
                    </View>

                    {error && <Text style={styles.error}>{error}</Text>}

                    <Text onPress={btnSignUpPressed} style={styles.signUpText}>
                        Don't have an account? Sign up here
                    </Text>

                    <TouchableOpacity onPress={btnSignInPressed} style={styles.signInButton}>
                        <Text style={styles.signInButtonText}>Sign In</Text>
                    </TouchableOpacity>

                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
};

export default SignIn;

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
    signUpText: {
        color: '#007BFF',
        textAlign: 'center',
        marginVertical: 15,
    },
    signInButton: {
        backgroundColor: '#007BFF',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    signInButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
