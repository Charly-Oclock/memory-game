const db = require("../models");
const Time = db.times;

//on enregistre un nouveau temps de jeu
exports.create = (req, res) => {
  //on commence toujours par vérifier que les données de notre requete sont valides
  //ici on verifie que la valeur de time est bien renseignée
  if (!req.body.time) {
    //si time n'est pas renseigné, on renvoie une erreur
    res.status(400).send({
      message: "Le temps n'a pas été renseigné!"
    });
    return;
  }

  //si le temps est bien renseigné, on va donc créer une nouvelle instance du model Time
  //c'est a dire, on fait une copie du patron, et on lui ajoute les valeurs que l'on souhaite
  const time = {
    time: req.body.time
  };

  //une fois notre nouveau temps créé, on peut le sauvegarder
  //pour cela on va faire appel a la méthode create qui est native de sequelize
  //cela revient a faire une requete SQL avec INSERT
  Time.create(time).then(data => {
    //si notre nouveau temps est bien sauvegarde, on renvoie les infos retournées
    res.send(data);
  })
  .catch(err => {
    //en cas d'erreur, on retourne une erreur 500
    res.status(500).send({
      message:
      //si on a un message d'erreur qui nous est parvenu, on peut le renvoyer, sinon on met un message par défaut
        err.message || "Une erreur est survenue lors de la sauvegarde du temps de jeu."
    });
  });
};

//on récupere les 5 meilleurs temps depuis la base de données
exports.findAll = (req, res) => {
  Time.findAll({
    //en requete SQL simple, nous ferions `SELECT time FROM TIMES ORDER BY time ASC LIMIT 5`
    //c'est a dire que l'on souhaite récupérer les 5 premiers résultats triés par ordre croissant de la valeur de la colonne "time"
    //avec sequelize, on passe cela en parametre de la fonction native findAll() via laquelle nous pouvons passez nos filtres en parametres

    //SELECT time
    attributes: ['time'],
    //ORDER BY time ASC
    order: [["time" ,"ASC"]], 
    //LIMIT 5
    limit: 5, 

  }).then(data => {
    //une fois nos données récupérées, on les retournes dans notre réponse
    res.send(data);
  })
  .catch(err => {
    //en cas d'erreur, on retourne une erreur 500 avec un message
    res.status(500).send({
      message:
        err.message || "Une erreur est survenue lors de la récupération des temps de jeu."
    });
  });
};
