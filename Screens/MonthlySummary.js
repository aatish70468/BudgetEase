import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from './../FirebaseConfig';

export default function MonthlySummary() {
  const [legalHours, setLegalHours] = useState(0);
  const [cashHours, setCashHours] = useState(0);
  const [legalPay, setLegalPay] = useState(0);
  const [cashPay, setCashPay] = useState(0);
  const [monthYear, setMonthYear] = useState({ month: new Date().getMonth(), year: new Date().getFullYear() });
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  useEffect(() => {
    getMonthlyDataFromDB(monthYear);
  }, [monthYear]);

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}${month}${year}`;
  };

  const getMonthlyDataFromDB = async (monthYear) => {
    try {
      const monthStart = new Date(monthYear.year, monthYear.month, 1);
      const monthEnd = new Date(monthYear.year, monthYear.month + 1, 0);
      const userEmail = auth.currentUser.email;

      let totalLegalHours = 0;
      let totalCashHours = 0;
      let totalLegalPay = 0;
      let totalCashPay = 0;

      const monthRef = collection(db, 'daily', userEmail, String(monthYear.month + 1));
      const monthQuery = query(
        monthRef,
        where('date', '>=', formatDate(monthStart)),
        where('date', '<=', formatDate(monthEnd))
      );

      const monthSnapshot = await getDocs(monthQuery);

      monthSnapshot.forEach((doc) => {
        const dayData = doc.data();
        totalLegalHours += dayData.legalHours || 0;
        totalCashHours += dayData.cashHours || 0;
        totalLegalPay += dayData.legalPay || 0;
        totalCashPay += dayData.cashPay || 0;
      });

      setLegalHours(totalLegalHours);
      setCashHours(totalCashHours);
      setLegalPay(totalLegalPay);
      setCashPay(totalCashPay);
    } catch (error) {
      console.error('Error fetching monthly data:', error);
    }
  };

  const openMonthPicker = () => {
    setShowMonthPicker(true);
  };

  const closeMonthPicker = () => {
    setShowMonthPicker(false);
  };

  const handleMonthYearChange = () => {
    getMonthlyDataFromDB(monthYear);
    closeMonthPicker();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={styles.monthSelector} onPress={openMonthPicker}>
          <Text style={styles.monthSelectorText}>
            {new Date(monthYear.year, monthYear.month).toLocaleString('default', {
              month: 'long',
              year: 'numeric',
            })}
          </Text>
        </TouchableOpacity>

        {/* Month Year Picker Modal */}
        <Modal
          visible={showMonthPicker}
          animationType="slide"
          transparent={true}
          onRequestClose={closeMonthPicker}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {/* Month Picker */}
              <Picker
                selectedValue={monthYear.month}
                style={styles.picker}
                onValueChange={(itemValue) => setMonthYear({ ...monthYear, month: itemValue })}
              >
                {Array.from({ length: 12 }).map((_, index) => (
                  <Picker.Item
                    label={new Date(0, index).toLocaleString('default', { month: 'long' })}
                    value={index}
                    key={index}
                  />
                ))}
              </Picker>

              {/* Year Picker */}
              <Picker
                selectedValue={monthYear.year}
                style={styles.picker}
                onValueChange={(itemValue) => setMonthYear({ ...monthYear, year: itemValue })}
              >
                {/* Generate options for years */}
                {Array.from({ length: 10 }).map((_, index) => {
                  const year = new Date().getFullYear() - index;
                  return <Picker.Item label={year.toString()} value={year} key={year} />;
                })}
              </Picker>

              {/* Confirm Button */}
              <TouchableOpacity style={styles.confirmButton} onPress={handleMonthYearChange}>
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <View style={styles.calculationContainer}>
          <View style={styles.calculationCard}>
            <View style={styles.cardHeader}>
              <FontAwesome5 name="calendar-alt" size={20} color="#63B3ED" />
              <Text style={styles.calculationTitle}>Monthly Hours</Text>
            </View>
            <View style={styles.calculationRow}>
              <Text style={styles.calculationLabel}>Legal Hours:</Text>
              <Text style={styles.calculationValue}>{legalHours.toFixed(2)}</Text>
            </View>
            <View style={styles.calculationRow}>
              <Text style={styles.calculationLabel}>Cash Hours:</Text>
              <Text style={styles.calculationValue}>{cashHours.toFixed(2)}</Text>
            </View>
            <View style={[styles.calculationRow, styles.totalRow]}>
              <Text style={styles.calculationLabel}>Total Hours:</Text>
              <Text style={styles.calculationValue}>{(legalHours + cashHours).toFixed(2)}</Text>
            </View>
          </View>

          <View style={styles.calculationCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="cash-outline" size={24} color="#63B3ED" />
              <Text style={styles.calculationTitle}>Monthly Pay</Text>
            </View>
            <View style={styles.calculationRow}>
              <Text style={styles.calculationLabel}>Legal Pay:</Text>
              <Text style={styles.calculationValue}>$ {legalPay.toFixed(2)}</Text>
            </View>
            <View style={styles.calculationRow}>
              <Text style={styles.calculationLabel}>Cash Pay:</Text>
              <Text style={styles.calculationValue}>$ {cashPay.toFixed(2)}</Text>
            </View>
            <View style={[styles.calculationRow, styles.totalRow]}>
              <Text style={styles.calculationLabel}>Total Pay:</Text>
              <Text style={styles.calculationValue}>$ {(legalPay + cashPay).toFixed(2)}</Text>
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
    backgroundColor: '#121212',
  },
  scrollContent: {
    flexGrow: 1,
  },
  calculationContainer: {
    padding: 16,
  },
  calculationCard: {
    backgroundColor: '#1F1F1F',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
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
    color: '#F7FAFC',
    marginLeft: 10,
  },
  calculationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  calculationLabel: {
    fontSize: 16,
    color: '#A0A0A0',
  },
  calculationValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f8f8f8',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#7F8487',
    paddingTop: 8,
    marginTop: 8,
  },
  monthSelector: {
    backgroundColor: '#3182CE',
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 16,
    alignItems: 'center',
  },
  monthSelectorText: {
    color: '#F7FAFC',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#2D3748',
    padding: 10,
    borderRadius: 10,
    width: '50%',
  },
  picker: {
    height: 80,
    width: '100%',
    color: '#F7FAFC',
  },
  confirmButton: {
    backgroundColor: '#63B3ED',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
