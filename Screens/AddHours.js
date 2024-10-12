import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { auth, db } from './../FirebaseConfig';
import { collection, setDoc, doc, getDocs, query, where, updateDoc, onSnapshot } from 'firebase/firestore'

export default function AddHours() {

  const [legalHours, setLegalHours] = useState('');
  // const [cashRate, setCashRate] = useState('');

  useEffect(() => {
    getCurrUserLegalHours();
  }, [])

  const getCurrUserLegalHours = async () => {
    const collectionRef = collection(db, 'users');
    const getUserDoc = query(collectionRef, where('id', '==', auth.currentUser.uid));

    onSnapshot(getUserDoc, (snapshot) => {

      const user = snapshot.docs.map(doc => {
        setLegalHours(doc.data().legalHours);
      })
    })
  }

  const handleAddPay = async () => {
    if (!legalHours) {
      alert('Please fill out all fields.');
    } else {

      const collectionRef = collection(db, 'users');
      const getUserDoc = query(collectionRef, where('id', '==', auth.currentUser.uid));
      const userDoc = await getDocs(getUserDoc);

      if (userDoc.docs.length === 0) {
        alert('User not found.');
        return;
      } else {
        const user = userDoc.docs[0].data();
        console.log(`User: ${JSON.stringify(user)}`);

        const addLegalHoursRef = doc(collectionRef, user.email)
        await updateDoc(addLegalHoursRef, {
          legalHours: legalHours,
        });
        alert('Legal Hours added successfully.');
      }

    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.form}>

          {/* Legal Hours Input */}
          <View style={styles.outerInputContainer}>
            <Text style={styles.label}>Legal Hours:</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="bank" size={24} color="#4285F4" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Enter legal hours you can do..."
                placeholderTextColor="#BBBBBB"
                value={legalHours}
                onChangeText={setLegalHours}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Cash Pay Rate Input */}
          {/* <View style={styles.outerInputContainer}>
            <Text style={styles.label}>Cash Hours:</Text>
            <View style={styles.inputContainer}>
              <FontAwesome5 name="hand-holding-usd" size={20} color="#4285F4" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Enter Cash Hours you can do..."
                placeholderTextColor="#BBBBBB"
                value={cashRate}
                onChangeText={setCashRate}
                keyboardType="numeric"
              />
            </View>
          </View> */}

          {/* Add Pay Button */}
          <TouchableOpacity style={styles.button} onPress={handleAddPay}>
            <Text style={styles.buttonText}>Add Hours</Text>
          </TouchableOpacity>
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
  form: {
    backgroundColor: '#1F1B24', // Slightly lighter dark color for form
    margin: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  outerInputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF', //Light label text color
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#BBBBBB', // Lighter border
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#1F1B24',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#FFFFFF', // Light text color
  },
  button: {
    backgroundColor: '#4285F4', // Accent color for button
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
