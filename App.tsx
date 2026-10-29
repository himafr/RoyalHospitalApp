import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { decode as base64Decode } from 'base-64';
import { AuthProvider } from './src/context/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';
(globalThis as any).atob = base64Decode;
export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content"  />
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}