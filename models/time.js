//ici on va simplement définir notre modele
//en base de données, les champs ID, createdAt, updatedAt sont automatiquement créés, il n'est donc pas nécessaire de les ajouter ici

module.exports = (sequelize, Sequelize) => {
  //on commence par définir l'objet Time
  const Time = sequelize.define("time", {
    //on définit le champs time qui correspond a la colonne time de notre BDD
    time: {
      //en BDD notre colonne time est définie comme INT afin de pouvoir faire le tri sur la valeur numérique et non pas une chaine de caracteres. On définit donc ce champs comme INTEGER
      type: Sequelize.INTEGER
    }
  });
  
  //et on retourne notre objet
  return Time;
};