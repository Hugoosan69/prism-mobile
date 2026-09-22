import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PressableCard, Screen, ScreenHeader } from '../../src/components/ui';
import { links as seed, Link } from '../../src/mock';
import { colors, radius, spacing, spectrum, typography } from '../../src/theme';

export default function LinksScreen() {
  const [links, setLinks] = useState<Link[]>(seed);
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  const groups = useMemo(() => {
    const visible = onlyFavorites ? links.filter((link) => link.favorite) : links;
    return visible.reduce<Record<string, Link[]>>((acc, link) => {
      acc[link.folder] = [...(acc[link.folder] ?? []), link];
      return acc;
    }, {});
  }, [links, onlyFavorites]);

  function toggleFavorite(id: string) {
    setLinks((current) =>
      current.map((link) => (link.id === id ? { ...link, favorite: !link.favorite } : link)),
    );
  }

  return (
    <Screen>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScreenHeader title="Links" />
        <View style={styles.filters}>
          <Pressable
            onPress={() => setOnlyFavorites((value) => !value)}
            style={[styles.filter, onlyFavorites && styles.filterActive]}
          >
            <Ionicons
              name={onlyFavorites ? 'star' : 'star-outline'}
              size={13}
              color={onlyFavorites ? spectrum.favoritos : colors.mutedForeground}
            />
            <Text style={[styles.filterLabel, onlyFavorites && styles.filterLabelActive]}>
              Favoritos
            </Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.list}>
          {Object.entries(groups).map(([folder, items]) => (
            <View key={folder} style={styles.group}>
              <Text style={styles.groupLabel}>{folder}</Text>
              {items.map((link) => (
                <PressableCard key={link.id} style={styles.row}>
                  <View style={styles.rowText}>
                    <Text style={styles.title} numberOfLines={1}>
                      {link.title}
                    </Text>
                    <Text style={styles.url} numberOfLines={1}>
                      {link.url}
                    </Text>
                  </View>
                  <Pressable onPress={() => toggleFavorite(link.id)} hitSlop={10}>
                    <Ionicons
                      name={link.favorite ? 'star' : 'star-outline'}
                      size={17}
                      color={link.favorite ? spectrum.favoritos : colors.mutedForeground}
                    />
                  </Pressable>
                </PressableCard>
              ))}
            </View>
          ))}
          {Object.keys(groups).length === 0 ? (
            <Text style={styles.empty}>Nenhum link favorito ainda.</Text>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  filters: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  filter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: colors.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  filterActive: {
    backgroundColor: colors.accent,
    borderColor: colors.input,
  },
  filterLabel: {
    ...typography.caption,
    color: colors.mutedForeground,
  },
  filterLabelActive: {
    color: colors.foreground,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },
  group: {
    gap: spacing.sm,
  },
  groupLabel: {
    ...typography.caption,
    color: colors.mutedForeground,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  rowText: {
    flex: 1,
  },
  title: {
    ...typography.body,
    color: colors.foreground,
  },
  url: {
    ...typography.caption,
    color: colors.mutedForeground,
    marginTop: 1,
  },
  empty: {
    ...typography.body,
    color: colors.mutedForeground,
    textAlign: 'center',
    paddingVertical: spacing.xxl,
  },
});
