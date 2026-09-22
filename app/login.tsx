import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Button, Input } from '../src/components/ui';
import { useAuth } from '../src/lib/auth';
import { colors, radius, spacing, typography } from '../src/theme';

export default function LoginScreen() {
  const { entrar } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [verSenha, setVerSenha] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function submeter() {
    if (!email.trim() || !senha) {
      setErro('Preencha e-mail e senha.');
      return;
    }
    setEnviando(true);
    setErro(null);
    const falha = await entrar(email.trim(), senha);
    setEnviando(false);
    if (falha) setErro(falha);
  }

  return (
    <KeyboardAvoidingView
      style={styles.tela}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.conteudo}>
        <Image source={require('../assets/splash-icon.png')} style={styles.logo} contentFit="contain" />
        <Text style={styles.titulo}>Prism</Text>
        <Text style={styles.subtitulo}>Suas tarefas, notas e links num lugar só</Text>

        <View style={styles.formulario}>
          <Input
            value={email}
            onChangeText={setEmail}
            placeholder="E-mail"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            textContentType="emailAddress"
          />
          <View style={styles.campoSenha}>
            <Input
              value={senha}
              onChangeText={setSenha}
              placeholder="Senha"
              secureTextEntry={!verSenha}
              autoCapitalize="none"
              textContentType="password"
              style={styles.inputSenha}
              onSubmitEditing={submeter}
            />
            <Pressable onPress={() => setVerSenha((v) => !v)} style={styles.olho} hitSlop={8}>
              <Ionicons
                name={verSenha ? 'eye-off-outline' : 'eye-outline'}
                size={19}
                color={colors.sutil}
              />
            </Pressable>
          </View>

          {erro ? <Text style={styles.erro}>{erro}</Text> : null}

          <Button label="Entrar" onPress={submeter} carregando={enviando} />
        </View>

        <Text style={styles.rodape}>Mesma conta do Prism na web</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: colors.background },
  conteudo: { flex: 1, justifyContent: 'center', paddingHorizontal: spacing.xl },
  logo: { width: 76, height: 76, alignSelf: 'center' },
  titulo: {
    ...typography.display,
    color: colors.foreground,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  subtitulo: {
    ...typography.caption,
    color: colors.sutil,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  formulario: { marginTop: spacing.xxl, gap: spacing.md },
  campoSenha: { justifyContent: 'center' },
  inputSenha: { paddingRight: 46 },
  olho: { position: 'absolute', right: spacing.md },
  erro: {
    ...typography.caption,
    color: colors.destructive,
    textAlign: 'center',
    backgroundColor: 'rgba(248, 113, 113, 0.10)',
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  rodape: {
    ...typography.caption,
    color: colors.sutil,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
