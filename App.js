import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { auth } from './FirebaseConfig';
import { signOut } from 'firebase/auth';
import SignIn from './Screens/SignIn';
import SignUp from './Screens/SignUp';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {

  //when logout button pressed
  const btnLogoutPressed = async ({ navigation }) => {
    try {
      await signOut(auth);
      if (navigation.canGoBack()) {
        navigation.dispatch(StackActions.popToTop());
      }
    } catch (err) {
      console.error('Failed to sign out:', err);
    }
  }

  const btnDisplayLogout = ({navigation}) => (
    <Pressable style={styles.button} onPress={() => btnLogoutPressed(navigation)}>
      <Text style={styles.buttonText}>Logout</Text>
    </Pressable>
  )

  const screenOptions = {
    headerTitleAlign: 'center',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
    headerRight: ({ navigation }) => (
      <View style={{ flexDirection: 'row' }}>
        {btnDisplayLogout({navigation})}
      </View>
    ),
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator  screenOptions={screenOptions} initialRouteName='SignIn'>
        <Stack.Screen name="SignIn" component={SignIn} options={{}} />
        <Stack.Screen name="SignUp" component={SignUp} options={{}} />
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
    marginBottom: 10,
  }
});
