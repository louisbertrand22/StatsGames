# StatsGames
Game Statistics with NFC

## 📱 Mobile Application

A React Native mobile application built with Expo for displaying game statistics from Supercell games and sharing profiles via NFC.

### Features

- ✅ User Authentication (Email/Password + Magic Link)
- ✅ Protected Routes
- ✅ User Profile Management
- ✅ NFC Profile Sharing (Share profiles via NFC tags or links)
- 🚧 Game Statistics Dashboard (Coming soon)

### Quick Start

```bash
cd app
npm install

# Copy environment template and configure with your Supabase credentials
cp .env.example .env

# Start the development server
npm start
```

For detailed setup instructions, see [app/README.md](app/README.md).
For authentication setup, see [app/AUTH_README.md](app/AUTH_README.md).
For NFC profile sharing, see [NFC_USER_GUIDE.md](NFC_USER_GUIDE.md) and [NFC_IMPLEMENTATION.md](NFC_IMPLEMENTATION.md).

### Project Structure

```
app/
├── screens/          # Application screens
├── components/       # Reusable UI components
├── contexts/         # React Context providers
├── services/         # API and business logic
├── hooks/           # Custom React hooks
├── theme/           # Colors, typography, and styles
├── navigation/      # Navigation configuration
└── assets/          # Images, fonts, etc.
```

---

🟧 Issue 1 — Initialisation du projet mobile (Contexte détaillé pour Copilot)
🎯 Objectif

Créer la base de l’application mobile pour notre projet : une app permettant d'afficher des statistiques de jeux (Supercell) et de partager un profil via NFC.
Cette issue vise à mettre en place l’environnement initial, la structure du projet et les premiers écrans.
Cette étape sert de fondation à toutes les fonctionnalités futures (authentification, dashboard, NFC, etc.).

🧩 Contexte

Nous développons une application mobile multiplateforme.
Le but de cette issue est d’initialiser proprement le projet Flutter ou React Native (selon ce qui est installé dans ton repo — si aucun choix n’est fait, choisir Flutter).

L’application contiendra plus tard :

un système d’authentification,

l’ajout de tags Supercell,

la lecture des statistiques via notre backend,

et le partage NFC du profil.

Avant tout cela, il nous faut une structure technique propre, stable et modulaire afin que Copilot puisse construire les écrans et services futurs de façon cohérente.

📌 Tâches détaillées
🔹 Setup général

 Créer un nouveau projet mobile (Flutter ou React Native selon le framework choisi par le repo).

 Configurer les dossiers de base (screens, components, services).

 Ajouter un fichier de configuration globale pour les couleurs et la typographie.

🔹 Navigation

 Ajouter une navigation basique :

un HomeScreen vide

un LoadingScreen (splash minimal)

 Créer la logique permettant de naviguer entre les deux.

🔹 UI de base

 Créer un logo temporaire (simple texte centré).

 Ajouter un thème clair par défaut (background, couleurs principales).

 Implémenter un système de styles pour les textes (H1, H2, body).

🔹 Setup Dev

 Ajouter un README minimal expliquant comment lancer l’application.

 Ajouter un .gitignore adapté.

 Vérifier que le build fonctionne pour Android et iOS.

🧪 Critères d’acceptation

Pour considérer cette issue comme terminée :

L’app doit se lancer sur Android et iOS sans erreur.

La navigation doit afficher :
→ un écran Splash / Loading,
→ puis un écran Home vide.

La structure des dossiers doit être logique et prête pour les futures features.

Le thème global (couleurs + texte) doit être configuré.

Le README doit expliquer comment exécuter l’application en local.

📁 Répertoires concernés
/app
  /screens
  /components
  /services
  /theme
  /navigation

💡 Notes pour Copilot

Utiliser des bonnes pratiques de structure (clean architecture légère).

Préparer le terrain pour ajouter plus tard : authentification, API, NFC.

Aucun backend n’est encore branché à ce stade.

Le but est uniquement d’avoir une base saine pour travailler proprement.