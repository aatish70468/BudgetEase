import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { auth, db } from './../FirebaseConfig';
import { collection, setDoc, doc, getDocs, query, where, updateDoc } from 'firebase/firestore'

export default function AddPayRate() {
  const [payType, setPayType] = useState('');
  const [legalRate, setLegalRate] = useState('');
  const [cashRate, setCashRate] = useState('');

  const payTypeOptions = [
    { label: 'Hourly', value: 'hourly' },
    { label: 'Salary', value: 'salary' },
    { label: 'Commission', value: 'commission' },
    { label: 'Piece Rate', value: 'pieceRate' },
  ];

  const handleAddPay = async () => {
    if (!payType || !legalRate || !cashRate) {
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

        const addPayRateRef = doc(collectionRef, user.email)
        await updateDoc(addPayRateRef, {
          payType: payType,
          legalRate: legalRate,
          cashRate: cashRate,
        });
        alert('Pay Rate added successfully.');
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
          {/* Pay Type Picker */}
          <View style={styles.inputContainer}>
            <FontAwesome5 name="money-check-alt" size={20} color="#4285F4" style={styles.icon} />
            <Picker
              selectedValue={payType}
              onValueChange={(itemValue) => setPayType(itemValue)}
              style={styles.picker}
              dropdownIconColor="#4285F4"
            >
              <Picker.Item label="Select Pay Rate Type" value="" color="#BBBBBB" />
              {payTypeOptions.map(option => (
                <Picker.Item key={option.value} label={option.label} value={option.value} />
              ))}
            </Picker>
          </View>

          {/* Legal Pay Rate Input */}
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="bank" size={24} color="#4285F4" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Legal Hours Pay-Rate"
              placeholderTextColor="#BBBBBB"
              value={legalRate}
              onChangeText={setLegalRate}
              keyboardType="numeric"
            />
          </View>

          {/* Cash Pay Rate Input */}
          <View style={styles.inputContainer}>
            <FontAwesome5 name="hand-holding-usd" size={20} color="#4285F4" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Cash Hours Pay-Rate"
              placeholderTextColor="#BBBBBB"
              value={cashRate}
              onChangeText={setCashRate}
              keyboardType="numeric"
            />
          </View>

          {/* Add Pay Button */}
          <TouchableOpacity style={styles.button} onPress={handleAddPay}>
            <Text style={styles.buttonText}>Add Pay Rate</Text>
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
  picker: {
    flex: 1,
    color: '#FFFFFF', // White text in picker
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
