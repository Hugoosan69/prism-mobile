import { ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, elevacao, radius, spacing, typography } from '../theme';

export function Screen({ children }: { children: ReactNode }) {
  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.flex} edges={['top']}>
        {children}
      </SafeAreaView>
    </View>
  );
}

export function ScreenHeader({
  title,
  subtitle,
  acao,
}: {
  title: string;
  subtitle?: string;
  acao?: ReactNode;
}) {
  return (
    <View style={styles.header}>
      <View style={styles.flex}>
        <Text style={styles.headerTitle}>{title}</Text>
        {subtitle ? <Text style={styles.headerSubtitle}>{subtitle}</Text> : null}
      </View>
      {acao}
    </View>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function PressableCard({
  children,
  onPress,
  onLongPress,
  style,
}: {
  children: ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  style?: ViewStyle;
}) {
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed, style]}
    >
      {children}
    </Pressable>
  );
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  carregando,
  style,
}: {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  carregando?: boolean;
  style?: ViewStyle;
}) {
  const fundo =
    variant === 'primary'
      ? styles.buttonPrimary
      : variant === 'secondary'
        ? styles.buttonSecondary
        : styles.buttonGhost;
  const texto = variant === 'primary' ? styles.buttonPrimaryLabel : styles.buttonSecondaryLabel;
  return (
    <Pressable
      onPress={carregando ? undefined : onPress}
      style={({ pressed }) => [styles.button, fundo, pressed && styles.pressed, style]}
    >
      {carregando ? (
        <ActivityIndicator size="small" color={variant === 'primary' ? colors.primaryForeground : colors.foreground} />
      ) : (
        <Text style={texto}>{label}</Text>
      )}
    </Pressable>
  );
}

export function Input(props: TextInputProps) {
  return (
    <TextInput
      placeholderTextColor={colors.sutil}
      {...props}
      style={[styles.input, props.style]}
    />
  );
}

export function Dot({ color, tamanho = 7 }: { color: string; tamanho?: number }) {
  return (
    <View
      style={{ width: tamanho, height: tamanho, borderRadius: radius.full, backgroundColor: color }}
    />
  );
}

export function Chip({
  label,
  ativo,
  cor,
  onPress,
  contagem,
}: {
  label: string;
  ativo?: boolean;
  cor?: string;
  onPress?: () => void;
  contagem?: number;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.chip, ativo && styles.chipAtivo, pressed && styles.pressed]}
    >
      {cor ? <Dot color={cor} tamanho={6} /> : null}
      <Text style={[styles.chipLabel, ativo && styles.chipLabelAtivo]}>{label}</Text>
      {contagem !== undefined ? (
        <Text style={[styles.chipContagem, ativo && styles.chipLabelAtivo]}>{contagem}</Text>
      ) : null}
    </Pressable>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return <Text style={styles.sectionLabel}>{children}</Text>;
}

export function Carregando({ texto }: { texto?: string }) {
  return (
    <View style={styles.centro}>
      <ActivityIndicator color={colors.sutil} />
      {texto ? <Text style={styles.centroTexto}>{texto}</Text> : null}
    </View>
  );
}

export function Vazio({ mensagem, acao }: { mensagem: string; acao?: ReactNode }) {
  return (
    <View style={styles.centro}>
      <Text style={styles.centroTexto}>{mensagem}</Text>
      {acao}
    </View>
  );
}

export function Erro({ mensagem, aoTentar }: { mensagem: string; aoTentar?: () => void }) {
  return (
    <View style={styles.centro}>
      <Text style={styles.erroTexto}>{mensagem}</Text>
      {aoTentar ? <Button label="Tentar de novo" variant="secondary" onPress={aoTentar} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  headerTitle: { ...typography.title, color: colors.foreground },
  headerSubtitle: { ...typography.caption, color: colors.sutil, marginTop: 3 },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: spacing.md,
    ...elevacao.card,
  },
  cardPressed: { backgroundColor: colors.cardElevado, borderColor: colors.borderForte },
  pressed: { opacity: 0.7 },
  button: {
    height: 46,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    gap: spacing.sm,
  },
  buttonPrimary: { backgroundColor: colors.primary },
  buttonSecondary: {
    backgroundColor: colors.secondary,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  buttonGhost: { backgroundColor: 'transparent' },
  buttonPrimaryLabel: { ...typography.label, color: colors.primaryForeground },
  buttonSecondaryLabel: { ...typography.label, color: colors.foreground },
  input: {
    minHeight: 46,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.input,
    paddingHorizontal: spacing.md,
    color: colors.foreground,
    fontSize: typography.body.fontSize,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderRadius: radius.full,
    backgroundColor: colors.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  chipAtivo: { backgroundColor: colors.accent, borderColor: colors.borderForte },
  chipLabel: { ...typography.caption, color: colors.mutedForeground },
  chipLabelAtivo: { color: colors.foreground },
  chipContagem: { ...typography.caption, color: colors.sutil },
  sectionLabel: {
    ...typography.micro,
    color: colors.sutil,
    textTransform: 'uppercase',
  },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: spacing.md },
  centroTexto: { ...typography.body, color: colors.sutil, textAlign: 'center' },
  erroTexto: { ...typography.body, color: colors.destructive, textAlign: 'center' },
});
