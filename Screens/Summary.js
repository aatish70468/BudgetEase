import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function Summary() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <FontAwesome name="arrow-left" size={24} color="black" />
        <Text style={styles.headerText}>BudgetEase</Text>
        <FontAwesome name="bell" size={24} color="black" />
      </View>
      <View style={styles.totalPayContainer}>
        <View style={styles.totalPayCard}>
          <Text style={styles.totalPayTitle}>Your Total pay :</Text>
          <Text style={styles.totalPayText}>Gross Income : $0.00</Text>
          <Text style={styles.netIncomeText}>Net Income</Text>
          <Text style={styles.totalPayAmount}>$0.00</Text>
        </View>
      </View>
      <View style={styles.calculationContainer}>
        <View style={styles.calculationCard}>
          <Text style={styles.calculationTitle}>Weekly Hours Calculation</Text>
          <Text style={styles.calculationText}>Legal Hours Worked: 20</Text>
          <Text style={styles.calculationText}>Cash Hours Worked: 10</Text>
          <Text style={styles.calculationText}>Total Hours Worked: 30</Text>
        </View>
        <View style={styles.calculationCard}>
          <Text style={styles.calculationTitle}>Monthly Hours Calculation</Text>
          <Text style={styles.calculationText}>Legal Hours Worked: 20</Text>
          <Text style={styles.calculationText}>Cash Hours Worked: 10</Text>
          <Text style={styles.calculationText}>Total Hours Worked: 30</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E7EB',
  },
  header: {
    backgroundColor: '#FFFFFF',
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
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalPayContainer: {
    backgroundColor: '#FECACA',
    padding: 16,
  },
  totalPayCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  totalPayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalPayText: {
    marginTop: 8,
  },
  netIncomeText: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalPayAmount: {
    marginTop: 8,
    fontSize: 24,
    fontWeight: 'bold',
  },
  calculationContainer: {
    padding: 16,
  },
  calculationCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 16,
  },
  calculationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  calculationText: {
    marginTop: 8,
  },
});