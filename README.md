# CHERISH

Une appli pour ne plus jamais oublier l'anniversaire d'un proche et surtout, pour arrêter de paniquer la veille en cherchant un cadeau à la dernière minute.

## Le principe

Tu ajoutes tes proches (date de naissance, centres d'intérêt, budget), et CHERISH te prévient quand un anniversaire approche. Pour l'idée cadeau, une IA (Gemini) te propose des suggestions adaptées au profil de la personne, en tenant compte du budget donné comme un plafond,pas comme une cible, histoire d'avoir vraiment le choix.

Projet réalisé dans le cadre du Bloc 2 du titre RNCP 39583 (Expert en Développement Logiciel), Ynov Campus.

## Stack

- React Native + Expo (SDK 54), TypeScript
- Expo Router pour la navigation
- Supabase pour l'auth, la base de données et le stockage (avec Row Level Security)
- Google Gemini pour les suggestions cadeaux
- Jest pour les tests unitaires
- GitHub Actions + EAS Build pour l'intégration et le déploiement continus

Architecture en MVVM (`src/views`, `src/viewmodels`, `src/models`, `src/services`), pour garder la logique métier découplée de l'affichage.

## Installer le projet en local

```bash
git clone https://github.com/FayrouzSAADAOUI/Cherish.git
cd Cherish
npm install
```

Il te faut ensuite un fichier `.env` à la racine (voir `.env.example`) avec :

EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_GEMINI_API_KEY=

Puis :

```bash
npx expo start
```

Scanne le QR code avec Expo Go, ou tape `w` pour lancer la version web.

> Pour tester rapidement sans configurer de backend, utilise directement l'apk fourni dans les [Releases](https://github.com/FayrouzSAADAOUI/Cherish/releases) — il contient déjà une configuration fonctionnelle.
> Pour lancer le projet à partir du code source, il faut fournir tes propres identifiants Supabase et Gemini (voir `.env.example`).

## Tests

```bash
npm test
```

17 tests unitaires, principalement sur le calcul des rappels d'anniversaire et le traitement des suggestions IA.

## Version installable

Un `.apk` Android à jour est disponible dans les [Releases](https://github.com/FayrouzSAADAOUI/Cherish/releases) du repo, généré automatiquement à chaque push sur `main` via le pipeline CI/CD.

## Fonctionnalités

**Faites** : authentification, gestion des proches, rappels d'anniversaire, suggestions cadeaux par IA, historique des cadeaux offerts.

**Pas encore** (prévues en V1) : onboarding guidé, vote collaboratif sur les idées cadeaux à plusieurs, filtre des suggestions par tranche de budget.

---

Fayrouz Saadaoui — M2 Expert Développement Mobile & IoT