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

// .controller('postDetailCtrl', function($scope) {
//  // $scope.chat = Chats.get($stateParams.chatId);
//  $scope.chat="Title";
//  $scope.content="Content";
//  console.log("Hit");
// })


.controller('postDetailCtrl', ['$scope', '$http', '$stateParams', function($scope, $http, $stateParams){
      $http.get("http://accelerate.net.in/cmcair/apis/viewpost.php?id="+$stateParams.postID).then(function(response) {
        $scope.post= response.data;
      });
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

.controller('LoginCtrl',['$scope', '$state','$http', '$ionicPopup',  function($scope, $state, $http, $ionicPopup){
  
  //Already logged in case.
  if(localStorage.getItem("token") != null && localStorage.getItem("token") != "")
    $state.go('tab.timeline')

  

  $scope.login = function(mobile){

    //By default, do not show any error message.
    $scope.errorFlag = 0;
    
    
           
      if (/^\d{10}$/.test(mobile)){
        //Valid Mobile Number. Send OTP and verify it.

        $scope.otp_original = {};
        $http.get('http://accelerate.net.in/cmcair/apis/useractivate.php?mobile='+mobile).then(function(response) {
        $scope.otp_original = response.data.code;
        $scope.validity = response.data.valid;

          if($scope.validity){ //Valid, Registered User.          

                  //OTP Validation happens here.
                    $scope.userdata = {};
                    $ionicPopup.show({
                      template: '<input type="password" ng-model="userdata.otp">',
                    title: "One Time Password",
                    subTitle: "Please enter the OTP received on your registered mobile number "+mobile,
                    scope: $scope, 
                    buttons: [
                      { text: 'Cancel' },
                      {
                        text: '<b>Submit</b>',
                        type: 'button-positive',
                        onTap: function(e) {
                          if (!$scope.userdata.otp) 
                          {
                            //don't allow the user to close unless he enters wifi password
                            e.preventDefault();
                          } 
                          else 
                          {
                            if($scope.userdata.otp == $scope.otp_original){ //OTP Match                
                              $scope.token = mobile;                
                              localStorage.setItem("token", $scope.token);
                              $http.get('http://accelerate.net.in/cmcair/apis/usersignin.php?mobile='+mobile);
                              $state.go('tab.timeline');
                            }
                            else
                            {
                              $scope.errorFlag = 1;
                              $scope.errorMessage = "Sorry! You have entered a wrong OTP.";
                            }

                          }
                          }
                        }
                    ]
                    });
          }
          else{
              $scope.errorFlag = 1;
              $scope.errorMessage = "Not registered.";
          }
        }); 
      } 
      else 
      {
        
        $scope.errorFlag = 0;
        $ionicPopup.alert({
        title: "Invalid Mobile Number",
        content: "Please enter a valid 10 digit mobile number, which is registered with CMC Air."
        });
      }
  };


}]);



//Trial Codes
function MorePosts($scope, $http) {

};
