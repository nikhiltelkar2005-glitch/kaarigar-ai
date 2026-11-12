import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Colors, Spacing } from '../../../constants/theme';
import { Text } from '../../../components/ui/Text';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { useAuth } from '../../../contexts/AuthContext';

interface LoginScreenProps {
  navigation: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    if (!identifier.trim() || !password.trim()) {
      setErrorMessage('Please enter both your email/phone and password.');
      return;
    }

    setErrorMessage('');
    setLoading(true);
    try {
      await login(identifier.trim(), password);
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Brand Header */}
        <View style={styles.header}>
          <Text variant="caption" color={Colors.primary} weight="700">
            DIGITAL COMMERCE FOR ARTISANS
          </Text>
          <Text variant="h1" style={styles.title}>
            Kaarigar AI
          </Text>
          <Text variant="body" color={Colors.textSecondary} style={styles.subtitle}>
            Empowering weavers, craftsmen, and rural micro-entrepreneurs.
          </Text>
        </View>

        <Card elevated style={styles.card}>
          <Text variant="h2" style={styles.cardTitle}>
            Welcome Back
          </Text>
          <Text variant="bodySmall" color={Colors.textSecondary} style={styles.cardSubtitle}>
            Sign in to access your digital workshop and catalog
          </Text>

          {errorMessage ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          <Input
            label="Email or Mobile Number"
            placeholder="e.g. artisan@kaarigar.org or 9876543210"
            value={identifier}
            onChangeText={(text) => {
              setIdentifier(text);
              if (errorMessage) setErrorMessage('');
            }}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Input
            label="Password"
            placeholder="Enter your account password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errorMessage) setErrorMessage('');
            }}
            secureTextEntry={!showPassword}
            rightIcon={
              <Text variant="bodySmall" color={Colors.primary} weight="600">
                {showPassword ? 'Hide' : 'Show'}
              </Text>
            }
            onRightIconPress={() => setShowPassword(!showPassword)}
          />

          <Button
            title="Sign In to Workshop"
            onPress={handleLogin}
            loading={loading}
            style={styles.loginButton}
          />

          <View style={styles.footerLink}>
            <Text variant="bodySmall" color={Colors.textSecondary}>
              New to Kaarigar AI?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text variant="bodySmall" color={Colors.primary} weight="600">
                Register as Artisan
              </Text>
            </TouchableOpacity>
          </View>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    marginTop: Spacing.xs,
    color: Colors.secondary,
  },
  subtitle: {
    textAlign: 'center',
    marginTop: Spacing.xs,
    maxWidth: 320,
  },
  card: {
    padding: Spacing.lg,
  },
  cardTitle: {
    marginBottom: Spacing.xs,
  },
  cardSubtitle: {
    marginBottom: Spacing.lg,
  },
  errorBox: {
    backgroundColor: Colors.dangerLight,
    padding: Spacing.sm + 2,
    borderRadius: 8,
    marginBottom: Spacing.md,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 13,
  },
  loginButton: {
    marginTop: Spacing.sm,
  },
  footerLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
});

