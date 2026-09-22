import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { Alert, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card, PressableCard, Screen, ScreenHeader, SectionLabel } from '../../src/components/ui';
import { useAuth } from '../../src/lib/auth';
import { useFavoritos, useTarefas } from '../../src/lib/dados';
import { TASK_STATUS_LABELS, TASK_STATUSES } from '../../src/lib/types';
import { colors, spacing, statusColors, typography } from '../../src/theme';

const SITE = 'https://prism-chi-six.vercel.app';

export default function MaisScreen() {
  const { tarefas, carregando, recarregar } = useTarefas();
  const { dados: favoritos } = useFavoritos();
  const { session, sair } = useAuth();

  const concluidasHoje = tarefas.filter(
    (t) => t.completed_at && new Date(t.completed_at).toDateString() === new Date().toDateString(),
  ).length;

  function confirmarSaida() {
    Alert.alert('Sair da conta', 'Você vai precisar entrar de novo com e-mail e senha.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: sair },
    ]);
  }

  return (
    <Screen>
      <ScreenHeader title="Mais" subtitle={session?.user.email ?? undefined} />

      <ScrollView
        contentContainerStyle={styles.conteudo}
        refreshControl={
          <RefreshControl refreshing={carregando} onRefresh={recarregar} tintColor={colors.sutil} />
        }
      >
        <Card>
          <SectionLabel>Tarefas por estágio</SectionLabel>
          <View style={styles.numeros}>
            {TASK_STATUSES.map((s) => (
              <View key={s} style={styles.numero}>
                <Text style={[styles.valor, { color: statusColors[s] }]}>
                  {tarefas.filter((t) => t.status === s).length}
                </Text>
                <Text style={styles.rotulo}>{TASK_STATUS_LABELS[s]}</Text>
              </View>
            ))}
          </View>
          {concluidasHoje > 0 ? (
            <Text style={styles.nota}>
              {concluidasHoje} {concluidasHoje === 1 ? 'concluída' : 'concluídas'} hoje
            </Text>
          ) : null}
        </Card>

        {favoritos.length > 0 ? (
          <View style={styles.secao}>
            <SectionLabel>Favoritos</SectionLabel>
            {favoritos.slice(0, 6).map((f) => (
              <PressableCard
                key={f.id}
                onPress={() => Linking.openURL(f.url)}
                style={styles.linha}
              >
                <Ionicons name="bookmark-outline" size={17} color={colors.sutil} />
                <View style={styles.texto}>
                  <Text style={styles.titulo} numberOfLines={1}>
                    {f.title}
                  </Text>
                  {f.category ? <Text style={styles.subtitulo}>{f.category}</Text> : null}
                </View>
                <Ionicons name="open-outline" size={15} color={colors.sutil} />
              </PressableCard>
            ))}
          </View>
        ) : null}

        <View style={styles.secao}>
          <SectionLabel>Conta</SectionLabel>
          <PressableCard onPress={() => Linking.openURL(SITE)} style={styles.linha}>
            <Ionicons name="globe-outline" size={17} color={colors.sutil} />
            <View style={styles.texto}>
              <Text style={styles.titulo}>Abrir o Prism na web</Text>
              <Text style={styles.subtitulo}>Dashboard, SQL e configurações</Text>
            </View>
            <Ionicons name="open-outline" size={15} color={colors.sutil} />
          </PressableCard>

          <PressableCard onPress={confirmarSaida} style={styles.linha}>
            <Ionicons name="log-out-outline" size={17} color={colors.destructive} />
            <View style={styles.texto}>
              <Text style={[styles.titulo, styles.perigo]}>Sair da conta</Text>
            </View>
          </PressableCard>
        </View>

        <Text style={styles.rodape}>Prism · 1.0.0</Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  conteudo: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl, gap: spacing.lg },
  numeros: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.md },
  numero: { alignItems: 'center', flex: 1 },
  valor: { fontSize: 25, fontWeight: '700' },
  rotulo: { ...typography.caption, color: colors.sutil, marginTop: 2 },
  nota: {
    ...typography.caption,
    color: colors.sutil,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  secao: { gap: spacing.sm },
  linha: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  texto: { flex: 1 },
  titulo: { ...typography.body, color: colors.foreground },
  subtitulo: { ...typography.caption, color: colors.sutil, marginTop: 1 },
  perigo: { color: colors.destructive },
  rodape: { ...typography.micro, color: colors.sutil, textAlign: 'center' },
});
