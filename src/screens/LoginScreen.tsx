import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../components/common/Button';
import { Colors } from '../theme/Colors';
import { useAuthViewModel } from '../viewmodels/authViewModel';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export const LoginScreen = ({ navigation }: any) => {
  const { login, isLoading, error } = useAuthViewModel();
  
  const { control, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onLogin = async (data: LoginForm) => {
    try {
      await login(data.email, data.password);
    } catch (err: any) {
      Alert.alert('Login Error', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SocialApp</Text>
      
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

      <TouchableOpacity 
        style={styles.forgotPasswordButton}
        onPress={() => navigation.navigate('ForgotPassword')}
      >
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Button 
        title="Login" 
        onPress={handleSubmit(onLogin)} 
        loading={isLoading} 
      />

      <TouchableOpacity 
        onPress={() => navigation.navigate('Signup')}
        style={styles.footer}
      >
        <Text style={styles.footerText}>
          Don't have an account? <Text style={styles.linkText}>Sign Up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    color: Colors.primary,
    letterSpacing: 2,
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
  },
  footerText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  linkText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    marginTop: -8,
  },
  forgotPasswordText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});
