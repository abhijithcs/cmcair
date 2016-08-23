angular.module('starter.controllers', ['ngCordova'])

.controller('TimelineCtrl', ['$scope', '$http', function($scope, $http) {         

      $http.get("http://accelerate.net.in/cmcair/apis/posts.php?value=0").then(function(response) {
        $scope.feedsList= response.data;
        $scope.left = 1;
      });

  $scope.feedsList = [];
  $scope.limiter = 1;

    $scope.doRefresh = function() {
      
    $http.get("http://accelerate.net.in/cmcair/apis/posts.php?value=0")
     .then(function(response) {
       $scope.feedsList= response.data; 
       $scope.left = 1;
       $scope.limiter = 1;
     })
     .finally(function() {
       // Stop the ion-refresher from spinning
       $scope.left = 1;
       $scope.limiter = 1;
       $scope.$broadcast('scroll.refreshComplete');
     });
    };

  $scope.loadMore = function() {
    $http.get('http://accelerate.net.in/cmcair/apis/posts.php?value='+$scope.limiter).then(function(items) {
    	if(items.data.length == 0){
    		$scope.left = 0;
    	}
	    $scope.feedsList = $scope.feedsList.concat(items.data)

	  //  $scope.feedsList.push(items);
      $scope.limiter++;

      //$scope.left = 0;
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };
}])




.controller('AnnouncementsCtrl', ['$scope', '$http', function($scope, $http) {         

      $http.get("http://accelerate.net.in/cmcair/apis/announcements.php?value=0").then(function(response) {
        $scope.feedsList= response.data;
        $scope.left = 1;

        //Load Table data.
        $http.get('http://accelerate.net.in/cmcair/apis/table.php?id=101').then(function(items) {
        $scope.tableList = items.data;

            //Table Meta data.
            $http.get('http://accelerate.net.in/cmcair/apis/tableinfo.php?id=101').then(function(meta) {
            $scope.tableMetaData = meta.data;})
       })

      });



  $scope.feedsList = [];
  $scope.limiter = 1;

    $scope.getTable = function(){
      $http.get('http://accelerate.net.in/cmcair/apis/announcements.php?value=0').then(function(items) {
      $scope.tableList = items.data;
    })
    };

    $scope.doRefresh = function() {
      
    $http.get("http://accelerate.net.in/cmcair/apis/announcements.php?value=0")
     .then(function(response) {
       $scope.feedsList= response.data; 
       $scope.left = 1;
       $scope.limiter = 1;
     })
     .finally(function() {
       // Stop the ion-refresher from spinning
       $scope.left = 1;
       $scope.limiter = 1;
       $scope.$broadcast('scroll.refreshComplete');
     });
    };

  $scope.loadMore = function() {
    $http.get('http://accelerate.net.in/cmcair/apis/announcements.php?value='+$scope.limiter).then(function(items) {
      if(items.data.length == 0){
        $scope.left = 0;
      }
      $scope.feedsList = $scope.feedsList.concat(items.data)

    //  $scope.feedsList.push(items);
      $scope.limiter++;

      //$scope.left = 0;
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };
}])


.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})



.controller('InfinitySectretaryCtrl', ['$scope', '$http', function($scope, $http){

      $http.get("http://accelerate.net.in/cmcair/apis/secretaries.php").then(function(response) {
        $scope.userlist= response.data;
      });
}])

.controller('InfinityHeadCtrl', ['$scope', '$http', function($scope, $http){

      $http.get("http://accelerate.net.in/cmcair/apis/heads.php").then(function(response) {
        $scope.userlist= response.data;
      });
}])

.controller('InfinityEmergencyCtrl', ['$scope', '$http', function($scope, $http){

      $http.get("http://accelerate.net.in/cmcair/apis/emergency_contacts.php").then(function(response) {
        $scope.userlist= response.data;
      });
}])


.controller('InfinityShopCtrl', ['$scope', '$http', function($scope, $http){

      $http.get("http://accelerate.net.in/cmcair/apis/shops.php").then(function(response) {
        $scope.userlist= response.data;
      });
}])





.controller('EventsCtrl', ['$scope', '$http', function($scope, $http) {         

      $http.get("http://accelerate.net.in/cmcair/apis/events.php?value=0").then(function(response) {
        $scope.feedsList= response.data;
        $scope.left = 1;
      });

  $scope.feedsList = [];
  $scope.limiter = 1;

    $scope.doRefresh = function() {
      
    $http.get("http://accelerate.net.in/cmcair/apis/events.php?value=0")
     .then(function(response) {
       $scope.feedsList= response.data; 
       $scope.left = 1;
       $scope.limiter = 1;
     })
     .finally(function() {
       // Stop the ion-refresher from spinning
       $scope.left = 1;
       $scope.limiter = 1;
       $scope.$broadcast('scroll.refreshComplete');
     });
    };

  $scope.loadMore = function() {
    $http.get('http://accelerate.net.in/cmcair/apis/events.php?value='+$scope.limiter).then(function(items) {
      if(items.data.length == 0){
        $scope.left = 0;
      }
      $scope.feedsList = $scope.feedsList.concat(items.data)

    //  $scope.feedsList.push(items);
      $scope.limiter++;

      //$scope.left = 0;
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };
}])



.controller('InfinityCtrl', function($scope) {
  $scope.name = "Hi from Developer! :)";
})

.controller('SettingsCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});



//Trial Codes
function MorePosts($scope, $http) {

};
