angular.module("blackjack-game", []);

angular.module("blackjack-game").controller("GameCtrl", ["$scope", "$log", "Game", function ($scope, $log, Game) {
  $scope.game = null;

  $scope.chips = [5, 20, 50];

  $scope.startNewGame = function () {
    $scope.game = new Game($scope.playerCount);
    $scope.players = $scope.game.players;
    $log.debug("Started new game with", $scope.playerCount, "players");
  }

  $scope.hit = function (player) {
    player.doHit();
  }

  $scope.stick = function (player) {
    player.doStick();
  }

  $scope.disableControls = function (player) {
    return !player.isOnTurn || !player.isPlaying() || !$scope.game.getStatus();
  }

  $scope.gameStatus = function () {
    if ($scope.game == null) return "NOT STARTED";

    return $scope.game.getStatus() ? "ACTIVE" : "OVER";
  }

  $scope.betChip = function (chip) {
    $scope.game.getCurrentPlayer().doBet(chip);
  }

  $scope.cardColor = function (card) {
    if (card.suit.name == "Diamonds" || card.suit.name == "Hearts")
      return "red";
    else return "black";
  }

  $scope.deal = function () {
    this.game.deal();
  }
}]);

//for debugging
window.getScope = function () {
  return angular.element(document.getElementById("blackjack-ui")).scope();
}

