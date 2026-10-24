import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import  Ionicons  from 'react-native-vector-icons/Ionicons'; // عدلها حسب طريقتك
import { colors } from '../theme';
import HomeScreen from '../screens/main/HomeScreen';
import AboutScreen from '../screens/main/AboutScreen';
import DoctorsScreen from '../screens/main/DoctorsScreen';
import ServicesScreen from '../screens/main/ServicesScreen';
import AppointmentScreen from '../screens/main/AppointmentScreen';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { backgroundColor: colors.primary, borderTopColor: colors.goldBorder, height: 65, paddingBottom: 10 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
        tabBarIcon: ({ focused, color, size }) => {
          const icons: any = {
            HomeTab: 'home',
            AboutTab: 'information-circle',
            DoctorsTab: 'people',
            ServicesTab: 'medkit',
            AppointmentTab: 'calendar',
          };
          return <Ionicons name={focused ? icons[route.name] : `${icons[route.name]}-outline`} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: 'الرئيسية' }} />
      <Tab.Screen name="AboutTab" component={AboutScreen} options={{ title: 'عن العيادة' }} />
      <Tab.Screen name="ServicesTab" component={ServicesScreen} options={{ title: 'الخدمات' }} />
      <Tab.Screen name="DoctorsTab" component={DoctorsScreen} options={{ title: 'الأطباء' }} />
      <Tab.Screen name="AppointmentTab" component={AppointmentScreen} options={{ title: 'حجز' }} />
    </Tab.Navigator>
  );
}