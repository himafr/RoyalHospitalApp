import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import CustomTabBar from '../components/CustomTabBar';
import AppointmentScreen from '../features/appointment/AppointmentScreen';
import DoctorsScreen from '../screens/main/DoctorsScreen';
import HomeScreen from '../screens/main/HomeScreen';
import ServicesScreen from '../screens/main/ServicesScreen';
import { useAuth } from '../context/AuthContext';
import PatientHomeScreen from '../features/patient/PatientProfileScreen';
import DoctorHomeScreen from '../features/doctor/DoctorHomeScreen';
import DoctorProfileScreen from '../features/doctor/DoctorProfileScreen';

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
      <Tab.Screen name="Profile" component={isDoctor?DoctorProfileScreen:PatientHomeScreen} />
      {/* <Tab.Screen name="AboutTab" component={AboutScreen} /> */}
      <Tab.Screen name="ServicesTab" component={ServicesScreen} />
      <Tab.Screen name="DoctorsTab" component={DoctorsScreen} />
    </Tab.Navigator>
  );
}
