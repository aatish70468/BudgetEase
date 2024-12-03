import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { auth, db, storage } from './../../FirebaseConfig';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, doc, onSnapshot, query, where, updateDoc } from 'firebase/firestore';

export default function App() {
  const [image, setImage] = useState(null);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    getLibraryPermission();
    userDataFromDatabase();
  }, []);

  const getLibraryPermission = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  }

  const userDataFromDatabase = async () => {
    const collectionRef = collection(db, 'users');
    const getUserDoc = query(collectionRef, where('id', '==', auth.currentUser.uid));

    onSnapshot(getUserDoc, (snapshot) => {

      const user = snapshot.docs.map(doc => {
        setEmail(doc.data().email)
        setName(doc.data().name);
        setPhoneNumber(doc.data().phoneNumber);
        setImage(doc.data().photoURL)
      })
    })
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      console.log(`URL: ${result.assets[0].uri}`);

      // Uploading the image to Firebase Storage
      const imageRef = ref(storage, `images/${result.assets[0].uri.split('/').pop()}`);
      const uploadTask = uploadBytesResumable(imageRef, result.assets[0]);

      uploadTask.on('state_changed', (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload progress: ', progress);
      }, (error) => {
        console.error('Error uploading image: ', error);
      }, async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setImage(downloadURL)
        console.log('Image uploaded to Firebase Storage!', downloadURL);
      });
    }
  };

  const btnUpdatePressed = async () => {
    if (name && email && phoneNumber) {
      // Adding user data to Firebase Firestore
      const userCollectionRef = collection(db, 'users');
      const userDocRef = doc(userCollectionRef, email)
      const addUserData = {
        photoURL: image,
        name: name,
        email: email,
        phoneNumber: phoneNumber
      };

      await updateDoc(userDocRef, addUserData);

      alert('Profile updated successfully!');
    } else {
      alert('Please fill all the fields.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.content}>
          <View style={styles.formContainer}>
            <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
              {image ? (
                <Image source={{ uri: image }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <FontAwesome name="camera" size={40} color="#A0AEC0" />
                  <Text style={styles.avatarText}>Add Photo</Text>
                </View>
              )}
            </TouchableOpacity>
            <View style={styles.inputContainer}>
              <FontAwesome name="user" size={20} color="#CBD5E0" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Name"
                placeholderTextColor="#A0AEC0"
                onChangeText={setName}
                value={name}
              />
            </View>
            <View style={styles.inputContainer}>
              <FontAwesome name="envelope" size={20} color="#CBD5E0" style={styles.icon} />
              <TextInput
                style={[styles.input, { color: 'grey' }]}
                placeholder="Email"
                keyboardType="email-address"
                placeholderTextColor="#A0AEC0"
                onChangeText={setEmail}
                value={email}
                editable={false}
              />
            </View>
            <View style={styles.inputContainer}>
              <FontAwesome name="phone" size={20} color="#CBD5E0" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Contact No."
                keyboardType="phone-pad"
                placeholderTextColor="#A0AEC0"
                onChangeText={setPhoneNumber}
                value={phoneNumber}
              />
            </View>
            <TouchableOpacity style={styles.button} onPress={btnUpdatePressed}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Dark background
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F7FAFC', // Light text for title
    marginBottom: 30,
  },
  formContainer: {
    width: '100%',
    backgroundColor: '#2D3748', // Dark card for form
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  avatarContainer: {
    marginBottom: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#4A5568', // Slightly lighter border for contrast
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#4A5568', // Placeholder is darker
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    marginTop: 5,
    color: '#CBD5E0', // Light text for placeholder
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4A5568', // Darker border for inputs
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
    paddingHorizontal: 15,
    height: 50,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#E2E8F0', // Light text for inputs
  },
  button: {
    backgroundColor: '#3182CE', // Darker blue button
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white', // White text for button
    fontWeight: 'bold',
    fontSize: 18,
  },
});
