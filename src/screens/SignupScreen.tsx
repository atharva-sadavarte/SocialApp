import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../components/common/Button';
import { Colors } from '../theme/Colors';
import { useAuthViewModel } from '../viewmodels/authViewModel';

const signupSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupForm = z.infer<typeof signupSchema>;

export const SignupScreen = ({ navigation }: any) => {
  const { signup, isLoading } = useAuthViewModel();
  
  const { control, handleSubmit, formState: { errors } } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSignup = async (data: SignupForm) => {
    try {
      await signup(data.username, data.email, data.password, data.confirmPassword);
      Alert.alert('Success', 'Account created successfully! Please login.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (err: any) {
      Alert.alert('Signup Error', err.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      
      <Controller
        control={control}
        name="username"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, errors.username && styles.inputError]}
            placeholder="Username"
            placeholderTextColor={Colors.textSecondary}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
          />
        )}
      />
      {errors.username && <Text style={styles.errorText}>{errors.username.message}</Text>}

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            placeholder="Email"
            placeholderTextColor={Colors.textSecondary}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        )}
      />
      {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, errors.password && styles.inputError]}
            placeholder="Password"
            placeholderTextColor={Colors.textSecondary}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            secureTextEntry
          />
        )}
      />
      {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, errors.confirmPassword && styles.inputError]}
            placeholder="Confirm Password"
            placeholderTextColor={Colors.textSecondary}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            secureTextEntry
          />
        )}
      />
      {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>}

      <Button 
        title="Sign Up" 
        onPress={handleSubmit(onSignup)} 
        loading={isLoading} 
      />

      <TouchableOpacity 
        onPress={() => navigation.navigate('Login')}
        style={styles.footer}
      >
        <Text style={styles.footerText}>
          Already have an account? <Text style={styles.linkText}>Login</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    color: Colors.primary,
    letterSpacing: 1,
  },
  input: {
    height: 55,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 10,
    backgroundColor: Colors.surface,
    fontSize: 16,
    color: Colors.text,
  },
  inputError: {
    borderColor: Colors.error,
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 5,
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  footerText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  linkText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
});

