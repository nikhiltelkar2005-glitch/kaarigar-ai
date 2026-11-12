import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Colors, Spacing, Radius } from '../../../constants/theme';
import { Text } from '../../../components/ui/Text';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { useAuth } from '../../../contexts/AuthContext';
import { apiClient } from '../../../api/client';
import { humanize } from '../../../utils/formatters';

export const ProfileScreen: React.FC = () => {
  const { profile, user, logout, refreshProfile } = useAuth();

  const [fullName, setFullName] = useState(profile?.fullName || '');
  const [businessName, setBusinessName] = useState(profile?.businessName || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [story, setStory] = useState(profile?.story || '');
  const [experienceYears, setExperienceYears] = useState(
    profile?.experienceYears ? String(profile.experienceYears) : ''
  );
  const [city, setCity] = useState(profile?.city || '');
  const [state, setState] = useState(profile?.state || '');
  const [pincode, setPincode] = useState(profile?.pincode || '');
  const [address, setAddress] = useState(profile?.address || '');
  const [upiId, setUpiId] = useState(profile?.upiId || '');

  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const handleSave = async () => {
    setStatusMessage(null);
    setSaving(true);
    try {
      const res = await apiClient.put('/artisans', {
        fullName,
        businessName,
        bio: bio || undefined,
        story: story || undefined,
        experienceYears: experienceYears ? parseInt(experienceYears, 10) : undefined,
        city: city || undefined,
        state: state || undefined,
        pincode: pincode || undefined,
        address: address || undefined,
        upiId: upiId || undefined,
      });

      if (res.data.success) {
        await refreshProfile();
        setStatusMessage({ text: 'Profile updated successfully!', isError: false });
      }
    } catch (err: any) {
      setStatusMessage({ text: err.message || 'Failed to update profile', isError: true });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to log out of Kaarigar AI?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => logout() },
    ]);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Profile Card Header */}
        <Card elevated style={styles.headerCard}>
          <View style={styles.avatarPlaceholder}>
            <Text style={{ fontSize: 32 }}>🧵</Text>
          </View>
          <Text variant="h2" style={styles.name}>
            {profile?.fullName || 'Artisan Profile'}
          </Text>
          <Text variant="bodySmall" color={Colors.textSecondary}>
            {profile?.businessName}
          </Text>
          <View style={styles.badgeRow}>
            <Badge
              label={humanize(profile?.craftType || 'Artisan')}
              variant="info"
            />
            {profile?.isVerified && (
              <Badge label="Verified Artisan" variant="success" style={{ marginLeft: 8 }} />
            )}
          </View>
          <Text variant="caption" color={Colors.textMuted} style={{ marginTop: 8 }}>
            Registered email: {user?.email}
          </Text>
        </Card>

        {statusMessage && (
          <View
            style={[
              styles.statusBanner,
              statusMessage.isError ? styles.statusError : styles.statusSuccess,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                statusMessage.isError ? { color: Colors.danger } : { color: Colors.success },
              ]}
            >
              {statusMessage.text}
            </Text>
          </View>
        )}

        {/* Edit Form */}
        <Card style={styles.sectionCard}>
          <Text variant="h3" style={styles.sectionTitle}>
            Workshop & Identity
          </Text>
          <Input label="Artisan Full Name" value={fullName} onChangeText={setFullName} />
          <Input label="Workshop / Business Name" value={businessName} onChangeText={setBusinessName} />
          <Input
            label="Years of Craft Experience"
            placeholder="e.g. 15"
            value={experienceYears}
            onChangeText={setExperienceYears}
            keyboardType="numeric"
          />
        </Card>

        <Card style={styles.sectionCard}>
          <Text variant="h3" style={styles.sectionTitle}>
            Artisan Story & Heritage (Seen by Buyers)
          </Text>
          <Input
            label="Short Bio / Tagline"
            placeholder="A brief introduction to your craftsmanship"
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={2}
          />
          <Input
            label="Artisan Heritage Story"
            placeholder="Tell buyers about your weaving lineage, generational traditions, and craft process..."
            value={story}
            onChangeText={setStory}
            multiline
            numberOfLines={4}
          />
        </Card>

        <Card style={styles.sectionCard}>
          <Text variant="h3" style={styles.sectionTitle}>
            Location & Payout Details
          </Text>
          <Input
            label="Direct UPI ID for Payments"
            placeholder="artisan@upi (e.g. 9876543210@paytm)"
            value={upiId}
            onChangeText={setUpiId}
            autoCapitalize="none"
          />
          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: Spacing.sm }}>
              <Input label="City" value={city} onChangeText={setCity} />
            </View>
            <View style={{ flex: 1 }}>
              <Input label="State" value={state} onChangeText={setState} />
            </View>
          </View>
          <Input label="Pincode" value={pincode} onChangeText={setPincode} keyboardType="numeric" />
          <Input label="Workshop Address" value={address} onChangeText={setAddress} multiline />
        </Card>

        <Button
          title="Save Profile Changes"
          onPress={handleSave}
          loading={saving}
          style={styles.saveButton}
        />

        <Button
          title="Sign Out of Kaarigar AI"
          variant="outline"
          onPress={handleLogout}
          style={styles.logoutButton}
          textStyle={{ color: Colors.danger }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  headerCard: {
    alignItems: 'center',
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  name: {
    fontSize: 20,
    color: Colors.secondary,
    marginBottom: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    marginTop: Spacing.xs,
  },
  statusBanner: {
    padding: Spacing.sm + 2,
    borderRadius: Radius.md,
    marginBottom: Spacing.md,
  },
  statusSuccess: {
    backgroundColor: Colors.successLight,
  },
  statusError: {
    backgroundColor: Colors.dangerLight,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  sectionCard: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    color: Colors.secondary,
    marginBottom: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
  },
  saveButton: {
    marginTop: Spacing.xs,
    marginBottom: Spacing.md,
  },
  logoutButton: {
    borderColor: Colors.danger,
    marginBottom: Spacing.xl,
  },
});

