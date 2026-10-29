import { Text, TouchableOpacity, View } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"

import { colors, radius, spacing } from "../theme"

const VerifyMessage : React.FC<{isVerified:boolean,navigation:any}> =({isVerified,navigation})=> {
    return (
        <View>
            {!isVerified && (
    <TouchableOpacity
      style={{
    marginTop: spacing.lg,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
    
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
      <Ionicons name="alert-circle" size={18} color={colors.white} />
      <Text style={{
    color: colors.white,
    fontSize: 14,
    fontWeight: '900',
  }}>اضغط هنا لتوثيق الحساب</Text>
    </TouchableOpacity>
  )}
        </View>
    )
}

export default VerifyMessage
