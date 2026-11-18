import { StyleSheet } from 'react-native';
import { createDirectionalStyles } from '../src/utils/direction';

describe('createDirectionalStyles', () => {
  const styles = StyleSheet.create({
    row: { flexDirection: 'row-reverse', marginLeft: 8 },
    text: { fontSize: 16, textAlign: 'right' },
    aligned: { alignItems: 'flex-end' },
  });

  it('uses logical row, text and spacing directions for LTR', () => {
    const directionalStyles = createDirectionalStyles(styles, false);

    expect(StyleSheet.flatten(directionalStyles.row)).toMatchObject({
      flexDirection: 'row',
      marginRight: 8,
    });
    expect(StyleSheet.flatten(directionalStyles.text)).toMatchObject({
      textAlign: 'left',
      writingDirection: 'ltr',
    });
    expect(StyleSheet.flatten(directionalStyles.aligned)?.alignItems).toBe(
      'flex-start',
    );
  });

  it('keeps Arabic text and spacing directions for RTL', () => {
    const directionalStyles = createDirectionalStyles(styles, true);

    expect(StyleSheet.flatten(directionalStyles.row)).toMatchObject({
      flexDirection: 'row',
      marginLeft: 8,
    });
    expect(StyleSheet.flatten(directionalStyles.text)).toMatchObject({
       
      writingDirection: 'rtl',
    });
    expect(StyleSheet.flatten(directionalStyles.aligned)?.alignItems).toBe(
      'flex-start',
    );
  });
});
