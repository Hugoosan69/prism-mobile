import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Carregando, Erro } from '../../src/components/ui';
import { supabase } from '../../src/lib/supabase';
import type { Note } from '../../src/lib/types';
import { colors, spacing, typography } from '../../src/theme';

export default function NotaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [nota, setNota] = useState<Note | null>(null);
  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    supabase
      .from('notes')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error) setErro(error.message);
        else if (data) {
          setNota(data);
          setTitulo(data.title);
          setConteudo(data.content);
        }
      });
  }, [id]);

  /** Salva sozinho depois de uma pausa na digitação — sem botão de salvar. */
  function agendarGravacao(campos: { title?: string; content?: string }) {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      setSalvando(true);
      await supabase
        .from('notes')
        .update({ ...campos, updated_at: new Date().toISOString() })
        .eq('id', id);
      setSalvando(false);
    }, 700);
  }

  if (erro) return <Erro mensagem={erro} />;
  if (!nota) return <Carregando />;

  return (
    <View style={styles.tela}>
      <SafeAreaView style={styles.flex} edges={['top']}>
        <View style={styles.barra}>
          <Pressable onPress={() => router.back()} hitSlop={10} style={styles.voltar}>
            <Ionicons name="chevron-back" size={22} color={colors.foreground} />
          </Pressable>
          <Text style={styles.estado}>{salvando ? 'salvando…' : 'salvo'}</Text>
        </View>

        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView contentContainerStyle={styles.conteudo} keyboardDismissMode="interactive">
            <TextInput
              value={titulo}
              onChangeText={(t) => {
                setTitulo(t);
                agendarGravacao({ title: t });
              }}
              placeholder="Título"
              placeholderTextColor={colors.sutil}
              style={styles.titulo}
              multiline
            />
            <TextInput
              value={conteudo}
              onChangeText={(t) => {
                setConteudo(t);
                agendarGravacao({ content: t });
              }}
              placeholder="Escreva em Markdown…"
              placeholderTextColor={colors.sutil}
              style={styles.corpo}
              multiline
              textAlignVertical="top"
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  barra: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  voltar: { padding: spacing.xs },
  estado: { ...typography.micro, color: colors.sutil, paddingRight: spacing.sm },
  conteudo: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  titulo: { ...typography.title, color: colors.foreground, marginBottom: spacing.md },
  corpo: { ...typography.body, color: colors.mutedForeground, lineHeight: 23, minHeight: 400 },
});
