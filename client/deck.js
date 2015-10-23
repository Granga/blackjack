angular.module("blackjack-game").factory("Deck", ["Card", function (Card) {

    var cardSuits = [
      {
        name: "Spades",
        icon: "♠"
      },
      {
        name: "Hearts",
        icon: "♥"
      },
      {
        name: "Diamonds",
        icon: "♦"
      },
      {
        name: "Clubs",
        icon: "♣"
      }];

    var Deck = function () {
      this.cards = [];
      
      //initialize the deck
      this.reset();
    }

    Deck.prototype.shuffle = function () {
      this.cards = _.shuffle(this.cards);
    }

    Deck.prototype.pickNextCard = function () {
      return this.cards.pop()
    }

    Deck.prototype.reset = function () {
      this.cards = _.shuffle(createDeckCards());

      function createDeckCards() {
        var _deckCards = [];
        
        //create numbers
        var cardNumbers = [];
        for (var i = 2; i <= 14; i++) {
          cardNumbers.push(i);
        }
        
        //create deck
        for (var i = 2; i <= 14; i++) {
          for (var j = 0; j < 4; j++) {
            _deckCards.push(new Card(i, cardSuits[j]));
          }
        }

        return _deckCards;
      }
    }

    return Deck;

  }]);