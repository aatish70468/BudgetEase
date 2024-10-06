import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import firestore from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';

const AddHours = () => {
  const [date, setDate] = useState(new Date());
  const [clockIn, setClockIn] = useState(new Date());
  const [clockOut, setClockOut] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [showClockIn, setShowClockIn] = useState(false);
  const [showClockOut, setShowClockOut] = useState(false);

  const onDateChange = (selectedDate) => {
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

  const handleAddHours = async () => {
    try {
      const totalHours = (clockOut - clockIn) / (1000 * 60 * 60); // Convert milliseconds to hours
      await firestore().collection('hours').add({
        date: date.toDateString(),
        clockIn: clockIn.toLocaleTimeString(),
        clockOut: clockOut.toLocaleTimeString(),
        hours: totalHours,
      });
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
            <Text>{date.toDateString()}</Text>
          </TouchableOpacity>
          {showCalendar && (
            <Calendar
              onDayPress={(day) => onDateChange(new Date(day.timestamp))}
              markedDates={{
                [date.toISOString().split('T')[0]]: {selected: true, marked: true}
              }}
            />
          )}
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Clock-In:</Text>
          <TouchableOpacity style={styles.input} onPress={() => setShowClockIn(true)}>
            <Text>{clockIn.toLocaleTimeString()}</Text>
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
            <Text>{clockOut.toLocaleTimeString()}</Text>
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
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    padding: 20,
  },
  form: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  button: {
    backgroundColor: '#4F46E5',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddHours;