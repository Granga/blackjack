angular.module("blackjack-game").factory("Hand", [function () {
  var Hand = function (cards, deck) {
    this.cards = cards;
  }

  Hand.prototype.total = function () {
    var aces = _.filter(this.cards, function (c) { return c.num == 11; }).length;
    var value = _.reduce(this.cards, function (memo, c) {
      return memo + (c.num > 11 ? 10 : c.num);
    }, 0)

    while (aces > 0 && value > 21) {
      aces--;
      value -= 10;
    }

    return value;
  }

  Hand.prototype.pushCard = function (card) {
    this.cards.push(card);
  }

  return Hand;
}]);
