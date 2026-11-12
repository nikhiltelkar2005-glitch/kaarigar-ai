import React from 'react';
import { Text as RNText, TextProps, StyleSheet } from 'react-native';
import { Colors } from '../../constants/theme';

type Variant = 'h1' | 'h2' | 'h3' | 'body' | 'bodySmall' | 'caption';
type Weight  = 'normal' | '400' | '500' | '600' | '700' | 'bold';

interface AppTextProps extends TextProps {
  variant?: Variant;
  color?: string;
  weight?: Weight;
  align?: 'left' | 'center' | 'right';
}

export const Text: React.FC<AppTextProps> = ({
  variant = 'body',
  color,
  weight,
  align,
  style,
  children,
  ...rest
}) => (
  <RNText
    style={[
      styles[variant],
      color  ? { color }           : undefined,
      weight ? { fontWeight: weight } : undefined,
      align  ? { textAlign: align }  : undefined,
      style,
    ]}
    {...rest}
  >
    {children}
  </RNText>
);

const styles = StyleSheet.create({
  h1:        { fontSize: 26, fontWeight: '700', color: Colors.text, lineHeight: 34 },
  h2:        { fontSize: 20, fontWeight: '600', color: Colors.text, lineHeight: 28 },
  h3:        { fontSize: 17, fontWeight: '600', color: Colors.text, lineHeight: 24 },
  body:      { fontSize: 15, fontWeight: '400', color: Colors.text, lineHeight: 22 },
  bodySmall: { fontSize: 13, fontWeight: '400', color: Colors.textSecondary, lineHeight: 18 },
  caption:   { fontSize: 11, fontWeight: '500', color: Colors.textMuted,  lineHeight: 14 },
});

