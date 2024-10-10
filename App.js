import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { auth } from './FirebaseConfig';
import { signOut } from 'firebase/auth';
import SignIn from './Screens/SignIn';
import SignUp from './Screens/SignUp';
import Home from './Screens/Home';
import Profile from './Screens/Profile';
import ForgotPassword from './Screens/ForgotPassword';
import Splash from './Screens/Splash';
import AddHours from './Screens/AddHours';
import AddPayRate from './Screens/AddPayRate';
import Summary from './Screens/Summary';
import SetBudget from './Screens/SetBudget';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {

  // Logout button pressed logic
  const btnLogoutPressed = async ({ navigation }) => {
    try {
      await signOut(auth);
      if (navigation.canGoBack()) {
        navigation.dispatch(StackActions.popToTop());
      }
    } catch (err) {
      console.error('Failed to sign out:', err);
    }
  };

  // Display Logout button in the header
  const btnDisplayLogout = ({ navigation }) => (
    <Pressable style={styles.button} onPress={() => btnLogoutPressed({ navigation })}>
      <Text style={styles.buttonText}>Logout</Text> 
    </Pressable>
  );

  // Bottom tab navigation
  const TabNavigator = () => (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = route.name === 'Home' ? (focused ? 'home' : 'home-outline') : (focused ? 'person' : 'person-outline');
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarStyle: {
          backgroundColor: '#1F1F1F', // Dark tab bar background
          height: 50,
          padding: 10
        },
        tabBarActiveTintColor: '#3182CE', // Active tab color
        tabBarInactiveTintColor: '#3182CE',
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={Home} 
        options={{ headerShown: false }} // No header for Home in tabs
      />
      <Tab.Screen 
        name="Profile" 
        component={Profile} 
        options={{ headerShown: false }} // No header for Profile in tabs
      />
    </Tab.Navigator>
  );

  const screenOptions = {
    headerTitleAlign: 'center',
    headerTitleStyle: {
      fontWeight: 'bold',
      color: '#F5F5F5', // Light text color for header
      fontSize: 20,
    },
    headerStyle: {
      backgroundColor: '#333', // Dark header background
    },
    headerTintColor: '#F5F5F5' // Light tint color for icons
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={screenOptions} initialRouteName="Splash">
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="SignIn" 
          component={SignIn} 
          options={{ 
            headerTitle: 'BudgetEase',
          }} 
        />
        <Stack.Screen 
          name="SignUp" 
          component={SignUp} 
          options={{ headerTitle: 'BudgetEase' }} 
        />
        <Stack.Screen 
          name="ForgotPassword" 
          component={ForgotPassword} 
          options={{ headerTitle: 'BudgetEase' }} 
        />
        
        <Stack.Screen 
          name="Home" 
          component={TabNavigator} // Show TabNavigator when logged in
          options={({ navigation }) => ({
            headerBackVisible: false,
            headerRight: () => btnDisplayLogout({ navigation }),
          })} 
        />
        <Stack.Screen 
          name="AddHours" 
          component={AddHours} 
          options={{ headerTitle: 'Add Hours' }} 
        />
        <Stack.Screen 
          name="AddPayRate" 
          component={AddPayRate} 
          options={{ headerTitle: 'Add PayRate' }} 
        />
        <Stack.Screen 
          name="SetBudget" 
          component={SetBudget} 
          options={{ headerTitle: 'Set Budget' }} 
        />
        <Stack.Screen 
          name="Summary" 
          component={Summary} 
          options={{ headerTitle: 'Summary' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Dark background color for app
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#3182CE', // Bright color for logout button
    padding: 10,
    borderRadius: 5,
    marginRight: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
