import React from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, Image } from 'react-native';
import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';

const Home = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>BudgetEase</Text>
          <Text style={styles.subtitle}>Welcome back, User!</Text>
        </View>
        <View style={styles.headerIcons}>
          <Pressable onPress={() => navigation.navigate('Notification')} style={styles.iconButton}>
            <MaterialIcons name="notifications-none" size={28} color="#4A5568" />
          </Pressable>
          <Pressable onPress={() => navigation.navigate('Profile')} style={styles.profileButton}>
            <Image
              source={{ uri: 'https://example.com/profile-image.jpg' }}
              style={styles.profileImage}
            />
          </Pressable>
        </View>
      </View>

      {/* Earnings Section */}
      <View style={styles.earningsSection}>
        <Text style={styles.earningsTitle}>Your Earnings</Text>
        <View style={styles.earningsRow}>
          <View style={styles.earningsItem}>
            <Text style={styles.earningsLabel}>This Week</Text>
            <Text style={styles.earningsAmount}>$330</Text>
          </View>
          <View style={styles.earningsItem}>
            <Text style={styles.earningsLabel}>This Month</Text>
            <Text style={styles.earningsAmount}>$1200</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions Section */}
      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          <Pressable style={styles.actionItem} onPress={() => navigation.navigate('AddPayRate')}>
            <FontAwesome5 name="money-bill-wave" size={24} color="#4299E1" />
            <Text style={styles.actionText}>Add PayRate</Text>
          </Pressable>
          <Pressable style={styles.actionItem} onPress={() => navigation.navigate('AddHours')}>
            <Ionicons name="time-outline" size={24} color="#4299E1" />
            <Text style={styles.actionText}>Add Hours</Text>
          </Pressable>
          <Pressable style={styles.actionItem} onPress={() => navigation.navigate('SetBudget')}>
            <Ionicons name="wallet-outline" size={24} color="#4299E1" />
            <Text style={styles.actionText}>Set Budget</Text>
          </Pressable>
          <Pressable style={styles.actionItem} onPress={() => navigation.navigate('ViewAll')}>
            <FontAwesome5 name="list-ul" size={24} color="#4299E1" />
            <Text style={styles.actionText}>View All</Text>
          </Pressable>
        </View>
      </View>

      {/* Summary Section */}
      <Pressable 
        style={styles.summarySection} 
        onPress={() => navigation.navigate('Summary')}
      >
        <View style={styles.summaryContent}>
          <Text style={styles.summaryText}>Get more detailed insights</Text>
          <Text style={styles.viewSummary}>View Summary</Text>
        </View>
        <FontAwesome5 name="chevron-right" size={20} color="#4299E1" />
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
    marginTop: 4,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginRight: 16,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  earningsSection: {
    backgroundColor: '#4299E1',
    borderRadius: 20,
    margin: 20,
    padding: 20,
  },
  earningsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  earningsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  earningsItem: {
    alignItems: 'center',
  },
  earningsLabel: {
    fontSize: 14,
    color: '#E2E8F0',
    marginBottom: 8,
  },
  earningsAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  actionsSection: {
    margin: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionItem: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#4A5568',
  },
  summarySection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    margin: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryContent: {
    flex: 1,
  },
  summaryText: {
    fontSize: 16,
    color: '#4A5568',
    marginBottom: 4,
  },
  viewSummary: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4299E1',
  },
});

export default Home;