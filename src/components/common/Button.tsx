import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors } from '../../theme/Colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export const Button = ({ title, onPress, loading, disabled }: ButtonProps) => {
  return (
    <TouchableOpacity
      style={[styles.button, (disabled || loading) && styles.disabled]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={Colors.white} />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 16,
  },
});
