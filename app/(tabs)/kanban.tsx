import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  Carregando,
  Chip,
  Dot,
  Erro,
  PressableCard,
  Screen,
  ScreenHeader,
  Vazio,
} from '../../src/components/ui';
import { useTarefas } from '../../src/lib/dados';
import {
  TASK_STATUS_LABELS,
  TASK_STATUSES,
  type Task,
  type TaskPriority,
  type TaskStatus,
} from '../../src/lib/types';
import { colors, spacing, statusColors, typography } from '../../src/theme';

const coresPrioridade: Record<TaskPriority, string> = {
  high: statusColors.todo,
  medium: statusColors.doing,
  low: statusColors.done,
};

export default function KanbanScreen() {
  const { tarefas, carregando, erro, recarregar, mudarStatus, alternarDestaque } = useTarefas();
  const [ativo, setAtivo] = useState<TaskStatus>('todo');
  const [atualizando, setAtualizando] = useState(false);

  const visiveis = useMemo(
    () => tarefas.filter((t) => t.status === ativo),
    [tarefas, ativo],
  );

  const contagens = useMemo(
    () =>
      TASK_STATUSES.reduce<Record<string, number>>(
        (acc, s) => ({ ...acc, [s]: tarefas.filter((t) => t.status === s).length }),
        {},
      ),
    [tarefas],
  );

  function avancar(tarefa: Task) {
    const i = TASK_STATUSES.indexOf(tarefa.status as TaskStatus);
    mudarStatus(tarefa, TASK_STATUSES[(i + 1) % TASK_STATUSES.length]);
  }

  async function puxar() {
    setAtualizando(true);
    await recarregar();
    setAtualizando(false);
  }

  return (
    <Screen>
      <ScreenHeader title="Kanban" subtitle="Toque avança o estágio · segure destaca" />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.abasWrap}
        contentContainerStyle={styles.abas}
      >
        {TASK_STATUSES.map((s) => (
          <Chip
            key={s}
            label={TASK_STATUS_LABELS[s]}
            cor={statusColors[s]}
            contagem={contagens[s] ?? 0}
            ativo={s === ativo}
            onPress={() => setAtivo(s)}
          />
        ))}
      </ScrollView>

      {carregando ? (
        <Carregando />
      ) : erro ? (
        <Erro mensagem={erro} aoTentar={recarregar} />
      ) : (
        <ScrollView
          contentContainerStyle={visiveis.length ? styles.lista : styles.listaVazia}
          refreshControl={
            <RefreshControl refreshing={atualizando} onRefresh={puxar} tintColor={colors.sutil} />
          }
        >
          {visiveis.length === 0 ? (
            <Vazio mensagem={`Nada em ${TASK_STATUS_LABELS[ativo].toLowerCase()}.`} />
          ) : (
            visiveis.map((tarefa, i) => (
              <PressableCard
                key={tarefa.id}
                onPress={() => avancar(tarefa)}
                onLongPress={() => alternarDestaque(tarefa)}
              >
                <View style={styles.linha}>
                  <Text style={styles.rank}>{i + 1}</Text>
                  <Dot color={coresPrioridade[tarefa.priority as TaskPriority] ?? statusColors.done} />
                  <Text style={styles.titulo} numberOfLines={2}>
                    {tarefa.title}
                  </Text>
                  {tarefa.highlighted ? (
                    <Ionicons name="star" size={15} color={statusColors.doing} />
                  ) : null}
                </View>
                {tarefa.description ? (
                  <Text style={styles.descricao} numberOfLines={2}>
                    {tarefa.description}
                  </Text>
                ) : null}
                {tarefa.tags?.length ? (
                  <View style={styles.tags}>
                    {tarefa.tags.slice(0, 3).map((tag) => (
                      <Text key={tag} style={styles.tag}>
                        {tag}
                      </Text>
                    ))}
                  </View>
                ) : null}
              </PressableCard>
            ))
          )}
        </ScrollView>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  abasWrap: { flexGrow: 0, marginBottom: spacing.md },
  abas: { paddingHorizontal: spacing.lg, gap: spacing.sm },
  lista: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl, gap: spacing.sm },
  listaVazia: { flexGrow: 1 },
  linha: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  rank: { ...typography.caption, color: colors.sutil, minWidth: 14 },
  titulo: { ...typography.body, color: colors.foreground, flex: 1 },
  descricao: {
    ...typography.caption,
    color: colors.mutedForeground,
    marginTop: spacing.xs,
    marginLeft: 28,
    lineHeight: 17,
  },
  tags: { flexDirection: 'row', gap: spacing.xs, marginTop: spacing.sm, marginLeft: 28 },
  tag: {
    ...typography.micro,
    color: colors.sutil,
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 999,
  },
});
