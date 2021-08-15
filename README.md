# memory-game



## Projet
Il s'agit d'un projet pédagogique qui m'aura permis de replonger dans le Javascript vanilla, et les bases de données MySQL, ainsi que de découvrir pour la première fois NodeJS, Express JS ainsi que Sequelize.
Le code est commenté à l'excès dans un but pédagogique.


## Installation

Assurez-vous d’avoir Node, NPM, et MySQL d’installés au préalable.


### Base de données

#### Introduction
Une base de données ou database en anglais (que nous nommerons BDD par commodité), est une collection d’informations organisées afin d’être facilement consultables, gérables et mises à jour. Au sein d’une database, les données sont organisées en lignes, colonnes et tableaux. Elles sont indexées afin de pouvoir facilement trouver les informations recherchées à l’aide d’un logiciel informatique. Chaque fois que de nouvelles informations sont ajoutées, les données sont mises à jour, et éventuellement supprimées.

Imaginons un annuaire téléphonique qui représenterait un tableau (ou un table).
Nous avons des colonnes qui correspondent aux clés des informations: numéro, nom, prénom, adresse, ville, code postale, etc...
Puis nous avons les lignes, qui contiennent les valeurs pour chacunes des colonnes: 01000000, Perceval, DE GALLES, La Taverne, Pays de Logres, 12345

Pour se projet, nous allons faire simple puisque nous souhaitons simplement stocker des chiffres correspondants a des temps de jeu en secondes.

#### Installation
On lance MySQL dans un terminal:
`$mysql -u username -p`
Il faudra ensuite saisir votre mot de passe d'utilisateur MySQL
`Enter password: `
Une fois connecter avec le terminal `mysql>` on peut commencer a créer la base de données

`mysql> CREATE DATABASE memoryGame;`
On doit ensuite se placer sur cette BDD:
`mysql> use memoryGame;`

Ensuite on ajoute une table pour les temps que nous allons appeler "times", avec une premiere colonne "time" correspondant a la valeur des temps de jeu en secondes:
`mysql> CREATE TABLE times (time INT);`

Ensuite nous allons ajouter plusieurs colonnes qu'on utilise généralement dans tous les systemes de bases de données: "id" correspondant a un identifiant unique, "createdAt" correspondant a la date de création d'un nouveau temps, et "updatedAt" correspondant a la date de derniere modification.

A noter que pour ce projet, ces colonnes n'auront aucune importance car nous ne traitons pas encore ces informations.

`mysql> ALTER TABLE times ADD `ID` INT NOT NULL AUTO_INCREMENT PRIMARY KEY FIRST;

Ici on indique que l'ID ne doit jamais etre nul, et qu'il soit automatiquement s'incrémenter de 1 en 1 a chaque nouvelle ligne ajoutée dans ma table.

`mysql> ALTER TABLE times ADD COLUMN createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP;`
Puis
`mysql> ALTER TABLE times ADD COLUMN updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;`

Vous pouvez vérifier que les colonnes sont bien présentent en tapant:
`mysql> SHOW COLUMNS FROM times;`
Ce qui devrait donner:
```
+-----------+-----------+------+-----+-------------------+-----------------------------------------------+
| Field     | Type      | Null | Key | Default           | Extra                                         |
+-----------+-----------+------+-----+-------------------+-----------------------------------------------+
| id        | int       | NO   | PRI | NULL              | auto_increment                                |
| time      | int       | YES  |     | NULL              |                                               |
| createdAt | timestamp | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED                             |
| updatedAt | datetime  | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED on update CURRENT_TIMESTAMP |
+-----------+-----------+------+-----+-------------------+-----------------------------------------------+

```

### Installation du projet
On ensuite on peut cloner le projet:

`$cd {dossier de votre choix} && git clone https://github.com/Charly-Oclock/memory-game.git`

`$cd memory-game`

Ensuite on installe les dépendances
`$npm install`

Maintenant, on peut lancer l’application avec
`$npm start`

Le message `Listening on port 3000...` doit apparaitre en console.

Attention, si vous avez une erreur, il faut vérifier que le port 3000 est disponible. Sinon vous pouvez mettre le port que vous souhaitez en modifiant dans le fichier index.js

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