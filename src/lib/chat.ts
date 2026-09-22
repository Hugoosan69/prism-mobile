import { supabase } from './supabase';

/**
 * O chat é a única coisa que não fala direto com o Supabase. A chave do modelo
 * não pode existir dentro do APK — qualquer um extrai o bundle —, então o app
 * chama a mesma rota que o site usa, autenticando com o token da sessão em vez
 * de cookie. Cofre, busca na web e memória vêm de graça junto: tudo isso roda
 * lá dentro.
 */
const API_BASE = 'https://prism-chi-six.vercel.app';

export type EventoChat =
  | { type: 'reasoning'; text: string }
  | { type: 'content'; text: string }
  | { type: 'tool'; name: string; status: 'running' | 'done' }
  | { type: 'proposal'; id: string; tool: string; args: Record<string, unknown> }
  | { type: 'error'; message: string }
  | { type: 'done' };

export type MensagemEnviada = {
  role: 'user' | 'assistant' | 'tool';
  content: string;
  tool_calls?: unknown[];
  tool_call_id?: string;
};

/**
 * A resposta vem como NDJSON — uma linha por evento. `fetch` no React Native
 * não expõe `body` como stream legível, então o texto é lido por inteiro e
 * quebrado em linhas. Na prática a resposta é curta o bastante para isso não
 * pesar, e evita depender de polyfill de streams.
 */
export async function enviarMensagem(
  mensagens: MensagemEnviada[],
  aoReceber: (evento: EventoChat) => void,
  sinal?: AbortSignal,
): Promise<void> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) {
    aoReceber({ type: 'error', message: 'Sessão expirada. Entre de novo.' });
    return;
  }

  let resposta: Response;
  try {
    resposta = await fetch(`${API_BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ messages: mensagens }),
      signal: sinal,
    });
  } catch {
    aoReceber({ type: 'error', message: 'Sem conexão com o servidor.' });
    return;
  }

  if (!resposta.ok) {
    const motivo = resposta.status === 401 ? 'Sessão expirada. Entre de novo.' : `Erro ${resposta.status}.`;
    aoReceber({ type: 'error', message: motivo });
    return;
  }

  const texto = await resposta.text();
  for (const linha of texto.split('\n')) {
    if (!linha.trim()) continue;
    try {
      aoReceber(JSON.parse(linha) as EventoChat);
    } catch {
      // Linha cortada no meio: ignorar em vez de derrubar a resposta inteira.
    }
  }
}

export async function listarConversas() {
  const { data, error } = await supabase
    .from('chat_threads')
    .select('*')
    .order('updated_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function carregarMensagens(threadId: string) {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('thread_id', threadId)
    .order('created_at', { ascending: true });
  if (error) throw new Error(error.message);
  return data;
}

export async function criarConversa(titulo: string) {
  const { data, error } = await supabase
    .from('chat_threads')
    .insert({ title: titulo.slice(0, 80) })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function gravarMensagem(threadId: string, role: string, content: string, reasoning = '') {
  const { error } = await supabase
    .from('chat_messages')
    .insert({ thread_id: threadId, role, content, reasoning });
  if (error) throw new Error(error.message);
  await supabase.from('chat_threads').update({ updated_at: new Date().toISOString() }).eq('id', threadId);
}
