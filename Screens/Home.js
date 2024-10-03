import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';

const Home = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>BudgetEase</Text>
        <Pressable onPress={() => console.log('Notification pressed')}>
          <MaterialIcons name="notifications-none" size={28} color="black" />
        </Pressable>
      </View>

      {/* Top Section */}
      <View style={styles.topSection}>
        <Text style={styles.greeting}>Hi There</Text>
        <View style={styles.actionRow}>
          <Pressable style={styles.actionItem} onPress={() => console.log('Add PayRate pressed')}>
            <FontAwesome name="credit-card" size={24} color="black" />
            <Text style={styles.actionText}>Add PayRate</Text>
          </Pressable>
          <Pressable style={styles.actionItem} onPress={() => console.log('Add Time pressed')}>
            <Ionicons name="time-outline" size={24} color="black" />
            <Text style={styles.actionText}>Add Time</Text>
          </Pressable>
          <Pressable style={styles.actionItem} onPress={() => console.log('Set Budget pressed')}>
            <Ionicons name="wallet-outline" size={24} color="black" />
            <Text style={styles.actionText}>Set Budget</Text>
          </Pressable>
        </View>
        <Pressable onPress={() => navigation.navigate('ViewAll')}>
          <Text style={styles.viewAll}>View All</Text>
        </Pressable>
      </View>

      {/* Earnings Section */}
      <View style={styles.earningsSection}>
        <Text style={styles.earningsText}>Your earnings this week:</Text>
        <Text style={styles.earningsAmount}>$330</Text>
        <Text style={styles.earningsText}>Your earnings this month:</Text>
        <Text style={styles.earningsAmount}>$1200</Text>
      </View>

      {/* Summary Section */}
      <View style={styles.summarySection}>
        <Text style={styles.summaryText}>Get more detailed insights</Text>
        <Pressable onPress={() => navigation.navigate('Summary')}>
          <Text style={styles.viewSummary}>View Summary</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  topSection: {
    backgroundColor: '#f8b9b9',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  actionItem: {
    alignItems: 'center',
    flex: 1,
  },
  actionText: {
    marginTop: 10,
    fontSize: 14,
  },
  viewAll: {
    color: '#007bff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  earningsSection: {
    marginBottom: 20,
    alignItems: 'center',
  },
  earningsText: {
    fontSize: 18,
    color: '#333',
  },
  earningsAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  summarySection: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 16,
    marginBottom: 10,
  },
  viewSummary: {
    fontSize: 18,
    color: '#32cd32',
    fontWeight: 'bold',
  },
});
