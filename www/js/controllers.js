angular.module('starter.controllers', ['ngCordova'])

.controller('TimelineCtrl', ['$scope', '$http' ,'$ionicPopup', '$cordovaNetwork', '$timeout', '$state', function($scope, $http, $ionicPopup, $cordovaNetwork, $timeout, $state) {         

  //NOT logged in case.
  if(localStorage.getItem("token") == null || localStorage.getItem("token") == "LOGOUT")
    {$state.go('tab.login'); ionic.Platform.exitApp();}

      $http.get("http://accelerate.net.in/cmcair/apis/posts.php?value=0&user="+localStorage.getItem("token")).then(function(response) {
        $scope.feedsList= response.data;
        $scope.left = 1;
      });
    
    $scope.viewLikes = function(postID) { 
      $http.get("http://accelerate.net.in/cmcair/apis/viewlikes.php?id="+postID).then(function(likes) {
        $scope.likeList= likes.data;        
      });

            var popup = $ionicPopup.show({
           template: '<ion-list>                                '+
                     '  <ion-item class="item-text-wrap" ng-repeat="item in likeList"> '+
                     '    {{item.name}} '+
                     '  </ion-item>                             '+
                     '</ion-list>                               ',
           
           title: 'People <i class="icon ion-android-favorite"></i> this Post',
           scope: $scope,
           buttons: [
             { text: 'OK' },
           ]
         });
    };



    $scope.deletePost = function(postID, index) { 
           var confirmPopup = $ionicPopup.confirm({
             title: 'Delete Post',
             template: 'Are you sure you want to delete this post?'
           });

           confirmPopup.then(function(res) {
             if(res) {
                 $http.get("http://accelerate.net.in/cmcair/apis/deletepost.php?id="+postID+"&user="+localStorage.getItem("token"));
                 $scope.feedsList.splice(index, 1);
                 //document.getElementById('post_'+postID).style.visibility = "hidden";
                 
             }
           });

    };


    $scope.likedata = {};
    $scope.liker = function(postID) {      
        $scope.likedata.userID = localStorage.getItem("token");
        $scope.likedata.postID = postID;

        $http({
          method  : 'POST',
          url     : 'http://accelerate.net.in/cmcair/apis/likepost.php',
          data    : $scope.likedata, //forms user object
          headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
         })
          .success(function(data) {
            if(data.status == "liked"){
              document.getElementById(postID).style.color = "#E90C44";
              var temp = document.getElementById(postID).innerHTML;
              document.getElementById(postID).innerHTML = " "+(Number(temp) + 1) ;
              document.getElementById(postID).className = "icon ion-android-favorite";
            }
            else{
              document.getElementById(postID).style.color = "#95a5a6";
              var temp = document.getElementById(postID).innerHTML;
              document.getElementById(postID).innerHTML = " "+(Number(temp) - 1) ;
              document.getElementById(postID).className = "icon ion-android-favorite-outline";
            }
            $scope.liked = !$scope.liked;
          
          });
    };



  $scope.feedsList = [];
  $scope.limiter = 1;

     $scope.showPopup = function() {
      var popup = $ionicPopup.alert({
        title: 'You are offline. Please connect to Internet.'
      });
      $timeout(function(){
        popup.close();      
      }, 2000)
    };
    
setInterval(function(){
  if(!$cordovaNetwork.isOnline()){
    $scope.showPopup();
  }
}, 10000);



    $scope.doRefresh = function() {
      
    $http.get("http://accelerate.net.in/cmcair/apis/posts.php?value=0&user="+localStorage.getItem("token"))
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
    $http.get('http://accelerate.net.in/cmcair/apis/posts.php?value='+$scope.limiter+'&user='+localStorage.getItem("token")).then(function(items) {
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
      $http.get("http://accelerate.net.in/cmcair/apis/viewpost.php?id="+$stateParams.postID+"&user="+localStorage.getItem("token")).then(function(response) {
        $scope.post= response.data;
        $scope.liked = response.data.likeFlag;
      });

    $scope.likedata = {};
    $scope.liker = function(postID) {      
        $scope.likedata.userID = localStorage.getItem("token");
        $scope.likedata.postID = postID;

        $http({
          method  : 'POST',
          url     : 'http://accelerate.net.in/cmcair/apis/likepost.php',
          data    : $scope.likedata, //forms user object
          headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
         })
          .success(function(data) {
            $scope.liked = !$scope.liked;
            $scope.refresher();
          });
    };

    $scope.refresher = function() {      
    $http.get("http://accelerate.net.in/cmcair/apis/viewpost.php?id="+$stateParams.postID+"&user="+localStorage.getItem("token"))    
     .then(function(response) {
       $scope.feedsList= response.data; 
     })
     .finally(function() {
       $scope.$broadcast('scroll.refreshComplete');
     });
    };


}])


.controller('AnnouncementsCtrl', ['$scope', '$http', '$rootScope', '$ionicPopup', function($scope, $http, $rootScope, $ionicPopup) {         

      $http.get("http://accelerate.net.in/cmcair/apis/announcements.php?value=0&user="+localStorage.getItem("token")).then(function(response) {
        $scope.feedsList= response.data;
        $scope.left = 1;

        //Load Table data.
        $http.get('http://accelerate.net.in/cmcair/apis/table.php?id=101').then(function(items) {
        $scope.tableList = items.data;

            //Table Meta data.
            $http.get('http://accelerate.net.in/cmcair/apis/tableinfo.php?id=101').then(function(meta) {
            $scope.tableMetaData = meta.data;})

            //Update Head
            $http.get('http://accelerate.net.in/cmcair/apis/notificationheadupdate.php?user='+localStorage.getItem("token")).then(function(inn) {
            })
            $rootScope.notificationCount = "";
            
       });

          $scope.deleteAnnouncement = function(postID, index) { 
           var confirmPopup = $ionicPopup.confirm({
             title: 'Delete Post',
             template: 'Are you sure you want to delete this post?'
           });

           confirmPopup.then(function(res) {
             if(res) {
                 $http.get("http://accelerate.net.in/cmcair/apis/deleteannouncement.php?id="+postID+"&user="+localStorage.getItem("token"));
                  $scope.feedsList.splice(index, 1);
                 //document.getElementById('ann_'+postID).style.visibility = "hidden";                 
             }
           });

    };

  });



  $scope.feedsList = [];
  $scope.limiter = 1;

    $scope.getTable = function(){
      $http.get("http://accelerate.net.in/cmcair/apis/announcements.php?value=&user="+localStorage.getItem("token")).then(function(items) {
      $scope.tableList = items.data;
    })
    };

    $scope.doRefresh = function() {
      
    $http.get("http://accelerate.net.in/cmcair/apis/announcements.php?value=0&user="+localStorage.getItem("token"))
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
    $http.get("http://accelerate.net.in/cmcair/apis/announcements.php?value="+$scope.limiter+"&user="+localStorage.getItem("token")).then(function(items) {
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

.controller('InfinityServiceCtrl', ['$scope', '$http', function($scope, $http){

      $http.get("http://accelerate.net.in/cmcair/apis/services.php").then(function(response) {
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

.controller('SettingsCtrl', ['$scope', '$http', function($scope, $http) {         
  if(localStorage.getItem("postFlag") == 1){$scope.flag=true;} else {$scope.flag=false;}
  

      $scope.user_mob = localStorage.getItem("token");

      $http.get("http://accelerate.net.in/cmcair/apis/userinfo.php?user="+$scope.user_mob).then(function(response) {
        $scope.userdata= response.data;
      });

      //Log Out
      $scope.logoutMe = function() {
        localStorage.setItem("token", "LOGOUT");
        localStorage.setItem("postFlag", "");
        localStorage.setItem("notification", "");
        ionic.Platform.exitApp();
      };

  // NOTIFICATION CUSTOMISATION
//  TUTORIAL - https://www.npmjs.com/package/cordova-plugin-fcm
  if(localStorage.getItem("notification") == 1){$scope.notify=true;} else {$scope.notify=false;}
  $scope.pushNotificationChange = function() {
    if($scope.notify){ //ON --> OFF
      console.log('Switching OFF');
      // FCMPlugin.unsubscribeFromTopic('campuswide');
      // FCMPlugin.subscribeToTopic('55');      
    }
    else //OFF --> ON
    {
      console.log('Switching ON');
      // FCMPlugin.unsubscribeFromTopic('55');
      // FCMPlugin.subscribeToTopic('campuswide');
    }  
  };

  $scope.pushNotification = {checked: $scope.notify};

  

}])

.controller('PostTimelineCtrl', ['$scope', '$http', '$state', function($scope, $http, $state){

  $scope.data = {};
  $scope.data.userID = localStorage.getItem("token");
  $scope.errorFlag = 0;  

  $scope.postTimeline = function() {
    if(!$scope.data.title){
      $scope.errorFlag = 1;
      $scope.errorMsg = "Title can not be empty.";
    }
    else if(!$scope.data.content){
      $scope.errorFlag = 1;
      $scope.errorMsg = "Content can not be empty.";
    }
    else if($scope.data.title.length >200){
      $scope.errorFlag = 1;
      $scope.errorMsg = "Maximum Title length is 200 characters.";
    }
    else if($scope.data.content.length >2000){
      $scope.errorFlag = 1;
      $scope.errorMsg = "Maximum Content length is 2000 characters.";
    }
    else{ //Success Case - accept input.

        $http({
          method  : 'POST',
          url     : 'http://accelerate.net.in/cmcair/apis/posttimeline.php',
          data    : $scope.data, //forms user object
          headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
         })
          .success(function(data) {
            if (data.status) {
              $state.go('tab.timeline');
            } else {
              //Check for invalid inputs.
            }
          });
    }
  }

}])


.controller('PostEventCtrl', ['$scope', '$http', '$state', function($scope, $http, $state){

  $scope.data = {};
  $scope.data.userID = localStorage.getItem("token");
  $scope.errorFlag = 0;  

  $scope.postEvent = function() {
    if(!$scope.data.title){
      $scope.errorFlag = 1;
      $scope.errorMsg = "Title can not be empty.";
    }
    else if(!$scope.data.brief){
      $scope.errorFlag = 1;
      $scope.errorMsg = "Brief can not be empty.";
    }
    else if(!$scope.data.time){
      $scope.errorFlag = 1;
      $scope.errorMsg = "Time and Date can not be empty.";
    }    
    else if(!$scope.data.venue){
      $scope.errorFlag = 1;
      $scope.errorMsg = "Venue can not be empty.";
    }    
    else if(!$scope.data.host){
      $scope.errorFlag = 1;
      $scope.errorMsg = "Host can not be empty.";
    }    
    else if($scope.data.title.length >200){
      $scope.errorFlag = 1;
      $scope.errorMsg = "Maximum Title length is 200 characters.";
    }
    else if($scope.data.brief.length >2000){
      $scope.errorFlag = 1;
      $scope.errorMsg = "Maximum Content length is 2000 characters.";
    }
    else{ //Success Case - accept input.
        $http({
          method  : 'POST',
          url     : 'http://accelerate.net.in/cmcair/apis/postevent.php',
          data    : $scope.data, //forms user object
          headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
         })
          .success(function(data) {
            if (data.status) {
              $state.go('tab.events');
            } else {
              //Check for invalid inputs.
            }
          });
    }
  }

}])


.controller('PostAnnouncementCtrl', ['$scope', '$http', '$state', function($scope, $http, $state){
  $scope.data = {};
  $scope.data.userID = localStorage.getItem("token");
  $scope.errorFlag = 0;  

  $scope.postAnnouncement = function() {
    if(!$scope.data.content){
      $scope.errorFlag = 1;
      $scope.errorMsg = "Content can not be empty.";
    }
    else if(!$scope.data.for){
      $scope.errorFlag = 1;
      $scope.errorMsg = "Please select audience.";
    }
    else if($scope.data.content.length >200){
      $scope.errorFlag = 1;
      $scope.errorMsg = "Maximum Content length is 200 characters.";
    }
    else{ //Success Case - accept input.
      console.log($scope.data.for)
        $http({
          method  : 'POST',
          url     : 'http://accelerate.net.in/cmcair/apis/postannouncement.php',
          data    : $scope.data, //forms user object
          headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
         })
          .success(function(data) {
            if (data.status) {
              $state.go('tab.announcements');
            } else {
              //Check for invalid inputs.
            }
          });
    }
  }
}])

.controller('tabNotificationCtrl', ['$scope', '$http', '$rootScope', function($scope, $http, $rootScope){
   $http.get("http://accelerate.net.in/cmcair/apis/notificationcount.php?user="+localStorage.getItem("token"))
     .then(function(response) {
       $rootScope.notificationCount= response.data.count; 
       if($rootScope.notificationCount == 0){$rootScope.notificationCount = "";}
     });

}])

.controller('LoginCtrl',['$scope', '$state','$http', '$ionicPopup',  function($scope, $state, $http, $ionicPopup){
  
  //Already logged in case.
  if(localStorage.getItem("token") != null && localStorage.getItem("token") != "LOGOUT")
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
        if(response.data.postFlag){$scope.userPostAccess = 1;}else{$scope.userPostAccess = 0;}
        

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
                              localStorage.setItem("postFlag", $scope.userPostAccess);
                              localStorage.setItem("notification", 1);

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
