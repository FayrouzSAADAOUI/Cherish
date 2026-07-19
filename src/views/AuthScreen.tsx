import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuth } from '../viewmodels/useAuth';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const { signIn, signUp, loading, error } = useAuth();

  async function handleSubmit() {
    if (isSignUp) await signUp(email, password);
    else await signIn(email, password);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isSignUp ? 'Créer un compte' : 'Se connecter'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        accessibilityLabel="Adresse email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        accessibilityLabel="Mot de passe"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {error && (
        <Text style={styles.error} accessibilityLiveRegion="polite">
          {error}
        </Text>
      )}
      <Pressable
        style={styles.button}
        onPress={handleSubmit}
        disabled={loading}
        accessibilityRole="button"
        accessibilityLabel={isSignUp ? "S'inscrire" : 'Se connecter'}
      >
        <Text style={styles.buttonText}>{loading ? '...' : isSignUp ? "S'inscrire" : 'Connexion'}</Text>
      </Pressable>
      <Pressable
        onPress={() => setIsSignUp(!isSignUp)}
        accessibilityRole="button"
        accessibilityLabel={isSignUp ? 'Basculer vers la connexion' : "Basculer vers l'inscription"}
      >
        <Text style={styles.switch}>
          {isSignUp ? 'Déjà un compte ? Se connecter' : "Pas de compte ? S'inscrire"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: '600', marginBottom: 24, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12 },
  button: { backgroundColor: '#9B1B30', borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontWeight: '600' },
  switch: { textAlign: 'center', marginTop: 16, color: '#9B1B30' },
  error: { color: 'red', marginBottom: 12, textAlign: 'center' },
});