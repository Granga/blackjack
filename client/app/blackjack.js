if (Meteor.isClient) {

  angular.module("blackjack-game", ["angular-meteor"]);

  angular.module("blackjack-game").controller("GameCtrl", ["$scope", "$log", "Game", function ($scope, $log, Game) {

    $scope.playerCount = 2;

    $scope.game = {};

    $scope.startNewGame = function () {
      $scope.game = new Game($scope.playerCount);
      $scope.players = $scope.game.players;
      $log.debug("Started new game!");
    }

    $scope.hit = function (player) {
      player.hit();
      player.isOnTurn = false;
      $scope.game.next();
    }

    $scope.stick = function (player) {
      player.stick();
      player.isOnTurn = false;
      $scope.game.next();
    }

    $scope.disableControls = function (player) {
      return !player.isOnTurn || player.status == "busted" || player.status == "sticking";
    }

    $scope.statusClass = function () {
      switch ($scope.game.status) {
        case "Dealer won":
          return "alert-danger";
          break;
        case "Dealer lost":
          return "alert-success";
          break;
        default:
          return "alert-warning";
          break;
      }
    }
    
    //for testing
    $scope.startNewGame();

  }]);


  window.getScope = function () {
    return angular.element(document.getElementById("my-table")).scope();
  }
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
