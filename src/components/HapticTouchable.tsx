import { memo } from "react";
import type { GestureResponderEvent, TouchableOpacityProps } from "react-native";
import { TouchableOpacity } from "react-native";
import { triggerHaptic } from "@utils";

interface HapticTouchableProps extends TouchableOpacityProps {
  enableHaptic?: boolean;
}

const HapticTouchableComponent = ({
  onPress,
  enableHaptic = true,
  disabled,
  ...rest
}: HapticTouchableProps) => {
  const handlePress = (event: GestureResponderEvent): void => {
    if (!disabled && enableHaptic) {
      void triggerHaptic();
    }

    onPress?.(event);
  };

  return <TouchableOpacity {...rest} disabled={disabled} onPress={handlePress} />;
};

export const HapticTouchable = memo(HapticTouchableComponent);
