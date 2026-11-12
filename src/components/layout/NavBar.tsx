import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../context/ModeContext';
import { useMemo } from 'react';
import { lightMode, spacing } from '../../theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const NavBar: React.FC<{ navigation: any; title: string }> = ({
  navigation,
  title,
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const insets =useSafeAreaInsets()

  return (
    <View style={[styles.header,{paddingTop:insets.top}]}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backBtn}
      >
        <Ionicons name="arrow-forward" size={24} color={colors.text} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={{ width: 24 }} />
    </View>
  );
};

export default NavBar;

const getStyles = (colors: typeof lightMode) =>
  StyleSheet.create({
    header: {
      flexDirection: 'row-reverse',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: spacing.md,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backBtn: { padding: spacing.xs },
    headerTitle: {
      fontSize: 18,
      fontWeight: '900',
      color: colors.text,
    },
  });
