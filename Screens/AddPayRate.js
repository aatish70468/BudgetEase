import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';

export default function AddPayRate() {
  const [payType, setPayType] = useState('');
  const [legalRate, setLegalRate] = useState('16.55');
  const [cashRate, setCashRate] = useState('10.00');

  const payTypeOptions = [
    { label: 'Hourly', value: 'hourly' },
    { label: 'Salary', value: 'salary' },
    { label: 'Commission', value: 'commission' },
    { label: 'Piece Rate', value: 'pieceRate' },
  ];

  const handleAddPay = () => {
    Alert.alert('Success', 'Pay rate added successfully!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.header}>
          <Text style={styles.headerText}>Add Pay Rate</Text>
        </View>
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <FontAwesome5 name="money-check-alt" size={20} color="#4B5563" style={styles.icon} />
            <RNPickerSelect
              onValueChange={(value) => setPayType(value)}
              items={payTypeOptions}
              style={pickerSelectStyles}
              value={payType}
              placeholder={{ label: "Select pay rate type", value: null }}
            />
          </View>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="bank" size={24} color="#4B5563" style={styles.icon} />
            <TextInput 
              style={styles.input} 
              placeholder="Legal Hours Pay-Rate"
              value={legalRate}
              onChangeText={setLegalRate}
              keyboardType="numeric"
            />
            <Text style={styles.currency}>$</Text>
          </View>
          <View style={styles.inputContainer}>
            <FontAwesome5 name="hand-holding-usd" size={20} color="#4B5563" style={styles.icon} />
            <TextInput 
              style={styles.input} 
              placeholder="Cash Hours Pay-Rate"
              value={cashRate}
              onChangeText={setCashRate}
              keyboardType="numeric"
            />
            <Text style={styles.currency}>$</Text>
          </View>
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
    backgroundColor: '#F3F4F6',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#3B82F6',
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  form: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  currency: {
    fontSize: 16,
    color: '#4B5563',
  },
  button: {
    backgroundColor: '#3B82F6',
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

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});