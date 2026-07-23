import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  FlatList, Keyboard, KeyboardAvoidingView, Modal, Platform,
  Pressable, StyleSheet, Text, TextInput, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { frToIso, isoToFr } from '../utils/dateFormat';
import { useContacts } from '../viewmodels/useContacts';

export default function ContactsScreen() {
  const { contacts, loading, error, addContact } = useContacts();
  const { openAdd } = useLocalSearchParams<{ openAdd?: string }>();
  const [formVisible, setFormVisible] = useState(false);
  const [nom, setNom] = useState('');
  const [dateNaissance, setDateNaissance] = useState('');
  const [relation, setRelation] = useState('');
  const [interets, setInterets] = useState('');
  const [budget, setBudget] = useState('');
  const [notes, setNotes] = useState('');
  const [dateError, setDateError] = useState<string | null>(null);

  useEffect(() => {
    if (openAdd === '1') {
      setFormVisible(true);
      router.setParams({ openAdd: undefined });
    }
  }, [openAdd]);

  function resetForm() {
    setNom('');
    setDateNaissance('');
    setRelation('');
    setInterets('');
    setBudget('');
    setNotes('');
    setDateError(null);
  }

  async function handleAdd() {
    if (!nom || !dateNaissance) return;
    const isoDate = frToIso(dateNaissance);
    if (!isoDate) {
      setDateError('Format de date invalide (attendu : JJ-MM-AAAA)');
      return;
    }
    setDateError(null);
    const ok = await addContact({
      nom,
      date_naissance: isoDate,
      interets: interets || null,
      budget: budget ? Number(budget) : null,
      relation: relation || null,
      notes: notes || null,
    });
    if (ok) {
      Keyboard.dismiss();
      resetForm();
      setFormVisible(false);
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>Vos proches</Text>

      {loading ? (
        <Text style={styles.empty}>Chargement...</Text>
      ) : (
        <FlatList
          data={contacts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<Text style={styles.empty}>Aucun contact pour l'instant</Text>}
          ListFooterComponent={
            <Pressable
              style={({ pressed }) => [styles.addButton, pressed && styles.buttonPressed]}
              onPress={() => setFormVisible(true)}
              accessibilityRole="button"
              accessibilityLabel="Ajouter un proche"
            >
              <Ionicons name="add" size={20} color={theme.colors.white} />
              <Text style={styles.addButtonText}>Ajouter un proche</Text>
            </Pressable>
          }
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() => router.push(`/contact/${item.id}`)}
              accessibilityRole="button"
              accessibilityLabel={`Voir la fiche de ${item.nom}`}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.nom.charAt(0).toUpperCase()}</Text>
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.cardName}>
                  {item.nom}
                  {item.relation ? <Text style={styles.cardRelation}>  ·  {item.relation}</Text> : null}
                </Text>
                <Text style={styles.cardDetail}>{isoToFr(item.date_naissance)}</Text>
                {item.interets && <Text style={styles.cardDetail}>{item.interets}</Text>}
                {item.budget != null && (
                  <View style={styles.budgetPill}>
                    <Text style={styles.budgetPillText}>{item.budget} €</Text>
                  </View>
                )}
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
            </Pressable>
          )}
        />
      )}

      <Modal
        visible={formVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setFormVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer} edges={['top']}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nouveau proche</Text>
              <Pressable
                onPress={() => setFormVisible(false)}
                accessibilityRole="button"
                accessibilityLabel="Fermer le formulaire"
              >
                <Ionicons name="close" size={26} color={theme.colors.textSecondary} />
              </Pressable>
            </View>

            <FlatList
              data={[]}
              keyExtractor={() => 'x'}
              renderItem={null}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ padding: theme.spacing.lg }}
              ListHeaderComponent={
                <View>
                  <Text style={styles.label}>Nom complet</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ex : Thomas Dubois"
                    placeholderTextColor={theme.colors.textSecondary}
                    accessibilityLabel="Nom complet du proche"
                    value={nom}
                    onChangeText={setNom}
                  />

                  <View style={styles.row}>
                    <View style={styles.halfField}>
                      <Text style={styles.label}>Date de naissance</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="JJ-MM-AAAA"
                        placeholderTextColor={theme.colors.textSecondary}
                        accessibilityLabel="Date de naissance, format jour-mois-année"
                        value={dateNaissance}
                        onChangeText={setDateNaissance}
                        keyboardType="numbers-and-punctuation"
                      />
                    </View>
                    <View style={styles.halfField}>
                      <Text style={styles.label}>Relation</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Ex : Ami, Sœur"
                        placeholderTextColor={theme.colors.textSecondary}
                        accessibilityLabel="Relation avec ce proche"
                        value={relation}
                        onChangeText={setRelation}
                      />
                    </View>
                  </View>
                  {dateError && <Text style={styles.error}>{dateError}</Text>}

                  <Text style={styles.label}>Centres d'intérêt</Text>
                  <TextInput
                    style={[styles.input, styles.multiline]}
                    placeholder="Ex : Photographie, café, high-tech, voyages..."
                    placeholderTextColor={theme.colors.textSecondary}
                    accessibilityLabel="Centres d'intérêt"
                    value={interets}
                    onChangeText={setInterets}
                    multiline
                    numberOfLines={3}
                  />

                  <Text style={styles.label}>Budget cadeau (€)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ex : 50"
                    placeholderTextColor={theme.colors.textSecondary}
                    accessibilityLabel="Budget en euros"
                    keyboardType="numeric"
                    value={budget}
                    onChangeText={setBudget}
                  />

                  <Text style={styles.label}>Notes privées</Text>
                  <TextInput
                    style={[styles.input, styles.multiline]}
                    placeholder="Tailles de vêtements, allergies, etc."
                    placeholderTextColor={theme.colors.textSecondary}
                    accessibilityLabel="Notes privées"
                    value={notes}
                    onChangeText={setNotes}
                    multiline
                    numberOfLines={3}
                  />

                  {error && (
                    <Text style={styles.error} accessibilityLiveRegion="polite">
                      {error}
                    </Text>
                  )}

                  <Pressable
                    style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
                    onPress={handleAdd}
                    accessibilityRole="button"
                    accessibilityLabel="Enregistrer ce proche"
                  >
                    <Text style={styles.buttonText}>Enregistrer</Text>
                  </Pressable>
                </View>
              }
            />
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, padding: theme.spacing.lg },
  title: { fontSize: 24, fontWeight: '700', color: theme.colors.textPrimary, marginBottom: theme.spacing.md, textAlign: 'center' },
  addButton: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.pill,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: theme.spacing.sm,
  },
  buttonPressed: { opacity: 0.85 },
  addButtonText: { color: theme.colors.white, fontWeight: '700', fontSize: 15 },
  listContent: { paddingBottom: theme.spacing.lg },
  empty: { textAlign: 'center', color: theme.colors.textSecondary, marginTop: theme.spacing.lg },
  card: {
    flexDirection: 'row',
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  avatarText: { color: theme.colors.primary, fontWeight: '700', fontSize: 20 },
  cardBody: { flex: 1 },
  cardName: { fontWeight: '700', fontSize: 16, color: theme.colors.textPrimary },
  cardRelation: { fontWeight: '400', color: theme.colors.textSecondary, fontSize: 13 },
  cardDetail: { color: theme.colors.textSecondary, fontSize: 13, marginTop: 2 },
  budgetPill: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.successBg,
    borderRadius: theme.radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginTop: theme.spacing.xs,
  },
  budgetPillText: { color: theme.colors.success, fontWeight: '700', fontSize: 12 },
  modalContainer: { flex: 1, backgroundColor: theme.colors.background },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalTitle: { fontSize: 20, fontWeight: '700', color: theme.colors.textPrimary },
  row: { flexDirection: 'row', gap: theme.spacing.sm },
  halfField: { flex: 1 },
  label: { fontSize: 13, fontWeight: '600', color: theme.colors.textPrimary, marginBottom: theme.spacing.xs, marginTop: theme.spacing.sm },
  input: { backgroundColor: theme.colors.card, borderRadius: theme.radius.md, padding: 14, fontSize: 15, color: theme.colors.textPrimary, borderWidth: 1, borderColor: theme.colors.border },
  multiline: { minHeight: 80, textAlignVertical: 'top' },
  button: { backgroundColor: theme.colors.primary, borderRadius: theme.radius.pill, padding: 16, alignItems: 'center', marginTop: theme.spacing.lg },
  buttonText: { color: theme.colors.white, fontWeight: '700', fontSize: 16 },
  error: { color: '#C0392B', marginTop: theme.spacing.sm, fontSize: 13 },
});