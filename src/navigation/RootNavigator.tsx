import React from 'react';
import { createNavigationContainerRef, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import AuthStack from './AuthStack';
import MainTabs from './MainTabs';
import { colors } from '../theme';
import ActivateScreen from '../features/auth/ActivateScreen';
import EditModalScreen from '../screens/EditModalScreen';
import DoctorProfileScreen from '../features/doctor/DoctorProfileScreen';
import PatientHomeScreen from '../screens/main/HomeScreen';

const Stack = createNativeStackNavigator();
export const navigationRef = createNavigationContainerRef();

export default function RootNavigator() {
  const { loading, isAuthenticated,role } = useAuth();
  if (loading)
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.gold} />
      </View>
    );

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade_from_bottom',
          animationDuration: 250,
        }}
      >
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthStack} />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="Profile" component={role==="DOCTOR"?DoctorProfileScreen:PatientHomeScreen} />

            <Stack.Screen
              name="Activate"
              component={ActivateScreen}
              options={{
                presentation: 'modal',
                headerShown: true,
                animationDuration: 250,
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
                animationDuration: 250,
                title: route.params?.title || 'تعديل', 
              })}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bg,
  },
});
