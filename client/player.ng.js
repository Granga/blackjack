angular.module("blackjack-game").factory("Player", ["Hand", function(Hand) {

  var Player = function(deck, isDealer, id) {
    this.hand = new Hand([deck.pickNextCard(), deck.pickNextCard()]);
    this.isDealer = isDealer;
    this.isOnTurn = false;
    this.status = "playing";
    this.deck = deck;
    this.id = id;
    this.chips = 90;
    this.bet = 10; //minimal bet
  }

  Player.prototype.hit = function() {
    this.hand.pushCard(this.deck.pickNextCard());
    if (this.hand.total() > 21) {
      this.status = "busted";
    }
    this.isOnTurn = false;
  }

  Player.prototype.stick = function() {
    this.status = "sticking";
    this.isOnTurn = false;
  }

  Player.prototype.isBusted = function() {
    return this.status == "busted";
  }

  Player.prototype.isSticking = function() {
    return this.status == "sticking";
  }

  Player.prototype.isPlaying = function() {
    if(this.hand.total() > 21) this.status = "busted";
    return this.status == "playing";
  }

  Player.prototype.betAmount = function(amount) {
    if (this.chips < amount) return;
    this.bet += amount;
    this.chips -= amount;
  }

  Player.prototype.autoPlay = function() {
    if (this.hand.total() < 17) {
      this.hit();
    } else {
      //simple rule:
      var difference = 21 - this.hand.total();

      if (difference > 5) {
        this.hit();
      } else {
        this.stick();
      }
    }
  }

  Player.prototype.newHand = function(deck) {
    this.deck = deck;
    this.hand = new Hand([deck.pickNextCard(), deck.pickNextCard()]);
    this.isOnTurn = false;
    this.status = "playing";
    this.bet = 10;
    this.chips -= this.bet;
  }

  return Player;

}]);
