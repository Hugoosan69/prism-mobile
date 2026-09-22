import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Input, Screen, ScreenHeader, Vazio } from '../../src/components/ui';
import {
  carregarMensagens,
  criarConversa,
  enviarMensagem,
  gravarMensagem,
  listarConversas,
  type EventoChat,
  type MensagemEnviada,
} from '../../src/lib/chat';
import { colors, elevacao, radius, spacing, spectrum, typography } from '../../src/theme';

type Mensagem = { id: string; role: 'user' | 'assistant'; content: string };

/** Nome legível para a ferramenta que o modelo está usando. */
const rotuloFerramenta: Record<string, string> = {
  buscar_no_prism: 'buscando no Prism',
  ler_item_do_prism: 'abrindo item',
  buscar_nas_conversas: 'buscando nas conversas',
  ler_conversa: 'lendo conversa',
  cofre_buscar: 'buscando no cofre',
  cofre_ler: 'lendo o cofre',
  buscar_na_web: 'buscando na web',
};

const CONVITE = 'Pergunte alguma coisa.\nEu enxergo suas tarefas, notas, links e o cofre.';

export default function ChatScreen() {
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [rascunho, setRascunho] = useState('');
  const [threadId, setThreadId] = useState<string | null>(null);
  const [respondendo, setRespondendo] = useState(false);
  const [ferramenta, setFerramenta] = useState<string | null>(null);
  const [iniciando, setIniciando] = useState(true);
  const scroll = useRef<ScrollView>(null);
  const abortar = useRef<AbortController | null>(null);

  /** Abre a conversa mais recente, como o site faz ao entrar no chat. */
  useEffect(() => {
    (async () => {
      try {
        const conversas = await listarConversas();
        if (conversas.length) {
          const recente = conversas[0];
          setThreadId(recente.id);
          const historico = await carregarMensagens(recente.id);
          setMensagens(
            historico
              .filter((m) => (m.role === 'user' || m.role === 'assistant') && m.content.trim())
              .map((m) => ({ id: m.id, role: m.role as 'user' | 'assistant', content: m.content })),
          );
        }
      } catch {
        // Sem histórico é estado válido: a conversa começa vazia.
      } finally {
        setIniciando(false);
      }
    })();
  }, []);

  const rolarAoFim = useCallback(() => {
    requestAnimationFrame(() => scroll.current?.scrollToEnd({ animated: true }));
  }, []);

  async function enviar() {
    const texto = rascunho.trim();
    if (!texto || respondendo) return;

    setRascunho('');
    const minha: Mensagem = { id: `u${Date.now()}`, role: 'user', content: texto };
    const daIA: Mensagem = { id: `a${Date.now()}`, role: 'assistant', content: '' };
    const anteriores = mensagens;
    setMensagens([...anteriores, minha, daIA]);
    setRespondendo(true);
    rolarAoFim();

    let thread = threadId;
    try {
      if (!thread) {
        const nova = await criarConversa(texto);
        thread = nova.id;
        setThreadId(nova.id);
      }
      await gravarMensagem(thread, 'user', texto);
    } catch {
      // Falha ao gravar não impede a resposta: a conversa continua na tela.
    }

    const historico: MensagemEnviada[] = [
      ...anteriores.map((m) => ({ role: m.role, content: m.content })),
      { role: 'user' as const, content: texto },
    ];

    abortar.current = new AbortController();
    let resposta = '';

    await enviarMensagem(
      historico,
      (evento: EventoChat) => {
        if (evento.type === 'content') {
          resposta += evento.text;
          setMensagens((atual) =>
            atual.map((m) => (m.id === daIA.id ? { ...m, content: resposta } : m)),
          );
          rolarAoFim();
        } else if (evento.type === 'tool') {
          setFerramenta(
            evento.status === 'running' ? (rotuloFerramenta[evento.name] ?? evento.name) : null,
          );
        } else if (evento.type === 'error') {
          resposta = resposta || evento.message;
          setMensagens((atual) =>
            atual.map((m) => (m.id === daIA.id ? { ...m, content: resposta } : m)),
          );
        }
      },
      abortar.current.signal,
    );

    setFerramenta(null);
    setRespondendo(false);
    if (thread && resposta) {
      try {
        await gravarMensagem(thread, 'assistant', resposta);
      } catch {
        // idem
      }
    }
    rolarAoFim();
  }

  function novaConversa() {
    abortar.current?.abort();
    setMensagens([]);
    setThreadId(null);
    setRespondendo(false);
    setFerramenta(null);
  }

  return (
    <Screen>
      <ScreenHeader
        title="Chat"
        subtitle="Pergunte sobre tarefas, notas, links e o cofre"
        acao={
          mensagens.length > 0 ? (
            <Pressable onPress={novaConversa} hitSlop={10}>
              <Ionicons name="create-outline" size={20} color={colors.sutil} />
            </Pressable>
          ) : null
        }
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={8}
      >
        <ScrollView
          ref={scroll}
          style={styles.flex}
          contentContainerStyle={mensagens.length ? styles.lista : styles.vazio}
          keyboardDismissMode="interactive"
          onContentSizeChange={rolarAoFim}
        >
          {iniciando ? (
            <ActivityIndicator color={colors.sutil} />
          ) : mensagens.length === 0 ? (
            <Vazio mensagem={CONVITE} />
          ) : (
            mensagens.map((m) => <Bolha key={m.id} mensagem={m} respondendo={respondendo} />)
          )}

          {ferramenta ? (
            <View style={styles.ferramenta}>
              <ActivityIndicator size="small" color={colors.sutil} />
              <Text style={styles.ferramentaTexto}>{ferramenta}</Text>
            </View>
          ) : null}
        </ScrollView>

        <View style={styles.composer}>
          <Input
            value={rascunho}
            onChangeText={setRascunho}
            placeholder="Escreva uma mensagem"
            style={styles.campo}
            multiline
          />
          <Pressable
            onPress={respondendo ? () => abortar.current?.abort() : enviar}
            style={({ pressed }) => [
              styles.enviar,
              respondendo && styles.enviarParar,
              pressed && styles.pressionado,
            ]}
          >
            <Ionicons
              name={respondendo ? 'stop' : 'arrow-up'}
              size={19}
              color={respondendo ? colors.foreground : colors.primaryForeground}
            />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

function Bolha({ mensagem, respondendo }: { mensagem: Mensagem; respondendo: boolean }) {
  const minha = mensagem.role === 'user';
  const esperando = !mensagem.content && !minha && respondendo;
  return (
    <View style={[styles.bolha, minha ? styles.bolhaMinha : styles.bolhaIA]}>
      {esperando ? (
        <ActivityIndicator size="small" color={colors.sutil} />
      ) : (
        <Text style={[styles.texto, minha && styles.textoMinha]}>{mensagem.content}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  lista: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg, gap: spacing.md },
  vazio: { flexGrow: 1 },
  bolha: {
    maxWidth: '88%',
    borderRadius: radius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 3,
  },
  bolhaMinha: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
    borderBottomRightRadius: radius.sm,
  },
  bolhaIA: {
    alignSelf: 'flex-start',
    backgroundColor: colors.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    borderBottomLeftRadius: radius.sm,
  },
  texto: { ...typography.body, color: colors.foreground, lineHeight: 22 },
  textoMinha: { color: colors.primaryForeground },
  ferramenta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
  },
  ferramentaTexto: { ...typography.caption, color: colors.sutil },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  campo: { flex: 1, maxHeight: 130, paddingTop: spacing.md, paddingBottom: spacing.md },
  enviar: {
    width: 46,
    height: 46,
    borderRadius: radius.lg,
    backgroundColor: spectrum.chat,
    alignItems: 'center',
    justifyContent: 'center',
    ...elevacao.card,
  },
  enviarParar: { backgroundColor: colors.secondary },
  pressionado: { opacity: 0.7 },
});
