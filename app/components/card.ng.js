angular.module("blackjack-game").factory("Card", [function () {
  var Card = function (num, suit) {
    this.num = num;
    this.suit = suit;
  };

  Card.prototype.visual = function () {
    var visualNum = "";
    switch (this.num) {
      case 14:
        visualNum = "K";
        break;
      case 13:
        visualNum = "Q";
        break;
      case 12:
        visualNum = "J";
        break;
      case 11:
        visualNum = "A";
        break;
      default:
        visualNum = this.num;
        break;
    }

    return this.suit.icon + visualNum;
  };

  return Card;
}]);
