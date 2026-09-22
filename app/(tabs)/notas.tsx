import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  Carregando,
  Chip,
  Erro,
  Input,
  PressableCard,
  Screen,
  ScreenHeader,
  Vazio,
} from '../../src/components/ui';
import { useNotas } from '../../src/lib/dados';
import { colors, spacing, spectrum, typography } from '../../src/theme';

/** "há 3 dias", "ontem" — mais legível que data cheia numa lista. */
function quando(iso: string) {
  const dias = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (dias === 0) return 'hoje';
  if (dias === 1) return 'ontem';
  if (dias < 7) return `${dias} dias`;
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

export default function NotasScreen() {
  const { notas, carregando, erro, recarregar, alternarFavorita } = useNotas();
  const [busca, setBusca] = useState('');
  const [soFavoritas, setSoFavoritas] = useState(false);
  const [atualizando, setAtualizando] = useState(false);
  const router = useRouter();

  const visiveis = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return notas.filter((n) => {
      if (soFavoritas && !n.is_favorite) return false;
      if (!termo) return true;
      return (
        n.title.toLowerCase().includes(termo) || n.content.toLowerCase().includes(termo)
      );
    });
  }, [notas, busca, soFavoritas]);

  async function puxar() {
    setAtualizando(true);
    await recarregar();
    setAtualizando(false);
  }

  return (
    <Screen>
      <ScreenHeader title="Notas" subtitle={`${notas.length} no total`} />

      <View style={styles.filtros}>
        <Input
          value={busca}
          onChangeText={setBusca}
          placeholder="Buscar nas notas"
          style={styles.busca}
        />
        <Chip
          label="Favoritas"
          ativo={soFavoritas}
          onPress={() => setSoFavoritas((v) => !v)}
        />
      </View>

      {carregando ? (
        <Carregando />
      ) : erro ? (
        <Erro mensagem={erro} aoTentar={recarregar} />
      ) : (
        <ScrollView
          contentContainerStyle={visiveis.length ? styles.lista : styles.listaVazia}
          keyboardDismissMode="on-drag"
          refreshControl={
            <RefreshControl refreshing={atualizando} onRefresh={puxar} tintColor={colors.sutil} />
          }
        >
          {visiveis.length === 0 ? (
            <Vazio mensagem={busca ? 'Nenhuma nota encontrada.' : 'Nenhuma nota ainda.'} />
          ) : (
            visiveis.map((nota) => (
              <PressableCard key={nota.id} onPress={() => router.push(`/nota/${nota.id}`)}>
                <View style={styles.linha}>
                  <Text style={styles.titulo} numberOfLines={1}>
                    {nota.title || 'Sem título'}
                  </Text>
                  <Pressable onPress={() => alternarFavorita(nota)} hitSlop={10}>
                    <Ionicons
                      name={nota.is_favorite ? 'star' : 'star-outline'}
                      size={16}
                      color={nota.is_favorite ? spectrum.favoritos : colors.sutil}
                    />
                  </Pressable>
                </View>
                {nota.content ? (
                  <Text style={styles.trecho} numberOfLines={2}>
                    {nota.content.replace(/[#*`>\-]/g, '').trim()}
                  </Text>
                ) : null}
                <Text style={styles.data}>{quando(nota.updated_at)}</Text>
              </PressableCard>
            ))
          )}
        </ScrollView>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  filtros: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  busca: { flex: 1 },
  lista: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl, gap: spacing.sm },
  listaVazia: { flexGrow: 1 },
  linha: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  titulo: { ...typography.heading, color: colors.foreground, flex: 1 },
  trecho: {
    ...typography.caption,
    color: colors.mutedForeground,
    marginTop: spacing.xs,
    lineHeight: 18,
  },
  data: { ...typography.micro, color: colors.sutil, marginTop: spacing.sm },
});
