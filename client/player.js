angular.module("blackjack-game").factory("Player", ["Hand", function (Hand) {

    var Player = function (deck, isDealer) {
      this.hand = new Hand([deck.pickNextCard(), deck.pickNextCard()]);
      this.isDealer = isDealer;
      this.isOnTurn = false;
      this.status = "playing",
      this.deck = deck;
    }

    Player.prototype.hit = function () {
      this.hand.pushCard(this.deck.pickNextCard());
      if (this.hand.total() > 21) {
        this.status = "busted";
      }
      this.isOnTurn = false;
    }

    Player.prototype.stick = function () {
      this.status = "sticking";
      this.isOnTurn = false;
    }

    Player.prototype.autoPlay = function () {
      if (this.hand.total() < 17) {
        this.hit();
      }
      else {
        //simple rule: 
        var difference = 21 - this.total();

        if (difference > 5) {
          this.hit();
        }
        else {
          this.stick();
        }
      }
    }

    return Player;

  }]);