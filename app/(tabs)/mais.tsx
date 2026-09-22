import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, PressableCard, Screen, ScreenHeader } from '../../src/components/ui';
import { statusLabels, statusOrder, tasks } from '../../src/mock';
import { colors, spacing, spectrum, statusColors, typography } from '../../src/theme';

type IconName = keyof typeof Ionicons.glyphMap;

const modules: { icon: IconName; label: string; color: string; hint: string }[] = [
  { icon: 'grid-outline', label: 'Dashboard', color: spectrum.dashboard, hint: 'Visão geral do dia' },
  { icon: 'server-outline', label: 'SQL', color: spectrum.sql, hint: 'Consultas salvas' },
  { icon: 'star-outline', label: 'Favoritos', color: spectrum.favoritos, hint: 'Acesso rápido' },
  { icon: 'settings-outline', label: 'Configurações', color: colors.mutedForeground, hint: 'Modelo de IA e chaves' },
];

export default function MaisScreen() {
  return (
    <Screen>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScreenHeader title="Mais" />
        <ScrollView contentContainerStyle={styles.content}>
          <Card>
            <Text style={styles.sectionLabel}>Tarefas por estágio</Text>
            <View style={styles.stats}>
              {statusOrder.map((status) => (
                <View key={status} style={styles.stat}>
                  <Text style={[styles.statValue, { color: statusColors[status] }]}>
                    {tasks.filter((task) => task.status === status).length}
                  </Text>
                  <Text style={styles.statLabel}>{statusLabels[status]}</Text>
                </View>
              ))}
            </View>
          </Card>

          <View style={styles.modules}>
            {modules.map((module) => (
              <PressableCard key={module.label} style={styles.module}>
                <Ionicons name={module.icon} size={20} color={module.color} />
                <View style={styles.moduleText}>
                  <Text style={styles.moduleLabel}>{module.label}</Text>
                  <Text style={styles.moduleHint}>{module.hint}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />
              </PressableCard>
            ))}
          </View>

          <Text style={styles.footer}>Prism · versão de desenvolvimento</Text>
        </ScrollView>
      </SafeAreaView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },
  sectionLabel: {
    ...typography.caption,
    color: colors.mutedForeground,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: spacing.md,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '600',
  },
  statLabel: {
    ...typography.caption,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  modules: {
    gap: spacing.sm,
  },
  module: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  moduleText: {
    flex: 1,
  },
  moduleLabel: {
    ...typography.body,
    color: colors.foreground,
  },
  moduleHint: {
    ...typography.caption,
    color: colors.mutedForeground,
    marginTop: 1,
  },
  footer: {
    ...typography.caption,
    color: colors.mutedForeground,
    textAlign: 'center',
  },
});
