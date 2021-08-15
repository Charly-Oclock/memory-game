//Ici on a notre fichier principal qui va nous servir de hub pour notre serveur
//c'est dans ce fichier que nous allons faire nos imports de modules, de routes etc...

//Imports dependances 
const express = require('express');

//Imports de NodeJS
const cors = require('cors'); //permet de gérer les autorisations pour effectuer des requetes au serveur
const path = require('path'); //permet de récupérer les chemins des fichiers
const router = express.Router(); //le router qui permet de définir les routes
const fs = require('fs') //fs qui permet de manipuler et d'accéder aux fichiers locaux

//Imports locaux
const timesRoutes = require('./routes/times.js') //j'importe les routes liées a /times pour communiquer avec ma BDD

//Ensuite je définis des constantes que j'utilise dans le fichier
//On utilise des constantes plutot que des variables car leur valeur ne doit pas changer

//chemin d'acces au dossier du projet
const root = '/home/charly/projects/luinilbleue/memory-game' //mettre le chemin vers le dossier du repo
//app
const app = express();
//notre base de données connectée avec sequelize
const db = require("./models");
//il faut ajouter la synchronisation
db.sequelize.sync();


//Maintenant on peut appeler des méthodes qui seront utilisées sur le serveur

//méthode pour lire/écrire du JSON pour notre API
app.use(express.urlencoded());
app.use(express.json());

//ici on définit que "/" doit correspondre au chemin d'acces a notre dossier
app.use('/', express.static(root))

//on applique les parametres des cors pour les autorisations de connexion
app.use(cors());

//ici on appelle notre fichier HTML qui charge notre application des lors qu'une connexion s'effectue sur la homepage "/"
router.get('/', (request, response) => {
  //on envoie le fichier HTML
  response.sendFile(path.join(__dirname + '/memory.html'))
})

//on injecte nos routes dans l'app
app.use('/', router);
app.use(timesRoutes);

//l'app communique avec le port de notre choix, ici 3000 pour moi
app.listen(3000, console.log('Listening on port 3000...'))