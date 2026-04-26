import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Colors } from '../theme/Colors';
import { useAuthViewModel } from '../viewmodels/authViewModel';

export const VerifyOTPScreen = ({ navigation, route }: any) => {
  const { email } = route.params;
  const { verifyOTP, forgotPassword, isLoading, error } = useAuthViewModel();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputs = useRef<Array<TextInput | null>>([]);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const onVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      Alert.alert('Error', 'Please enter the 6-digit code');
      return;
    }

    try {
      await verifyOTP(email, otpCode);
      navigation.navigate('ResetPassword', { email, otp: otpCode });
    } catch (err: any) {
      // Error handled by ViewModel
    }
  };

  const onResend = async () => {
    try {
      const newOtp = await forgotPassword(email);
      Alert.alert('Code Resent', `Your new reset code is: ${newOtp}`);
      setOtp(['', '', '', '', '', '']);
      inputs.current[0]?.focus();
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

      <Text style={styles.title}>Verify Code</Text>
      <Text style={styles.subtitle}>Enter the 6-digit code sent to {email}</Text>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputs.current[index] = ref)}
            style={styles.otpInput}
            value={digit}
            onChangeText={(value) => handleOtpChange(value, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            keyboardType="number-pad"
            maxLength={1}
            selectTextOnFocus
          />
        ))}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <TouchableOpacity 
        style={styles.button} 
        onPress={onVerify}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Verify Code</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.resendButton}
        onPress={onResend}
        disabled={isLoading}
      >
        <Text style={styles.resendText}>Didn't receive code? <Text style={styles.resendLink}>Resend</Text></Text>
      </TouchableOpacity>
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
    marginBottom: 40,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  otpInput: {
    width: 45,
    height: 55,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  errorText: {
    color: Colors.error,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    height: 52,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
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
  resendButton: {
    marginTop: 30,
    alignItems: 'center',
  },
  resendText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  resendLink: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
});
