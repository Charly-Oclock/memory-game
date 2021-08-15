//dans ce fichier nous allons initialiser sequelize afin de mettre en place la relation entre nos modeles et la base de données
//on commence par importer les infos de connexion a la BDD
const dbConfig = require("../lib/db_config.js");

//puis on importe sequelize
const Sequelize = require("sequelize");

//on créer la nouvelle instance de connexion avec les infos récupérées dans ../lib/db_config.js
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
});

//on initialise une constante via laquelle nous pourrons accéder a nos données
const db = {};
db.Sequelize = Sequelize; //le module
db.sequelize = sequelize; //la connexion

//on lie la table times dans la constante DB nouvellement instanciée
db.times = require("./time.js")(sequelize, Sequelize);

//et on n'oublie pas d'exporter ;)
module.exports = db;