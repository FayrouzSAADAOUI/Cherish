import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Alert, FlatList, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Contact } from '../models/Contact';
import { theme } from '../theme';
import { frToIso, isoToFr } from '../utils/dateFormat';
import { useContacts } from '../viewmodels/useContacts';
import { useGiftHistory } from '../viewmodels/useGiftHistory';

export default function HistoryScreen() {
  const { contacts, loading: loadingContacts } = useContacts();
  const { history, loading: loadingHistory, error, addHistoryEntry, deleteHistoryEntry } = useGiftHistory();
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const [cadeau, setCadeau] = useState('');
  const [dateOfferte, setDateOfferte] = useState('');
  const [dateError, setDateError] = useState<string | null>(null);

  const activeHistory = useMemo(
    () => (activeContact ? history.filter((h) => h.contact_id === activeContact.id) : []),
    [history, activeContact]
  );

  function openContact(contact: Contact) {
    setActiveContact(contact);
    setCadeau('');
    setDateOfferte('');
    setDateError(null);
  }

  async function handleAdd() {
    if (!activeContact || !cadeau || !dateOfferte) return;
    const isoDate = frToIso(dateOfferte);
    if (!isoDate) {
      setDateError('Format de date invalide (attendu : JJ-MM-AAAA)');
      return;
    }
    setDateError(null);
    const ok = await addHistoryEntry({
      contact_id: activeContact.id,
      cadeau,
      date_offert: isoDate,
    });
    if (ok) {
      setCadeau('');
      setDateOfferte('');
    }
  }

  function confirmDelete(id: string, label: string) {
    Alert.alert(
      'Supprimer cette entrée ?',
      `"${label}" sera définitivement supprimé de l'historique.`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', style: 'destructive', onPress: () => deleteHistoryEntry(id) },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>Historique cadeaux</Text>

      {loadingContacts ? (
        <Text style={styles.empty}>Chargement...</Text>
      ) : (
        <FlatList
          data={contacts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<Text style={styles.empty}>Ajoute d'abord un proche dans l'onglet Contacts</Text>}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.nom.charAt(0).toUpperCase()}</Text>
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.cardName}>{item.nom}</Text>
                {item.relation && <Text style={styles.cardDetail}>{item.relation}</Text>}
              </View>
              <Pressable
                style={styles.historyButton}
                onPress={() => openContact(item)}
                accessibilityRole="button"
                accessibilityLabel={`Voir l'historique de ${item.nom}`}
              >
                <Ionicons name="time-outline" size={16} color={theme.colors.primary} />
                <Text style={styles.historyButtonText}>Historique</Text>
              </Pressable>
            </View>
          )}
        />
      )}

      <Modal
        visible={!!activeContact}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setActiveContact(null)}
      >
        <KeyboardAvoidingView style={styles.modalContainer} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Historique de {activeContact?.nom}</Text>
            <Pressable onPress={() => setActiveContact(null)} accessibilityRole="button" accessibilityLabel="Fermer">
              <Ionicons name="close" size={26} color={theme.colors.textSecondary} />
            </Pressable>
          </View>

          <FlatList
            data={activeHistory}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ padding: theme.spacing.lg }}
            ListHeaderComponent={
              <View style={styles.form}>
                <Text style={styles.label}>Cadeau offert</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex : Bouteille de vin"
                  placeholderTextColor={theme.colors.textSecondary}
                  accessibilityLabel="Nom du cadeau offert"
                  value={cadeau}
                  onChangeText={setCadeau}
                />
                <Text style={styles.label}>Date</Text>
                <TextInput
                  style={styles.input}
                  placeholder="JJ-MM-AAAA"
                  placeholderTextColor={theme.colors.textSecondary}
                  accessibilityLabel="Date à laquelle le cadeau a été offert, format jour-mois-année"
                  value={dateOfferte}
                  onChangeText={setDateOfferte}
                />
                {dateError && <Text style={styles.error}>{dateError}</Text>}
                {error && <Text style={styles.error} accessibilityLiveRegion="polite">{error}</Text>}
                <Pressable
                  style={styles.button}
                  onPress={handleAdd}
                  accessibilityRole="button"
                  accessibilityLabel="Ajouter à l'historique"
                >
                  <Text style={styles.buttonText}>Ajouter à l'historique</Text>
                </Pressable>

                <Text style={styles.sectionLabel}>CADEAUX PRÉCÉDENTS</Text>
              </View>
            }
            ListEmptyComponent={
              !loadingHistory ? <Text style={[styles.empty, { marginTop: 0 }]}>Aucun cadeau enregistré pour l'instant</Text> : null
            }
            renderItem={({ item }) => (
              <View style={styles.historyCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.historyName}>{item.cadeau}</Text>
                  <Text style={styles.historyDate}>Offert le {isoToFr(item.date_offert)}</Text>
                </View>
                <Pressable
                  onPress={() => confirmDelete(item.id, item.cadeau)}
                  accessibilityRole="button"
                  accessibilityLabel={`Supprimer ${item.cadeau} de l'historique`}
                  hitSlop={8}
                >
                  <Ionicons name="trash-outline" size={20} color="#C0392B" />
                </Pressable>
              </View>
            )}
          />
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, padding: theme.spacing.lg },
  title: { fontSize: 24, fontWeight: '700', color: theme.colors.textPrimary, marginBottom: theme.spacing.md, textAlign: 'center' },
  listContent: { paddingBottom: theme.spacing.lg },
  empty: { textAlign: 'center', color: theme.colors.textSecondary, marginTop: theme.spacing.lg },
  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: theme.colors.card, borderRadius: theme.radius.lg, padding: theme.spacing.md, marginBottom: theme.spacing.sm,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 1,
  },
  avatar: {
    width: 48, height: 48, borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: theme.spacing.md,
  },
  avatarText: { color: theme.colors.primary, fontWeight: '700' },
  cardBody: { flex: 1 },
  cardName: { fontWeight: '700', fontSize: 16, color: theme.colors.textPrimary },
  cardDetail: { color: theme.colors.textSecondary, fontSize: 13, marginTop: 2 },
  historyButton: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderWidth: 1, borderColor: theme.colors.primary, borderRadius: theme.radius.pill,
    paddingHorizontal: 12, paddingVertical: 7,
  },
  historyButtonText: { color: theme.colors.primary, fontWeight: '700', fontSize: 12 },
  modalContainer: { flex: 1, backgroundColor: theme.colors.background },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: theme.spacing.lg, borderBottomWidth: 1, borderBottomColor: theme.colors.border,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: theme.colors.textPrimary },
  form: {
    backgroundColor: theme.colors.card, borderRadius: theme.radius.lg, padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 2,
  },
  label: { fontSize: 13, fontWeight: '600', color: theme.colors.textPrimary, marginBottom: theme.spacing.xs, marginTop: theme.spacing.sm },
  input: { backgroundColor: theme.colors.background, borderRadius: theme.radius.md, padding: 14, fontSize: 15, color: theme.colors.textPrimary },
  error: { color: '#C0392B', marginTop: theme.spacing.sm, fontSize: 13 },
  button: { backgroundColor: theme.colors.primary, borderRadius: theme.radius.pill, padding: 16, alignItems: 'center', marginTop: theme.spacing.lg },
  buttonText: { color: theme.colors.white, fontWeight: '700', fontSize: 16 },
  sectionLabel: { fontSize: 12, fontWeight: '700', color: theme.colors.textSecondary, letterSpacing: 0.5, marginTop: theme.spacing.lg },
  historyCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: theme.colors.card, borderRadius: theme.radius.md, padding: theme.spacing.md, marginTop: theme.spacing.sm,
  },
  historyName: { fontWeight: '700', color: theme.colors.textPrimary, fontSize: 15 },
  historyDate: { color: theme.colors.textSecondary, fontSize: 13, marginTop: 2 },
});