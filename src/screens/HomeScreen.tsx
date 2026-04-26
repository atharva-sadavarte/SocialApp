import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../theme/Colors';
import { useAuthViewModel } from '../viewmodels/authViewModel';

export const HomeScreen = () => {
  const { user, logout } = useAuthViewModel();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>SocialApp</Text>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.welcome}>Welcome back,</Text>
        <Text style={styles.username}>{user?.username || 'User'}!</Text>
        <Text style={styles.placeholder}>Your feed will appear here soon.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    letterSpacing: 1,
  },
  logoutText: {
    color: Colors.error,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcome: {
    fontSize: 18,
    color: Colors.textSecondary,
  },
  username: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 20,
  },
  placeholder: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
