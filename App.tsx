import { decode as base64Decode } from 'base-64';
import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { AuthProvider } from './src/context/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';
import { toastConfig } from './src/utils/toast';
import { ThemeProvider } from './src/context/ModeContext';
(globalThis as any).atob = base64Decode;
export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <AuthProvider>
        <ThemeProvider>
          <RootNavigator />
          <Toast config={toastConfig} />
        </ThemeProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
