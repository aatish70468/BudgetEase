import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { auth } from './FirebaseConfig';
import { signOut } from 'firebase/auth';
import SignIn from './Screens/SignIn';
import SignUp from './Screens/SignUp';
import Home from './Screens/Home';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {

  // Logout button pressed logic
  const btnLogoutPressed = async (navigation) => {
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
    <Pressable style={styles.button} onPress={() => btnLogoutPressed(navigation)}>
      <Text style={styles.buttonText}>Logout</Text>
    </Pressable>
  );

  const screenOptions = {
    headerTitleAlign: 'center',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator screenOptions={screenOptions} initialRouteName="SignIn">
        <Stack.Screen 
          name="SignIn" 
          component={SignIn} 
          options={{ headerTitle: 'BudgetEase' }} 
        />
        <Stack.Screen 
          name="SignUp" 
          component={SignUp} 
          options={{ headerTitle: 'BudgetEase' }} 
        />
        <Stack.Screen 
          name="Home" 
          component={Home} 
          options={({ navigation }) => ({
            headerTitle: 'Home',
            headerBackVisible: false,
            headerRight: () => (
              <View style={{ flexDirection: 'row', paddingRight: 10 }}>
                {btnDisplayLogout({ navigation })}
              </View>
            ),
          })} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#ff0000',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});