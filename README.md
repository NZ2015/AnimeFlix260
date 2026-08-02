# 🎬 AnimeFlix260 - Plateforme de Streaming d'Animes

Bienvenue sur **AnimeFlix260**, une plateforme moderne de streaming d'animes avec 30 animes populaires et des fonctionnalités avancées.

## ✨ Fonctionnalités

### 🎥 Lecteur Vidéo
- Lecteur vidéo HTML5 intégré
- Support des fichiers MP4
- Contrôles de lecture complets (play, pause, volume, fullscreen)
- Interface responsive et intuitive

### ❤️ Système de Favoris
- Sauvegarde des animes favoris en localStorage
- Persistance des données même après fermeture du navigateur
- Accès rapide aux favoris depuis la page d'accueil

### 🏷️ Catégories et Collections
- Filtrage par genre (Action, Aventure, Drame, etc.)
- Vue par catégories pour une meilleure organisation
- Découvrez les animes par thème

### 📄 Page de Détails
- Information complète sur chaque anime
- Année de sortie et studio de production
- Nombre total d'épisodes
- Accès rapide aux episodes

### 🔍 Recherche en Temps Réel
- Recherche instantanée par titre ou genre
- Filtrage intelligent des résultats

## 📁 Structure du Projet

```
AnimeFlix260/
├── index.html          # Page principale
├── details.html        # Page de détails des animes
├── categories.html     # Page des catégories
├── anime.json          # Données des animes (30 animes)
├── images/             # Dossier pour les posters
│   ├── naruto.jpg
│   ├── onepiece.jpg
│   └── ... (30 images total)
├── video/              # Dossier pour les vidéos
│   ├── naruto-saison1-episode1.mp4
│   ├── naruto-saison1-episode2.mp4
│   └── ... (90 vidéos total: 3 episodes x 30 animes)
└── README.md           # Ce fichier
```

## 🚀 Installation

### 1. Cloner le Repository
```bash
git clone https://github.com/NZ2015/AnimeFlix260.git
cd AnimeFlix260
```

### 2. Ajouter les Fichiers Vidéo
- Placez vos fichiers MP4 dans le dossier `video/`
- Les noms doivent correspondre aux chemins dans `anime.json`
- Exemple: `video/naruto-saison1-episode1.mp4`

### 3. Ajouter les Images des Posters
- Placez les images dans le dossier `images/`
- Formats supportés: JPG, PNG
- Exemple: `images/naruto.jpg`

### 4. Ouvrir dans le Navigateur
```bash
# Option 1: Ouvrir directement
open index.html

# Option 2: Utiliser un serveur local
python -m http.server 8000
# Puis accédez à http://localhost:8000
```

## 📊 Données

Le fichier `anime.json` contient 30 animes populaires avec:
- **Titre et description**
- **Note de rating** (0-5)
- **Genres** (Action, Aventure, Drame, etc.)
- **Année de sortie**
- **Studio de production**
- **Nombre total d'épisodes**
- **3 épisodes** par anime (Saison 1, Episodes 1-3)

### 🎬 Animes Disponibles
1. Naruto
2. One Piece
3. Bleach
4. Demon Slayer
5. Attack on Titan
6. Jujutsu Kaisen
7. Death Note
8. My Hero Academia
9. Tokyo Ghoul
10. Vinland Saga
11. Hunter x Hunter
12. Fullmetal Alchemist Brotherhood
13. Fairy Tail
14. Sword Art Online
15. Black Clover
16. Chainsaw Man
17. Spy x Family
18. Solo Leveling
19. Blue Lock
20. Haikyu!!
21. Code Geass
22. Steins;Gate
23. Dr. Stone
24. Seven Deadly Sins
25. Tokyo Revengers
26. Parasyte
27. Erased
28. Mob Psycho 100
29. Neon Genesis Evangelion
30. Gintama

## 🎨 Design

- **Interface moderne** avec gradient de couleurs
- **Responsive design** pour tous les appareils
- **Dark theme** pour une meilleure expérience de visionnage
- **Animations fluides** et transitions élégantes

## 💾 Stockage Local

Les favoris sont sauvegardés en localStorage:
```javascript
// Format: { animeId: true }
localStorage.setItem('animeFlix_favorites', JSON.stringify(favorites));
```

## 🔧 Technologies Utilisées

- **HTML5** pour la structure
- **CSS3** pour le styling et les animations
- **JavaScript** pour l'interactivité
- **localStorage** pour la persistance des données
- **JSON** pour les données des animes

## 📱 Compatibilité

- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile (iOS/Android)

## 🌐 GitHub Pages

Pour activer GitHub Pages:
1. Allez dans `Settings` du repository
2. Accédez à `Pages`
3. Sélectionnez `main` comme branche source
4. Sauvegardez
5. Votre site sera accessible à: `https://NZ2015.github.io/AnimeFlix260`

## 📄 License

Ce projet est sous license MIT.

## 🤝 Contribution

Les contributions sont les bienvenues! N'hésitez pas à:
- Signaler des bugs
- Proposer des améliorations
- Ajouter de nouveaux animes
- Améliorer le design

## 📧 Contact

Pour toute question ou suggestion, contactez: [NZ2015](https://github.com/NZ2015)

---

**AnimeFlix260** - Votre plateforme de streaming d'animes préférée! 🎬✨
