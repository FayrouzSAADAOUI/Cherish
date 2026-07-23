# CHERISH

Une appli pour ne plus jamais oublier l'anniversaire d'un proche et surtout, pour arrêter de paniquer la veille en cherchant un cadeau à la dernière minute.

## Le principe

Vous ajoutez vos proches (date de naissance, centres d'intérêt, budget), et CHERISH vous prévient quand un anniversaire approche. Pour l'idée cadeau, une IA (Gemini) vous propose des suggestions adaptées au profil de la personne, en tenant compte du budget donné comme un plafond, pas comme une cible, histoire d'avoir vraiment le choix.

Projet réalisé dans le cadre du Bloc 2 du titre RNCP 39583 (Expert en Développement Logiciel), Ynov Campus.

## Stack

- React Native + Expo (SDK 54), TypeScript
- Expo Router pour la navigation
- Supabase pour l'auth, la base de données et le stockage (avec Row Level Security)
- Google Gemini pour les suggestions cadeaux
- Jest pour les tests unitaires
- GitHub Actions + EAS Build pour l'intégration et le déploiement continus

Architecture en MVVM (`src/views`, `src/viewmodels`, `src/models`, `src/services`), pour garder la logique métier découplée de l'affichage.


## Tester l'application (Android)

1. Téléchargez le `.apk` depuis les [Releases](https://github.com/FayrouzSAADAOUI/Cherish/releases)
2. Ouvrez le fichier téléchargé — Android peut demander d'autoriser l'installation depuis cette source (paramètre à activer une seule fois, normal pour toute app hors Play Store)
3. Installez, puis ouvrez l'app

Disponible uniquement sur Android pour l'instant (pas de build iOS). L'apk est un format natif Android : pour un test depuis un PC, un émulateur (BlueStacks, Android Studio) est nécessaire.

> Pour tester rapidement sans rien configurer, téléchargez directement l'apk fourni dans les [Releases](https://github.com/FayrouzSAADAOUI/Cherish/releases), il est déjà configuré et fonctionnel.
> Pour lancer le projet vous-même à partir du code source, vous devez créer vos propres comptes Supabase et Gemini, puis renseigner vos identifiants dans un fichier `.env` (voir `.env.example`).

## Installer le projet en local

```bash
git clone https://github.com/FayrouzSAADAOUI/Cherish.git
cd Cherish
npm install
```

Il vous faut ensuite un fichier `.env` à la racine (voir `.env.example`) avec :

EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_GEMINI_API_KEY=

Puis :

```bash
npx expo start
```

Scannez le QR code avec Expo Go, ou tapez `w` pour lancer la version web.

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