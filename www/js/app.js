// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','ionic.service.core', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform, $ionicPopup) {
  $ionicPlatform.ready(function() {  	
    //Exit app if not connected to Internet
    if(window.Connection) {
                if(navigator.connection.type == Connection.NONE) {
                    $ionicPopup.alert({
                        title: "Not Connected to Internet",
                        content: "Please connect to Internet and then launch the App."
                    })
                    .then(function(result) {
                        ionic.Platform.exitApp();
                    });
                }
    }

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn infinity here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.timeline', {
    url: '/timeline',
    views: {
      'tab-timeline': {
        templateUrl: 'templates/tab-timeline.html',
        controller: 'TimelineCtrl'
      }
    }
  })

    .state('tab.post-detail', {
      url: '/posts/:postID',
      views: {
        'tab-timeline': {
          templateUrl: 'templates/post-detail.html',
          controller: 'postDetailCtrl'
        }
      }
    })

  .state('tab.events', {
    url: '/events',
    views: {
      'tab-events': {
        templateUrl: 'templates/tab-events.html',
        controller: 'EventsCtrl'
      }
    }
  })  

  .state('tab.announcements', {
    url: '/announcements',
    views: {
      'tab-announcements': {
        templateUrl: 'templates/tab-announcements.html',
        controller: 'AnnouncementsCtrl'
      }
    }
  }) 

 .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
  })

  .state('tab.infinity', {
    url: '/infinity',
    views: {
      'tab-infinity': {
        templateUrl: 'templates/tab-infinity.html',
        controller: 'InfinityCtrl'
      }
    }
  })   
  .state('tab.infinity-secretary', {
    url: '/infinity-secretary',
    views: {
      'tab-infinity': {
        templateUrl: 'templates/infinity-secretary.html',
        controller: 'InfinitySectretaryCtrl'
      }
    }
  })
  .state('tab.infinity-head', {
    url: '/infinity-head',
    views: {
      'tab-infinity': {
        templateUrl: 'templates/infinity-head.html',
        controller: 'InfinityHeadCtrl'
      }
    }
  })
  .state('tab.infinity-shop', {
    url: '/infinity-shop',
    views: {
      'tab-infinity': {
        templateUrl: 'templates/infinity-shop.html',
        controller: 'InfinityShopCtrl'
      }
    }
  })
  .state('tab.infinity-emergency', {
    url: '/infinity-emergency',
    views: {
      'tab-infinity': {
        templateUrl: 'templates/infinity-emergency.html',
        controller: 'InfinityEmergencyCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});

