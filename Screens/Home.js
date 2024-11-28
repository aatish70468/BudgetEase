import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, Image } from 'react-native';
import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { auth, db, storage } from './../FirebaseConfig';
import { collection, addDoc, doc, onSnapshot, query, where, updateDoc, getDocs } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native'

const Home = ({ navigation }) => {

  const [weeklyIncome, setWeeklyIncome] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [userPayrate, setUserPayrate] = useState(0);
  const [userTotalHours, setUserTotalHours] = useState(0);

  // Fetch Firestore Data
  useFocusEffect(
    useCallback(() => {
      getUserPayrate();
      getUserHours();
    }, [])
  )

  // Fetch payrate from Firestore
  const getUserPayrate = async () => {
    const collectionRef = collection(db, 'users');
    const getUserDoc = query(collectionRef, where('id', '==', auth.currentUser.uid));
  
    onSnapshot(getUserDoc, (snapshot) => {
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        console.log("User Payrate: ", data.legalRate);  // Debugging Payrate
        setUserPayrate(data.legalRate);
      });
    });
  };
  
  const getUserHours = async () => {
    const month = new Date().getMonth()+1;
    console.log("Current Month: ", month);
    const collectionRef = doc(collection(db, 'monthly', auth.currentUser.email, String(month)), "1");
    let getHours = 0;
  
    const getTotalHours = await getDocs(collectionRef);
    if (getTotalHours.docs.length > 0) {
      getTotalHours.forEach(doc => {
        const data = doc.data();
        console.log("Worked Hours for the day: ", data.legalHours);  // Debugging Hours
        getHours += data.legalHours;
      });
      setUserTotalHours(getHours);
    } else {
      console.log("No hours found for this month");
    }
  };

  // Calculate income after payrate and hours are fetched
  useEffect(() => {
    console.log("Payrate: ", userPayrate, "Total Hours: ", userTotalHours);  // Debugging effect
  
    if (userPayrate > 0 && userTotalHours > 0) {
      const weeklyIncomeCalculated = userTotalHours * userPayrate; 
      const monthlyIncomeCalculated = userTotalHours * userPayrate;
  
      setWeeklyIncome(weeklyIncomeCalculated);
      setMonthlyIncome(monthlyIncomeCalculated);
    }
  }, [userPayrate, userTotalHours]);

  return (
    <ScrollView style={styles.container}>

      {/* Earnings Section */}
      <View style={styles.earningsSection}>
        <Text style={styles.earningsTitle}>Your Earnings</Text>
        <View style={styles.earningsRow}>
          <View style={styles.earningsItem}>
            <Text style={styles.earningsLabel}>This Week</Text>
            <Text style={styles.earningsAmount}>${weeklyIncome.toFixed(2)}</Text>
          </View>
          <View style={styles.earningsItem}>
            <Text style={styles.earningsLabel}>This Month</Text>
            <Text style={styles.earningsAmount}>${monthlyIncome.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      {/* Add Today's Timing Section */}
      <View style={styles.timingSection}>
        <Text style={styles.timingTitle}>Add Today's Timing</Text>
        <Pressable style={styles.timingButton} onPress={() => navigation.navigate('AddTodaysTiming')}>
          <Text style={styles.timingButtonText}>Add Today's Timing</Text>
        </Pressable>
      </View>

      {/* Quick Actions Section */}
      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          <Pressable style={styles.actionItem} onPress={() => navigation.navigate('AddPayRate')}>
            {/* <FontAwesome5 name="money-bill-wave" size={24} color="#63B3ED" /> */}
            <Ionicons name="cash-outline" size={24} color="#63B3ED" />
            <Text style={styles.actionText}>Add PayRate</Text>
          </Pressable>
          <Pressable style={styles.actionItem} onPress={() => navigation.navigate('AddHours')}>
            <Ionicons name="time-outline" size={24} color="#63B3ED" />
            <Text style={styles.actionText}>Add Hours</Text>
          </Pressable>
          <Pressable style={styles.actionItem} onPress={() => navigation.navigate('SetBudget')}>
            <Ionicons name="wallet-outline" size={24} color="#63B3ED" />
            <Text style={styles.actionText}>Set Budget</Text>
          </Pressable>
          {/* <Pressable style={styles.actionItem} onPress={() => navigation.navigate('SetBudget')}>
            <Ionicons name="notifications-outline" size={24} color="#63B3ED" />
            <Text style={styles.actionText}>Notification</Text>
          </Pressable> */}
          <Pressable style={styles.actionItem} onPress={() => navigation.navigate('ViewAll')}>
            <FontAwesome5 name="list-ul" size={24} color="#63B3ED" />
            <Text style={styles.actionText}>View All</Text>
          </Pressable>
        </View>
      </View>

      {/* Summary Section */}
      <View style={styles.summaryViewSection}>
        <Text style={styles.summaarySectionTitle}>View Summary</Text>
        <Pressable
          style={styles.summarySection}
          onPress={() => navigation.navigate('DailySummary')}
        >
          <View style={styles.summaryContent}>
            <Text style={styles.summaryText}>Get details by daily</Text>
          </View>
          <FontAwesome5 name="chevron-right" size={20} color="#63B3ED" />
        </Pressable>
        <Pressable
          style={styles.summarySection}
          onPress={() => navigation.navigate('WeeklySummary')}
        >
          <View style={styles.summaryContent}>
            <Text style={styles.summaryText}>Get details by weekly</Text>
          </View>
          <FontAwesome5 name="chevron-right" size={20} color="#63B3ED" />
        </Pressable>
        <Pressable
          style={styles.summarySection}
          onPress={() => navigation.navigate('MonthlySummary')}
        >
          <View style={styles.summaryContent}>
            <Text style={styles.summaryText}>Get details by monthly</Text>
          </View>
          <FontAwesome5 name="chevron-right" size={20} color="#63B3ED" />
        </Pressable>
        <Pressable
          style={styles.summarySection}
          onPress={() => navigation.navigate('YearlySummary')}
        >
          <View style={styles.summaryContent}>
            <Text style={styles.summaryText}>Get details by yearly</Text>
          </View>
          <FontAwesome5 name="chevron-right" size={20} color="#63B3ED" />
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Dark background for the app
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#2D3748', // Darker header background
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F7FAFC', // Light title for dark theme
  },
  subtitle: {
    fontSize: 16,
    color: '#A0AEC0', // Lighter subtitle
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
    backgroundColor: '#3182CE', // Strong contrast for earnings section
    borderRadius: 20,
    margin: 20,
    padding: 20,
    marginTop: 60
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
    color: '#F7FAFC', // Light text for section titles
    marginBottom: 16,
  },
  summaarySectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F7FAFC', // Light text for section titles
    marginLeft: 20
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionItem: {
    width: '48%',
    backgroundColor: '#2D3748', // Dark background for action items
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
    color: '#E2E8F0', // Light text for action items
  },
  summarySection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2D3748',
    borderRadius: 12,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
    marginTop: 10,
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
    color: '#E2E8F0',
    marginBottom: 4,
  },
  viewSummary: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#63B3ED', // Light blue for call-to-action
  },
  timingSection: {
    margin: 20,
    marginBottom: 0,
  },
  timingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F7FAFC', // Light text for section titles
    marginBottom: 16,
  },
  timingButton: {
    backgroundColor: '#3182CE', // Light blue for button
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  timingButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default Home;