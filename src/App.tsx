import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './navigation/AppNavigator';
import { useAuthViewModel } from './viewmodels/authViewModel';

const queryClient = new QueryClient();

function App() {
  const { checkAuth } = useAuthViewModel();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);


  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

export default App;


