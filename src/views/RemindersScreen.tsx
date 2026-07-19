import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useReminders } from '../viewmodels/useReminders';

export default function RemindersScreen() {
  const { reminders, loading, error } = useReminders();

  return (
    <View style={styles.container}>
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
          ListEmptyComponent={<Text style={styles.empty}>Aucun proche enregistré pour l'instant</Text>}
          renderItem={({ item }) => (
            <View
              style={styles.card}
              accessible
              accessibilityLabel={`${item.nom}, anniversaire le ${item.prochainAnniversaire}, dans ${item.joursRestants} jours${item.type ? `, rappel ${item.type}` : ''}`}
            >
              <View style={styles.rowBetween}>
                <Text style={styles.cardName}>{item.nom}</Text>
                {item.type && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.type}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.cardDetail}>
                Anniversaire le {item.prochainAnniversaire} · dans {item.joursRestants} jour(s)
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: '600', marginBottom: 16 },
  error: { color: 'red', marginBottom: 12 },
  empty: { textAlign: 'center', color: '#888', marginTop: 20 },
  card: { backgroundColor: '#f5f5f5', borderRadius: 8, padding: 12, marginBottom: 8 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardName: { fontWeight: '600', fontSize: 16 },
  cardDetail: { color: '#555', marginTop: 4 },
  badge: { backgroundColor: '#9B1B30', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
});