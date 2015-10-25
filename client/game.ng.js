angular.module("blackjack-game").factory("Game", ["Deck", "Player", function (Deck, Player) {

  var Game = function (numPlayers) {
    this.numPlayers = numPlayers;
    this.deck = new Deck();
    this.players = this.makePlayers();
    this.dealer = _.last(this.players);
    this.humans = _.where(this.players, { isDealer: false });
    this.currentIndex = 0;
    this.status = true;

    this.winners = [];
    this.draws = [];

    this.currentPlayer().isOnTurn = true;
  }

  Game.prototype.next = function () {
    console.log("NEXT!");
    this.status = this.checkGameStatus();
    if (!this.status) return;

    this.currentIndex++;
    if (this.currentIndex >= this.players.length)
      this.currentIndex = 0;

    var p = this.currentPlayer();

    if (!p.playing()) this.next();

    if (p.isDealer) {
      console.log("Player with ID", p.id, "is dealer. Performing automove.");
      p.autoPlay();
      this.next();
    }

    else {
      p.isOnTurn = true;
    }
    this.status = this.checkGameStatus();
  }

  Game.prototype.checkGameStatus = function () {
    var dealer = this.getDealer();
    var anybodyPlaying = _.some(this.players, function (p) { return p.playing(); });

    if (dealer.busted()) {
      this.publishResults(true);
      return false;;
    }

    if (!anybodyPlaying) {
      this.publishResults(false);
      return false;
    }

    return true;
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

  Game.prototype.getDealer = function () {
    return _.findWhere(this.players, { isDealer: true });
  }

  Game.prototype.publishResults = function (dealerLost) {
    var winners = [];
    var draws = [];
    var dealer = this.getDealer();

    var humansInGame = _.filter(this.humans, function (h) { return h.playing() || h.sticking(); });

    if (dealerLost) {
      winners = humansInGame;
    }
    else {
      _.each(humansInGame, function (h) {
        var humanTotal = h.hand.total();
        var dealerTotal = dealer.hand.total();
        if (humanTotal == dealerTotal) {
          draws.push(h);
        }
        else if (humanTotal > dealerTotal) {
          winners.push(h);
        }
        else if (humanTotal < dealerTotal) {
          //no need to note losers
        }
      });
    }

    console.log("Game over, publishing results");
    this.draws = draws;
    this.winners = winners;
  }

  return Game;
}]);