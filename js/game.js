var app = {

  //on instancie nos variables utilisées a travers l'app
  bestTimes:[], //la liste des 5 meilleurs temps de jeu, vide a l'initialisation, nous la remplirons ensuite
  timeleft: 300, //le temps restant dans la partie, ici 5 minutes
  firstCard: null, //la premiere carte tirée afin de faire la comparaison
  secondCard: null, //la seconde carte tirée
  apiUrl: 'http://localhost:3000/times', //l'URL de notre API avec laquelle nous communiquons pour récupérer les temps de jeu et enregistrer un nouveau temps de jeu


  init: function() {
    //on appelle les fonctions que l'on souhaite executer au lançement de l'application
    app.initStartingScreen()

  },

  //on instancie notre jeu a son état initial
  initStartingScreen: async function() {
    //c'est a dire on affiche une liste des meilleurs temps + un bouton pour commencer une partie

    //nous allons donc commencer par afficher une modale avec les meilleurs temps de jeu
    var modal = document.querySelector('#modal')

    //on commence par récupérer les temps de jeu que l'on souhaite afficher
    //on créer un tableau vide dans lequel on va stocker nos données
    var bestTimes = []
    //on utilise axios pour faire notre requete et récupérer nos temps
    //ici on utilise await afin d'attendre que notre methode récupére bien toutes les données avant de procéder a l'affichage
    await axios.get(app.apiUrl).then((response) => {
      //on évite d'attribuer directement la response dans notre variable, on utilise une variable intermédiaire
      var times = response.data
      bestTimes = times
    }).catch((error) => {
      //en cas d'erreur
      console.log(error)
    });

    //maintenant on va créer les elements HTML pour afficher la liste des temps
    //pour cela on va donc ajouter un titre + des elements ul>li
    var bestTimesList = document.createElement('ul')
    bestTimesList.classList.add('modal-content')
    var bestTimesTitle = document.createElement('h1')
    bestTimesTitle.innerHTML = 'Top 5 Times'
    bestTimesList.appendChild(bestTimesTitle)

    //on ajoute un compteur qui nous permet d'afficher le classement
    var i = 0

    bestTimes.forEach(time => {
      //on incrémente notre compteur
      i+=1
      //maintenant on va ajouter chaque temps dans notre modal
      //on commence par créer notre element li, lui ajouter les classes puis le texte
      var timeItem = document.createElement('li')
      timeItem.classList.add('times-list-item')
      timeItem.innerHTML = '#' + i + ' => ' + time.time + ' secondes'
      //on verse notre li dans le ul
      bestTimesList.appendChild(timeItem)
    });

    //on ajoute la liste dans la modale
    modal.appendChild(bestTimesList)
    
    //on va créer un bouton pour commencer la partie
    var startButton = document.createElement('button')
    startButton.classList.add('button')
    startButton.innerHTML = 'Start new game'
    //on ajoute l'écouteur d'evement qui va démarrer la partie
    startButton.addEventListener('click', app.startNewGame)
    //on ajoute le bouton dans la modale
    modal.appendChild(startButton)
  },

  //cette fonction permet de fermer la modale et de lancer une partie
  startNewGame: function() {

    //on commence par cibler puis cacher notre modale
    var modal = document.querySelector('#modal')
    modal.style.display = 'None'

    //on appelle les 2 fonctions qui permettent d'initialiser le jeu, a savoir le tableau de jeu et le timer
    app.generateNewGame()
    app.createTimer()
  },

  //fonction qui permet de relancer le jeu
  resetGame: function() {
    //pour reset le jeu, on refresh simplement la page
    window.location.reload();
  },

  //fonction qui va générer automatiquement une nouvelle planche de jeu aléatoire
  generateNewGame: function() {

    //on commence par récupérer notre container principal dans lequel les cartes seront générées
    var gameboard = document.querySelector('#memory')
    gameboard.classList.add('memory')
    //ici on va récupérer la liste des cartes
    var cards = data.cards

    //notre table de jeu doit etre composée de 14 paires de cartes
    //nous allons donc ouvrir une boucle afin de répéter l'opération 14 fois
    for(var i = 0; i < 3; i += 1) {

      //on récupere une carte de notre liste
      var card = cards[i];

      //comme on souhaite générer 2 cartes identiques, on doit répéter l'action de création 2 fois
      for(var j = 0; j < 2; j += 1) {

        //on créer notre élément div
        var cardElement = document.createElement('div');

        //on lui ajoute les class pour le style
        cardElement.classList.add('card', 'card-hidden');

        //on créer notre élément img qui va contenir l'image de la carte
        var cardImage = document.createElement('img')

        //on attribue le lien source et le titre alternatif a la carte selectionnée dans la boucle parente
        cardImage.src = cardImage.alt = card

        //on accroche notre élément img dans notre div
        cardElement.appendChild(cardImage)

        //on rajoute un identifiant unique pour la carte, cela nous permettra d'identifier si on tire une paire de cartes identiques ou non
        cardElement.dataset.cardId = 'card' + i

        //les cartes étant crées a la suite, il faut maintenant mélanger l'ordre d'affichage car sinon toutes les paires se suiveront
        //pour cela on peut utiliser la propriété css order et lui attribuer une valeur aléatoire comprise en 1 et 28 (on peut mettre 100 si on le souhaite, le tout c'est que le mélange soit fait au maximum entre les cartes qui se suivent)
        cardElement.style.order = Math.floor(Math.random() * 28);

        // On ajoute notre div contenant tout ces éléments à notre table de jeu
        gameboard.appendChild(cardElement);

        //on active notre eventListener pour appeler la fonction qui va gérer le click sur une carte
        cardElement.addEventListener('click', app.flipACard)
      }
    }
  },

  //fonction qui initialise le timer
  createTimer: function() {
    //on commence par créer le timer numérique

    //on récupere notre container dans une variable
    var timerContainer = document.querySelector('#timer')
    timerContainer.classList.add('timer')

    //pour un compteur numérique on ne souhaite afficher que du texte
    var countTimer = document.createElement('p');
    //on ajoute une class pour le style
    countTimer.classList.add('timer-count')
    timerContainer.appendChild(countTimer)

    //on affiche le temps restant dans des le debut de la partie
    countTimer.innerHTML = app.timeleft

    //on créer notre fonction timer
    //cete fonction va prendre la valeur définie dans timeleft et l'afficher a jour toutes les secondes jusqu'a ce que le compteur soit a 0
    var timer = setInterval(function(){
      //on commence par soustraire une seconde au temps restant
      app.timeleft -= 1;
      if(app.timeleft < 0){
        //si le temps est inférieur a zéro, on met le timer en pause, et on gere le cas de défaite
        clearInterval(timer);
        app.handleLose()

      }
      //on met a jour le temps restant dans le compteur
      countTimer.innerHTML = app.timeleft
    }, 1000);

    //on créer notre élément qui va servir de container et on lui ajoute la class pour le style
    var progressbarContainer = document.createElement('div');
    progressbarContainer.classList.add('progressbar');

    //on créer ensuite une div qui sera la partie animée de la barre
    var progressbar = document.createElement('div');
    progressbar.classList.add('animated-bar');
    progressbar.style.animationDuration = '301s';

    //on pourrait également appeler handleLose() uniquement avec le CSS en utilisant l'évenement animationend, qui permet d'appeler une fonction lorsqu'une animation se termine
    //progressbarinner.addEventListener('animationend', app.handleLose);

    //on ajoute la barre animée dans la barre container
    progressbarContainer.appendChild(progressbar  );

    //on ajoute la barre du timer dans le DOM
    timerContainer.appendChild(progressbarContainer)

    //une fois que tout est chargé dans le DOM, on démarre l'animation de la barre
    progressbar.style.animationPlayState = 'running';
  },

  //fonction qui permet de gérer le retournement d'une carte au clic
  flipACard: async function(event) {
    //cette fonction est définie asynchrone (async) afin de pouvoir utiliser des Promise (ici dans le but d'avoir un délais entre les clicks)

    //on affiche l'image de la carte
    //ici this correspond a l'element sur lequel on a cliqué
    this.classList.remove('card-hidden')

    //on désactive l'eventListener sur la carte
    this.removeEventListener('click', app.flipACard)

    //on vérifie si une carte est deja retournée
    if(!app.firstCardIsFlipped){
      //si aucune carte n'est retournée
      //on met la carte cliquée dans une variable afin de pouvoir effectuer les comparaisons au second clic
      app.firstCard = this
      //on indique que la premiere carte est retournée dans une variable
      app.firstCardIsFlipped = true
      //
      app.firstCard.classList.add('card-first')
    }else{
      //si une carte est déja retournée

      //on désactive le click temporairement sur toutes les cartes cachées
      app.toggleClickEvent(false)

      //on stocke la seconde carte dans une variable
      app.secondCard = this
      //on va vérifier l'id des cartes
      //comme l'id des elements est de type card10-1, on souhaite comparer uniquement le numéro de la carte
      // on doit donc supprimer les 2 derniers caracteres de la string
      firstCardId = app.firstCard.dataset.cardId
      secondCardId = app.secondCard.dataset.cardId

      //on vérifie si les deux cartes sont identiques
      if(firstCardId === secondCardId){
        //les cartes correspondent, on vérifie si le joueur a gagné ou non
        //on enleve la bordure orange de la premiere carte
        app.firstCard.classList.remove('card-first')
        //on ajoute la bordure verte sur les 2 cartes
        app.firstCard.classList.add('card-match')
        app.secondCard.classList.add('card-match')
        //pause pour voir la carte retournée
        await app.sleep(200)
        //on vérifie si le joueur a gagné
        app.checkForVictory()
      }else{
        //les cartes ne correspondent pas, on reset les propriétés des cartes en les cachant a nouveau et réactivant l'eventListener
        //on enleve la bordure orange de la premiere carte puis on met une bordure rouge autour des 2 cartes
        app.firstCard.classList.remove('card-first')
        app.firstCard.classList.add('card-wrong')
        app.secondCard.classList.add('card-wrong')
        //on pause afin que le joueur ait le temps de voir la carte
        await app.sleep(1000)
        //on enleve les bordure rouge et on cache a nouveau les cartes
        app.firstCard.classList.remove('card-wrong')
        app.firstCard.classList.add('card-hidden')
        app.secondCard.classList.remove('card-wrong')
        app.secondCard.classList.add('card-hidden')
        //on résactive le click sur ces 2 cartes
        app.firstCard.addEventListener('click', app.flipACard)
        app.secondCard.addEventListener('click', app.flipACard)
      }
      //on réactive le click sur les cartes cachées et on reset le boolean
      app.toggleClickEvent(true)
      app.firstCardIsFlipped = false
    }
  },

  //fonction qui permet de bloquer le clic sur toutes les cartes cachées pendant le tirage de la seconde carte, sans quoi le joueur peut cliquer sur toutes les cartes en meme temps
  toggleClickEvent: function(activate) {
    //en parametre, on passe un boolean activate qui nous permet de choisir sur on désactive ou active le click

    //on récupere tous les elements card du tableau de jeu
    var cards = document.querySelectorAll('.card-hidden')
    if(!activate) {
      //on désactive. Ici on boucle sur les cartes récupérées
      cards.forEach(card => {
        //pour chaque carte du tableau, on enleve l'eventlistener
        card.removeEventListener('click', app.flipACard)
      });
    }else{
      //on active
      cards.forEach(card => {
        //pour chaque carte du tableau, on réactive l'eventlistener
        card.addEventListener('click', app.flipACard)
      });
    }
  },

  //fonction pour vérifier si la paire validée est la derniere ou non
  checkForVictory: async function() {

    //pour cela on récupere un tableau contenant tous les elements avec la class 'hidden' et on vérifie la longueur du tableau
    var hiddenCardsCounter = document.querySelectorAll('.card-hidden').length
    if(hiddenCardsCounter == 0){
      //si le tableau est vide, c'est la victoire !
      alert('Vous avez gagné !!')
      //on va donc sauvegarder le temps de jeu, pour cela on soustrait le temps total au temps restant
      var totalTime = 300 - app.timeleft 
      //puis on fait notre requete post vers notre serveur avec l'URL + les parametres
      await axios.post(app.apiUrl, {time: totalTime}).then((response) => {
        console.log(response);
      }, (error) => {
        console.log(error);
      });
      //on reset le jeu apres le click sur l'alert
      app.resetGame()
    }
  },

  //fonction qui prévient le joueur que la partie est perdue, dommage...
  handleLose: function() {
    //si le timer arriver a 0, on affiche une alerte et on reset le jeu au clic
    alert('Vous avez perdu !!')
    app.resetGame()
  },

  //fonction utilitaire qui permet d'ajouter temps d'attente
  sleep: function(ms) {
    //on ajoute une fonction qui va mettre le jeu en pause afin de laisser le temps au joueur de voir la seconde carte tirée
    //on passe en parametre de la fonction le nombre de millisecondes
    return new Promise(resolve => setTimeout(resolve, ms))
  },
  
}
document.addEventListener('DOMContentLoaded', app.init)