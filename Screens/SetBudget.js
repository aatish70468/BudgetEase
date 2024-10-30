import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, FlatList } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { db, auth } from './../FirebaseConfig'; // Import your Firestore setup
import { doc, setDoc, getDoc, collection, addDoc, query, getDocs, deleteDoc } from 'firebase/firestore';

const SetBudget = () => {
  const [monthlyBudget, setMonthlyBudget] = useState('');
  const [currentExpenses, setCurrentExpenses] = useState('0');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDescription, setExpenseDescription] = useState('');
  const [expensesList, setExpensesList] = useState([]);

  useEffect(() => {
    loadBudgetAndExpenses();
  }, []);

  const loadBudgetAndExpenses = async () => {
    try {
      const userEmail = auth.currentUser.email;
      const budgetDocRef = doc(db, 'budgets', userEmail);
      const budgetDocSnap = await getDoc(budgetDocRef);

      if (budgetDocSnap.exists()) {
        const data = budgetDocSnap.data();
        setMonthlyBudget(data.monthlyBudget || '');
        setCurrentExpenses(data.currentExpenses || '0');

        // Load all expenses from the expenses subcollection
        const expensesQuery = query(collection(budgetDocRef, 'expenses'));
        const expensesSnapshot = await getDocs(expensesQuery);
        const expenses = expensesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setExpensesList(expenses);
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveBudget = async () => {
    try {
      const userEmail = auth.currentUser.email;
      await setDoc(doc(db, 'budgets', userEmail), {
        monthlyBudget,
        currentExpenses
      });
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
      const userEmail = auth.currentUser.email;
      const budgetDocRef = doc(db, 'budgets', userEmail);

      // Add expense to the expenses subcollection
      await addDoc(collection(budgetDocRef, 'expenses'), {
        amount: expenseAmount,
        description: expenseDescription,
        timestamp: new Date()
      });

      // Update the current expenses in the budget document
      await setDoc(budgetDocRef, {
        monthlyBudget,
        currentExpenses: newTotalExpenses.toString()
      }, { merge: true });

      setExpenseAmount('');
      setExpenseDescription('');

      if (newTotalExpenses > parseFloat(monthlyBudget)) {
        Alert.alert('Budget Exceeded', 'You have exceeded your monthly budget!');
      }

      // Reload the expenses list
      loadBudgetAndExpenses();
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const resetExpenses = async () => {
    try {
      const userEmail = auth.currentUser.email;
      const budgetDocRef = doc(db, 'budgets', userEmail);

      // Reset current expenses
      await setDoc(budgetDocRef, { currentExpenses: '0' }, { merge: true });
      setCurrentExpenses('0');

      // Delete all documents in the expenses subcollection
      const expensesSnapshot = await getDocs(collection(budgetDocRef, 'expenses'));
      for (const docSnap of expensesSnapshot.docs) {
        await deleteDoc(docSnap.ref);
      }

      setExpensesList([]);
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
          <FontAwesome name="dollar" size={20} color="#63B3ED" style={styles.icon} />
          <TextInput
            style={styles.input}
            value={monthlyBudget}
            onChangeText={setMonthlyBudget}
            placeholder="Enter monthly budget"
            placeholderTextColor="#7F8487"
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
          <FontAwesome name="dollar" size={20} color="#63B3ED" style={styles.icon} />
          <TextInput
            style={styles.input}
            value={expenseAmount}
            onChangeText={setExpenseAmount}
            placeholder="Enter expense amount"
            placeholderTextColor="#7F8487"
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputContainer}>
          <FontAwesome name="pencil" size={20} color="#63B3ED" style={styles.icon} />
          <TextInput
            style={styles.input}
            value={expenseDescription}
            onChangeText={setExpenseDescription}
            placeholder="Enter expense description"
            placeholderTextColor="#7F8487"
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

      <FlatList
        data={expensesList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.expenseItem}>
            <Text style={styles.expenseText}>${item.amount} - {item.description}</Text>
          </View>
        )}
        style={{ marginTop: 20 }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  section: {
    backgroundColor: '#1F1F1F',
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
    color: '#F7FAFC',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#7F8487',
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
    color: '#f8f8f8',
  },
  button: {
    backgroundColor: '#63B3ED',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  summarySection: {
    backgroundColor: '#2A2A2A',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  summaryText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#F7FAFC',
  },
  resetButton: {
    backgroundColor: '#63B3ED',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  expenseItem: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  expenseText: {
    color: '#f8f8f8',
  },
});

export default SetBudget;