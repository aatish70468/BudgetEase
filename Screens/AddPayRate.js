import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function AddPayRate() {
  const handleAddPay = () => {
    Alert.alert('Button Pressed', 'Add Pay button was pressed');
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>What is the type of your pay-rate?</Text>
        <TextInput style={styles.input} placeholder="Deposit" />
        <Text style={styles.label}>Legal Hours Pay-Rate</Text>
        <TextInput style={styles.input} value="$ 16.55" />
        <Text style={styles.label}>Cash Hours Pay-Rate</Text>
        <TextInput style={styles.input} value="$ 10.00" />
        <TouchableOpacity style={styles.button} onPress={handleAddPay}>
          <Text style={styles.buttonText}>Add Pay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  form: {
    backgroundColor: 'white',
    width: '90%',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  label: {
    color: '#4B5563',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#FCA5A5',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});