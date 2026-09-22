import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
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
  SectionLabel,
  Vazio,
} from '../../src/components/ui';
import { useLinks, usePastas } from '../../src/lib/dados';
import type { LinkItem } from '../../src/lib/types';
import { colors, spacing, spectrum, typography } from '../../src/theme';

function dominio(url: string) {
  return url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
}

export default function LinksScreen() {
  const { links, carregando, erro, recarregar, alternarFavorito } = useLinks();
  const { dados: pastas } = usePastas();
  const [busca, setBusca] = useState('');
  const [soFavoritos, setSoFavoritos] = useState(false);
  const [atualizando, setAtualizando] = useState(false);

  const nomePasta = useMemo(() => {
    const mapa = new Map<string, string>();
    for (const p of pastas as { id: string; name: string }[]) mapa.set(p.id, p.name);
    return mapa;
  }, [pastas]);

  const grupos = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    const filtrados = links.filter((l) => {
      if (soFavoritos && !l.is_favorite) return false;
      if (!termo) return true;
      return (
        l.title.toLowerCase().includes(termo) ||
        l.url.toLowerCase().includes(termo) ||
        l.description.toLowerCase().includes(termo)
      );
    });
    return filtrados.reduce<Record<string, LinkItem[]>>((acc, l) => {
      const chave = l.folder_id ? (nomePasta.get(l.folder_id) ?? 'Pasta') : 'Sem pasta';
      acc[chave] = [...(acc[chave] ?? []), l];
      return acc;
    }, {});
  }, [links, busca, soFavoritos, nomePasta]);

  async function puxar() {
    setAtualizando(true);
    await recarregar();
    setAtualizando(false);
  }

  return (
    <Screen>
      <ScreenHeader title="Links" subtitle={`${links.length} salvos`} />

      <View style={styles.filtros}>
        <Input value={busca} onChangeText={setBusca} placeholder="Buscar" style={styles.busca} />
        <Chip label="Favoritos" ativo={soFavoritos} onPress={() => setSoFavoritos((v) => !v)} />
      </View>

      {carregando ? (
        <Carregando />
      ) : erro ? (
        <Erro mensagem={erro} aoTentar={recarregar} />
      ) : (
        <ScrollView
          contentContainerStyle={
            Object.keys(grupos).length ? styles.lista : styles.listaVazia
          }
          keyboardDismissMode="on-drag"
          refreshControl={
            <RefreshControl refreshing={atualizando} onRefresh={puxar} tintColor={colors.sutil} />
          }
        >
          {Object.keys(grupos).length === 0 ? (
            <Vazio mensagem={busca ? 'Nenhum link encontrado.' : 'Nenhum link ainda.'} />
          ) : (
            Object.entries(grupos).map(([pasta, itens]) => (
              <View key={pasta} style={styles.grupo}>
                <SectionLabel>{pasta}</SectionLabel>
                {itens.map((link) => (
                  <PressableCard
                    key={link.id}
                    onPress={() => Linking.openURL(link.url)}
                    style={styles.item}
                  >
                    <View style={styles.texto}>
                      <Text style={styles.titulo} numberOfLines={1}>
                        {link.title}
                      </Text>
                      <Text style={styles.url} numberOfLines={1}>
                        {dominio(link.url)}
                      </Text>
                    </View>
                    <Pressable onPress={() => alternarFavorito(link)} hitSlop={10}>
                      <Ionicons
                        name={link.is_favorite ? 'star' : 'star-outline'}
                        size={17}
                        color={link.is_favorite ? spectrum.favoritos : colors.sutil}
                      />
                    </Pressable>
                  </PressableCard>
                ))}
              </View>
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
  lista: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl, gap: spacing.lg },
  listaVazia: { flexGrow: 1 },
  grupo: { gap: spacing.sm },
  item: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  texto: { flex: 1 },
  titulo: { ...typography.body, color: colors.foreground },
  url: { ...typography.caption, color: colors.sutil, marginTop: 2 },
});
