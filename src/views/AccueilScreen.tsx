import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useMemo } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { calculateAge } from '../utils/dateFormat';
import { useAuthContext } from '../viewmodels/AuthContext';
import { useAuth } from '../viewmodels/useAuth';
import { useGiftHistory } from '../viewmodels/useGiftHistory';
import { useReminders } from '../viewmodels/useReminders';
import { useSuggestions } from '../viewmodels/useSuggestions';

export default function AccueilScreen() {
  const { session } = useAuthContext();
  const { signOut } = useAuth();
  const { reminders, contacts, loading: loadingContacts, refetch: refetchContacts } = useReminders();
  const { history, refetch: refetchHistory } = useGiftHistory();
  const { suggestions, getSuggestions } = useSuggestions();

  useFocusEffect(
    useCallback(() => {
      refetchContacts();
      refetchHistory();
    }, [refetchContacts, refetchHistory])
  );

  const prenom = useMemo(() => {
    const metaPseudo = (session?.user?.user_metadata as { pseudo?: string } | undefined)?.pseudo;
    if (metaPseudo) return metaPseudo;
    const email = session?.user?.email ?? '';
    const local = email.split('@')[0] ?? '';
    return local ? local.charAt(0).toUpperCase() + local.slice(1) : '';
  }, [session]);

  const upcomingCount = useMemo(
    () => reminders.filter((r) => r.joursRestants <= 30 && r.joursRestants >= 0).length,
    [reminders]
  );

  const nextReminder = reminders[0];
  const nextContact = useMemo(
    () => (nextReminder ? contacts.find((c) => c.id === nextReminder.contactId) : undefined),
    [nextReminder, contacts]
  );

  useEffect(() => {
    if (nextContact) getSuggestions(nextContact);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextContact?.id]);

  const recentHistory = useMemo(() => history.slice(0, 3), [history]);
  const isEmpty = !loadingContacts && contacts.length === 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headerCenter}>
          <Image
            source={require('../../assets/images/cherish-logo.png')}
            style={styles.logo}
            resizeMode="contain"
            accessibilityLabel="Logo CHERISH"
          />
          <Text style={styles.greeting}>Bonjour{prenom ? `, ${prenom}` : ''}</Text>
          {!isEmpty && (
            <Text style={styles.eventCount}>
              {upcomingCount} événement{upcomingCount > 1 ? 's' : ''} à venir ce mois-ci
            </Text>
          )}
        </View>

        {isEmpty ? (
          <View style={styles.welcomeCard}>
            <View style={styles.welcomeIcon}>
              <Ionicons name="heart" size={32} color={theme.colors.primary} />
            </View>
            <Text style={styles.welcomeTitle}>Bienvenue sur CHERISH !</Text>
            <Text style={styles.welcomeText}>
              Ajoute ton premier proche pour commencer à recevoir des rappels d'anniversaire et des idées cadeaux personnalisées par IA.
            </Text>
            <Pressable
              style={({ pressed }) => [styles.findGiftButton, pressed && { opacity: 0.85 }]}
              onPress={() => router.push({ pathname: '/contacts', params: { openAdd: '1' } })}
              accessibilityRole="button"
              accessibilityLabel="Ajouter mon premier proche"
            >
              <Ionicons name="add" size={18} color={theme.colors.white} />
              <Text style={styles.findGiftButtonText}>Ajouter mon premier proche</Text>
            </Pressable>
          </View>
        ) : (
          <>
            {nextReminder && nextContact ? (
              <>
                <Text style={styles.sectionTitle}>Bientôt</Text>
                <View style={styles.upcomingCard}>
                  <Pressable
                    style={styles.upcomingAvatar}
                    onPress={() => router.push(`/contact/${nextContact.id}`)}
                    accessibilityRole="button"
                    accessibilityLabel={`Voir la fiche de ${nextContact.nom}`}
                  >
                    <Text style={styles.upcomingAvatarText}>{nextContact.nom.charAt(0).toUpperCase()}</Text>
                  </Pressable>

                  <Text style={styles.upcomingName}>{nextContact.nom}</Text>

                  {nextReminder.joursRestants === 0 ? (
                    <Text style={styles.upcomingSub}>
                      Célèbre ses <Text style={styles.bold}>{calculateAge(nextContact.date_naissance)} ans</Text> aujourd'hui !
                    </Text>
                  ) : (
                    <Text style={styles.upcomingSub}>
                      Célèbre ses <Text style={styles.bold}>{calculateAge(nextContact.date_naissance)} ans</Text> dans{' '}
                      <Text style={styles.bold}>
                        {nextReminder.joursRestants} jour{nextReminder.joursRestants > 1 ? 's' : ''}
                      </Text>
                    </Text>
                  )}

                  <Pressable
                    style={({ pressed }) => [styles.findGiftButton, pressed && { opacity: 0.85 }]}
                    onPress={() => router.push({ pathname: '/suggestions', params: { contactId: nextContact.id } })}
                    accessibilityRole="button"
                    accessibilityLabel={`Trouver un cadeau pour ${nextContact.nom}`}
                  >
                    <Text style={styles.findGiftButtonText}>Trouver un cadeau</Text>
                  </Pressable>
                </View>
              </>
            ) : (
              <Pressable
                style={styles.primaryButton}
                onPress={() => router.push('/suggestions')}
                accessibilityRole="button"
                accessibilityLabel="Voir les idées cadeaux IA"
              >
                <Ionicons name="sparkles" size={18} color={theme.colors.white} />
                <Text style={styles.primaryButtonText}>Idées IA</Text>
              </Pressable>
            )}

            {nextContact && suggestions.length > 0 && (
              <View style={styles.section}>
                <View style={styles.rowBetween}>
                  <Text style={styles.sectionTitle}>Suggestions pour {nextContact.nom}</Text>
                  <Pressable
                    onPress={() => router.push({ pathname: '/suggestions', params: { contactId: nextContact.id } })}
                    accessibilityRole="button"
                    accessibilityLabel="Voir toutes les suggestions"
                  >
                    <Text style={styles.link}>Voir tout</Text>
                  </Pressable>
                </View>
                {suggestions.slice(0, 2).map((s, i) => (
                  <View key={i} style={styles.suggestionCard}>
                    <View style={styles.suggestionIcon}>
                      <Ionicons name="gift-outline" size={20} color={theme.colors.primary} />
                    </View>
                    <Text style={styles.suggestionText}>{s}</Text>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Activité récente</Text>
              {recentHistory.length === 0 ? (
                <Text style={styles.empty}>Aucune activité pour l'instant</Text>
              ) : (
                recentHistory.map((h) => (
                  <Text key={h.id} style={styles.activityText}>
                    Vous avez offert <Text style={{ fontWeight: '700' }}>{h.cadeau}</Text> à{' '}
                    {(h as any).contacts?.nom ?? 'un proche'}
                  </Text>
                ))
              )}
            </View>
          </>
        )}

        <Pressable
          onPress={signOut}
          style={styles.signOut}
          accessibilityRole="button"
          accessibilityLabel="Se déconnecter"
        >
          <Text style={styles.signOutText}>Se déconnecter</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { padding: theme.spacing.lg, paddingBottom: theme.spacing.xl },
  headerCenter: { alignItems: 'center', marginBottom: theme.spacing.lg },
  logo: { width: 240, height: 104, marginBottom: theme.spacing.xs },
  greeting: { fontSize: 26, fontWeight: '800', color: theme.colors.textPrimary, textAlign: 'center' },
  eventCount: { color: theme.colors.textSecondary, marginTop: 4, textAlign: 'center' },
  welcomeCard: {
    backgroundColor: theme.colors.card, borderRadius: theme.radius.lg, padding: theme.spacing.xl,
    alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 14, shadowOffset: { width: 0, height: 6 }, elevation: 3,
  },
  welcomeIcon: {
    width: 64, height: 64, borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: theme.spacing.md,
  },
  welcomeTitle: { fontSize: 20, fontWeight: '800', color: theme.colors.primary, marginBottom: theme.spacing.sm, textAlign: 'center' },
  welcomeText: { fontSize: 14, color: theme.colors.textSecondary, textAlign: 'center', marginBottom: theme.spacing.lg, lineHeight: 20 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: theme.colors.textPrimary, marginBottom: theme.spacing.sm },
  section: { marginTop: theme.spacing.lg },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  link: { color: theme.colors.primary, fontWeight: '600', fontSize: 13 },
  upcomingCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.xl,
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 14, shadowOffset: { width: 0, height: 6 }, elevation: 3,
  },
  upcomingAvatar: {
    width: 110, height: 110, borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primaryLight, alignItems: 'center', justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  upcomingAvatarText: { color: theme.colors.primary, fontWeight: '700', fontSize: 40 },
  upcomingName: { color: theme.colors.primary, fontWeight: '800', fontSize: 24, marginBottom: 6, textAlign: 'center' },
  upcomingSub: { color: theme.colors.textPrimary, fontSize: 15, textAlign: 'center', marginBottom: theme.spacing.lg },
  bold: { fontWeight: '800' },
  findGiftButton: {
    flexDirection: 'row', gap: 6, backgroundColor: theme.colors.primary, borderRadius: theme.radius.pill,
    paddingVertical: 14, paddingHorizontal: theme.spacing.xl, width: '100%', alignItems: 'center', justifyContent: 'center',
  },
  findGiftButtonText: { color: theme.colors.white, fontWeight: '700', fontSize: 16 },
  primaryButton: {
    flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center',
    backgroundColor: theme.colors.primary, borderRadius: theme.radius.pill, paddingVertical: 14,
  },
  primaryButtonText: { color: theme.colors.white, fontWeight: '700', fontSize: 15 },
  suggestionCard: {
    flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md,
    backgroundColor: theme.colors.card, borderRadius: theme.radius.lg,
    borderWidth: 1, borderColor: theme.colors.border,
    padding: theme.spacing.md, marginBottom: theme.spacing.sm,
  },
  suggestionIcon: {
    width: 40, height: 40, borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primaryLight, alignItems: 'center', justifyContent: 'center',
  },
  suggestionText: { flex: 1, color: theme.colors.textPrimary, fontSize: 14 },
  activityText: { color: theme.colors.textSecondary, fontSize: 14, marginBottom: theme.spacing.xs },
  empty: { color: theme.colors.textSecondary, fontSize: 14 },
  signOut: { marginTop: theme.spacing.xl, paddingVertical: theme.spacing.sm },
  signOutText: { textAlign: 'center', color: theme.colors.primary, fontWeight: '600' },
});