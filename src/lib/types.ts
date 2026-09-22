import type { Tables } from './database.types';

export type Task = Tables<'tasks'>;
export type Note = Tables<'notes'>;
export type Folder = Tables<'folders'>;
export type LinkItem = Tables<'links'>;
export type Bookmark = Tables<'bookmarks'>;
export type Snippet = Tables<'snippets'>;
export type Memory = Tables<'memories'>;
export type ChatThread = Tables<'chat_threads'>;
export type ChatMessageRow = Tables<'chat_messages'>;

export type TaskStatus = 'todo' | 'doing' | 'waiting' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

/** Mesma ordem do quadro na web: da esquerda para a direita. */
export const TASK_STATUSES: TaskStatus[] = ['todo', 'doing', 'waiting', 'done'];

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'A Fazer',
  doing: 'Fazendo',
  waiting: 'Aguardando',
  done: 'Concluído',
};

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
};
