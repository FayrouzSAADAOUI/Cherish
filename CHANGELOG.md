# Journal des versions - CHERISH

Toutes les évolutions notables de ce projet sont documentées dans ce fichier.
Format inspiré de Keep a Changelog (https://keepachangelog.com).

## [1.1.0] - 2026-08-17

### Ajouté
- Écran d'accueil : vue d'ensemble, prochain anniversaire mis en avant, accès rapide aux suggestions
- Pseudo demandé à l'inscription, utilisé pour personnaliser l'accueil
- Modification et suppression d'un proche depuis sa fiche détaillée
- Historique des cadeaux consultable et modifiable proche par proche
- Déploiement continu automatique : chaque envoi de code sur la branche
  principale déclenche un build Android sans action manuelle

### Modifié
- Thème visuel entièrement revu (couleurs, logo, icône, écran de démarrage)
- Le budget renseigné pour un proche est désormais traité comme un plafond
  de prix par l'IA, et non comme une cible à atteindre

### Corrigé
- Navigation cassée sur certains boutons (chemin de route incorrect)
- Données non synchronisées entre l'écran d'accueil et les autres onglets
- Titre d'écran masqué sous la barre de statut sur certains appareils

## [1.0.0] - 2026-07-23

### Ajouté
- Authentification (inscription, connexion, session persistante et chiffrée)
- Gestion des proches (ajout, liste)
- Rappels d'anniversaire (J-7, J-1)
- Suggestions cadeaux personnalisées par IA (Gemini)
- Historique des cadeaux offerts
- Intégration continue : vérification TypeScript et tests unitaires à
  chaque envoi de code