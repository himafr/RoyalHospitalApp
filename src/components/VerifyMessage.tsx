import { Text, TouchableOpacity, View } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"

import { useTheme } from "../context/ModeContext"
import { radius, spacing } from "../theme"

const VerifyMessage : React.FC<{isVerified:boolean,navigation:any}> =({isVerified,navigation})=> {
  const {colors,fontScale}=useTheme()
    return (
        <View>
            {!isVerified && (
    <TouchableOpacity
      style={{
    marginTop: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundAlt,
    
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    gap: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  }}
      onPress={() => navigation.navigate('Activate')}
    >
      <Ionicons name="alert-circle" size={18} color={colors.error} />
      <Text style={{
    color: colors.text,
    fontSize: 14 * fontScale,
    fontWeight: '900',
  }}>اضغط هنا لتوثيق الحساب</Text>
    </TouchableOpacity>
  )}
        </View>
    )
}

export default VerifyMessage
