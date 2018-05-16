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

    //Push Notifications
    var notificationOpenedCallback = function(jsonData) {
      console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
    };

    window.plugins.OneSignal
    .startInit("94bfce07-9196-4248-9f32-6c6ef1b8740f")
    .handleNotificationOpened(notificationOpenedCallback)
    .endInit();

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

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {



$ionicConfigProvider.tabs.position('bottom');



  // Ionic uses AngularUI Router which uses the concept of states
  // Learn infinity here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    controller: 'tabNotificationCtrl',
    templateUrl: 'templates/tabs.html'
  })



    .state('main', {
        url: '/main',
        abstract: true,
        templateUrl: 'templates/main.html'
    })

    .state('main.app', {
        url: '/app',
        abstract: true,
        views: {
            'main-view@main': {
                templateUrl: 'templates/main-blog-app.html',
                controller: 'AppCtrl'
            }
        }
    })



    .state('main.app.tiles', {
        url: '/tiles',
        views: {
            'main-view@main': {
                templateUrl: 'templates/blog-tiles.html',
                controller: 'tilesCtrl'
            }
        }
    })



    .state('main.mycmc-events', {
        url: '/mycmc-events',
        abstract: true,
        views: {
            'main-view@main': {
                templateUrl: 'templates/mycmc-app-events.html',
                controller: 'AppCtrl'
            }
        }
    })


    .state('main.mycmc-events.events', {
        url: '/events',
        views: {
            'mycmc-events@main.mycmc-events': {
                templateUrl: 'templates/tab-events.html',
                controller: 'EventsCtrl'
            }
        }
    })




    .state('main.mycmc-announcements', {
        url: '/mycmc-announcements',
        abstract: true,
        views: {
            'main-view@main': {
                templateUrl: 'templates/mycmc-app-announcements.html',
                controller: 'AppCtrl'
            }
        }
    })


    .state('main.mycmc-announcements.announcements', {
        url: '/announcements',
        views: {
            'mycmc-announcements@main.mycmc-announcements': {
                templateUrl: 'templates/tab-announcements.html',
                controller: 'AnnouncementsCtrl'
            }
        }
    })



    .state('main.mycmc-union', {
        url: '/mycmc-union',
        abstract: true,
        views: {
            'main-view@main': {
                templateUrl: 'templates/mycmc-app-union.html',
                controller: 'AppCtrl'
            }
        }
    })


    .state('main.mycmc-union.union', {
        url: '/union',
        views: {
            'mycmc-union@main.mycmc-union': {
                templateUrl: 'templates/tab-union.html',
                controller: 'unionCtrl'
            }
        }
    })






  .state('tab.infinity', {
    url: '/infinity',
    views: {
      'tab-infinity': {
        templateUrl: 'templates/tab-infinity.html'
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
  .state('tab.infinity-services', {
    url: '/infinity-services',
    views: {
      'tab-infinity': {
        templateUrl: 'templates/infinity-services.html',
        controller: 'InfinityServiceCtrl'
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

  .state('tab.settings', {
    url: '/settings',
    views: {
      'tab-settings': {
        templateUrl: 'templates/tab-settings.html',
        controller: 'SettingsCtrl'
      }
    }
  })

   .state('tab.post-timeline', {
    url: '/post-timeline',
    views: {
      'tab-settings': {
        templateUrl: 'templates/post-timeline.html',
        controller: 'PostTimelineCtrl'
      }
    }
  })
   .state('tab.post-event', {
    url: '/post-event',
    views: {
      'tab-settings': {
        templateUrl: 'templates/post-event.html',
        controller: 'PostEventCtrl'
      }
    }
  })
  .state('tab.post-announcement', {
    url: '/post-announcement',
    views: {
      'tab-settings': {
        templateUrl: 'templates/post-announcement.html',
        controller: 'PostAnnouncementCtrl'
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
;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
