import { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { theme } from '../theme';
import { useAuth } from '../viewmodels/useAuth';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pseudo, setPseudo] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const { signIn, signUp, loading, error } = useAuth();

  async function handleSubmit() {
    if (isSignUp) await signUp(email, password, pseudo);
    else await signIn(email, password);
  }

  const canSubmit = isSignUp ? email && password && pseudo : email && password;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Image
        source={require('../../assets/images/cherish-logo.png')}
        style={styles.logo}
        resizeMode="contain"
        accessibilityLabel="Logo CHERISH"
      />

      <Text style={styles.title}>{isSignUp ? 'Créer un compte' : 'Bienvenue sur CHERISH'}</Text>

      <View style={styles.form}>
        {isSignUp && (
          <>
            <Text style={styles.label}>Pseudo</Text>
            <TextInput
              style={styles.input}
              placeholder="Comment veux-tu qu'on t'appelle ?"
              placeholderTextColor={theme.colors.textSecondary}
              accessibilityLabel="Pseudo"
              value={pseudo}
              onChangeText={setPseudo}
            />
          </>
        )}

        <Text style={styles.label}>Adresse email</Text>
        <TextInput
          style={styles.input}
          placeholder="vous@exemple.com"
          placeholderTextColor={theme.colors.textSecondary}
          accessibilityLabel="Adresse email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Mot de passe</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          placeholderTextColor={theme.colors.textSecondary}
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
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed, !canSubmit && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading || !canSubmit}
          accessibilityRole="button"
          accessibilityLabel={isSignUp ? "S'inscrire" : 'Se connecter'}
        >
          <Text style={styles.buttonText}>{loading ? '...' : isSignUp ? "S'inscrire" : 'Se connecter'}</Text>
        </Pressable>

        <Pressable
          onPress={() => setIsSignUp(!isSignUp)}
          accessibilityRole="button"
          accessibilityLabel={isSignUp ? 'Basculer vers la connexion' : "Basculer vers l'inscription"}
        >
          <Text style={styles.switch}>
            {isSignUp ? 'Déjà un compte ? ' : 'Nouveau sur CHERISH ? '}
            <Text style={styles.switchBold}>{isSignUp ? 'Se connecter' : "Créer un compte"}</Text>
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  logo: {
    width: 380,
    height: 165,
    alignSelf: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  form: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
    marginTop: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.md,
    padding: 14,
    fontSize: 15,
    color: theme.colors.textPrimary,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.pill,
    padding: 16,
    alignItems: 'center',
    marginTop: theme.spacing.lg,
  },
  buttonPressed: { opacity: 0.85 },
  buttonDisabled: { opacity: 0.4 },
  buttonText: { color: theme.colors.white, fontWeight: '700', fontSize: 16 },
  switch: {
    textAlign: 'center',
    marginTop: theme.spacing.lg,
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  switchBold: { color: theme.colors.primary, fontWeight: '700' },
  error: { color: '#C0392B', marginTop: theme.spacing.sm, textAlign: 'center', fontSize: 13 },
});