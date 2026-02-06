/**
 * Haptic Feedback Utility
 * Provides tactile feedback for user interactions on supported devices.
 * Falls back silently on unsupported browsers/devices.
 */

type HapticType =
  | "light"
  | "medium"
  | "heavy"
  | "selection"
  | "success"
  | "warning"
  | "error";

const VIBRATION_PATTERNS: Record<HapticType, number | number[]> = {
  light: 10,
  medium: 25,
  heavy: 50,
  selection: 5,
  success: [10, 50, 30],
  warning: [50, 100, 50],
  error: [100, 50, 100, 50, 100],
};

/**
 * Trigger haptic feedback on supported devices
 * @param type - Type of haptic feedback
 */
export function haptic(type: HapticType = "light"): void {
  // Check if Vibration API is available
  if (!("vibrate" in navigator)) return;

  const pattern = VIBRATION_PATTERNS[type];

  try {
    navigator.vibrate(pattern);
  } catch {
    // Silently fail - haptic is a nice-to-have
  }
}

/**
 * Hook-style haptic for event handlers
 * Returns a function that can be called in onClick etc.
 */
export function createHapticHandler<T extends (...args: unknown[]) => unknown>(
  handler: T,
  type: HapticType = "light",
): T {
  return ((...args: Parameters<T>) => {
    haptic(type);
    return handler(...args);
  }) as T;
}

/**
 * Simple haptic callbacks for common patterns
 */
export const haptics = {
  tap: () => haptic("light"),
  press: () => haptic("medium"),
  longPress: () => haptic("heavy"),
  select: () => haptic("selection"),
  success: () => haptic("success"),
  warning: () => haptic("warning"),
  error: () => haptic("error"),
} as const;
