import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { auth, db, createBatch } from './../../FirebaseConfig';
import { collection, setDoc, doc, getDoc, getDocs, query, where, updateDoc, onSnapshot } from 'firebase/firestore'
import DateTimePicker from '@react-native-community/datetimepicker';

const AddTodaysTiming = () => {
  const [email, setEmail] = useState('');
  const [date, setDate] = useState(new Date());
  const [clockIn, setClockIn] = useState(new Date());
  const [clockOut, setClockOut] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [showClockIn, setShowClockIn] = useState(false);
  const [showClockOut, setShowClockOut] = useState(false);
  const [weeklyLegalHoursLimit, setWeeklyLegalHoursLimit] = useState(0); // Track the user's weekly legal hours limit
  const [weeklyWorkedLegalHours, setWeeklyWorkedLegalHours] = useState(0); // Track already worked legal hours in current week

  useEffect(() => {
    getCurrUser();
  }, [])

  function isTimestamp(date) {
    // Check if the input is an object and has the required properties
    return (
      typeof date === 'object' &&
      date !== null &&
      typeof date.seconds === 'number' &&
      typeof date.nanoseconds === 'number'
    );
  }

  function getWeekNumber(startDate, inputDate) {
    const start = isTimestamp(startDate) ? new Date(startDate.seconds * 1000) : new Date(startDate);
    const input = new Date(inputDate);

    // Calculate the difference in time
    const timeDifference = input.getTime() - start.getTime();
    // Calculate the difference in days
    const dayDifference = timeDifference / (1000 * 3600 * 24);

    // Calculate the week number based on day difference (Each week is 7 days)
    const weekNumber = Math.floor(dayDifference / 7) + 1;
    console.log(weekNumber)
    return weekNumber;
  }

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0'); // Get the day
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get the month
    const year = date.getFullYear(); // Get the full year

    return `${day}${month}${year}`; // Format as ddmmyyyy
  };

  const getCurrUser = async () => {
    const collectionRef = collection(db, 'users');
    const getUserDoc = query(collectionRef, where('id', '==', auth.currentUser.uid));

    onSnapshot(getUserDoc, (snapshot) => {
      const user = snapshot.docs.map(doc => {
        setEmail(doc.data().email)
        setWeeklyLegalHoursLimit(doc.data().legalHours || 0);
      })
    })
  }

  function calculateHoursForWeek(totalHours, user, weeklyWorkedLegalHours) {
    let legalHours = 0;
    let cashHours = 0;

    // Check if the user has a weekly legal hours limit
    //const weeklyLegalHoursLimit = user.weeklyLegalHours || 0; // Get legal hours limit from user data

    // Calculate remaining legal hours allowed for the week
    const remainingLegalHours = Math.max(weeklyLegalHoursLimit - weeklyWorkedLegalHours, 0);

    if (totalHours <= remainingLegalHours) {
      // If the entered hours are less than or equal to the remaining legal hours, all are legal
      legalHours = totalHours;
    } else {
      // If the entered hours exceed the remaining legal hours, split into legal and cash hours
      legalHours = remainingLegalHours;
      cashHours = totalHours - remainingLegalHours;
    }
    return { legalHours, cashHours };
  }

  async function insertDataWithWeeklyLegalLimit(userId, email, date, totalHours, legalPayRate, cashPayRate) {
    const monthName = new Date(date).toLocaleString('default', { month: 'long' });
    const year = new Date(date).getFullYear();
    const monthNumber = new Date(date).getMonth() + 1; // Month number (1-12)

    // Firestore references
    const userRef = doc(db, 'users', email);
    const dailyRef = doc(collection(db, 'daily', email, String(monthNumber)), formatDate(date));
    const monthlyRef = doc(collection(db, 'monthly', email, String(monthNumber)), '1');
    const yearlyRef = doc(collection(db, 'yearly', email, String(year)), String(year));

    // Step 1: Get the user data from the users collection
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      console.error('User data not found');
      return;
    }
    const userData = userDoc.data();

    // Step 2: Retrieve the total legal hours worked in the current week so far
    // Check if the user has a start date for week 
    const startDate = userData.startDate ? userData.startDate : date;

    //Set the week number
    const weekNumber = getWeekNumber(startDate, date);

    if (!userData.startDate) {
      await updateDoc(userRef, {
        startDate: startDate,
        weekNumber: weekNumber
      }).then(() => {
        console.log('Start date set to today');
      }).catch((error) => {
        console.error('Error updating start date:', error);
      });
    } else {
      await updateDoc(userRef, {
        weekNumber: weekNumber
      }).then(() => {
        console.log('Week Updated');
      }).catch((error) => {
        console.error('Error updating week:', error);
      });
    }


    // Calculate the appropriate week number based on the start date
    const weeklyRef = doc(collection(db, 'weekly', email, String(weekNumber)), '1');
    const weeklyDoc = await getDoc(weeklyRef);

    const weeklyWorkedLegalHours = weeklyDoc?.data()?.legalHours || 0;

    // Step 3: Calculate legal and cash hours based on total hours and the remaining weekly legal limit
    const { legalHours, cashHours } = calculateHoursForWeek(totalHours, userData, weeklyWorkedLegalHours);

    // Calculate legal and cash pay
    const legalPayCalculated = legalHours * userData.legalRate;
    const cashPayCalculated = cashHours * userData.cashRate;

    const dailyData = { date: formatDate(date ), totalHours, legalHours, cashHours, legalPay: legalPayCalculated, cashPay: cashPayCalculated, monthNumber: monthNumber };
    // Firestore batch for atomic writes
    const batch = createBatch();

    // Step 4: Insert daily entry
    batch.set(dailyRef, dailyData);

    // Step 5: Update weekly record
    if (weeklyDoc.exists()) {
      const weeklyData = weeklyDoc.data();
      batch.update(weeklyRef, {
        legalHours: weeklyData.legalHours + legalHours,
        cashHours: weeklyData.cashHours + cashHours,
        legalPay: weeklyData.legalPay + legalPayCalculated,
        cashPay: weeklyData.cashPay + cashPayCalculated,
        endDate: date,
      });
    } else {
      batch.set(weeklyRef, {
        weekNumber,
        legalHours,
        cashHours,
        legalPay: legalPayCalculated,
        cashPay: cashPayCalculated,
        startDate: date,
        endDate: date,
        startDateDayNum: new Date(date).getDay()
      });
    }

    // Step 6: Update monthly record
    const monthlyDoc = await getDoc(monthlyRef);
    if (monthlyDoc.exists()) {
      const monthlyData = monthlyDoc.data();
      batch.update(monthlyRef, {
        legalHours: monthlyData.legalHours + legalHours,
        cashHours: monthlyData.cashHours + cashHours,
        legalPay: monthlyData.legalPay + legalPayCalculated,
        cashPay: monthlyData.cashPay + cashPayCalculated,
      });
    } else {
      batch.set(monthlyRef, {
        monthNumber,
        legalHours,
        cashHours,
        legalPay: legalPayCalculated,
        cashPay: cashPayCalculated,
      });
    }

    // Step 7: Update yearly record
    const yearlyDoc = await getDoc(yearlyRef);
    if (yearlyDoc.exists()) {
      const yearlyData = yearlyDoc.data();
      batch.update(yearlyRef, {
        legalHours: yearlyData.legalHours + legalHours,
        cashHours: yearlyData.cashHours + cashHours,
        legalPay: yearlyData.legalPay + legalPayCalculated,
        cashPay: yearlyData.cashPay + cashPayCalculated,
      });
    } else {
      batch.set(yearlyRef, {
        year,
        legalHours,
        cashHours,
        legalPay: legalPayCalculated,
        cashPay: cashPayCalculated,
      });
    }

    // Step 8: Delete past 2nd month data from Daily record
    const pastMonthDate = monthNumber - 2;
    console.log(`Month Number: ${monthNumber}`);
    console.log(`Past Month Number: ${pastMonthDate}`);
    
    const pastDailyCollectionRef1 = collection(db, 'daily', email, String(pastMonthDate));
    const pastDailyRef = query(pastDailyCollectionRef1, where('monthNumber', '==', pastMonthDate))
    const pastDailyDoc2 = await getDocs(pastDailyRef)

    if (pastDailyDoc2.docs.length > 0) {
      pastDailyDoc2.docs.forEach(doc => {
        batch.delete(doc.ref);
      })
    }

    //Step 9: Delete past 8th week data from Weekly record
    const pastWeekNumber = weekNumber - 7;
    console.log(`Past Week Number: ${pastWeekNumber}`);
    const pastWeekRef = doc(collection(db, 'weekly', email, String(pastWeekNumber)), '1');
    const pastWeekDoc = await getDoc(pastWeekRef)
    if (pastWeekDoc.exists()) {
      console.log('2');
      batch.delete(pastWeekRef);
    }

    // Step 10: Delete past 2nd months data from Monthly record
    const pastMonthNumber = monthNumber - 2;
    console.log(`Month Number: ${pastMonthNumber}`);
    const pastMonthlyRef = doc(collection(db, 'monthly', email, String(pastMonthNumber)), '1');
    const pastMonthlyDoc = await getDoc(pastMonthlyRef)
    if (pastMonthlyDoc.exists()) {
      console.log('3');
      batch.delete(pastMonthlyRef);
    }

    // Step 11: Delete past 5 years data from Yearly record
    // const pastYear = new Date(date).getFullYear() - 5;
    // const pastYearlyRef = doc(collection(db, 'yearly', email, String(pastYear)), String(pastYear));
    // const pastYearlyDoc = await getDoc(pastYearlyRef)
    // if (!pastYearlyDoc.exists()) {
    //   batch.delete(pastYearlyRef);
    // }

    // Commit the batch
    try {
      await batch.commit();
      console.log('Data inserted successfully with weekly legal hour limit!');
    } catch (error) {
      console.error('Error inserting data: ', error);
    }
  }

  const onDateChange = (selectedDate) => {
    console.log(`${selectedDate.toISOString()}`)
    setDate(selectedDate);
    setShowCalendar(false);
  };

  const onClockInChange = (event, selectedTime) => {
    const currentTime = selectedTime || clockIn;
    setShowClockIn(Platform.OS === 'ios');
    setClockIn(currentTime);
  };

  const onClockOutChange = (event, selectedTime) => {
    const currentTime = selectedTime || clockOut;
    setShowClockOut(Platform.OS === 'ios');
    setClockOut(currentTime);
  };

  // Handle the addition of hours
  const handleAddHours = async () => {
    try {
      const userRef = doc(db, 'users', email);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data()
      // Step 2: Retrieve the total legal hours worked in the current week so far
      // Check if the user has a start date for week 1
      let startDate;
      if (!userDoc.exists) {
        // If no start date exists, set today as the start date
        startDate = date;
        await userRef.set({ startDate }); // Save the start date for the user
      } else {
        // Retrieve the existing start date  
        startDate = userDoc.data().startDate;
      }

      console.log(`Mail: ${email}`);
      console.log(`Time IN: ${clockIn.getHours()} and Time OUT: ${clockOut.getHours()}`);
      const totalHours = (clockOut - clockIn) / (1000 * 60 * 60); // Convert milliseconds to hours
      console.log(`Total Time: ${totalHours}`);

      // Step 1: Calculate legal and cash hours based on weekly limit
      const { legalHours, cashHours } = calculateHoursForWeek(totalHours, userData, weeklyWorkedLegalHours);

      // Calculate legal and cash pay
      const legalPayCalculated = legalHours * userData.legalPayRate;
      const cashPayCalculated = cashHours * userData.cashPayRate;

      await insertDataWithWeeklyLegalLimit(auth.currentUser.uid, email, date, totalHours, legalPayCalculated, cashPayCalculated);

      alert('Hours added successfully!');
      setClockIn(new Date());
      setClockOut(new Date());
    } catch (error) {
      console.error(error);
      alert('Failed to add hours.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Select Date:</Text>
          <TouchableOpacity style={styles.input} onPress={() => setShowCalendar(true)}>
            <Text style={styles.text}>{date.toISOString().split('T')[0]}</Text>
          </TouchableOpacity>
          {showCalendar && (
            <Calendar
              onDayPress={(day) => {
                const selectedDate = new Date(Date.UTC(
                  parseInt(day.year),
                  parseInt(day.month) - 1, // month is 0-indexed in Date.UTC
                  parseInt(day.day)
                ));
                onDateChange(selectedDate);
              }}
              markedDates={{
                [date.toISOString().split('T')[0]]: { selected: true, marked: true }
              }}
            />
          )}
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Clock-In:</Text>
          <TouchableOpacity style={styles.input} onPress={() => setShowClockIn(true)}>
            <Text style={styles.text}>{clockIn.toLocaleTimeString()}</Text>
          </TouchableOpacity>
          {showClockIn && (
            <DateTimePicker
              value={clockIn}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={onClockInChange}
            />
          )}
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Clock-Out:</Text>
          <TouchableOpacity style={styles.input} onPress={() => setShowClockOut(true)}>
            <Text style={styles.text}>{clockOut.toLocaleTimeString()}</Text>
          </TouchableOpacity>
          {showClockOut && (
            <DateTimePicker
              value={clockOut}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={onClockOutChange}
            />
          )}
        </View>
        <TouchableOpacity style={styles.button} onPress={handleAddHours}>
          <Text style={styles.buttonText}>Add hours</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#121212', //Dark background
    alignItems: 'center',
    padding: 20,
  },
  form: {
    backgroundColor: '#1F1B24', //Slightly lighter dark color for form
    width: '100%',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF', //Light label text color
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#2C2C34', //Slightly lighter dark background for input
    borderWidth: 1,
    borderColor: '#BBBBBB', //Lighter border
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  text: {
    fontSize: 16,
    color: '#FFFFFF' //White text color
  },
  button: {
    backgroundColor: '#3182CE', //Accent color for button
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF', //White button text
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddTodaysTiming;