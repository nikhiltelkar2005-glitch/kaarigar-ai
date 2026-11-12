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

interface RegisterScreenProps {
  navigation: any;
}

const CRAFT_OPTIONS = [
  { label: 'Weaving & Handloom', value: 'WEAVING_HANDLOOM' },
  { label: 'Pottery & Ceramics', value: 'POTTERY_CERAMICS' },
  { label: 'Woodwork & Carving', value: 'WOODWORK_CARVING' },
  { label: 'Metal & Bell Craft', value: 'METAL_CRAFT' },
  { label: 'Embroidery & Textile', value: 'EMBROIDERY_TEXTILE' },
  { label: 'Jewelry & Ornaments', value: 'JEWELRY_ORNAMENTS' },
  { label: 'Folk Art & Painting', value: 'PAINTING_FOLK_ART' },
  { label: 'Bamboo & Cane', value: 'BAMBOO_CANE_CRAFT' },
  { label: 'Other Handicrafts', value: 'OTHER' },
];

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const { register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [craftType, setCraftType] = useState('WEAVING_HANDLOOM');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async () => {
    if (!fullName.trim() || !businessName.trim() || !email.trim() || !password.trim()) {
      setErrorMessage('Please fill in all required fields (Name, Workshop, Email, Password).');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    setErrorMessage('');
    setLoading(true);
    try {
      await register({
        fullName: fullName.trim(),
        businessName: businessName.trim(),
        craftType,
        email: email.trim().toLowerCase(),
        phone: phone.trim() || undefined,
        city: city.trim() || undefined,
        state: state.trim() || undefined,
        pincode: pincode.trim() || undefined,
        password,
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Please try again.');
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
        <View style={styles.header}>
          <Text variant="caption" color={Colors.primary} weight="700">
            ARTISAN ONBOARDING
          </Text>
          <Text variant="h1" style={styles.title}>
            Join Kaarigar AI
          </Text>
          <Text variant="bodySmall" color={Colors.textSecondary} style={styles.subtitle}>
            Digitize your craft, preserve your heritage, and connect directly to buyers worldwide.
          </Text>
        </View>

        <Card elevated style={styles.card}>
          {errorMessage ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          <Text variant="h3" style={styles.sectionHeader}>
            1. Artisan & Workshop Details
          </Text>

          <Input
            label="Artisan Full Name *"
            placeholder="e.g. Ramesh Chandra"
            value={fullName}
            onChangeText={setFullName}
          />

          <Input
            label="Workshop / Business Name *"
            placeholder="e.g. Chandra Handlooms"
            value={businessName}
            onChangeText={setBusinessName}
          />

          {/* Craft Type Selector */}
          <Text style={styles.fieldLabel}>Primary Craft Discipline *</Text>
          <View style={styles.chipsContainer}>
            {CRAFT_OPTIONS.map((craft) => {
              const isSelected = craftType === craft.value;
              return (
                <TouchableOpacity
                  key={craft.value}
                  onPress={() => setCraftType(craft.value)}
                  style={[styles.chip, isSelected && styles.chipSelected]}
                >
                  <Text
                    variant="caption"
                    color={isSelected ? Colors.textInverse : Colors.text}
                    weight={isSelected ? '600' : 'normal'}
                  >
                    {craft.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text variant="h3" style={[styles.sectionHeader, { marginTop: Spacing.md }]}>
            2. Location & Contact
          </Text>

          <Input
            label="Email Address *"
            placeholder="artisan@kaarigar.org"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label="Mobile Number (Optional)"
            placeholder="10-digit number for SMS alerts"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            maxLength={10}
          />

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: Spacing.sm }}>
              <Input label="City/Village" placeholder="e.g. Varanasi" value={city} onChangeText={setCity} />
            </View>
            <View style={{ flex: 1 }}>
              <Input label="State" placeholder="e.g. Uttar Pradesh" value={state} onChangeText={setState} />
            </View>
          </View>

          <Input
            label="Pincode"
            placeholder="6-digit postal code"
            value={pincode}
            onChangeText={setPincode}
            keyboardType="numeric"
            maxLength={6}
          />

          <Text variant="h3" style={[styles.sectionHeader, { marginTop: Spacing.md }]}>
            3. Account Security
          </Text>

          <Input
            label="Password *"
            placeholder="At least 8 characters (letters & numbers)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Button
            title="Complete Artisan Registration"
            onPress={handleRegister}
            loading={loading}
            style={styles.submitButton}
          />

          <View style={styles.footerLink}>
            <Text variant="bodySmall" color={Colors.textSecondary}>
              Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text variant="bodySmall" color={Colors.primary} weight="600">
                Sign In
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
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
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
  sectionHeader: {
    marginBottom: Spacing.md,
    color: Colors.secondary,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: Spacing.md,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  row: {
    flexDirection: 'row',
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
  submitButton: {
    marginTop: Spacing.md,
  },
  footerLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
});

