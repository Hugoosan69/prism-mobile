/** Dados de exemplo para desenvolver a interface antes de ligar no Supabase. */

export type TaskStatus = 'todo' | 'doing' | 'waiting' | 'done';
export type Priority = 'low' | 'medium' | 'high';

export type Task = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: Priority;
  highlighted: boolean;
};

export type Note = {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
};

export type Link = {
  id: string;
  title: string;
  url: string;
  folder: string;
  favorite: boolean;
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export const statusLabels: Record<TaskStatus, string> = {
  todo: 'A fazer',
  doing: 'Fazendo',
  waiting: 'Aguardando',
  done: 'Concluído',
};

export const statusOrder: TaskStatus[] = ['todo', 'doing', 'waiting', 'done'];

export const tasks: Task[] = [
  { id: '1', title: 'Fechar escopo do app Android', description: 'Definir fases e o que entra no MVP', status: 'doing', priority: 'high', highlighted: true },
  { id: '2', title: 'Migrar node_modules para disco local', description: 'Google Drive corrompe o install', status: 'done', priority: 'high', highlighted: false },
  { id: '3', title: 'Revisar tokens de tema no mobile', description: null, status: 'todo', priority: 'medium', highlighted: false },
  { id: '4', title: 'Testar streaming do chat em rede móvel', description: 'SSE pode cair quando a tela apaga', status: 'waiting', priority: 'high', highlighted: true },
  { id: '5', title: 'Desenhar tab bar com o espectro', description: 'Uma cor por módulo, discreta', status: 'todo', priority: 'low', highlighted: false },
  { id: '6', title: 'Conferir RLS nas consultas do mobile', description: null, status: 'todo', priority: 'medium', highlighted: false },
  { id: '7', title: 'Assinar build de produção', description: 'Keystore no EAS', status: 'waiting', priority: 'medium', highlighted: false },
];

export const notes: Note[] = [
  { id: '1', title: 'Arquitetura do app mobile', content: 'Expo + expo-router. Tema em tokens, sem NativeWind.\n\nConexões com Supabase entram depois da UI.', updatedAt: '22/09' },
  { id: '2', title: 'Ideias de melhoria do chat', content: 'Buscar nas conversas antigas já funciona no web.\nNo mobile, avaliar histórico paginado.', updatedAt: '21/09' },
  { id: '3', title: 'Limites de contexto', content: 'Tudo que a ferramenta devolve volta ao modelo na rodada seguinte.\nTeto por resultado é decisão de projeto.', updatedAt: '20/09' },
  { id: '4', title: 'Rotinas do WinThor', content: 'Trace OCI vira nota. Manter só os blocos Prepare.', updatedAt: '18/09' },
];

export const links: Link[] = [
  { id: '1', title: 'Documentação do Expo', url: 'docs.expo.dev', folder: 'Referência', favorite: true },
  { id: '2', title: 'Supabase — JS Client', url: 'supabase.com/docs', folder: 'Referência', favorite: true },
  { id: '3', title: 'Backup do banco — setembro', url: 'drive.google.com', folder: 'Backups', favorite: false },
  { id: '4', title: 'Traces do WinThor', url: 'drive.google.com', folder: 'Trabalho', favorite: false },
  { id: '5', title: 'React Native — Styling', url: 'reactnative.dev', folder: 'Referência', favorite: false },
];

export const chatMessages: ChatMessage[] = [
  { id: '1', role: 'user', content: 'Quais tarefas estão travadas?' },
  { id: '2', role: 'assistant', content: 'Duas estão aguardando:\n\n• Testar streaming do chat em rede móvel\n• Assinar build de produção\n\nA primeira está marcada como destaque e tem prioridade alta.' },
  { id: '3', role: 'user', content: 'O que decidimos sobre o node_modules?' },
  { id: '4', role: 'assistant', content: 'Fica em C:/Code/prism-mobile, fora do Google Drive. A sincronização corrompia o install com EPERM e EBADF.' },
];
