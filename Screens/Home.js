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
        <MaterialIcons name="notifications-none" size={28} color="#4A5568" />
        </Pressable>
      </View>

      {/* Top Section */}
      <View style={styles.topSection}>
        <Text style={styles.greeting}>Hi There</Text>
        <View style={styles.actionRow}>
        <Pressable 
  style={styles.actionItem} 
  onPress={() => navigation.navigate('AddPayRate')}>
  <FontAwesome name="credit-card" size={24} color="#4299E1" />
  <Text style={styles.actionText}>Add PayRate</Text>
</Pressable>

<Pressable 
  style={styles.actionItem} 
  onPress={() => navigation.navigate('AddHours')}
>
<Ionicons name="time-outline" size={24} color="#4299E1" />
  <Text style={styles.actionText}>Add Hours</Text>
</Pressable>

          <Pressable style={styles.actionItem} onPress={() => console.log('Set Budget pressed')}>
          <Ionicons name="wallet-outline" size={24} color="#4299E1" />
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
    backgroundColor: '#F0F4F8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A365D',
  },
  topSection: {
    backgroundColor: '#4299E1',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  greeting: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 24,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  actionItem: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  actionText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
  },
  viewAll: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  earningsSection: {
    marginBottom: 24,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  earningsText: {
    fontSize: 18,
    color: '#4A5568',
    marginBottom: 8,
  },
  earningsAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2D3748',
    marginVertical: 8,
  },
  summarySection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryText: {
    fontSize: 18,
    marginBottom: 16,
    color: '#4A5568',
  },
  viewSummary: {
    fontSize: 18,
    color: '#4299E1',
    fontWeight: 'bold',
  },
});
