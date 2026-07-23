import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { calculateAge, formatDayMonthFr, frToIso, isoToFr } from '../utils/dateFormat';
import { useContacts } from '../viewmodels/useContacts';
import { useGiftHistory } from '../viewmodels/useGiftHistory';

export default function ContactDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { contacts, deleteContact, updateContact } = useContacts();
  const { history } = useGiftHistory();

  const contact = useMemo(() => contacts.find((c) => c.id === id), [contacts, id]);
  const contactHistory = useMemo(() => history.filter((h) => h.contact_id === id), [history, id]);
  const interetsList = useMemo(
    () => (contact?.interets ? contact.interets.split(',').map((i) => i.trim()).filter(Boolean) : []),
    [contact]
  );

  const [menuVisible, setMenuVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [nom, setNom] = useState('');
  const [dateNaissance, setDateNaissance] = useState('');
  const [relation, setRelation] = useState('');
  const [interets, setInterets] = useState('');
  const [budget, setBudget] = useState('');
  const [notes, setNotes] = useState('');
  const [dateError, setDateError] = useState<string | null>(null);

  function openEdit() {
    if (!contact) return;
    setNom(contact.nom);
    setDateNaissance(isoToFr(contact.date_naissance));
    setRelation(contact.relation ?? '');
    setInterets(contact.interets ?? '');
    setBudget(contact.budget != null ? String(contact.budget) : '');
    setNotes(contact.notes ?? '');
    setDateError(null);
    setMenuVisible(false);
    setEditVisible(true);
  }

  async function handleSaveEdit() {
    if (!contact || !nom || !dateNaissance) return;
    const isoDate = frToIso(dateNaissance);
    if (!isoDate) {
      setDateError('Format de date invalide (attendu : JJ-MM-AAAA)');
      return;
    }
    const ok = await updateContact(contact.id, {
      nom,
      date_naissance: isoDate,
      relation: relation || null,
      interets: interets || null,
      budget: budget ? Number(budget) : null,
      notes: notes || null,
    });
    if (ok) setEditVisible(false);
  }

  function confirmDelete() {
    if (!contact) return;
    setMenuVisible(false);
    Alert.alert(
      'Supprimer ce proche ?',
      `${contact.nom} et son historique associé seront définitivement supprimés.`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            const ok = await deleteContact(contact.id);
            if (ok) router.back();
          },
        },
      ]
    );
  }

  if (!contact) {
    return (
      <SafeAreaView style={styles.notFound} edges={['top']}>
        <Text style={styles.empty}>Contact introuvable.</Text>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.headerSafe}>
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => router.back()}
            style={styles.headerButton}
            accessibilityRole="button"
            accessibilityLabel="Retour"
          >
            <Ionicons name="chevron-back" size={26} color={theme.colors.white} />
          </Pressable>
          <Pressable
            onPress={() => setMenuVisible(true)}
            style={styles.headerButton}
            accessibilityRole="button"
            accessibilityLabel="Options"
          >
            <Ionicons name="ellipsis-horizontal" size={24} color={theme.colors.white} />
          </Pressable>
        </View>
      </SafeAreaView>

      <View style={styles.bodyContainer}>
        <ScrollView contentContainerStyle={styles.body}>
          <View style={{ height: 46 }} />
          <Text style={styles.name}>{contact.nom}</Text>
          <Text style={styles.subtitle}>
            {contact.relation ? `${contact.relation} · ` : ''}
            {calculateAge(contact.date_naissance)} ans le {formatDayMonthFr(contact.date_naissance)}
          </Text>

          <Pressable
            style={({ pressed }) => [styles.iaButton, pressed && { opacity: 0.85 }]}
            onPress={() => router.push({ pathname: '/suggestions', params: { contactId: contact.id } })}
            accessibilityRole="button"
            accessibilityLabel={`Voir les idées cadeaux pour ${contact.nom}`}
          >
            <Ionicons name="sparkles" size={18} color={theme.colors.white} />
            <Text style={styles.iaButtonText}>Idées IA</Text>
          </Pressable>

          {interetsList.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>CENTRES D'INTÉRÊT</Text>
              <View style={styles.chipsRow}>
                {interetsList.map((interet) => (
                  <View key={interet} style={styles.chip}>
                    <Text style={styles.chipText}>{interet}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {contact.budget != null && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>BUDGET CADEAU</Text>
              <View style={styles.budgetPill}>
                <Text style={styles.budgetPillText}>{contact.budget} €</Text>
              </View>
            </View>
          )}

          {contact.notes && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>NOTES PRIVÉES</Text>
              <Text style={styles.notesText}>{contact.notes}</Text>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>HISTORIQUE DES CADEAUX</Text>
            <View style={styles.historyCard}>
              {contactHistory.length === 0 ? (
                <Text style={styles.empty}>Aucun cadeau enregistré pour l'instant</Text>
              ) : (
                contactHistory.map((h, i) => (
                  <View key={h.id} style={[styles.historyRow, i > 0 && styles.historyRowBorder]}>
                    <Text style={styles.historyName}>{h.cadeau}</Text>
                    <Text style={styles.historyDate}>Offert le {isoToFr(h.date_offert)}</Text>
                  </View>
                ))
              )}
            </View>
          </View>
        </ScrollView>

        <View style={styles.avatarLarge} pointerEvents="none">
          <Text style={styles.avatarLargeText}>{contact.nom.charAt(0).toUpperCase()}</Text>
        </View>
      </View>

      {/* Menu "..." */}
      <Modal visible={menuVisible} transparent animationType="fade" onRequestClose={() => setMenuVisible(false)}>
        <Pressable style={styles.menuBackdrop} onPress={() => setMenuVisible(false)}>
          <View style={styles.menuCard}>
            <Pressable style={styles.menuItem} onPress={openEdit} accessibilityRole="button" accessibilityLabel="Modifier ce proche">
              <Ionicons name="create-outline" size={20} color={theme.colors.textPrimary} />
              <Text style={styles.menuItemText}>Modifier</Text>
            </Pressable>
            <View style={styles.menuDivider} />
            <Pressable style={styles.menuItem} onPress={confirmDelete} accessibilityRole="button" accessibilityLabel="Supprimer ce proche">
              <Ionicons name="trash-outline" size={20} color="#C0392B" />
              <Text style={[styles.menuItemText, { color: '#C0392B' }]}>Supprimer</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* Modale de modification */}
      <Modal visible={editVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setEditVisible(false)}>
        <KeyboardAvoidingView style={styles.editContainer} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Modifier {contact.nom}</Text>
            <Pressable onPress={() => setEditVisible(false)} accessibilityRole="button" accessibilityLabel="Fermer">
              <Ionicons name="close" size={26} color={theme.colors.textSecondary} />
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={{ padding: theme.spacing.lg }} keyboardShouldPersistTaps="handled">
            <Text style={styles.label}>Nom complet</Text>
            <TextInput style={styles.input} value={nom} onChangeText={setNom} accessibilityLabel="Nom complet" />

            <View style={styles.row}>
              <View style={styles.halfField}>
                <Text style={styles.label}>Date de naissance</Text>
                <TextInput style={styles.input} placeholder="JJ-MM-AAAA" value={dateNaissance} onChangeText={setDateNaissance} accessibilityLabel="Date de naissance" />
              </View>
              <View style={styles.halfField}>
                <Text style={styles.label}>Relation</Text>
                <TextInput style={styles.input} value={relation} onChangeText={setRelation} accessibilityLabel="Relation" />
              </View>
            </View>
            {dateError && <Text style={styles.error}>{dateError}</Text>}

            <Text style={styles.label}>Centres d'intérêt</Text>
            <TextInput
              style={[styles.input, styles.multiline]}
              value={interets}
              onChangeText={setInterets}
              multiline
              numberOfLines={3}
              accessibilityLabel="Centres d'intérêt"
            />

            <Text style={styles.label}>Budget cadeau (€)</Text>
            <TextInput style={styles.input} keyboardType="numeric" value={budget} onChangeText={setBudget} accessibilityLabel="Budget en euros" />

            <Text style={styles.label}>Notes privées</Text>
            <TextInput
              style={[styles.input, styles.multiline]}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
              accessibilityLabel="Notes privées"
            />

            <Pressable
              style={({ pressed }) => [styles.saveButton, pressed && { opacity: 0.85 }]}
              onPress={handleSaveEdit}
              accessibilityRole="button"
              accessibilityLabel="Enregistrer les modifications"
            >
              <Text style={styles.saveButtonText}>Enregistrer les modifications</Text>
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.primary },
  notFound: { flex: 1, backgroundColor: theme.colors.background, alignItems: 'center', justifyContent: 'center' },
  headerSafe: { backgroundColor: theme.colors.primary },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  headerButton: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  bodyContainer: { flex: 1, backgroundColor: theme.colors.background, borderTopLeftRadius: 28, borderTopRightRadius: 28 },
  body: { alignItems: 'center', padding: theme.spacing.lg, paddingBottom: theme.spacing.xl },
  avatarLarge: {
    position: 'absolute',
    top: -46,
    alignSelf: 'center',
    width: 92, height: 92, borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 4, borderColor: theme.colors.card,
  },
  avatarLargeText: { color: theme.colors.primary, fontSize: 32, fontWeight: '700' },
  name: { fontSize: 24, fontWeight: '700', color: theme.colors.textPrimary, marginTop: theme.spacing.md },
  subtitle: { fontSize: 14, color: theme.colors.primary, fontWeight: '600', marginTop: 4, marginBottom: theme.spacing.lg },
  iaButton: {
    flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center',
    backgroundColor: theme.colors.primary, borderRadius: theme.radius.pill,
    paddingVertical: 14, paddingHorizontal: 28, marginBottom: theme.spacing.lg,
  },
  iaButtonText: { color: theme.colors.white, fontWeight: '700', fontSize: 15 },
  section: { width: '100%', marginTop: theme.spacing.md },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: theme.colors.textSecondary, letterSpacing: 0.5, marginBottom: theme.spacing.sm },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { backgroundColor: theme.colors.card, borderRadius: theme.radius.pill, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: theme.colors.border },
  chipText: { color: theme.colors.textPrimary, fontWeight: '600', fontSize: 13 },
  budgetPill: { alignSelf: 'flex-start', backgroundColor: theme.colors.successBg, borderRadius: theme.radius.pill, paddingHorizontal: 14, paddingVertical: 8 },
  budgetPillText: { color: theme.colors.success, fontWeight: '700', fontSize: 14 },
  notesText: { color: theme.colors.textPrimary, backgroundColor: theme.colors.card, borderRadius: theme.radius.md, padding: theme.spacing.md, fontSize: 14 },
  historyCard: { backgroundColor: theme.colors.card, borderRadius: theme.radius.lg, padding: theme.spacing.md },
  historyRow: { paddingVertical: theme.spacing.sm },
  historyRowBorder: { borderTopWidth: 1, borderTopColor: theme.colors.border },
  historyName: { fontWeight: '700', color: theme.colors.textPrimary, fontSize: 15 },
  historyDate: { color: theme.colors.textSecondary, fontSize: 13, marginTop: 2 },
  empty: { textAlign: 'center', color: theme.colors.textSecondary, padding: theme.spacing.md },
  menuBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'flex-end' },
  menuCard: { backgroundColor: theme.colors.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: theme.spacing.xl },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: theme.spacing.lg },
  menuItemText: { fontSize: 16, fontWeight: '600', color: theme.colors.textPrimary },
  menuDivider: { height: 1, backgroundColor: theme.colors.border, marginHorizontal: theme.spacing.lg },
  editContainer: { flex: 1, backgroundColor: theme.colors.background },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: theme.spacing.lg, borderBottomWidth: 1, borderBottomColor: theme.colors.border,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: theme.colors.textPrimary },
  row: { flexDirection: 'row', gap: theme.spacing.sm },
  halfField: { flex: 1 },
  label: { fontSize: 13, fontWeight: '600', color: theme.colors.textPrimary, marginBottom: theme.spacing.xs, marginTop: theme.spacing.sm },
  input: { backgroundColor: theme.colors.card, borderRadius: theme.radius.md, padding: 14, fontSize: 15, color: theme.colors.textPrimary, borderWidth: 1, borderColor: theme.colors.border },
  multiline: { minHeight: 80, textAlignVertical: 'top' },
  error: { color: '#C0392B', marginTop: theme.spacing.sm, fontSize: 13 },
  saveButton: { backgroundColor: theme.colors.primary, borderRadius: theme.radius.pill, padding: 16, alignItems: 'center', marginTop: theme.spacing.lg },
  saveButtonText: { color: theme.colors.white, fontWeight: '700', fontSize: 16 },
});