import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../screens/LoginScreen';
import { SignupScreen } from '../screens/SignupScreen';
import { ForgotPasswordScreen } from '../screens/ForgotPasswordScreen';
import { VerifyOTPScreen } from '../screens/VerifyOTPScreen';
import { ResetPasswordScreen } from '../screens/ResetPasswordScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { useAuthViewModel } from '../viewmodels/authViewModel';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  const { isAuthenticated } = useAuthViewModel();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="Main" component={MainStack} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
};

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    <Stack.Screen name="VerifyOTP" component={VerifyOTPScreen} />
    <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
  </Stack.Navigator>
);


const MainStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={HomeScreen} />
  </Stack.Navigator>
);

