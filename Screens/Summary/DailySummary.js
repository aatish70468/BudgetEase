
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { doc,collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from './../../FirebaseConfig'
import DateTimePicker from '@react-native-community/datetimepicker';

export default function DailySummary() {
  const [legalHours, setLegalHours] = useState(0);
  const [cashHours, setCashHours] = useState(0);
  const [legalPay, setLegalPay] = useState(0);
  const [cashPay, setCashPay] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    getDailyDataFromDB(selectedDate);
  }, [selectedDate]);
  
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}${month}${year}`;
  };
  
  const getDailyDataFromDB = async (date) => {
    try {
      const formattedDate = formatDate(date);
      const monthNum = date.getMonth() + 1;
      console.log('Get Current Date', formattedDate);
      const userEmail = auth.currentUser.email;
      
      const dayRef = collection(db, 'daily', userEmail, String(monthNum));
      const dayQuery = query(dayRef, where('date', '==', formattedDate));
      
      const daySnapshot = await getDocs(dayQuery);
  
      if (daySnapshot.empty) {
        console.log('No matching documents for the selected date.');
        setLegalHours(0);
        setCashHours(0);
        setLegalPay(0);
        setCashPay(0);
      } else {
        const dayData = daySnapshot.docs[0].data();
        setLegalHours(dayData.legalHours || 0);
        setCashHours(dayData.cashHours || 0);
        setLegalPay(dayData.legalPay || 0);
        setCashPay(dayData.cashPay || 0);
      }
    } catch (error) {
      console.error('Error fetching daily data:', error);
    }
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setSelectedDate(currentDate);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={styles.dateSelector} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.dateSelectorText}>
            {selectedDate.toDateString()}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={onDateChange}
            style={{backgroundColor:"#3182CE"}}
          />
        )}
        <View style={styles.calculationContainer}>
          <View style={styles.calculationCard}>
            <View style={styles.cardHeader}>
              <FontAwesome5 name="calendar-week" size={20} color="#63B3ED" />
              <Text style={styles.calculationTitle}>Daily Hours</Text>
            </View>
            <View style={styles.calculationRow}>
              <Text style={styles.calculationLabel}>Legal Hours:</Text>
              <Text style={styles.calculationValue}>{legalHours}</Text>
            </View>
            <View style={styles.calculationRow}>
              <Text style={styles.calculationLabel}>Cash Hours:</Text>
              <Text style={styles.calculationValue}>{cashHours}</Text>
            </View>
            <View style={[styles.calculationRow, styles.totalRow]}>
              <Text style={styles.calculationLabel}>Total Hours:</Text>
              <Text style={styles.calculationValue}>{legalHours + cashHours}</Text>
            </View>
          </View>
          <View style={styles.calculationCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="cash-outline" size={24} color="#63B3ED" />
              <Text style={styles.calculationTitle}>Daily Pay</Text>
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
  dateSelector: {
    backgroundColor: '#3182CE',
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 16,
    alignItems: 'center',
  },
  dateSelectorText: {
    color: '#F7FAFC',
    fontSize: 16,
    fontWeight: '600',
  },
});