import { StyleProp, StyleSheet, TextStyle, ViewStyle } from 'react-native';

type DirectionalStyle = StyleProp<TextStyle | ViewStyle>;
type DirectionalStyles = Record<string, DirectionalStyle>;

const horizontalStylePairs = [
  ['left', 'right'],
  ['marginLeft', 'marginRight'],
  ['paddingLeft', 'paddingRight'],
  ['borderLeftWidth', 'borderRightWidth'],
  ['borderLeftColor', 'borderRightColor'],
  ['borderTopLeftRadius', 'borderTopRightRadius'],
  ['borderBottomLeftRadius', 'borderBottomRightRadius'],
] as const;

export function createDirectionalStyles<T extends DirectionalStyles>(
  styles: T,
  isRTL: boolean,
): T {
  const directionalStyles: Record<string, DirectionalStyle> = {};

  for (const key of Object.keys(styles)) {
    const style: Record<string, unknown> = {
      ...StyleSheet.flatten(styles[key]),
    };

    if (style.flexDirection === 'row' || style.flexDirection === 'row-reverse') {
      style.flexDirection = 'row';
    }

    if (style.flexDirection !== 'row' && style.alignItems === 'flex-end') {
      style.alignItems = 'flex-start';
    }

    if (style.textAlign === 'left' || style.textAlign === 'right') {
      style.textAlign = isRTL ? 'right' : 'left';
      style.writingDirection = isRTL ? 'rtl' : 'ltr';
    } else if (style.fontSize !== undefined || style.fontFamily !== undefined) {
      style.writingDirection = isRTL ? 'rtl' : 'ltr';
    }

    if (!isRTL) {
      for (const [left, right] of horizontalStylePairs) {
        const leftValue = style[left];
        style[left] = style[right];
        style[right] = leftValue;
      }
    }

    directionalStyles[key] = style as DirectionalStyle;
  }

  return directionalStyles as T;
}
