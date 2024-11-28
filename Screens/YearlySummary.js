import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from './../FirebaseConfig';
import { Picker } from '@react-native-picker/picker';

export default function YearlySummary() {
  const [legalHours, setLegalHours] = useState(0);
  const [cashHours, setCashHours] = useState(0);
  const [legalPay, setLegalPay] = useState(0);
  const [cashPay, setCashPay] = useState(0);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showYearPicker, setShowYearPicker] = useState(false);

  useEffect(() => {
    getYearlyDataFromDB(selectedYear);
  }, [selectedYear]);

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= 2020; year--) {
      years.push(year);
    }
    return years;
  };

  const getYearlyDataFromDB = async (year) => {
    try {
      const userEmail = auth.currentUser.email;
      let totalLegalHours = 0;
      let totalCashHours = 0;
      let totalLegalPay = 0;
      let totalCashPay = 0;
  
      for (let month = 1; month <= 12; month++) {
        const monthRef = collection(db, 'daily', userEmail, String(month));
        const startDate = `01${String(month).padStart(2, '0')}${year}`;
        const endDate = `${new Date(year, month, 0).getDate()}${String(month).padStart(2, '0')}${year}`;
        
        const monthQuery = query(monthRef, 
          where('date', '>=', startDate),
          where('date', '<=', endDate)
        );
        
        const monthSnapshot = await getDocs(monthQuery);
  
        monthSnapshot.forEach((doc) => {
          const dayData = doc.data();
          totalLegalHours += dayData.legalHours || 0;
          totalCashHours += dayData.cashHours || 0;
          totalLegalPay += dayData.legalPay || 0;
          totalCashPay += dayData.cashPay || 0;
        });
      }
  
      setLegalHours(totalLegalHours);
      setCashHours(totalCashHours);
      setLegalPay(totalLegalPay);
      setCashPay(totalCashPay);
    } catch (error) {
      console.error('Error fetching yearly data:', error);
    }
  };

  const onYearChange = (year) => {
    setSelectedYear(year);
    setShowYearPicker(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={styles.yearSelector} onPress={() => setShowYearPicker(true)}>
          <Text style={styles.yearSelectorText}>
            {selectedYear}
          </Text>
        </TouchableOpacity>
        {showYearPicker && (
          <Picker
            selectedValue={selectedYear}
            onValueChange={(itemValue) => onYearChange(itemValue)}
            style={styles.yearPicker}
          >
            {generateYearOptions().map((year) => (
              <Picker.Item key={year} label={year.toString()} value={year} />
            ))}
          </Picker>
        )}
        <View style={styles.calculationContainer}>
          <View style={styles.calculationCard}>
            <View style={styles.cardHeader}>
              <FontAwesome5 name="calendar-alt" size={20} color="#63B3ED" />
              <Text style={styles.calculationTitle}>Yearly Hours</Text>
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
              <Text style={styles.calculationTitle}>Yearly Pay</Text>
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
        backgroundColor: '#121212', // Dark background for the entire screen
    },
    scrollContent: {
        flexGrow: 1,
    },
    calculationContainer: {
        padding: 16,
    },
    calculationCard: {
        backgroundColor: '#1F1F1F', // Dark card background
        padding: 20,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3, // Darker shadow for better elevation effect
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
        color: '#F7FAFC', // Light accent color for titles
        marginLeft: 10,
    },
    calculationRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    calculationLabel: {
        fontSize: 16,
        color: '#A0A0A0', // Lighter gray for labels
    },
    calculationValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#f8f8f8', // Lighter text for values
    },
    totalRow: {
        borderTopWidth: 1,
        borderTopColor: '#7F8487', // Subtle border for total row
        paddingTop: 8,
        marginTop: 8,
    },
    yearSelector: {
        backgroundColor: '#3182CE',
        padding: 10,
        borderRadius: 8,
        marginHorizontal: 16,
        marginTop: 16,
        alignItems: 'center',
      },
      yearSelectorText: {
        color: '#F7FAFC',
        fontSize: 16,
        fontWeight: '600',
      },
      yearPicker: {
        backgroundColor: '#1F1F1F',
        color: '#F7FAFC',
      },
});