import React, { useEffect, useRef } from 'react';
import { Animated, ScrollViewProps } from 'react-native';

export default function SmoothScrollView(props: ScrollViewProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    const animation = Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 240,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 240,
        useNativeDriver: true,
      }),
    ]);

    animation.start();
    return () => animation.stop();
  }, [opacity, translateY]);

  return (
    <Animated.ScrollView
      decelerationRate="normal"
      overScrollMode="never"
      {...props}
      style={[
        props.style,
        { opacity, transform: [{ translateY }] },
      ]}
    />
  );
}
