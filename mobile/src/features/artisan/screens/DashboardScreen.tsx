import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Colors, Spacing, Radius } from '../../../constants/theme';
import { Text } from '../../../components/ui/Text';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { useAuth } from '../../../contexts/AuthContext';
import { apiClient } from '../../../api/client';
import { formatINR, humanize } from '../../../utils/formatters';

interface DashboardData {
  artisan: {
    id: string;
    fullName: string;
    businessName: string;
    craftType: string;
    isVerified: boolean;
    city?: string;
    state?: string;
    profileCompleteness: number;
  };
  metrics: {
    totalProducts: number;
    activeProducts: number;
    draftProducts: number;
    outOfStockProducts: number;
    lowStockProducts: number;
    totalInventoryUnits: number;
  };
  recentProducts: Array<{
    id: string;
    title: string;
    status: string;
    stockQuantity: number;
    finalPrice?: number;
    createdAt: string;
  }>;
}

export const DashboardScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { profile } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await apiClient.get('/dashboard');
      if (res.data.success && res.data.data) {
        setData(res.data.data);
      }
    } catch (err) {
      console.warn('Error fetching dashboard:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboard();
  };

  const displayName = data?.artisan.fullName || profile?.fullName || 'Artisan';
  const businessName = data?.artisan.businessName || profile?.businessName || 'My Workshop';
  const craftType = humanize(data?.artisan.craftType || profile?.craftType || 'WEAVING_HANDLOOM');
  const completeness = data?.artisan.profileCompleteness ?? 60;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
    >
      {/* Artisan Greeting & Identity Card */}
      <Card elevated style={styles.heroCard}>
        <View style={styles.heroHeader}>
          <View style={{ flex: 1 }}>
            <Text variant="caption" color={Colors.primary} weight="700">
              {craftType.toUpperCase()}
            </Text>
            <Text variant="h1" style={styles.artisanName}>
              Namaste, {displayName}
            </Text>
            <Text variant="body" color={Colors.textSecondary}>
              {businessName}
              {data?.artisan.city ? ` • ${data.artisan.city}, ${data.artisan.state}` : ''}
            </Text>
          </View>
          <Badge
            label={data?.artisan.isVerified ? 'Verified Artisan' : 'Self Certified'}
            variant={data?.artisan.isVerified ? 'success' : 'neutral'}
          />
        </View>

        {/* Profile Completeness Bar */}
        <View style={styles.completenessSection}>
          <View style={styles.completenessHeader}>
            <Text variant="bodySmall" weight="600">
              Artisan Profile Completeness
            </Text>
            <Text variant="bodySmall" weight="700" color={Colors.primary}>
              {completeness}%
            </Text>
          </View>
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: `${completeness}%` }]} />
          </View>
          {completeness < 100 && (
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <Text variant="caption" color={Colors.primary} weight="600" style={styles.completePrompt}>
                Add your artisan story, craft heritage & UPI to boost buyer trust →
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </Card>

      {/* Metrics Grid */}
      <Text variant="h2" style={styles.sectionTitle}>
        Workshop Overview
      </Text>

      {loading && !refreshing ? (
        <ActivityIndicator size="small" color={Colors.primary} style={{ marginVertical: Spacing.lg }} />
      ) : (
        <View style={styles.metricsGrid}>
          <Card style={[styles.metricCard, { borderLeftColor: Colors.primary, borderLeftWidth: 4 }]}>
            <Text variant="caption" color={Colors.textSecondary}>
              TOTAL PRODUCTS
            </Text>
            <Text variant="h1" color={Colors.secondary} style={styles.metricValue}>
              {data?.metrics.totalProducts ?? 0}
            </Text>
            <Text variant="caption" color={Colors.textMuted}>
              Digitized craft items
            </Text>
          </Card>

          <Card style={[styles.metricCard, { borderLeftColor: Colors.success, borderLeftWidth: 4 }]}>
            <Text variant="caption" color={Colors.textSecondary}>
              ACTIVE CATALOG
            </Text>
            <Text variant="h1" color={Colors.success} style={styles.metricValue}>
              {data?.metrics.activeProducts ?? 0}
            </Text>
            <Text variant="caption" color={Colors.textMuted}>
              Ready for buyers
            </Text>
          </Card>

          <Card style={[styles.metricCard, { borderLeftColor: Colors.warning, borderLeftWidth: 4 }]}>
            <Text variant="caption" color={Colors.textSecondary}>
              LOW STOCK ALERTS
            </Text>
            <Text variant="h1" color={Colors.warning} style={styles.metricValue}>
              {data?.metrics.lowStockProducts ?? 0}
            </Text>
            <Text variant="caption" color={Colors.textMuted}>
              Stock ≤ 3 units
            </Text>
          </Card>

          <Card style={[styles.metricCard, { borderLeftColor: Colors.secondary, borderLeftWidth: 4 }]}>
            <Text variant="caption" color={Colors.textSecondary}>
              TOTAL INVENTORY
            </Text>
            <Text variant="h1" color={Colors.secondary} style={styles.metricValue}>
              {data?.metrics.totalInventoryUnits ?? 0}
            </Text>
            <Text variant="caption" color={Colors.textMuted}>
              Units in stock
            </Text>
          </Card>
        </View>
      )}

      {/* Quick Action Navigation */}
      <Text variant="h2" style={styles.sectionTitle}>
        Quick Actions
      </Text>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => navigation.navigate('AIStudioTab')}
      >
        <Card elevated style={styles.actionCard}>
          <View style={styles.actionIconContainer}>
            <Text style={{ fontSize: 24 }}>✨</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text variant="h3" color={Colors.primary}>
              Capture New Product with AI
            </Text>
            <Text variant="bodySmall" color={Colors.textSecondary}>
              Take photos, record voice in your language, and let AI generate descriptions.
            </Text>
          </View>
        </Card>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => navigation.navigate('CatalogTab')}
      >
        <Card elevated style={styles.actionCard}>
          <View style={[styles.actionIconContainer, { backgroundColor: Colors.secondaryLight }]}>
            <Text style={{ fontSize: 24 }}>🏷️</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text variant="h3" color={Colors.secondary}>
              Smart Pricing & Inventory
            </Text>
            <Text variant="bodySmall" color={Colors.textSecondary}>
              Calculate raw material costs, profit margins, and manage stock quantities.
            </Text>
          </View>
        </Card>
      </TouchableOpacity>

      {/* Recent Listings */}
      <View style={styles.recentSectionHeader}>
        <Text variant="h2" style={styles.sectionTitle}>
          Recent Craft Listings
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('CatalogTab')}>
          <Text variant="bodySmall" color={Colors.primary} weight="600">
            View All →
          </Text>
        </TouchableOpacity>
      </View>

      {(!data?.recentProducts || data.recentProducts.length === 0) ? (
        <Card style={styles.emptyCard}>
          <Text variant="h3" style={{ textAlign: 'center', marginBottom: Spacing.xs }}>
            No products listed yet
          </Text>
          <Text variant="bodySmall" color={Colors.textSecondary} style={{ textAlign: 'center' }}>
            Tap 'Capture New Product with AI' to digitize your very first handmade creation.
          </Text>
        </Card>
      ) : (
        data.recentProducts.map((product) => (
          <Card key={product.id} style={styles.productRow}>
            <View style={{ flex: 1 }}>
              <Text variant="h3">{product.title}</Text>
              <Text variant="bodySmall" color={Colors.textSecondary}>
                Stock: {product.stockQuantity} units
                {product.finalPrice ? ` • ${formatINR(product.finalPrice)}` : ''}
              </Text>
            </View>
            <Badge
              label={product.status}
              variant={
                product.status === 'ACTIVE'
                  ? 'success'
                  : product.status === 'OUT_OF_STOCK'
                  ? 'danger'
                  : 'neutral'
              }
            />
          </Card>
        ))
      )}
    </ScrollView>
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
  heroCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  artisanName: {
    fontSize: 22,
    color: Colors.secondary,
    marginTop: 2,
    marginBottom: 4,
  },
  completenessSection: {
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  completenessHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  progressBarTrack: {
    height: 7,
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  completePrompt: {
    marginTop: Spacing.xs,
  },
  sectionTitle: {
    fontSize: 18,
    color: Colors.secondary,
    marginBottom: Spacing.sm,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: Spacing.lg,
  },
  metricCard: {
    flex: 1,
    minWidth: '46%',
    padding: Spacing.md,
  },
  metricValue: {
    fontSize: 24,
    marginVertical: 4,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  recentSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  emptyCard: {
    padding: Spacing.lg,
    alignItems: 'center',
    backgroundColor: Colors.surfaceSubtle,
    borderStyle: 'dashed',
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
});

