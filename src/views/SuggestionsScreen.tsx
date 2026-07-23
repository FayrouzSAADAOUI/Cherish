import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Contact } from '../models/Contact';
import { theme } from '../theme';
import { useContacts } from '../viewmodels/useContacts';
import { useSuggestions } from '../viewmodels/useSuggestions';

export default function SuggestionsScreen() {
  const { contacts, loading: loadingContacts } = useContacts();
  const { suggestions, loading: loadingSuggestions, error, getSuggestions } = useSuggestions();
  const [selected, setSelected] = useState<Contact | null>(null);
  const { contactId } = useLocalSearchParams<{ contactId?: string }>();

  async function handleSelect(contact: Contact) {
    if (selected?.id === contact.id) {
      setSelected(null);
      return;
    }
    setSelected(contact);
    await getSuggestions(contact);
  }

  useEffect(() => {
    if (contactId && contacts.length > 0) {
      const target = contacts.find((c) => c.id === contactId);
      if (target && target.id !== selected?.id) {
        setSelected(target);
        getSuggestions(target);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contactId, contacts]);

  async function handleRegenerate() {
    if (selected) await getSuggestions(selected, true);
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>Suggestions cadeaux</Text>

      {loadingContacts ? (
        <Text style={styles.empty}>Chargement...</Text>
      ) : (
        <FlatList
          data={contacts}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.contactList}
          ListEmptyComponent={<Text style={styles.empty}>Ajoute d'abord un proche dans l'onglet Contacts</Text>}
          renderItem={({ item }) => (
            <Pressable
              style={[styles.chip, selected?.id === item.id && styles.chipActive]}
              onPress={() => handleSelect(item)}
              accessibilityRole="button"
              accessibilityLabel={`${selected?.id === item.id ? 'Désélectionner' : 'Voir les suggestions pour'} ${item.nom}`}
              accessibilityState={{ selected: selected?.id === item.id }}
            >
              <Text style={[styles.chipText, selected?.id === item.id && styles.chipTextActive]}>
                {item.nom}
              </Text>
            </Pressable>
          )}
        />
      )}

      {!loadingContacts && contacts.length > 0 && !selected && (
        <View style={styles.guide}>
          <View style={styles.guideIcon}>
            <Ionicons name="gift-outline" size={28} color={theme.colors.primary} />
          </View>
          <Text style={styles.guideTitle}>Sélectionne un proche</Text>
          <Text style={styles.guideText}>
            Choisis un proche ci-dessus pour découvrir des idées cadeaux générées pour lui.
          </Text>
        </View>
      )}

      {selected && (
        <View style={styles.results}>
          {loadingSuggestions ? (
            <ActivityIndicator style={{ marginTop: 20 }} color={theme.colors.primary} accessibilityLabel="Génération des suggestions en cours" />
          ) : error ? (
            <Text style={styles.error} accessibilityLiveRegion="polite">
              {error}
            </Text>
          ) : (
            <>
              {suggestions.map((s, i) => (
                <View key={i} style={styles.card} accessible accessibilityLabel={`Idée cadeau ${i + 1} : ${s}`}>
                  <View style={styles.cardIcon}>
                    <Ionicons name="gift" size={20} color={theme.colors.primary} />
                  </View>
                  <Text style={styles.cardText}>{s}</Text>
                </View>
              ))}
              <Pressable
                style={({ pressed }) => [styles.button, pressed && { opacity: 0.85 }]}
                onPress={handleRegenerate}
                accessibilityRole="button"
                accessibilityLabel="Régénérer les suggestions"
              >
                <Ionicons name="refresh" size={18} color={theme.colors.white} />
                <Text style={styles.buttonText}>Régénérer</Text>
              </Pressable>
            </>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: theme.spacing.lg, backgroundColor: theme.colors.background },
  title: { fontSize: 24, fontWeight: '700', color: theme.colors.textPrimary, marginBottom: theme.spacing.md, textAlign: 'center' },
  contactList: { flexGrow: 0, marginBottom: theme.spacing.lg },
  empty: { color: theme.colors.textSecondary },
  chip: { borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.card, borderRadius: theme.radius.pill, paddingHorizontal: 14, paddingVertical: 8, marginRight: 8 },
  chipActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  chipText: { color: theme.colors.textPrimary, fontWeight: '600' },
  chipTextActive: { color: theme.colors.white },
  guide: { alignItems: 'center', marginTop: theme.spacing.xl, paddingHorizontal: theme.spacing.lg },
  guideIcon: {
    width: 64, height: 64, borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: theme.spacing.md,
  },
  guideTitle: { fontSize: 17, fontWeight: '700', color: theme.colors.textPrimary, marginBottom: theme.spacing.xs },
  guideText: { fontSize: 14, color: theme.colors.textSecondary, textAlign: 'center' },
  results: { marginTop: theme.spacing.sm },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md,
    backgroundColor: theme.colors.card, borderRadius: theme.radius.lg, padding: theme.spacing.md, marginBottom: theme.spacing.sm,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, elevation: 2,
  },
  cardIcon: {
    width: 44, height: 44, borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primaryLight, alignItems: 'center', justifyContent: 'center',
  },
  cardText: { flex: 1, color: theme.colors.textPrimary, fontSize: 15, fontWeight: '500' },
  error: { color: '#C0392B', textAlign: 'center' },
  button: {
    flexDirection: 'row', gap: 8, backgroundColor: theme.colors.primary, borderRadius: theme.radius.pill,
    padding: 14, alignItems: 'center', justifyContent: 'center', marginTop: theme.spacing.sm,
  },
  buttonText: { color: theme.colors.white, fontWeight: '700' },
});