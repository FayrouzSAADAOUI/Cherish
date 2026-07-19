import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useContacts } from '../viewmodels/useContacts';
import { useGiftHistory } from '../viewmodels/useGiftHistory';

export default function HistoryScreen() {
  const { contacts } = useContacts();
  const { history, loading, error, addHistoryEntry } = useGiftHistory();
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [cadeau, setCadeau] = useState('');
  const [dateOfferte, setDateOfferte] = useState('');

  async function handleAdd() {
    if (!selectedContactId || !cadeau || !dateOfferte) return;
    const ok = await addHistoryEntry({
      contact_id: selectedContactId,
      cadeau,
      date_offert: dateOfferte,
    });
    if (ok) {
      setCadeau('');
      setDateOfferte('');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historique des cadeaux</Text>

      <View style={styles.form}>
        <FlatList
          data={contacts}
          horizontal
          keyExtractor={(item) => item.id}
          style={{ flexGrow: 0, marginBottom: 8 }}
          renderItem={({ item }) => (
            <Pressable
              style={[styles.chip, selectedContactId === item.id && styles.chipActive]}
              onPress={() => setSelectedContactId(item.id)}
              accessibilityRole="button"
              accessibilityLabel={`Choisir ${item.nom} pour cette entrée d'historique`}
              accessibilityState={{ selected: selectedContactId === item.id }}
            >
              <Text style={[styles.chipText, selectedContactId === item.id && styles.chipTextActive]}>
                {item.nom}
              </Text>
            </Pressable>
          )}
        />
        <TextInput
          style={styles.input}
          placeholder="Cadeau offert"
          accessibilityLabel="Nom du cadeau offert"
          value={cadeau}
          onChangeText={setCadeau}
        />
        <TextInput
          style={styles.input}
          placeholder="Date (AAAA-MM-JJ)"
          accessibilityLabel="Date à laquelle le cadeau a été offert, format année-mois-jour"
          value={dateOfferte}
          onChangeText={setDateOfferte}
        />
        {error && (
          <Text style={styles.error} accessibilityLiveRegion="polite">
            {error}
          </Text>
        )}
        <Pressable
          style={styles.button}
          onPress={handleAdd}
          accessibilityRole="button"
          accessibilityLabel="Ajouter à l'historique"
        >
          <Text style={styles.buttonText}>Ajouter à l'historique</Text>
        </Pressable>
      </View>

      {loading ? (
        <Text style={styles.empty}>Chargement...</Text>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text style={styles.empty}>Aucun cadeau enregistré pour l'instant</Text>}
          renderItem={({ item }) => (
            <View
              style={styles.card}
              accessible
              accessibilityLabel={`${item.cadeau}, offert à ${(item as any).contacts?.nom ?? 'un contact'} le ${item.date_offert}`}
            >
              <Text style={styles.cardName}>{item.cadeau}</Text>
              <Text style={styles.cardDetail}>
                {(item as any).contacts?.nom ?? 'Contact'} · {item.date_offert}
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
  form: { marginBottom: 20, gap: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10 },
  button: { backgroundColor: '#9B1B30', borderRadius: 8, padding: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600' },
  error: { color: 'red' },
  empty: { textAlign: 'center', color: '#888', marginTop: 20 },
  card: { backgroundColor: '#f5f5f5', borderRadius: 8, padding: 12, marginBottom: 8 },
  cardName: { fontWeight: '600', fontSize: 16 },
  cardDetail: { color: '#555', marginTop: 2 },
  chip: { borderWidth: 1, borderColor: '#ccc', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, marginRight: 8 },
  chipActive: { backgroundColor: '#9B1B30', borderColor: '#9B1B30' },
  chipText: { color: '#333' },
  chipTextActive: { color: '#fff', fontWeight: '600' },
});