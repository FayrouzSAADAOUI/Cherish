import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuth } from '../viewmodels/useAuth';
import { useContacts } from '../viewmodels/useContacts';

export default function ContactsScreen() {

  const { contacts, loading, error, addContact } = useContacts();
  const { signOut } = useAuth();
  const [nom, setNom] = useState('');
  const [dateNaissance, setDateNaissance] = useState('');
  const [interets, setInterets] = useState('');
  const [budget, setBudget] = useState('');

  async function handleAdd() {
    if (!nom || !dateNaissance) return;
    const ok = await addContact({
      nom,
      date_naissance: dateNaissance,
      interets: interets || null,
      budget: budget ? Number(budget) : null,
    });
    if (ok) {
      setNom('');
      setDateNaissance('');
      setInterets('');
      setBudget('');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mes proches</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nom"
          accessibilityLabel="Nom du proche"
          value={nom}
          onChangeText={setNom}
        />
        <TextInput
          style={styles.input}
          placeholder="Date de naissance (AAAA-MM-JJ)"
          accessibilityLabel="Date de naissance, format année-mois-jour"
          value={dateNaissance}
          onChangeText={setDateNaissance}
        />
        <TextInput
          style={styles.input}
          placeholder="Intérêts"
          accessibilityLabel="Centres d'intérêt"
          value={interets}
          onChangeText={setInterets}
        />
        <TextInput
          style={styles.input}
          placeholder="Budget (€)"
          accessibilityLabel="Budget en euros"
          keyboardType="numeric"
          value={budget}
          onChangeText={setBudget}
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
          accessibilityLabel="Ajouter ce proche"
        >
          <Text style={styles.buttonText}>Ajouter</Text>
        </Pressable>
      </View>

      {loading ? (
        <Text style={styles.empty}>Chargement...</Text>
      ) : (
        <FlatList
          data={contacts}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text style={styles.empty}>Aucun contact pour l'instant</Text>}
          renderItem={({ item }) => (
            <View
              style={styles.card}
              accessible
              accessibilityLabel={`${item.nom}, né le ${item.date_naissance}${item.interets ? `, intérêts : ${item.interets}` : ''}${item.budget != null ? `, budget ${item.budget} euros` : ''}`}
            >
              <Text style={styles.cardName}>{item.nom}</Text>
              <Text style={styles.cardDetail}>{item.date_naissance}</Text>
              {item.interets && <Text style={styles.cardDetail}>Intérêts : {item.interets}</Text>}
              {item.budget != null && <Text style={styles.cardDetail}>Budget : {item.budget} €</Text>}
            </View>
          )}
        />
      )}

      <Pressable
        onPress={signOut}
        style={{ marginTop: 16 }}
        accessibilityRole="button"
        accessibilityLabel="Se déconnecter"
      >
        <Text style={{ textAlign: 'center', color: '#9B1B30' }}>Se déconnecter</Text>
      </Pressable>
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
});