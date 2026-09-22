import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { ColorValue, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spectrum } from '../../src/theme';

type IconName = keyof typeof Ionicons.glyphMap;

function icon(name: IconName) {
  return ({ color, size }: { color: ColorValue; size: number }) => (
    <Ionicons name={name} color={color} size={size} />
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: [styles.tabBar, { height: 64 + insets.bottom, paddingTop: 6, paddingBottom: 8 + insets.bottom }],
        tabBarLabelStyle: styles.tabLabel,
        tabBarInactiveTintColor: colors.mutedForeground,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Chat',
          tabBarActiveTintColor: spectrum.chat,
          tabBarIcon: icon('chatbubble-outline'),
        }}
      />
      <Tabs.Screen
        name="kanban"
        options={{
          title: 'Kanban',
          tabBarActiveTintColor: spectrum.kanban,
          tabBarIcon: icon('albums-outline'),
        }}
      />
      <Tabs.Screen
        name="notas"
        options={{
          title: 'Notas',
          tabBarActiveTintColor: spectrum.notas,
          tabBarIcon: icon('document-text-outline'),
        }}
      />
      <Tabs.Screen
        name="links"
        options={{
          title: 'Links',
          tabBarActiveTintColor: spectrum.arquivos,
          tabBarIcon: icon('link-outline'),
        }}
      />
      <Tabs.Screen
        name="mais"
        options={{
          title: 'Mais',
          tabBarActiveTintColor: spectrum.dashboard,
          tabBarIcon: icon('ellipsis-horizontal'),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.card,
    borderTopColor: colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  tabLabel: {
    fontSize: 11,
  },
});
