import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Contact } from '../models/Contact';
import { useContacts } from '../viewmodels/useContacts';
import { useSuggestions } from '../viewmodels/useSuggestions';

export default function SuggestionsScreen() {
  const { contacts, loading: loadingContacts } = useContacts();
  const { suggestions, loading: loadingSuggestions, error, getSuggestions } = useSuggestions();
  const [selected, setSelected] = useState<Contact | null>(null);

  async function handleSelect(contact: Contact) {
    setSelected(contact);
    await getSuggestions(contact);
  }

  async function handleRegenerate() {
    if (selected) await getSuggestions(selected, true);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Suggestions cadeaux</Text>

      {loadingContacts ? (
        <Text style={styles.empty}>Chargement...</Text>
      ) : (
        <FlatList
          data={contacts}
          keyExtractor={(item) => item.id}
          horizontal
          style={styles.contactList}
          ListEmptyComponent={<Text style={styles.empty}>Ajoute d'abord un proche dans l'onglet Contacts</Text>}
          renderItem={({ item }) => (
            <Pressable
              style={[styles.chip, selected?.id === item.id && styles.chipActive]}
              onPress={() => handleSelect(item)}
              accessibilityRole="button"
              accessibilityLabel={`Voir les suggestions pour ${item.nom}`}
              accessibilityState={{ selected: selected?.id === item.id }}
            >
              <Text style={[styles.chipText, selected?.id === item.id && styles.chipTextActive]}>
                {item.nom}
              </Text>
            </Pressable>
          )}
        />
      )}

      {selected && (
        <View style={styles.results}>
          {loadingSuggestions ? (
            <ActivityIndicator style={{ marginTop: 20 }} accessibilityLabel="Génération des suggestions en cours" />
          ) : error ? (
            <Text style={styles.error} accessibilityLiveRegion="polite">
              {error}
            </Text>
          ) : (
            <>
              {suggestions.map((s, i) => (
                <View key={i} style={styles.card} accessible accessibilityLabel={`Idée cadeau ${i + 1} : ${s}`}>
                  <Text style={styles.cardText}>{s}</Text>
                </View>
              ))}
              <Pressable
                style={styles.button}
                onPress={handleRegenerate}
                accessibilityRole="button"
                accessibilityLabel="Régénérer les suggestions"
              >
                <Text style={styles.buttonText}>Régénérer</Text>
              </Pressable>
            </>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: '600', marginBottom: 16 },
  contactList: { flexGrow: 0, marginBottom: 16 },
  empty: { color: '#888' },
  chip: { borderWidth: 1, borderColor: '#ccc', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, marginRight: 8 },
  chipActive: { backgroundColor: '#9B1B30', borderColor: '#9B1B30' },
  chipText: { color: '#333' },
  chipTextActive: { color: '#fff', fontWeight: '600' },
  results: { marginTop: 8 },
  card: { backgroundColor: '#f5f5f5', borderRadius: 8, padding: 14, marginBottom: 8 },
  cardText: { color: '#333' },
  error: { color: 'red' },
  button: { backgroundColor: '#333', borderRadius: 8, padding: 12, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontWeight: '600' },
});