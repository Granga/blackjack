angular.module("blackjack-game").factory("Player", ["Hand", function (Hand) {

  var Player = function (deck, isDealer, id, game, chips) {
    this.hand = new Hand([deck.pickNextCard(), deck.pickNextCard()]);
    this.isDealer = isDealer;
    this.isOnTurn = false;
    this.sticking = false;
    this.deck = deck;
    this.id = id;
    this.bet = 0;
    this.chips = chips;
    this.game = game;

    this.doBet(10); //minimal bet
  }

  Player.prototype.getStatus = function () {
    if (this.isPlaying()) {
      return this.game.getStatus() ? "playing" : "won";
    }
    if (this.isBusted()) {
      return this.game.getStatus() ? "busted" : "lost";
    }
    if (this.isSticking()) {
      if (this.game.getStatus() || this.isDealer) return "sticking";
      if (this.game.dealer.isBusted()) return "won";
      if (this.game.dealer.hand.total() > this.hand.total()) return "lost";
      if (this.game.dealer.hand.total() == this.hand.total()) return "draw";
      if (this.game.dealer.hand.total() < this.hand.total()) return "won";
    }
  }

  Player.prototype.doHit = function () {
    this.hand.pushCard(this.deck.pickNextCard());
    if (this.hand.total() > 21) {
      this.status = "busted";
    }
    this.isOnTurn = false;
    this.game.next();
  }

  Player.prototype.doStick = function () {
    this.sticking = true;
    this.isOnTurn = false;
    this.game.next();
  }

  Player.prototype.doBet = function (amount) {
    if (this.isDealer || this.chips < amount) return;
    this.bet += amount;
    this.chips -= amount;
  }

  Player.prototype.isBusted = function () {
    return this.hand.total() > 21;
  }

  Player.prototype.isSticking = function () {
    return this.sticking;
  }

  Player.prototype.isPlaying = function () {
    return !this.isBusted() && !this.isSticking();
  }

  Player.prototype.doAutoplay = function () {
    if (this.hand.total() < 17) {
      //dealer must hit until has a value of 17 (from wikipedia)
      this.doHit();
    }
    else {
      //simple rule:
      var difference = 21 - this.hand.total();

      if (difference > 5) {
        this.doHit();
      }
      else {
        this.doStick();
      }
    }
  }

  Player.prototype.deal = function (deck) {
    this.hand = new Hand([deck.pickNextCard(), deck.pickNextCard()]);
    this.isOnTurn = false;
    this.sticking = false;
    this.deck = deck;
    this.bet = 0;
    this.doBet(10); //minimal bet
  }

  Player.prototype.isBankrupt = function () {
    if (this.chips < 0) return true;
    return !this.game.getStatus() && this.chips <= 0;
  }

  return Player;

}]);
