import React, { useState } from 'react';
import {
  View,
  TextInput,
  TextInputProps,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Colors, Radius, Spacing } from '../../constants/theme';
import { Text } from './Text';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  onRightIconPress,
  style,
  onFocus,
  onBlur,
  ...rest
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputRow,
          focused && styles.focused,
          !!error && styles.errored,
        ]}
      >
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}

        <TextInput
          placeholderTextColor={Colors.textMuted}
          style={[styles.input, style]}
          onFocus={(e) => { setFocused(true); onFocus?.(e); }}
          onBlur={(e)  => { setFocused(false); onBlur?.(e); }}
          {...rest}
        />

        {rightIcon && (
          <TouchableOpacity
            style={styles.iconRight}
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>

      {error
        ? <Text style={styles.error}>{error}</Text>
        : hint
          ? <Text style={styles.hint}>{hint}</Text>
          : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper:  { marginBottom: Spacing.md },
  label:    { fontSize: 14, fontWeight: '500', color: Colors.text, marginBottom: 6 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    minHeight: 50,
  },
  focused:  { borderColor: Colors.primary },
  errored:  { borderColor: Colors.danger },
  input:    { flex: 1, fontSize: 15, color: Colors.text, paddingVertical: Spacing.sm },
  iconLeft: { marginRight: Spacing.sm },
  iconRight:{ marginLeft: Spacing.sm },
  error:    { fontSize: 12, color: Colors.danger, marginTop: 4 },
  hint:     { fontSize: 12, color: Colors.textMuted, marginTop: 4 },
});

