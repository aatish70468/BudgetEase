import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';

const SetBudget = () => {
  const [monthlyBudget, setMonthlyBudget] = useState('');
  const [currentExpenses, setCurrentExpenses] = useState('0');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDescription, setExpenseDescription] = useState('');

  useEffect(() => {
    loadBudgetAndExpenses();
  }, []);

  const loadBudgetAndExpenses = async () => {
    try {
      const storedBudget = await AsyncStorage.getItem('monthlyBudget');
      const storedExpenses = await AsyncStorage.getItem('currentExpenses');
      if (storedBudget) setMonthlyBudget(storedBudget);
      if (storedExpenses) setCurrentExpenses(storedExpenses);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveBudget = async () => {
    try {
      await AsyncStorage.setItem('monthlyBudget', monthlyBudget);
      Alert.alert('Success', 'Monthly budget has been set!');
    } catch (error) {
      console.error('Error saving budget:', error);
    }
  };

  const addExpense = async () => {
    if (!expenseAmount || !expenseDescription) {
      Alert.alert('Error', 'Please enter both amount and description');
      return;
    }

    const newTotalExpenses = parseFloat(currentExpenses) + parseFloat(expenseAmount);
    setCurrentExpenses(newTotalExpenses.toString());

    try {
      await AsyncStorage.setItem('currentExpenses', newTotalExpenses.toString());
      setExpenseAmount('');
      setExpenseDescription('');

      if (newTotalExpenses > parseFloat(monthlyBudget)) {
        Alert.alert('Budget Exceeded', 'You have exceeded your monthly budget!');
      }
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const resetExpenses = async () => {
    try {
      await AsyncStorage.setItem('currentExpenses', '0');
      setCurrentExpenses('0');
      Alert.alert('Success', 'Expenses have been reset for the new month.');
    } catch (error) {
      console.error('Error resetting expenses:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Set Monthly Budget</Text>
        <View style={styles.inputContainer}>
          <FontAwesome name="dollar" size={20} color="#4A5568" style={styles.icon} />
          <TextInput
            style={styles.input}
            value={monthlyBudget}
            onChangeText={setMonthlyBudget}
            placeholder="Enter monthly budget"
            keyboardType="numeric"
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={saveBudget}>
          <Text style={styles.buttonText}>Save Budget</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Add Expense</Text>
        <View style={styles.inputContainer}>
          <FontAwesome name="dollar" size={20} color="#4A5568" style={styles.icon} />
          <TextInput
            style={styles.input}
            value={expenseAmount}
            onChangeText={setExpenseAmount}
            placeholder="Enter expense amount"
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputContainer}>
          <FontAwesome name="pencil" size={20} color="#4A5568" style={styles.icon} />
          <TextInput
            style={styles.input}
            value={expenseDescription}
            onChangeText={setExpenseDescription}
            placeholder="Enter expense description"
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={addExpense}>
          <Text style={styles.buttonText}>Add Expense</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summarySection}>
        <Text style={styles.summaryText}>Monthly Budget: ${monthlyBudget}</Text>
        <Text style={styles.summaryText}>Current Expenses: ${currentExpenses}</Text>
        <Text style={styles.summaryText}>
          Remaining: ${(parseFloat(monthlyBudget) - parseFloat(currentExpenses)).toFixed(2)}
        </Text>
      </View>

      <TouchableOpacity style={styles.resetButton} onPress={resetExpenses}>
        <Text style={styles.buttonText}>Reset Expenses for New Month</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
    padding: 20,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2D3748',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4299E1',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  summarySection: {
    backgroundColor: '#EBF8FF',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  summaryText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#2B6CB0',
  },
  resetButton: {
    backgroundColor: '#ED8936',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
});

export default SetBudget;