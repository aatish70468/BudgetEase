import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Profile = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Profile Page</Text>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
