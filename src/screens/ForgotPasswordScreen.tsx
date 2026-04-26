import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Colors } from '../theme/Colors';
import { useAuthViewModel } from '../viewmodels/authViewModel';

const schema = z.object({
  email: z.string().email('Invalid email address'),
});

type FormData = z.infer<typeof schema>;

export const ForgotPasswordScreen = ({ navigation }: any) => {
  const { forgotPassword, isLoading, error, clearError } = useAuthViewModel();

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const otp = await forgotPassword(data.email);
      // For testing purposes as per backend
      Alert.alert('OTP Sent', `Your reset code is: ${otp}`, [
        { text: 'OK', onPress: () => navigation.navigate('VerifyOTP', { email: data.email }) }
      ]);
    } catch (err: any) {
      // Error handled by ViewModel
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subtitle}>Enter your email address and we'll send you a 6-digit code to reset your password.</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Email Address</Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="name@example.com"
              placeholderTextColor={Colors.textSecondary}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Send Code</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
  },
  backButton: {
    marginTop: 20,
    marginBottom: 30,
  },
  backButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 30,
    lineHeight: 22,
  },
  form: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    height: 50,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  inputError: {
    borderColor: Colors.error,
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    marginBottom: 16,
    marginTop: -8,
  },
  button: {
    height: 52,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
