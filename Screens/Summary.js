import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

export default function Summary() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <FontAwesome5 name="arrow-left" size={24} color="#4A5568" />
        </TouchableOpacity>
        <Text style={styles.headerText}>BudgetEase</Text>
        <TouchableOpacity>
          <FontAwesome5 name="bell" size={24} color="#4A5568" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.totalPayContainer}>
          <View style={styles.totalPayCard}>
            <Text style={styles.totalPayTitle}>Your Total Pay</Text>
            <View style={styles.payRow}>
              <Text style={styles.payLabel}>Gross Income:</Text>
              <Text style={styles.payAmount}>$0.00</Text>
            </View>
            <View style={styles.payRow}>
              <Text style={styles.payLabel}>Net Income:</Text>
              <Text style={styles.totalPayAmount}>$0.00</Text>
            </View>
          </View>
        </View>
        <View style={styles.calculationContainer}>
          <View style={styles.calculationCard}>
            <View style={styles.cardHeader}>
              <FontAwesome5 name="calendar-week" size={20} color="#4A5568" />
              <Text style={styles.calculationTitle}>Weekly Hours</Text>
            </View>
            <View style={styles.calculationRow}>
              <Text style={styles.calculationLabel}>Legal Hours:</Text>
              <Text style={styles.calculationValue}>20</Text>
            </View>
            <View style={styles.calculationRow}>
              <Text style={styles.calculationLabel}>Cash Hours:</Text>
              <Text style={styles.calculationValue}>10</Text>
            </View>
            <View style={[styles.calculationRow, styles.totalRow]}>
              <Text style={styles.calculationLabel}>Total Hours:</Text>
              <Text style={styles.calculationValue}>30</Text>
            </View>
          </View>
          <View style={styles.calculationCard}>
            <View style={styles.cardHeader}>
              <FontAwesome5 name="calendar-alt" size={20} color="#4A5568" />
              <Text style={styles.calculationTitle}>Monthly Hours</Text>
            </View>
            <View style={styles.calculationRow}>
              <Text style={styles.calculationLabel}>Legal Hours:</Text>
              <Text style={styles.calculationValue}>20</Text>
            </View>
            <View style={styles.calculationRow}>
              <Text style={styles.calculationLabel}>Cash Hours:</Text>
              <Text style={styles.calculationValue}>10</Text>
            </View>
            <View style={[styles.calculationRow, styles.totalRow]}>
              <Text style={styles.calculationLabel}>Total Hours:</Text>
              <Text style={styles.calculationValue}>30</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  totalPayContainer: {
    backgroundColor: '#EBF8FF',
    padding: 16,
  },
  totalPayCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  totalPayTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 16,
  },
  payRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  payLabel: {
    fontSize: 16,
    color: '#4A5568',
  },
  payAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
  },
  totalPayAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3182CE',
  },
  calculationContainer: {
    padding: 16,
  },
  calculationCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  calculationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
    marginLeft: 10,
  },
  calculationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  calculationLabel: {
    fontSize: 16,
    color: '#4A5568',
  },
  calculationValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 8,
    marginTop: 8,
  },
});