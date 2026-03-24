import * as Haptics from "expo-haptics";

export const triggerHaptic = async (): Promise<void> => {
  try {
    console.log("Triggering haptic");
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
  } catch {
    console.log("Haptics is unavailable on the device");
    // If haptics is unavailable on the device, keep interaction silent.
  }
};
