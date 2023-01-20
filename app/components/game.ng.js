angular.module("blackjack-game").factory("Game", ["Deck", "Player", "$log", function (Deck, Player, $log) {

  var Game = function (numPlayers) {
    this.deck = new Deck();
    this.dealer = null;
    this.humans = [];
    this.players = this.makePlayers(numPlayers);
    this.currentIndex = 0;
    this.getCurrentPlayer().isOnTurn = true;
    this.hasEnded = false;
    this.isInProgress = true;
  }

  Game.prototype.next = function () {
    console.log("NEXT! said player", this.getCurrentPlayer().id);
    if (this.checkEnded()) return;

    this.currentIndex++;
    if (this.currentIndex >= this.players.length)
      this.currentIndex = 0;

    var p = this.getCurrentPlayer();

    if (!p.isPlaying()) {
      $log.log("Player", p.id, "is not playing.");
      return this.next();
    }

    if (p.isDealer) {
      console.log("Player", p.id, "is dealer. Performing automove.");
      p.doAutoplay();
    }
    else {
      p.isOnTurn = true;
    }
  }

  Game.prototype.checkEnded = function () {
    if (this.hasEnded) return false;

    var anybodyPlaying = _.some(this.players, function (p) {
      return p.isPlaying();
    });

    var humansBusted = _.every(this.humans, function (h) {
      return h.isBusted();
    });

    $log.log("ANYBODY PLAYING:", anybodyPlaying, "HUMANS BUSTED", humansBusted, "DEALER BUSTED", this.dealer.isBusted());

    this.hasEnded = this.dealer.isBusted() || humansBusted || !anybodyPlaying;

    if (this.hasEnded) {
      this.doPayout();
    }

    return this.hasEnded;
  }

  Game.prototype.getStatus = function () {
    return !this.hasEnded;
  }

  Game.prototype.getCurrentPlayer = function () {
    return this.players[this.currentIndex];
  }

  Game.prototype.getDealer = function () {
    return this.dealer;
  }

  Game.prototype.makePlayers = function (numPlayers) {
    var players = [];
    for (var i = 0; i < numPlayers; i++) {
      this.humans.push(new Player(this.deck, false, i + 1, this, 100));
    }
    //the dealer
    this.dealer = new Player(this.deck, true, i + 1, this, 1000);
    players = players.concat(this.humans);
    players.push(this.dealer);

    return players;
  }

  Game.prototype.getDealer = function () {
    return _.findWhere(this.players, {
      isDealer: true
    });
  }

  Game.prototype.deal = function () {
    var deck = this.deck = new Deck();

    _.each(this.players, function (p) {
      p.deal(deck);
    });

    this.currentIndex = 0;
    this.getCurrentPlayer().isOnTurn = true;
    this.hasEnded = false;
  }

  Game.prototype.doPayout = function () {
    _.each(this.players, function (p) {
      if (p.getStatus() == "won") {
        p.chips += (p.bet * 2);
      }
      else if (p.getStatus() == "draw") {
        p.chips += p.bet;
      }
    });
  }

  return Game;
}]);
