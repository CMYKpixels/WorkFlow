![version](https://img.shields.io/badge/version-1.0.0-orange.svg?style=flat-square)

GULP - WorkFlow
=================


## Installation
```bash
npm i -D
```


## Varibles de configurations

- config.builType 		=> Type de web serveur à exécuter //for php server type 'php'
- config.buildDir 		=> Répertoire de destination
- config.ProjectName 	=> Nom du projet
- config.cssFileName 	=> Nom du fichier css de sortie
- config.jsFileName 	=> Nom du fichier JS de sortie



## Commandes Gulp

### gulp mkdir
- Créer les dossiers définits par la variable *PATH*.

**Dans ma config :**

```
. 															.
└── src 													└── dist
    ├── html 												    ├── files php & html
    ├── img 													├── css
    ├── img 													├── js
    └── js 													    ├── img
        ├── plugins 										    └── maps
        └── vendors
```

### gulp sass
- compile SCSS ,
- auto-préfixe les propriétés,
- renomme la feuille de style en main.css,
- minifie le code CSS,
- ordonne les propriétés,
- enregistre le fichier définit par la variable *config.cssFileName* dans le dossier *path.dist.styles*,
- créer un sourcemaps,
- affiche la taille du fichier main.css.

### gulp scripts
- créer un sourcemaps,
- uglipfy tous les fichiers JavaScript désignés ou présents dans le dossier dist/js,
- concatène tous ces fichiers dans un fichier unique définit dans la variable *config.jsFileName*,
- enregistre le fichier dans le dossier *path.dist.scripts*,
- affiche la taille du fichier main.js.

### gulp images
- optimise les images et les déplace dans le dossier de destination approprié *path.dist.images*.

### gulp html
- créer un sourcemaps,
- minify tous les fichiers PHP,
- enregistre les fichier dans le dossier dist,
- affiche la taille des fichiers.

### gulp php
- créer un sourcemaps,
- minify tous les fichiers HTML,
- enregistre les fichiers dans le dossier dist,
- affiche la taille des fichiers.

### gulp watch
- selon la variable *config.builType* lance un serveur PHP ou HTML,
- exécute en tâche de fonds les tâches sur les fichiers,
- lance un browser pour la visualisation et le raffraichissement.


## Commandes globales Gulp

### gulp init
- gulp mkdir
- gulp default

### gulp build
- gulp sass
- gulp scripts
- gulp images
- gulp html
- gulp php

### gulp default
- gulp build
- gulp watch


C'est évidemment très spécifique à ma configuration.

## Note!
N'hésitez pas à me faire part d'idées d'amélioration ou autre.
