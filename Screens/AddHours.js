import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, TextInput, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import firestore from 'firebase/firestore';

const AddHours = () => {
  const [date, setDate] = useState(new Date());
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const handleAddHours = async () => {
    try {
      const totalHours = parseFloat(hours) + (parseFloat(minutes) / 60);
      await firestore().collection('hours').add({
        date: date.toDateString(),
        hours: totalHours,
      });
      alert('Hours added successfully!');
      setHours('');
      setMinutes('');
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
              onDayPress={(day) => {
                setDate(new Date(day.timestamp));
                setShowCalendar(false);
              }}
              markedDates={{
                [date.toISOString().split('T')[0]]: {selected: true, marked: true}
              }}
            />
          )}
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Hours:</Text>
          <TextInput
            style={styles.input}
            onChangeText={setHours}
            value={hours}
            keyboardType="numeric"
            placeholder="Enter hours"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Minutes:</Text>
          <TextInput
            style={styles.input}
            onChangeText={setMinutes}
            value={minutes}
            keyboardType="numeric"
            placeholder="Enter minutes"
          />
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