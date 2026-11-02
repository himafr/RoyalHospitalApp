import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import AuthStack from './AuthStack';
import MainTabs from './MainTabs';
import { colors } from '../theme';
import ActivateScreen from '../features/auth/ActivateScreen';
import EditModalScreen from '../screens/EditModalScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { loading, isAuthenticated } = useAuth();
  if (loading) return <View style={styles.loader}><ActivityIndicator size="large" color={colors.gold} /></View>;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthStack} />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            
            <Stack.Screen 
              name="Activate" 
              component={ActivateScreen} 
              options={{ 
                presentation: 'modal', 
                headerShown: true,
                title: 'تفعيل الحساب',
                headerTintColor: colors.primary,
                headerStyle: { backgroundColor: colors.white },
              }} 
            />
            <Stack.Screen 
  name="EditModal" 
  component={EditModalScreen} 
  options={({ route }) => ({ 
    presentation: 'modal', 
    headerShown: true, 
    title: route.params?.title || 'تعديل' // بناخد العنوان من الـ Params
  })} 
/>
          </>
        )}

      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg },
});