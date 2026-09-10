# Stockage des vidéos avec Git LFS (public)

Prérequis :
- git installé
- git-lfs installé (https://git-lfs.github.com/)

Étapes rapides (nouveau dépôt) :
1. Initialiser le repo (si nécessaire)
   - git init
   - git remote add origin git@github.com:OWNER/REPO.git

2. Installer et configurer Git LFS
   - git lfs install

3. Utiliser le .gitattributes (fourni) ou exécuter :
   - git lfs track "*.mp4"
   - git lfs track "*.mov"
   - git add .gitattributes

4. Ajouter les vidéos
   - mkdir -p videos
   - cp /chemin/vers/tes_videos/*.mp4 videos/
   - git add videos/*
   - git commit -m "Ajout des vidéos via Git LFS"
   - git push -u origin main

Si le dépôt existe déjà : récupère la branche principale et pousse dessus (ajuste `main` si ta branche par défaut a un autre nom).

Cloner le dépôt (autres machines) :
- git clone git@github.com:OWNER/REPO.git
- cd REPO
- git lfs install
- git lfs pull

Vérifier l'état et les fichiers LFS :
- git lfs ls-files
- git lfs status

Bonnes pratiques et points importants :
- Tu as ~90 vidéos (~4,5+ Go si ~50 Mo chacune). GitHub LFS propose un quota gratuit limité — vérifie l'utilisation et le coût dans Settings → Billing → Git LFS.
- Pour beaucoup de téléchargements/streaming, une solution cloud + CDN (S3 + CloudFront) peut être plus rentable/performante qu’un dépôt public.
- Si tu veux conserver métadonnées (titres, durée, tags), stocke-les dans /videos-metadata/ (ex. YAML/JSON).
- Pour grands volumes, fais des commits par lots (ex. 10–20 fichiers par commit) pour éviter longues opérations uniques.
