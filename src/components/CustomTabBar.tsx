import {
  Animated,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import React, { useEffect } from 'react';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme';

function AnimatedTabIcon({
  name,
  focused,
}: {
  name: string;
  focused: boolean;
}) {
  const scale = React.useRef(new Animated.Value(1)).current;

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
        color={focused ? colors.gold : colors.textLight}
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
  const barHeight = 50;

  return (
    <View
      style={[
        styles.container,
        { height: barHeight, marginBottom: insets.bottom },
      ]}
    >
      <View
        style={[
          styles.bg,
          { height: barHeight, paddingBottom: isIOS ? insets.bottom : 10 },
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

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 20 : 12,
  },
  bg: {
    // height:80,
    backgroundColor: colors.primary,
    borderRadius:15 ,
    // borderTopEndRadius: 25,
    // borderTopStartRadius: 25,
    paddingTop: 5,
    paddingHorizontal: spacing.sm,
    position: 'relative',
    overflow: 'visible',
    // ظل خفيف
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 15,
  },
  // curvedCutout: {
  //   position: 'absolute',
  //   top: -35,
  //   left: width / 2 - 50,
  //   width: 100,
  //   height: 100,
  //   borderRadius: 50,
  //   backgroundColor: colors.white,
  //   zIndex: -1,
  // },
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
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textLight,
    marginTop: 2,
  },
  labelActive: {
    color: colors.gold,
    fontWeight: '900',
  },
  centerButtonWrapper: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  centerButton: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.gold,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    borderColor: colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    zIndex: 20,
  },
});
