import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, Spacing } from '../../../constants/theme';
import { Text } from '../../../components/ui/Text';
import { Card } from '../../../components/ui/Card';

export const AIStudioScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Card elevated style={styles.card}>
        <Text style={styles.icon}>📷✨</Text>
        <Text variant="h2" color={Colors.secondary} style={styles.title}>
          AI Product Studio
        </Text>
        <Text variant="caption" color={Colors.primary} weight="700">
          OWNED & DEVELOPED BY SUHANI
        </Text>
        <Text variant="body" color={Colors.textSecondary} style={styles.description}>
          This feature slice belongs to Suhani: AI-powered product photography, automated image enhancement,
          voice-to-text recording, multilingual translation, and AI product descriptions.
        </Text>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  card: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  icon: {
    fontSize: 44,
    marginBottom: Spacing.md,
  },
  title: {
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  description: {
    marginTop: Spacing.md,
    textAlign: 'center',
    lineHeight: 22,
  },
});

