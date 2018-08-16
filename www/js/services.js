angular.module('starter.services', [])

.directive('onErrorSrc', function() {
  return {
    link: function(scope, element, attrs) {
      element.bind('error', function() {
        if (attrs.src != attrs.onErrorSrc) {
          attrs.$set('src', attrs.onErrorSrc);
        }
      });
    }
  }
})



.directive('preImg', function() {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      ratio:'@',
      helperClass: '@'
    },
    controller: function($scope) {
      $scope.loaded = false;

      this.hideSpinner = function(){
        // Think i have to use apply because this function is not called from this controller ($scope)
        $scope.$apply(function () {
          $scope.loaded = true;
        });
      };
    },
    templateUrl: 'templates/fixed/pre-img.html'
  };
})

.directive('spinnerOnLoad', function() {
  return {
    restrict: 'A',
    require: '^preImg',
    scope: {
      ngSrc: '@'
    },
    link: function(scope, element, attr, preImgController) {
      element.on('load', function() {
        preImgController.hideSpinner();
      });
    }
  };
})




.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Perry Governor 2',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 5,
    name: 'Perry Governor 3',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 6,
    name: 'Perry Governor 4',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 7,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});


