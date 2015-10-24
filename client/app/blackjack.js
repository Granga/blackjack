if (Meteor.isClient) {

  angular.module("blackjack-game", ["angular-meteor"]);

  angular.module("blackjack-game").controller("GameCtrl", ["$scope", "$log", "Game", function ($scope, $log, Game) {
    $scope.game = {};

    $scope.startNewGame = function () {
      $scope.game = new Game($scope.playercount);
      $scope.players = $scope.game.players;
      $log.debug("Started new game with", $scope.playercount, "players");
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
      return !player.isOnTurn || !player.playing() || !$scope.game.status;
    }

    $scope.statusClass = function () {
      return $scope.game.status ? "alert-success" : "alert-danger";
    }
  }]);

  //for debugging
  window.getScope = function () {
    return angular.element(document.getElementById("my-table")).scope();
  }
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
