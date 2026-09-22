import { useCallback, useEffect, useState } from 'react';
import { supabase } from './supabase';
import type { Bookmark, LinkItem, Note, Task, TaskStatus } from './types';

/**
 * Uma consulta por tela, com recarga manual. Sem react-query: o app é de um
 * usuário só e as listas são curtas — cache elaborado seria peso sem ganho.
 */
function useConsulta<T>(buscar: () => Promise<T[]>, deps: unknown[] = []) {
  const [dados, setDados] = useState<T[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const recarregar = useCallback(async () => {
    try {
      setErro(null);
      setDados(await buscar());
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Falha ao carregar.');
    } finally {
      setCarregando(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    recarregar();
  }, [recarregar]);

  return { dados, setDados, carregando, erro, recarregar };
}

async function exigir<T>(p: PromiseLike<{ data: T | null; error: { message: string } | null }>) {
  const { data, error } = await p;
  if (error) throw new Error(error.message);
  return (data ?? []) as T;
}

export function useTarefas() {
  const q = useConsulta<Task>(() =>
    exigir(supabase.from('tasks').select('*').order('position', { ascending: true })),
  );

  /** Grava otimista: a tela anda na hora e volta atrás se o banco recusar. */
  async function mudarStatus(tarefa: Task, status: TaskStatus) {
    const antes = q.dados;
    const completed_at = status === 'done' ? new Date().toISOString() : null;
    q.setDados((atual) =>
      atual.map((t) => (t.id === tarefa.id ? { ...t, status, completed_at } : t)),
    );
    const { error } = await supabase.from('tasks').update({ status, completed_at }).eq('id', tarefa.id);
    if (error) q.setDados(antes);
    return error?.message ?? null;
  }

  async function alternarDestaque(tarefa: Task) {
    const antes = q.dados;
    const highlighted = !tarefa.highlighted;
    q.setDados((atual) => atual.map((t) => (t.id === tarefa.id ? { ...t, highlighted } : t)));
    const { error } = await supabase.from('tasks').update({ highlighted }).eq('id', tarefa.id);
    if (error) q.setDados(antes);
    return error?.message ?? null;
  }

  return { ...q, tarefas: q.dados, mudarStatus, alternarDestaque };
}

export function useNotas() {
  const q = useConsulta<Note>(() =>
    exigir(supabase.from('notes').select('*').order('updated_at', { ascending: false })),
  );

  async function alternarFavorita(nota: Note) {
    const antes = q.dados;
    const is_favorite = !nota.is_favorite;
    q.setDados((atual) => atual.map((n) => (n.id === nota.id ? { ...n, is_favorite } : n)));
    const { error } = await supabase.from('notes').update({ is_favorite }).eq('id', nota.id);
    if (error) q.setDados(antes);
    return error?.message ?? null;
  }

  async function salvar(nota: Note, campos: { title?: string; content?: string }) {
    const antes = q.dados;
    const updated_at = new Date().toISOString();
    q.setDados((atual) => atual.map((n) => (n.id === nota.id ? { ...n, ...campos, updated_at } : n)));
    const { error } = await supabase.from('notes').update({ ...campos, updated_at }).eq('id', nota.id);
    if (error) q.setDados(antes);
    return error?.message ?? null;
  }

  return { ...q, notas: q.dados, alternarFavorita, salvar };
}

export function useLinks() {
  const q = useConsulta<LinkItem>(() =>
    exigir(supabase.from('links').select('*').order('created_at', { ascending: false })),
  );

  async function alternarFavorito(link: LinkItem) {
    const antes = q.dados;
    const is_favorite = !link.is_favorite;
    q.setDados((atual) => atual.map((l) => (l.id === link.id ? { ...l, is_favorite } : l)));
    const { error } = await supabase.from('links').update({ is_favorite }).eq('id', link.id);
    if (error) q.setDados(antes);
    return error?.message ?? null;
  }

  return { ...q, links: q.dados, alternarFavorito };
}

export function useFavoritos() {
  return useConsulta<Bookmark>(() =>
    exigir(supabase.from('bookmarks').select('*').order('created_at', { ascending: false })),
  );
}

export function usePastas() {
  return useConsulta(() => exigir(supabase.from('folders').select('*').order('name')));
}
