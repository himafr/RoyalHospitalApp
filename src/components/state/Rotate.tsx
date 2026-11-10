import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View, StyleSheet } from 'react-native';

const Rotate: React.FC<{ rotate: boolean; component: React.ReactNode }> = ({ component, rotate }) => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let animation: Animated.CompositeAnimation | null = null;

    if (rotate) {
      animation = Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000, 
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      animation.start();
    } else {
      spinValue.stopAnimation();
      spinValue.setValue(0); 
    }

    return () => {
      if (animation) {
        animation.stop();
      }
    };
  }, [rotate, spinValue]); 

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        {component}
      </Animated.View>
    </View>
  );
};

export default Rotate;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});