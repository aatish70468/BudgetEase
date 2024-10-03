import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import firebase from 'firebase/app';
import 'firebase/database';

const AddHours = () => {
  const [date, setDate] = useState('');
  const [checkInTime, setCheckInTime] = useState('');
  const [checkOutTime, setCheckOutTime] = useState('');

  const handleAddHours = async () => {
    try {
      await firestore().collection('hours').add({
        date,
        checkInTime,
        checkOutTime,
      });
      alert('Hours added successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to add hours.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>BudgetEase</Text>
      </View>
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Today's Date:</Text>
          <TextInput
            style={styles.input}
            placeholder="mm/dd/yyyy"
            value={date}
            onChangeText={setDate}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Check-In Time:</Text>
          <TextInput
            style={styles.input}
            placeholder="1:00 Pm"
            value={checkInTime}
            onChangeText={setCheckInTime}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Check-Out Time:</Text>
          <TextInput
            style={styles.input}
            placeholder="9:00 Pm"
            value={checkOutTime}
            onChangeText={setCheckOutTime}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleAddHours}>
          <Text style={styles.buttonText}>Add hours</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  form: {
    backgroundColor: '#D1D5DB',
    width: '90%',
    padding: 16,
    marginTop: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4B5563',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
    color: '#4B5563',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  button: {
    backgroundColor: '#FCA5A5',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddHours;