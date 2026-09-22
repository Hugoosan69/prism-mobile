import type { Session } from '@supabase/supabase-js';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase';

type AuthState = {
  session: Session | null;
  carregando: boolean;
  entrar: (email: string, senha: string) => Promise<string | null>;
  sair: () => Promise<void>;
};

const Contexto = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setCarregando(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_evento, nova) => setSession(nova));
    return () => sub.subscription.unsubscribe();
  }, []);

  async function entrar(email: string, senha: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
    if (!error) return null;
    return error.message === 'Invalid login credentials'
      ? 'E-mail ou senha incorretos.'
      : error.message;
  }

  async function sair() {
    await supabase.auth.signOut();
  }

  return (
    <Contexto.Provider value={{ session, carregando, entrar, sair }}>{children}</Contexto.Provider>
  );
}

export function useAuth() {
  const valor = useContext(Contexto);
  if (!valor) throw new Error('useAuth precisa estar dentro de AuthProvider');
  return valor;
}
