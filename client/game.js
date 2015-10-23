angular.module("blackjack-game").factory("Game", ["Deck", "Player", function (Deck, Player) {

  var Game = function (numPlayers) {
    this.numPlayers = numPlayers;
    this.deck = new Deck();
    this.players = this.makePlayers();
    this.dealer = _.last(this.players);
    this.humans = _.where(this.players, { isDealer: false });
    this.currentIndex = 0;
    this.status = "active";

    this.winners = [];
    this.draws = [];
    this.losers = [];

    this.currentPlayer().isOnTurn = true;
  }

  Game.prototype.next = function () {
    this.status = this.checkGameStatus();
    if (this.status != "active") return;

    this.currentIndex++;
    var p = this.currentPlayer();

    if (p.status == "busted") {
      this.next();
    }
    else if (p.status == "sticking") {
      this.next();
    }
    else if (p.isDealer) {
      p.autoPlay();
      if (p.status == "busted") {
    				this.isActive = false;
      }
    }
    else {
      p.isOnTurn = true;
    }
  }

  Game.prototype.checkGameStatus = function () {
    var dealerBusted = this.dealer.hand.total() > 21;
    if (dealerBusted) {
      this.winners = _.filter(this.humans, function (p) { return p.status == "playing" || p.status == "sticking"; })
      this.losers = _.filter(this.humans, function (p) { return p.status == "busted"; })
      return "over";
    }

    var allSticking = _.every(this.players, function (p) { return p.status == "busted" || p.status == "sticking"; });
    if (allSticking) {
      var humanWinners = _.filter(this.humans, function (p) { return p.status == "sticking" && p.hand.total() > this.dealer.hand.total(); });
      this.draws = _.filter(this.humans, function (p) { return p.hand.total() == this.dealer.hand.total(); });
      this.winners = humanWinners.length > 0 ? humanWinners : [this.dealer];
      return "over";
    }

    var allHumansBusted = _.every(this.players, function (p) { return p.status == "busted"; });
    if (allHumansBusted) {
      this.winners = [this.dealer];
      this.losers = this.humans;
      return "over";
    }

    this.winners.length = this.losers.length = this.draws.length = 0;

    return "active";
  }

  Game.prototype.currentPlayer = function () {
    return this.players[this.currentIndex];
  }

  Game.prototype.makePlayers = function () {
    var players = [];
    for (var i = 0; i < this.numPlayers; i++) {
      players.push(new Player(this.deck, false));
    }
    //the dealer
    players.push(new Player(this.deck, true));

    return players;
  }

  return Game;
}]);