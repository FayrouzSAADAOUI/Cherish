import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { useReminders } from '../viewmodels/useReminders';

function reminderMessage(joursRestants: number): string | null {
  if (joursRestants === 0) return "C'est aujourd'hui ! Souhaite-lui un joyeux anniversaire 🎉";
  if (joursRestants === 1) return "N'oublie pas de lui souhaiter un joyeux anniversaire ! 🎉";
  if (joursRestants >= 2 && joursRestants <= 7) return "C'est le moment de lui trouver un cadeau !";
  return null;
}

function badgeLabel(type: string | null): string {
  if (type === 'J-0') return "Aujourd'hui";
  return type ?? '';
}

export default function RemindersScreen() {
  const { reminders, loading, error } = useReminders();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>Rappels à venir</Text>
      {error && (
        <Text style={styles.error} accessibilityLiveRegion="polite">
          {error}
        </Text>
      )}
      {loading ? (
        <Text style={styles.empty}>Chargement...</Text>
      ) : (
        <FlatList
          data={reminders}
          keyExtractor={(item) => item.contactId}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<Text style={styles.empty}>Aucun proche enregistré pour l'instant</Text>}
          renderItem={({ item }) => {
            const message = reminderMessage(item.joursRestants);
            const isUrgent = item.type === 'J-0';
            return (
              <View
                style={[styles.card, isUrgent && styles.cardUrgent]}
                accessible
                accessibilityLabel={`${item.nom}, anniversaire le ${item.prochainAnniversaire}, dans ${item.joursRestants} jours${message ? `, ${message}` : ''}`}
              >
                <View style={styles.rowBetween}>
                  <View style={styles.nameRow}>
                    <View style={[styles.avatar, isUrgent && styles.avatarUrgent]}>
                      <Text style={[styles.avatarText, isUrgent && styles.avatarTextUrgent]}>
                        {item.nom.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <Text style={[styles.cardName, isUrgent && styles.textUrgent]}>{item.nom}</Text>
                  </View>
                  {item.type && (
                    <View style={[styles.badge, isUrgent && styles.badgeUrgent]}>
                      <Text style={[styles.badgeText, isUrgent && styles.badgeTextUrgent]}>{badgeLabel(item.type)}</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.cardDetail, isUrgent && styles.textUrgentSub]}>
                  Anniversaire le {item.prochainAnniversaire} · dans {item.joursRestants} jour(s)
                </Text>
                {message && (
                  <Text style={[styles.message, isUrgent && styles.messageUrgent]}>{message}</Text>
                )}
              </View>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: theme.spacing.lg, backgroundColor: theme.colors.background },
  title: { fontSize: 24, fontWeight: '700', color: theme.colors.textPrimary, marginBottom: theme.spacing.md, textAlign: 'center' },
  error: { color: '#C0392B', marginBottom: theme.spacing.md, textAlign: 'center' },
  empty: { textAlign: 'center', color: theme.colors.textSecondary, marginTop: theme.spacing.lg },
  listContent: { paddingBottom: theme.spacing.lg },
  card: {
    backgroundColor: theme.colors.card, borderRadius: theme.radius.lg, padding: theme.spacing.md, marginBottom: theme.spacing.sm,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 1,
  },
  cardUrgent: {
    backgroundColor: theme.colors.accent,
    shadowOpacity: 0.18, shadowRadius: 12, elevation: 4,
  },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  avatar: {
    width: 36, height: 36, borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primaryLight, alignItems: 'center', justifyContent: 'center',
  },
  avatarUrgent: { backgroundColor: 'rgba(255,255,255,0.3)' },
  avatarText: { color: theme.colors.primary, fontWeight: '700', fontSize: 14 },
  avatarTextUrgent: { color: theme.colors.white },
  cardName: { fontWeight: '700', fontSize: 16, color: theme.colors.textPrimary },
  cardDetail: { color: theme.colors.textSecondary, fontSize: 13, marginTop: theme.spacing.sm },
  textUrgent: { color: theme.colors.white },
  textUrgentSub: { color: 'rgba(255,255,255,0.9)' },
  badge: { backgroundColor: theme.colors.primary, borderRadius: theme.radius.pill, paddingHorizontal: 10, paddingVertical: 4 },
  badgeUrgent: { backgroundColor: theme.colors.white },
  badgeText: { color: theme.colors.white, fontSize: 12, fontWeight: '700' },
  badgeTextUrgent: { color: theme.colors.accent },
  message: { color: theme.colors.primary, fontWeight: '600', fontSize: 13, marginTop: theme.spacing.xs },
  messageUrgent: { color: theme.colors.white, fontWeight: '700' },
});