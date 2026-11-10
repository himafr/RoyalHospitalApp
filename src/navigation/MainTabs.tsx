import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import CustomTabBar from '../components/CustomTabBar';
import { useAuth } from '../context/AuthContext';
import AppointmentScreen from '../features/appointment/AppointmentScreen';
import DoctorHomeScreen from '../features/doctor/DoctorHomeScreen';
import AboutScreen from '../screens/main/AboutScreen';
import DoctorsScreen from '../screens/main/DoctorsScreen';
import HomeScreen from '../screens/main/HomeScreen';
import ServicesScreen from '../screens/main/ServicesScreen';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  const {role}=useAuth()
  const isDoctor=role==="DOCTOR"
   return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        transitionSpec: {
          animation: 'timing',
          config: { duration: 220 },
        },
      }}
    >
      <Tab.Screen name="HomeTab" component={isDoctor?DoctorHomeScreen:HomeScreen} />
      <Tab.Screen name="AppointmentTab" component={AppointmentScreen} />
      <Tab.Screen name="AboutTab" component={AboutScreen} />
      <Tab.Screen name="ServicesTab" component={ServicesScreen} />
      <Tab.Screen name="DoctorsTab" component={DoctorsScreen} />
    </Tab.Navigator>
  );
}
