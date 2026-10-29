import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import CustomTabBar from '../components/CustomTabBar';
import AboutScreen from '../screens/main/AboutScreen';
import AppointmentScreen from '../screens/main/AppointmentScreen';
import DoctorsScreen from '../screens/main/DoctorsScreen';
import HomeScreen from '../screens/main/HomeScreen';
import ServicesScreen from '../screens/main/ServicesScreen';
import { useAuth } from '../context/AuthContext';
import DoctorHomeScreen from '../screens/main/DoctorHomeScreen';
import PatientHomeScreen from '../screens/main/PatientHomeScreen';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  const {role}=useAuth()
  const isDoctor=role=="DOCTOR"
   return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="HomeTab" component={isDoctor?DoctorHomeScreen:PatientHomeScreen} />
      <Tab.Screen name="AboutTab" component={AboutScreen} />
      <Tab.Screen name="AppointmentTab" component={AppointmentScreen} />
      <Tab.Screen name="ServicesTab" component={ServicesScreen} />
      <Tab.Screen name="DoctorsTab" component={DoctorsScreen} />
    </Tab.Navigator>
  );
}

    // <Tab.Navigator>
    // </Tab.Navigator>
    //   screenOptions={({ route }) => ({
    //     headerShown: false,
    //     tabBarActiveTintColor: colors.gold,
    //     tabBarInactiveTintColor: colors.textMuted,
    //     tabBarStyle: {
    //       backgroundColor: colors.primary,
    //       borderTopColor: colors.goldBorder,
    //       borderTopWidth: 1,
    //       height: 65 + insets.bottom, 
    //       paddingBottom: insets.bottom > 0 ? insets.bottom : 10, 
    //       paddingTop: 10,
    //       elevation: 20, 
    //       zIndex: 100,
    //     },
    //     tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
    //     tabBarIcon: ({ focused, color, size }) => {
    //       const icons: any = {
    //         HomeTab: 'home',
    //         AboutTab: 'information-circle',
    //         DoctorsTab: 'people',
    //         ServicesTab: 'medkit',
    //         AppointmentTab: 'calendar',
    //       };
    //       return (
    //         <Ionicons
    //           name={
    //             focused ? icons[route.name] : `${icons[route.name]}-outline`
    //           }
    //           size={size}
    //           color={color}
    //         />
    //       );
    //     },
    //   })}
    // >
    //   <Tab.Screen
    //     name="HomeTab"
    //     component={HomeScreen}
    //     options={{ title: 'الرئيسية' }}
    //   />
    //   <Tab.Screen
    //     name="AboutTab"
    //     component={AboutScreen}
    //     options={{ title: 'عن العيادة' }}
    //   />
    //   <Tab.Screen
    //     name="ServicesTab"
    //     component={ServicesScreen}
    //     options={{ title: 'الخدمات' }}
    //   />
    //   <Tab.Screen
    //     name="DoctorsTab"
    //     component={DoctorsScreen}
    //     options={{ title: 'الأطباء' }}
    //   />
    //   <Tab.Screen
    //     name="AppointmentTab"
    //     component={AppointmentScreen}
    //     options={{ title: 'حجز' }}
    //   />