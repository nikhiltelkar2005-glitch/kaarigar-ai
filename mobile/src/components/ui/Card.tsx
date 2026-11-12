import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { Colors, Radius, Spacing } from '../../constants/theme';

interface CardProps extends ViewProps {
  elevated?: boolean;
  padding?: number;
}

export const Card: React.FC<CardProps> = ({
  elevated = false,
  padding,
  style,
  children,
  ...rest
}) => (
  <View
    style={[styles.card, elevated && styles.elevated, padding != null && { padding }, style]}
    {...rest}
  >
    {children}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 0,
  },
});

