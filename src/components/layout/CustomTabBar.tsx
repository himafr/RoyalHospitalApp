import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React, { useEffect } from 'react';
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../context/ModeContext';
import { lightMode, spacing } from '../../theme';

function AnimatedTabIcon({
  name,
  focused,
}: {
  name: string;
  focused: boolean;
}) {
  const scale = React.useRef(new Animated.Value(1)).current;
  const {colors}=useTheme();
  useEffect(() => {
    Animated.spring(scale, {
      toValue: focused ? 1.12 : 1,
      speed: 20,
      bounciness: 4,
      useNativeDriver: true,
    }).start();
  }, [focused, scale]);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Ionicons
        name={focused ? name : `${name}-outline`}
        size={24}
        color={focused ? colors.textSecondary : colors.tabInactive}
      />
    </Animated.View>
  );
}

export default function CustomTabBar({
  state,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const isIOS = Platform.OS === 'ios';
  const {colors}=useTheme();
  const styles=getStyles(colors)
  const barHeight = 110 + (isIOS ? insets.bottom : 0);

  return (
    <View
      style={[
        styles.container,
        { height: barHeight, paddingBottom: insets.bottom,
          backgroundColor: colors.background
         },
      ]}
    >
      <View
        style={[
          styles.bg,
          { height: 60, paddingBottom: isIOS ? insets.bottom : 10 },
        ]}
      >
        {/* <View style={styles.curvedCutout} /> */}

        <View style={[styles.tabsRow]}>
          {state.routes.map((route, index) => {
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            const icons: any = {
              HomeTab: 'home',
              AboutTab: 'information-circle',
              Profile:"person-circle",
              DoctorsTab: 'people',
              ServicesTab: 'medkit',
              AppointmentTab: 'calendar',
            };
            
            const labels: any = {
              HomeTab: 'الرئيسية',
              Profile:"الملف الشخصي",
              AboutTab: 'عن العيادة',
              DoctorsTab: 'الأطباء',
              ServicesTab: 'الخدمات',
              AppointmentTab: 'حجز',
            };
            return (
              
                <TouchableOpacity
                  key={route.key}
                  onPress={onPress}
                  style={[styles.tabItem]}
                  activeOpacity={0.7}
                >
                  <AnimatedTabIcon
                    name={icons[route.name]}
                    focused={isFocused}
                  />
                  <Text style={[styles.label, isFocused && styles.labelActive]}>
                    {labels[route.name]}
                  </Text>
                </TouchableOpacity>
              
            );
          })}
        </View>
      </View>
    </View>
  );
}

const getStyles = (colors: typeof lightMode) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      paddingBottom: Platform.OS === 'ios' ? 20 : 12,
    },
    bg: {
      backgroundColor: colors.tabBarBackground,
      borderRadius: 15,
      borderWidth: 1,
      borderColor: colors.tabBarBorder,
      paddingTop: 5,
      paddingHorizontal: spacing.sm,
      position: 'relative',
      overflow: 'visible',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 15,
    },
    tabsRow: {
      flexDirection: 'row-reverse',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    tabItem: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 8,
      paddingBottom: 8,
      gap: 4,
      borderRadius: 100,
    },
    indicator: {
      position: 'absolute',
      top: 0,
      width: 20,
      height: 3,
      borderRadius: 2,
      backgroundColor: colors.tabIndicator,
    },
    label: {
      fontSize: 10,
      fontWeight: '600',
      color: colors.tabInactive,
      marginTop: 2,
    },
    labelActive: {
      color: colors.tabActive,
      fontWeight: '900',
    },
  });
 
