import { ActivityIndicator } from "react-native"
import { colors } from "../theme"

const SmallIndicator : React.FC =()=> {
    return (
       <ActivityIndicator color={colors.gold} size="small" />
    )
}

export default SmallIndicator
