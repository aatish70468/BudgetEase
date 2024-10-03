import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import firebase from 'firebase/app';
import 'firebase/database';

function AddPayRateScreen() {
  const [legalHours, setLegalHours] = useState(0);
  const [legalPayRate, setLegalPayRate] = useState(0);
  const [cashHours, setCashHours] = useState(0);
  const [cashPayRate, setCashPayRate] = useState(0);
  const [summary, setSummary] = useState('');

  const handleLegalHoursChange = (text) => {
    setLegalHours(parseFloat(text));
  };
  
  const handleLegalPayRateChange = (text) => {
    setLegalPayRate(parseFloat(text));
  };
  
  const handleCashHoursChange = (text) => {
    setCashHours(parseFloat(text));
  };
  
  const handleCashPayRateChange = (text) => {
    setCashPayRate(parseFloat(text));
  };

  const handleSubmit = async () => {
    try {
      const userId = firebase.auth().currentUser?.uid;
      if (!userId) {
        console.error('No authenticated user');
        return;
      }
  
      await firebase.database().ref(`users/${userId}/hours`).push({
        legalHours,
        legalPayRate,
        cashHours,
        cashPayRate,
      });
  
      calculateSummary();
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  const calculateSummary = async () => {
    const totalLegalPay = parseFloat(legalHours) * parseFloat(legalPayRate);
    const totalCashPay = parseFloat(cashHours) * parseFloat(cashPayRate);
    const totalPay = totalLegalPay + totalCashPay;

    const summaryText = `Summary:
    Legal Hours: ${legalHours} hours
    Legal Pay Rate: $${legalPayRate}/hour
    Total Legal Pay: $${totalLegalPay.toFixed(2)}
    Cash Hours: ${cashHours} hours
    Cash Pay Rate: $${cashPayRate}/hour
    Total Cash Pay: $${totalCashPay.toFixed(2)}
    Total Pay: $${totalPay.toFixed(2)}`;

    console.log('Summary calculated:', summaryText);
    setSummary(summaryText);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Hours</Text>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Legal Hours:</Text>
        <TextInput
          style={styles.input}
          value={legalHours.toString()}
          onChangeText={handleLegalHoursChange}
          keyboardType="numeric"
        />
        <Text style={styles.label}>Legal Pay Rate:</Text>
        <TextInput
          style={styles.input}
          value={legalPayRate.toString()}
          onChangeText={handleLegalPayRateChange}
          keyboardType="numeric"
        />
        <Text style={styles.label}>Cash Hours:</Text>
        <TextInput
          style={styles.input}
          value={cashHours.toString()}
          onChangeText={handleCashHoursChange}
          keyboardType="numeric"
        />
        <Text style={styles.label}>Cash Pay Rate:</Text>
        <TextInput
          style={styles.input}
          value={cashPayRate.toString()}
          onChangeText={handleCashPayRateChange}
          keyboardType="numeric"
        />
        <Button title="Submit" onPress={calculateSummary} />
      </View>
      <Text style={styles.summary}>{summary}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16, // consistent spacing
    },
    title: {
      fontSize: 28, // larger and bolder title
      fontWeight: 'bold',
      marginBottom: 16,
    },
    formContainer: {
      padding: 16,
      backgroundColor: '#fff', // white background for better contrast
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 10,
    },
    label: {
      fontSize: 14, // smaller font size for labels
      marginBottom: 5,
    },
    input: {
      height: 40,
      borderColor: '#ccc',
      borderWidth: 1,
      paddingHorizontal: 10,
      paddingVertical: 10,
      fontSize: 14, // smaller font size for input text
    },
    button: {
      backgroundColor: '#4CAF50', // primary color for buttons
      padding: 10,
      marginTop: 10,
      borderRadius: 5,
    },
    summary: {
      fontSize: 20, // smaller font size for summary text
      marginTop: 16,
      padding: 10,
      backgroundColor: '#f7f7f7', // subtle background color for summary
    },
  });

export default AddPayRateScreen;