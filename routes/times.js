//Dans la plupart des projets, on a différentes URLs pour afficher différentes données, ou effectuer différentes actions
//On appelle ces URLs des routes
//En général, une route communique avec le serveur et permet de récupérer certaines données ou d'effectuer une action en particulier
//Quand un projet prend de l'ampleur, on a beaucoup de routes: /users/all,  /user/15/settings, /user/15/pictures .... etc
//Afin de rendre le code plus lisible, surtout quand on commence a avoir beaucoup de routes, il convient de séparer les routes dans différents fichiers
//C'est ce que l'on fait ici, toutes les routes liées a /times seront définies ici

//imports
const express = require('express')
const router = express.Router()
//controller lié aux routes. C'est grace a lui que nous allons pouvoir récupérer nos données en GET et créer de nouvelles données en POST
const times = require("../controllers/time.js");

//dans ce petit projet, nous n'avons qu'une seule route: /times
//les communications avec la base de données se limitent a :
// 1 => récupérer les meilleurs temps pour les afficher
// 2 => enregistrer un nouveau temps de jeu
//l'une des actions s'effectue en GET et l'autre en POST
// on peut donc utiliser la meme route
//si on souhaitait afficher 1 seul temps de jeu, il nous faudrait une nouvelle route, par exemple /times/5

//on récupere les meilleurs temps de jeu
router.get("/times", times.findAll);

//on enregistre un nouveau temps de jeu
router.post("/times", times.create);

//et on exporte notre router
module.exports = router;