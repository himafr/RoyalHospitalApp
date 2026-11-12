import { ActivityIndicator } from "react-native"
import { useTheme } from "../context/ModeContext"

const SmallIndicator : React.FC =()=> {
    const {colors}=useTheme()
    return (
       <ActivityIndicator color={colors.primary} size="small" />
    )
}

export default SmallIndicator
