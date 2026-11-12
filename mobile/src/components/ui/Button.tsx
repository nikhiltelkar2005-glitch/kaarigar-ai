import React from 'react';
import {
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
  View,
} from 'react-native';
import { Colors, Radius, Spacing } from '../../constants/theme';
import { Text } from './Text';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size    = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size    = 'md',
  loading  = false,
  disabled = false,
  leftIcon,
  style,
  textStyle,
}) => {
  const off = disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={off}
      style={[styles.base, styles[variant], sizes[size], off && styles.disabled, style]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost' ? Colors.primary : Colors.textInverse}
        />
      ) : (
        <View style={styles.row}>
          {leftIcon}
          <Text
            style={[
              styles.text,
              textStyles[variant],
              textSizes[size],
              leftIcon ? { marginLeft: 6 } : undefined,
              textStyle,
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: Radius.md },
  row:      { flexDirection: 'row', alignItems: 'center' },
  primary:  { backgroundColor: Colors.primary },
  secondary:{ backgroundColor: Colors.secondary },
  outline:  { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: Colors.primary },
  ghost:    { backgroundColor: 'transparent' },
  danger:   { backgroundColor: Colors.danger },
  disabled: { opacity: 0.5 },
  text:     { fontWeight: '600' },
});

const sizes = StyleSheet.create({
  sm: { paddingVertical: 8,  paddingHorizontal: 14 },
  md: { paddingVertical: 14, paddingHorizontal: 20 },
  lg: { paddingVertical: 18, paddingHorizontal: 24 },
});

const textStyles = StyleSheet.create({
  primary:  { color: Colors.textInverse },
  secondary:{ color: Colors.textInverse },
  outline:  { color: Colors.primary },
  ghost:    { color: Colors.primary },
  danger:   { color: Colors.textInverse },
});

const textSizes = StyleSheet.create({
  sm: { fontSize: 13 },
  md: { fontSize: 15 },
  lg: { fontSize: 17 },
});

