import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input, PressableCard, Screen, ScreenHeader } from '../../src/components/ui';
import { notes } from '../../src/mock';
import { colors, spacing, typography } from '../../src/theme';

export default function NotasScreen() {
  const [query, setQuery] = useState('');

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return notes;
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(term) || note.content.toLowerCase().includes(term),
    );
  }, [query]);

  return (
    <Screen>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScreenHeader title="Notas" />
        <View style={styles.search}>
          <Input value={query} onChangeText={setQuery} placeholder="Buscar nas notas" />
        </View>
        <ScrollView contentContainerStyle={styles.list}>
          {visible.map((note) => (
            <PressableCard key={note.id}>
              <View style={styles.cardTop}>
                <Text style={styles.title} numberOfLines={1}>
                  {note.title}
                </Text>
                <Text style={styles.date}>{note.updatedAt}</Text>
              </View>
              <Text style={styles.preview} numberOfLines={2}>
                {note.content}
              </Text>
            </PressableCard>
          ))}
          {visible.length === 0 ? <Text style={styles.empty}>Nenhuma nota encontrada.</Text> : null}
        </ScrollView>
      </SafeAreaView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  search: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
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
  title: {
    ...typography.heading,
    color: colors.foreground,
    flex: 1,
  },
  date: {
    ...typography.caption,
    color: colors.mutedForeground,
  },
  preview: {
    ...typography.caption,
    color: colors.mutedForeground,
    marginTop: spacing.xs,
    lineHeight: 18,
  },
  empty: {
    ...typography.body,
    color: colors.mutedForeground,
    textAlign: 'center',
    paddingVertical: spacing.xxl,
  },
});
