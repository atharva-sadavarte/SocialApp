import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Colors } from '../theme/Colors';
import { useAuthViewModel } from '../viewmodels/authViewModel';

const schema = z.object({
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

export const ResetPasswordScreen = ({ navigation, route }: any) => {
  const { email, otp } = route.params;
  const { resetPassword, isLoading, error } = useAuthViewModel();

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await resetPassword({
        email,
        otp,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      
      Alert.alert('Success', 'Your password has been reset successfully.', [
        { text: 'Login Now', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (err: any) {
      // Error handled by ViewModel
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>New Password</Text>
      <Text style={styles.subtitle}>Create a new password that is at least 6 characters long.</Text>

      <View style={styles.form}>
        <Text style={styles.label}>New Password</Text>
        <Controller
          control={control}
          name="newPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.newPassword && styles.inputError]}
              placeholder="••••••••"
              placeholderTextColor={Colors.textSecondary}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry
            />
          )}
        />
        {errors.newPassword && <Text style={styles.errorText}>{errors.newPassword.message}</Text>}

        <Text style={styles.label}>Confirm New Password</Text>
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.confirmPassword && styles.inputError]}
              placeholder="••••••••"
              placeholderTextColor={Colors.textSecondary}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry
            />
          )}
        />
        {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>}

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Reset Password</Text>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 60,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 30,
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
