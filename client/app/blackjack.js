if (Meteor.isClient) {

  angular.module("blackjack-game", ["angular-meteor"]);

  angular.module("blackjack-game").controller("GameCtrl", ["$scope", "$log", "Game", function($scope, $log, Game) {
    $scope.game = null;

    $scope.chips = [5, 20, 50];

    $scope.startNewGame = function() {
      $scope.game = new Game($scope.playerCount);
      $scope.players = $scope.game.players;
      $log.debug("Started new game with", $scope.playerCount, "players");
    }

    $scope.hit = function(player) {
      player.hit();
      player.isOnTurn = false;
      $scope.game.next();
    }

    $scope.stick = function(player) {
      player.stick();
      player.isOnTurn = false;
      $scope.game.next();
    }

    $scope.disableControls = function(player) {
      return !player.isOnTurn || !player.playing() || !$scope.game.status;
    }

    $scope.statusClass = function() {
      if ($scope.game == null) return "alert-info";
      return $scope.game.status ? "alert-success" : "alert-danger";
    }

    $scope.gameStatus = function() {
      if ($scope.game == null) return "NOT STARTED";

      return $scope.game.status ? "ACTIVE" : "OVER";
    }

    $scope.betChip = function(chip) {
      $scope.game.currentPlayer().betAmount(chip);
    }

    $scope.cardColor = function(card) {
      if (card.suit.name == "Diamonds" || card.suit.name == "Hearts")
        return "red";
      else return "black";
    }

    $scope.dealNewHand = function(){
      this.game.dealNewHand();
    }
  }]);

  //for debugging
  window.getScope = function() {
    return angular.element(document.getElementById("blackjack-ui")).scope();
  }
}

if (Meteor.isServer) {
  Meteor.startup(function() {
    // code to run on server at startup
  });
}
