import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input, Screen, ScreenHeader } from '../../src/components/ui';
import { chatMessages, ChatMessage } from '../../src/mock';
import { colors, radius, spacing, spectrum, typography } from '../../src/theme';

export default function ChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>(chatMessages);
  const [draft, setDraft] = useState('');

  function send() {
    const text = draft.trim();
    if (!text) return;
    setMessages((current) => [
      ...current,
      { id: String(Date.now()), role: 'user', content: text },
    ]);
    setDraft('');
  }

  return (
    <Screen>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScreenHeader title="Chat" subtitle="Pergunte sobre suas tarefas, notas e links" />
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.messages}
            keyboardDismissMode="interactive"
          >
            {messages.map((message) => (
              <Bubble key={message.id} message={message} />
            ))}
          </ScrollView>
          <View style={styles.composer}>
            <Input
              value={draft}
              onChangeText={setDraft}
              placeholder="Escreva uma mensagem"
              style={styles.composerInput}
              multiline
              onSubmitEditing={send}
            />
            <Pressable
              onPress={send}
              style={({ pressed }) => [styles.sendButton, pressed && styles.sendPressed]}
            >
              <Ionicons name="arrow-up" size={20} color={colors.primaryForeground} />
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Screen>
  );
}

function Bubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';
  return (
    <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAssistant]}>
      <Text style={[styles.bubbleText, isUser && styles.bubbleTextUser]}>{message.content}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  messages: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  bubble: {
    maxWidth: '85%',
    borderRadius: radius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
  },
  bubbleUser: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
  },
  bubbleAssistant: {
    alignSelf: 'flex-start',
    backgroundColor: colors.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  bubbleText: {
    ...typography.body,
    color: colors.foreground,
    lineHeight: 21,
  },
  bubbleTextUser: {
    color: colors.primaryForeground,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  composerInput: {
    flex: 1,
    maxHeight: 120,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: spectrum.chat,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendPressed: {
    opacity: 0.75,
  },
});
