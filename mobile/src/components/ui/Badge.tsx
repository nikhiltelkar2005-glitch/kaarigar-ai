import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Colors, Radius, Spacing } from '../../constants/theme';
import { Text } from './Text';

type Variant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface BadgeProps {
  label: string;
  variant?: Variant;
  style?: StyleProp<ViewStyle>;
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'neutral', style }) => (
  <View style={[styles.base, bg[variant], style]}>
    <Text style={[styles.label, fg[variant]]}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  base:  { paddingHorizontal: 10, paddingVertical: 3, borderRadius: Radius.full, alignSelf: 'flex-start' },
  label: { fontSize: 12, fontWeight: '600' },
});

const bg = StyleSheet.create({
  success: { backgroundColor: Colors.successLight },
  warning: { backgroundColor: Colors.warningLight },
  danger:  { backgroundColor: Colors.dangerLight },
  info:    { backgroundColor: Colors.primaryLight },
  neutral: { backgroundColor: Colors.surfaceSubtle },
});

const fg = StyleSheet.create({
  success: { color: Colors.success },
  warning: { color: Colors.warning },
  danger:  { color: Colors.danger },
  info:    { color: Colors.primary },
  neutral: { color: Colors.textSecondary },
});

