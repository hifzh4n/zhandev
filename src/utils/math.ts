/**
 * Utility functions for calculations and transformations
 */

/**
 * Clamps a value between min and max
 * @param value - The value to clamp
 * @param min - Minimum value (default: 0)
 * @param max - Maximum value (default: 100)
 * @returns Clamped value
 */
export const clamp = (value: number, min = 0, max = 100): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Rounds a number to a specific precision
 * @param value - The number to round
 * @param precision - Number of decimal places (default: 3)
 * @returns Rounded number
 */
export const round = (value: number, precision = 3): number => {
  return parseFloat(value.toFixed(precision));
};

/**
 * Maps a value from one range to another (linear interpolation)
 * @param value - The value to map
 * @param fromMin - Source range minimum
 * @param fromMax - Source range maximum
 * @param toMin - Target range minimum
 * @param toMax - Target range maximum
 * @returns Mapped value
 */
export const mapRange = (
  value: number,
  fromMin: number,
  fromMax: number,
  toMin: number,
  toMax: number
): number => {
  return round(toMin + ((toMax - toMin) * (value - fromMin)) / (fromMax - fromMin));
};

/**
 * Calculates the distance between two points
 * @param x1 - First point X coordinate
 * @param y1 - First point Y coordinate
 * @param x2 - Second point X coordinate
 * @param y2 - Second point Y coordinate
 * @returns Distance between points
 */
export const getDistance = (x1: number, y1: number, x2: number, y2: number): number => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

/**
 * Eases a value using exponential decay
 * @param current - Current value
 * @param target - Target value
 * @param deltaTime - Time elapsed in seconds
 * @param tau - Time constant (default: 0.1)
 * @returns Eased value
 */
export const exponentialEase = (
  current: number,
  target: number,
  deltaTime: number,
  tau = 0.1
): number => {
  const k = 1 - Math.exp(-deltaTime / tau);
  return current + (target - current) * k;
};

/**
 * Linear interpolation between two values
 * @param start - Start value
 * @param end - End value
 * @param t - Interpolation factor (0-1)
 * @returns Interpolated value
 */
export const lerp = (start: number, end: number, t: number): number => {
  return start + (end - start) * t;
};

/**
 * Formats CSS pixel value
 * @param value - The numeric value
 * @returns CSS pixel string
 */
export const toPx = (value: number): string => {
  return `${value}px`;
};

/**
 * Converts degrees to radians
 * @param degrees - Angle in degrees
 * @returns Angle in radians
 */
export const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

/**
 * Converts radians to degrees
 * @param radians - Angle in radians
 * @returns Angle in degrees
 */
export const toDegrees = (radians: number): number => {
  return radians * (180 / Math.PI);
};
