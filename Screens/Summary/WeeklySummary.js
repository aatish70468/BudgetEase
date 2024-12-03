import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from './../../FirebaseConfig';

export default function WeeklySummary() {
  const [legalHours, setLegalHours] = useState(0);
  const [cashHours, setCashHours] = useState(0);
  const [legalPay, setLegalPay] = useState(0);
  const [cashPay, setCashPay] = useState(0);
  const [selectedWeek, setSelectedWeek] = useState(null);

  useEffect(() => {
    if (selectedWeek) {
      getWeeklyDataFromDB(selectedWeek);
    }
  }, [selectedWeek]);

  // Get the start and end of the week from a given date
  const getWeekStart = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Sunday is 0, so adjust for that
    return new Date(d.setDate(diff));
  };

  const getWeekEnd = (date) => {
    const weekStart = getWeekStart(date);
    return new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000); // 6 days after the start of the week
  };

  // Format date to a string that can be used in the database
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}${month}${year}`;
  };

  // Fetch data for the selected week from Firestore
  const getWeeklyDataFromDB = async (week) => {
    try {
      const { startDate, endDate } = week;
      const userEmail = auth.currentUser.email;

      let totalLegalHours = 0;
      let totalCashHours = 0;
      let totalLegalPay = 0;
      let totalCashPay = 0;

      // Loop through each day of the selected week
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const currentDate = formatDate(d);
        const monthNum = d.getMonth() + 1;

        // Query Firestore for data on the specific day
        const dayRef = collection(db, 'daily', userEmail, String(monthNum));
        const dayQuery = query(dayRef, where('date', '==', currentDate));

        const daySnapshot = await getDocs(dayQuery);

        if (!daySnapshot.empty) {
          const dayData = daySnapshot.docs[0].data();
          totalLegalHours += dayData.legalHours || 0;
          totalCashHours += dayData.cashHours || 0;
          totalLegalPay += dayData.legalPay || 0;
          totalCashPay += dayData.cashPay || 0;
        }
      }

      // Set the data in the state
      setLegalHours(totalLegalHours);
      setCashHours(totalCashHours);
      setLegalPay(totalLegalPay);
      setCashPay(totalCashPay);
    } catch (error) {
      console.error('Error fetching weekly data:', error);
    }
  };

  // Move to the next or previous week
  const moveToWeek = (direction) => {
    const newSelectedWeek = { ...selectedWeek };
    const weekStart = new Date(newSelectedWeek.startDate);
    
    if (direction === 'previous') {
      weekStart.setDate(weekStart.getDate() - 7); // Move 7 days back
    } else if (direction === 'next') {
      weekStart.setDate(weekStart.getDate() + 7); // Move 7 days forward
    }

    newSelectedWeek.startDate = weekStart;
    newSelectedWeek.endDate = getWeekEnd(weekStart);

    // Update the label based on the new selected week
    newSelectedWeek.label = `Week of ${newSelectedWeek.startDate.toDateString()} - ${newSelectedWeek.endDate.toDateString()}`;
    
    setSelectedWeek(newSelectedWeek);
  };

  // Set the current week when the component mounts
  useEffect(() => {
    const currentWeekStart = getWeekStart(new Date());
    const currentWeekEnd = getWeekEnd(currentWeekStart);

    setSelectedWeek({
      label: `Week of ${currentWeekStart.toDateString()} - ${currentWeekEnd.toDateString()}`,
      startDate: currentWeekStart,
      endDate: currentWeekEnd,
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.dateSelectorContainer}>
          <TouchableOpacity style={styles.arrowButton} onPress={() => moveToWeek('previous')}>
            <Ionicons name="arrow-back-outline" size={24} color="#F7FAFC" />
          </TouchableOpacity>

          <Text style={styles.dateSelectorText}>
            {selectedWeek ? selectedWeek.label : 'Loading...'}
          </Text>

          <TouchableOpacity style={styles.arrowButton} onPress={() => moveToWeek('next')}>
            <Ionicons name="arrow-forward-outline" size={24} color="#F7FAFC" />
          </TouchableOpacity>
        </View>

        {selectedWeek && (
          <View style={styles.calculationContainer}>
            <View style={styles.calculationCard}>
              <View style={styles.cardHeader}>
                <FontAwesome5 name="calendar-week" size={20} color="#63B3ED" />
                <Text style={styles.calculationTitle}>Weekly Hours</Text>
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
                <Text style={styles.calculationTitle}>Weekly Pay</Text>
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
        )}
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
  dateSelectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  arrowButton: {
    backgroundColor: '#3182CE',
    padding: 10,
    borderRadius: 8,
  },
  dateSelectorText: {
    color: '#F7FAFC',
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
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
});

