import {
  createNavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ActivityIndicator,  Image,  StyleSheet, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ModeContext';
import ActivateScreen from '../features/auth/ActivateScreen';
import DoctorProfileScreen from '../features/doctor/DoctorProfileScreen';
import PatientProfileScreen from '../features/patient/PatientProfileScreen';
import EditModalScreen from '../screens/EditModalScreen';
import AuthStack from './AuthStack';
import MainTabs from './MainTabs';
import AboutScreen from '../screens/AboutScreen';
import ServiceDetailsScreen from '../features/services/ServiceDetailsScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator();
export const navigationRef = createNavigationContainerRef();

export default function RootNavigator() {
  const { colors, t, isRTL } = useTheme();
  const { loading, isAuthenticated, role } = useAuth();
  if (loading)
    return (
      <View style={[styles.loader, { backgroundColor: colors.background }]}>
      <Image  source={require('../assets/images/md.png')} />
      </View>
    );

  return (
    <NavigationContainer direction={isRTL ? 'rtl' : 'ltr'}>
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
            <Stack.Screen
              name="Profile"
              component={
                role === 'DOCTOR' ? DoctorProfileScreen : PatientProfileScreen
              }
            />

            <Stack.Screen 
            name="About" 
            component={AboutScreen} 
            options={{headerShown:false}} />
            <Stack.Screen 
            name="Settings" 
            component={SettingsScreen} 
            options={{headerShown:false}} />
            <Stack.Screen
              name="ServiceDetails"
              component={ServiceDetailsScreen}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="Activate"
              component={ActivateScreen}
              options={{
                presentation: 'modal',
                headerShown: true,
                animationDuration: 250,
                title: t('activate_account'),
                headerTintColor: colors.primary,
                headerStyle: { backgroundColor: colors.backgroundAlt },
              }}
            />
            <Stack.Screen
              name="EditModal"
              component={EditModalScreen}
              options={({ route }: { route: any }) => ({
                presentation: 'modal',
                headerShown: true,
                animationDuration: 250,
                title: route.params?.title || t('edit'),
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
  },
});
