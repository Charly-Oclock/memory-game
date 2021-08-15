# memory-game



## Projet
Il s'agit d'un projet pédagogique qui m'aura permis de replonger dans le Javascript vanilla, et les bases de données MySQL, ainsi que de découvrir pour la première fois NodeJS, Express JS ainsi que Sequelize.
Le code est commenté à l'excès dans un but pédagogique.


## Installation

Assurez-vous d’avoir Node, NPM, et MySQL d’installés au préalable.


On commence par cloner le projet:

`$cd {dossier de votre choix}`
`$git clone https://github.com/Charly-Oclock/memory-game.git`

Ensuite on installe les dépendances
`$npm install`


Maintenant, on peut lancer l’application avec
`$npm start`

A noter qu’on utilise nodemon qui permet de ne plus avoir à relancer le serveur manuellement après chaque modification de fichier.



## Le jeu

### Écran de départ:
 - affiche les 5 meilleurs temps de jeu enregistrés en base de données
 - un bouton permet de commencer une nouvelle partie

### Écran de jeu:
#### 1 - Le plateau de jeu
 - on a un tableau de 4*7 cartes, faces cachées
 - cliquer sur une carte va la retourner, affichant ainsi l’image
 - cliquer sur une seconde carte va la retourner, afficher l’image
 - quand on clique sur la seconde carte, on a 1 seconde pour voir l’image qui correspond. On a donc 2 possibilités:
   - les cartes correspondent => les 2 cartes restent retournées et ne sont plus cliquables
   - les cartes ne correspondent pas => on a donc 1 secondes pour les observer avant qu’elles ne se retournent faces cachées

- on a 5 minutes, 300 secondes pour trouver toutes les paires de cartes
- on perd la partie si le timer se termine avant que toutes les paires ne soient visibles
- on gagne si on trouve toutes les paires avant la fin du temps imparti

si la partie est gagnée, notre temps est sauvegardé en base de données


#### 2 - Le Timer
En dessous du plateau de jeu on a le timer
 - un compteur numérique qui décompte à partir de 300 secondes
 - une barre de progression qui passe du vert au rouge en 300 secondes