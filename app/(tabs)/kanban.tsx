import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Dot, PressableCard, Screen, ScreenHeader } from '../../src/components/ui';
import { Priority, statusLabels, statusOrder, Task, tasks as seed, TaskStatus } from '../../src/mock';
import { colors, radius, spacing, statusColors, typography } from '../../src/theme';

const priorityColors: Record<Priority, string> = {
  high: statusColors.todo,
  medium: statusColors.doing,
  low: statusColors.done,
};

export default function KanbanScreen() {
  const [tasks, setTasks] = useState<Task[]>(seed);
  const [active, setActive] = useState<TaskStatus>('todo');

  const visible = useMemo(() => tasks.filter((task) => task.status === active), [tasks, active]);
  const counts = useMemo(
    () =>
      statusOrder.reduce<Record<TaskStatus, number>>(
        (acc, status) => ({ ...acc, [status]: tasks.filter((t) => t.status === status).length }),
        {} as Record<TaskStatus, number>,
      ),
    [tasks],
  );

  function advance(task: Task) {
    const next = statusOrder[(statusOrder.indexOf(task.status) + 1) % statusOrder.length];
    setTasks((current) => current.map((t) => (t.id === task.id ? { ...t, status: next } : t)));
  }

  return (
    <Screen>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScreenHeader title="Kanban" subtitle="Toque num cartão para avançar o estágio" />

        <View style={styles.tabs}>
          {statusOrder.map((status) => {
            const isActive = status === active;
            return (
              <Pressable
                key={status}
                onPress={() => setActive(status)}
                style={[styles.tab, isActive && styles.tabActive]}
              >
                <Dot color={statusColors[status]} />
                <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                  {statusLabels[status]}
                </Text>
                <Text style={styles.tabCount}>{counts[status]}</Text>
              </Pressable>
            );
          })}
        </View>

        <ScrollView contentContainerStyle={styles.list}>
          {visible.map((task, index) => (
            <PressableCard key={task.id} onPress={() => advance(task)}>
              <View style={styles.cardTop}>
                <Text style={styles.rank}>{index + 1}</Text>
                <Dot color={priorityColors[task.priority]} />
                <Text style={styles.cardTitle} numberOfLines={2}>
                  {task.title}
                </Text>
                {task.highlighted ? (
                  <Ionicons name="star" size={14} color={statusColors.doing} />
                ) : null}
              </View>
              {task.description ? (
                <Text style={styles.cardDescription} numberOfLines={2}>
                  {task.description}
                </Text>
              ) : null}
            </PressableCard>
          ))}
          {visible.length === 0 ? (
            <Text style={styles.empty}>Nada em {statusLabels[active].toLowerCase()}.</Text>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  tabs: {
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  tabActive: {
    backgroundColor: colors.accent,
    borderColor: colors.input,
  },
  tabLabel: {
    ...typography.caption,
    color: colors.mutedForeground,
  },
  tabLabelActive: {
    color: colors.foreground,
  },
  tabCount: {
    ...typography.caption,
    color: colors.mutedForeground,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.sm,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  rank: {
    ...typography.caption,
    color: colors.mutedForeground,
    minWidth: 14,
  },
  cardTitle: {
    ...typography.body,
    color: colors.foreground,
    flex: 1,
  },
  cardDescription: {
    ...typography.caption,
    color: colors.mutedForeground,
    marginTop: spacing.xs,
    marginLeft: 26,
  },
  empty: {
    ...typography.body,
    color: colors.mutedForeground,
    textAlign: 'center',
    paddingVertical: spacing.xxl,
  },
});
