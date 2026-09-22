import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '../src/lib/auth';
import { colors } from '../src/theme';

function Rotas() {
  const { session, carregando } = useAuth();
  const segmentos = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (carregando) return;
    const dentroDoApp = segmentos[0] === '(tabs)';
    if (!session && dentroDoApp) router.replace('/login');
    else if (session && !dentroDoApp) router.replace('/(tabs)');
  }, [session, carregando, segmentos, router]);

  if (carregando) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator color={colors.mutedForeground} />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'fade',
      }}
    />
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.raiz}>
      <SafeAreaProvider>
        <AuthProvider>
          <StatusBar style="light" />
          <Rotas />
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  raiz: { flex: 1, backgroundColor: colors.background },
  splash: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
});
