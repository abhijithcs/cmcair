angular.module('starter.controllers', ['ngCordova'])


    .controller('TimelineCtrl', ['$interval', '$rootScope', '$scope', '$http', '$ionicPopup', '$cordovaNetwork', '$timeout', '$state', '$ionicLoading', function($interval, $rootScope, $scope, $http, $ionicPopup, $cordovaNetwork, $timeout, $state, $ionicLoading) {


        //Tweak --> To stop timer incase state changed while taking test
        $rootScope.$on('$stateChangeStart', 
        function(event, toState, toParams, fromState, fromParams){ 
            if(fromState.name == 'main.mycmc-acads.acads'){
                $interval.cancel($rootScope.examTimer);

            }
        })


        if (localStorage.getItem("postAdminFlag") == 1) {
            $scope.adminDeleteFlag = true;
        } else {
            $scope.adminDeleteFlag = false;
        }


        $scope.getRandomEventClass = function(code) {
            var token = code % 7;
            token++;
            return 'eventHead' + token;
        }


        //Returns first letters of the 2 words in the string
        $scope.getImageCode = function(text){
            if(!text || text == ''){
                return 'WE';
            }

            text = text.replace(/[^a-zA-Z ]/g, "");
            var words = text.split(' ');

            if(words.length > 1){
                return words[0].substring(0,1)+words[1].substring(0,1);
            }
            else{
                return (text.substring(0, 2)).toUpperCase();
            }
        }





        //NOT logged in case.
        if (localStorage.getItem("token") == null || localStorage.getItem("token") == "LOGOUT") {
            $state.go('login');
        }


        //FIRST LOAD

        $scope.renderFailed = false;
        $scope.isRenderLoaded = false;

        $ionicLoading.show({
            template: '<ion-spinner></ion-spinner>'
        });

        $http.get("http://cmcair.in/apis/posts.php?value=0&user=" + localStorage.getItem("token"), {
                timeout: 10000
            })
            .success(function(response) {
                $scope.feedsList = response;
                $scope.left = 1;
                $ionicLoading.hide();
                $scope.renderFailed = false;
                $scope.isRenderLoaded = true;
            })
            .error(function(data) {
                $ionicLoading.hide();
                $ionicLoading.show({
                    template: "Not responding. Check your connection.",
                    duration: 3000
                });

                $scope.renderFailed = true;
                $scope.$broadcast('scroll.refreshComplete');

            });


        //REFRESHER

        $scope.doRefresh = function() {

            $http.get("http://cmcair.in/apis/posts.php?value=0&user=" + localStorage.getItem("token"), {
                    timeout: 10000
                })
                .success(function(response) {
                    $scope.feedsList = response;
                    $scope.left = 1;
                    $scope.limiter = 1;
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.renderFailed = false;
                    $scope.isRenderLoaded = true;
                })
                .error(function(data) {
                    $ionicLoading.show({
                        template: "Not responding. Check your connection.",
                        duration: 3000
                    });

                    $scope.$broadcast('scroll.refreshComplete');

                });

        };

        $scope.loadMore = function() {
            $http.get('http://cmcair.in/apis/posts.php?value=' + $scope.limiter + '&user=' + localStorage.getItem("token"), {
                    timeout: 10000
                })
                .success(function(items) {
                    if (items.length == 0) {
                        $scope.left = 0;
                    }
                    $scope.feedsList = $scope.feedsList.concat(items)
                    $scope.limiter++;
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                })
                .error(function(data) {
                    $ionicLoading.show({
                        template: "Not responding. Check your connection.",
                        duration: 3000
                    });

                    $scope.$broadcast('scroll.infiniteScrollComplete');

                });
        };




        $scope.viewLikes = function(postID) {
            $http.get("http://cmcair.in/apis/viewlikes.php?id=" + postID).then(function(likes) {
                $scope.likeList = likes.data;
            });

            var popup = $ionicPopup.show({
                template: '<ion-list>                                ' +
                    '  <ion-item class="item-text-wrap" ng-repeat="item in likeList"> ' +
                    '    {{item.name}} ' +
                    '  </ion-item>                             ' +
                    '</ion-list>                               ',

                title: 'People <i class="icon ion-android-favorite"></i> this Post',
                scope: $scope,
                buttons: [{
                    text: 'OK'
                }, ]
            });
        };



        $scope.deletePost = function(postID, index) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Delete Post',
                template: 'Are you sure you want to delete this post?'
            });

            confirmPopup.then(function(res) {
                if (res) {
                    $http.get("http://cmcair.in/apis/deletepost.php?id=" + postID + "&user=" + localStorage.getItem("token"));
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
                    method: 'POST',
                    url: 'http://cmcair.in/apis/likepost.php',
                    data: $scope.likedata, //forms user object
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                .success(function(data) {
                    if (data.status == "liked") {
                        document.getElementById(postID).style.color = "#E90C44";
                        var temp = document.getElementById(postID).innerHTML;
                        document.getElementById(postID).innerHTML = " " + (Number(temp) + 1);
                        document.getElementById(postID).className = "icon ion-android-favorite";
                    } else {
                        document.getElementById(postID).style.color = "#95a5a6";
                        var temp = document.getElementById(postID).innerHTML;
                        document.getElementById(postID).innerHTML = " " + (Number(temp) - 1);
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
            $timeout(function() {
                popup.close();
            }, 2000)
        };

        setInterval(function() {
            if (!$cordovaNetwork.isOnline()) {
                $scope.showPopup();
            }
        }, 10000);




    }])


    .controller('AppCtrl', function($scope, $state, $http, $ionicLoading, $timeout) {
        $scope.goToTiles = function() {
            $state.go('main.app.tiles')
        }
    })

    .controller('tilesCtrl', function($scope, $state, $http, $ionicLoading, $timeout, $rootScope, $interval) {

        //NOT logged in case.
        if (localStorage.getItem("token") == null || localStorage.getItem("token") == "LOGOUT") {
            $state.go('login');
        }


        //Tweak --> To stop timer incase state changed while taking test
        $rootScope.$on('$stateChangeStart', 
        function(event, toState, toParams, fromState, fromParams){ 
            if(fromState.name == 'main.mycmc-acads.acads'){
                $interval.cancel($rootScope.examTimer);

            }
        })


        $scope.openPage = function(id) {

            switch (id) {
                case "EVENTS":
                    {
                        $state.go('main.mycmc-events.events');
                        break;
                    }
                case "ANNOUNCEMENTS":
                    {
                        $state.go('main.mycmc-announcements.announcements');
                        break;
                    }
                case "BLOGS":
                    {
                        $state.go('main.mycmc-blogs.blogs');
                        break;
                    }
                case "UNION":
                    {
                        $state.go('main.mycmc-union.union');
                        break;
                    }
                case "DIRECTORY":
                    {
                        $state.go('main.mycmc-directory.directory');
                        break;
                    }
                case "ACADS":
                    {
                        $state.go('main.mycmc-acads.acads');
                        break;
                    }
            }

        }

        $scope.goToFeed = function() {
            $state.go('tab.timeline');
        }

        $scope.getTheme = function(){
            var d = new Date();
            return 'theme'+d.getDay();
        }
    })




    .controller('AnnouncementsCtrl', ['$scope', '$http', '$rootScope', '$ionicPopup', '$state', '$ionicLoading', function($scope, $http, $rootScope, $ionicPopup, $state, $ionicLoading) {


        //NOT logged in case.
        if (localStorage.getItem("token") == null || localStorage.getItem("token") == "LOGOUT") {
            $state.go('login');
        }

        $scope.goToTiles = function() {
            $state.go('main.app.tiles')
        }


        $scope.getColor = function(code) {
            var token = code % 7;
            token++;
            return 'gradient' + token;
        }



        //FIRST LOAD

        $scope.renderFailed = false;
        $scope.isRenderLoaded = false;

        $ionicLoading.show({
            template: '<ion-spinner></ion-spinner>'
        });

        $http.get("http://cmcair.in/apis/announcements.php?value=0&user=" + localStorage.getItem("token"), {
                timeout: 10000
            })
            .success(function(response) {
                $scope.feedsList = response;
                $scope.left = 1;
                $ionicLoading.hide();
                $scope.renderFailed = false;
                $scope.isRenderLoaded = true;
            })
            .error(function(data) {
                $ionicLoading.hide();
                $ionicLoading.show({
                    template: "Not responding. Check your connection.",
                    duration: 3000
                });

                $scope.renderFailed = true;
                $scope.$broadcast('scroll.refreshComplete');

            });




            $scope.loadTableData = function(){
                //Load Table data.
                $http.get('http://cmcair.in/apis/table.php?id=101').then(function(items) {
                    $scope.tableList = items.data;

                    //Table Meta data.
                    $http.get('http://cmcair.in/apis/tableinfo.php?id=101').then(function(meta) {
                        $scope.tableMetaData = meta.data;
                    })

                    //Update Head
                    $http.get('http://cmcair.in/apis/notificationheadupdate.php?user=' + localStorage.getItem("token")).then(function(inn) {})
                    $rootScope.notificationCount = "";

                });
            }

            $scope.loadTableData();



            $scope.deleteAnnouncement = function(postID, index) {
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Delete Post',
                    template: 'Are you sure you want to delete this post?'
                });

                confirmPopup.then(function(res) {
                    if (res) {
                        $http.get("http://cmcair.in/apis/deleteannouncement.php?id=" + postID + "&user=" + localStorage.getItem("token"));
                        $scope.feedsList.splice(index, 1);
                        //document.getElementById('ann_'+postID).style.visibility = "hidden";
                    }
                });

            };




        $scope.feedsList = [];
        $scope.limiter = 1;


        //REFRESHER
        $scope.doRefresh = function() {

            $http.get("http://cmcair.in/apis/announcements.php?value=0&user=" + localStorage.getItem("token"), {
                    timeout: 10000
                })
                .success(function(response) {
                    $scope.feedsList = response;
                    $scope.left = 1;
                    $scope.limiter = 1;
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.renderFailed = false;
                    $scope.isRenderLoaded = true;
                })
                .error(function(data) {
                    $ionicLoading.show({
                        template: "Not responding. Check your connection.",
                        duration: 3000
                    });

                    $scope.$broadcast('scroll.refreshComplete');

                });

            $scope.loadTableData();  

        };



        //LOAD MORE
        $scope.loadMore = function() {
            $http.get("http://cmcair.in/apis/announcements.php?value=" + $scope.limiter + "&user=" + localStorage.getItem("token"), {
                    timeout: 10000
                })
                .success(function(items) {
                    if (items.length == 0) {
                        $scope.left = 0;
                    }
                    $scope.feedsList = $scope.feedsList.concat(items)
                    $scope.limiter++;
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                })
                .error(function(data) {
                    $ionicLoading.show({
                        template: "Not responding. Check your connection.",
                        duration: 3000
                    });

                    $scope.$broadcast('scroll.infiniteScrollComplete');

                });
        };

}])






    .controller('directoryCtrl', ['$scope', '$http', '$ionicLoading', '$state', function($scope, $http, $ionicLoading, $state) {

        

        //NOT logged in case.
        if (localStorage.getItem("token") == null || localStorage.getItem("token") == "LOGOUT") {
            $state.go('login');
        }

        $scope.goToTiles = function() {
            $state.go('main.app.tiles')
        }

        $scope.isViewingExpanded = false;

        $scope.directoryData = [];
        $scope.searchData = [];

        //FIRST LOAD
        $scope.renderFailed = false;
        $scope.isRenderLoaded = false;

        if (localStorage.getItem("directorySavedData") != null && localStorage.getItem("directorySavedData") != "") {
                
                $scope.directoryData = localStorage.getItem("directorySavedData") ? JSON.parse(localStorage.getItem("directorySavedData")) : [];

                var n = 0;
                var m = 0;

                while($scope.directoryData[n]){ //Main Level
                    if($scope.directoryData[n].hasSubCategories){ //Sub Level
                        m = 0;
                        while($scope.directoryData[n].content[m]){
                            $scope.searchData = $scope.searchData.concat($scope.directoryData[n].content[m].content);
                            m++;
                        }
                    }
                    else{
                        $scope.searchData = $scope.searchData.concat($scope.directoryData[n].content);
                    }

                    n++;   
                }

                $ionicLoading.hide();
                $scope.renderFailed = false;
                $scope.isRenderLoaded = true;            
        }
        else{
            loadDirectoryInit();
        }

        function loadDirectoryInit(){
            $ionicLoading.show({
                template: '<ion-spinner></ion-spinner>'
            });

            $http.get("http://cmcair.in/apis/directory.php", {
                timeout: 10000
            })
            .success(function(response) {
                $scope.directoryData = response;

                var n = 0;
                var m = 0;

                while($scope.directoryData[n]){ //Main Level
                    if($scope.directoryData[n].hasSubCategories){ //Sub Level
                        m = 0;
                        while($scope.directoryData[n].content[m]){
                            $scope.searchData = $scope.searchData.concat($scope.directoryData[n].content[m].content);
                            m++;
                        }
                    }
                    else{
                        $scope.searchData = $scope.searchData.concat($scope.directoryData[n].content);
                    }

                    n++;   
                }


                localStorage.setItem("directorySavedData", JSON.stringify($scope.directoryData));

                $ionicLoading.hide();
                $scope.renderFailed = false;
                $scope.isRenderLoaded = true;
            })
            .error(function(data) {
                $ionicLoading.hide();
                $ionicLoading.show({
                    template: "Not responding. Check your connection.",
                    duration: 3000
                });

                $scope.renderFailed = true;
                $scope.$broadcast('scroll.refreshComplete');

            });
        }
        

        //REFRESHER
        $scope.doRefresh = function() {

            $http.get("http://cmcair.in/apis/directory.php", {
                    timeout: 10000
                })
                .success(function(response) {
                    $scope.directoryData = response;
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.renderFailed = false;
                    $scope.isRenderLoaded = true;

                    localStorage.setItem("directorySavedData", JSON.stringify($scope.directoryData));
                })
                .error(function(data) {
                    $ionicLoading.show({
                        template: "Not responding. Check your connection.",
                        duration: 3000
                    });

                    $scope.$broadcast('scroll.refreshComplete');

                });


        };




        //SEARCH
        $scope.isSearchEnabled = false;
        $scope.searchID = '';

        $scope.searchDirectory = function(search_key){
            if(search_key != ''){
                $scope.isSearchEnabled = true;
            }
            else{
                $scope.isSearchEnabled = false;
            }
        }




        $scope.expandCategory = function(hasSubCategories, content){

            $scope.isViewingExpanded = true;
            $scope.expandHasSubCategories = hasSubCategories;
            $scope.expandContent = content;

            $scope.isSearchEnabled = false; //To be safe.
        }

        $scope.cancelExpandView = function(){
            $scope.isViewingExpanded = false;
        }



    }])

    .controller('unionCtrl', ['$scope', '$http', '$ionicLoading', '$state', function($scope, $http, $ionicLoading, $state) {

        //NOT logged in case.
        if (localStorage.getItem("token") == null || localStorage.getItem("token") == "LOGOUT") {
            $state.go('login');
        }


        $scope.goToTiles = function() {
            $state.go('main.app.tiles')
        }


        //FIRST LOAD
        $scope.renderFailed = false;
        $scope.isRenderLoaded = false;

        $ionicLoading.show({
            template: '<ion-spinner></ion-spinner>'
        });

        $http.get("http://cmcair.in/apis/secretaries.php", {
                timeout: 10000
            })
            .success(function(response) {
                $scope.userlist = response;

                $ionicLoading.hide();
                $scope.renderFailed = false;
                $scope.isRenderLoaded = true;
            })
            .error(function(data) {
                $ionicLoading.hide();
                $ionicLoading.show({
                    template: "Not responding. Check your connection.",
                    duration: 3000
                });

                $scope.renderFailed = true;
                $scope.$broadcast('scroll.refreshComplete');

            });


        $http.get("http://cmcair.in/apis/heads.php", {
                timeout: 10000
            })
            .success(function(response) {
                $scope.headlist = response;
            })
            .error(function(data) {

            });

        //REFRESHER
        $scope.doRefresh = function() {

            $http.get("http://cmcair.in/apis/secretaries.php", {
                    timeout: 10000
                })
                .success(function(response) {
                    $scope.userlist = response;
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.renderFailed = false;
                    $scope.isRenderLoaded = true;
                })
                .error(function(data) {
                    $ionicLoading.show({
                        template: "Not responding. Check your connection.",
                        duration: 3000
                    });

                    $scope.$broadcast('scroll.refreshComplete');

                });
        
                
                $http.get("http://cmcair.in/apis/heads.php", {
                        timeout: 10000
                    })
                    .success(function(response) {
                        $scope.headlist = response;
                        $scope.$broadcast('scroll.refreshComplete');
                    })
                    .error(function(data) {
                        $scope.$broadcast('scroll.refreshComplete');
                    });

        };




    }])




    .controller('InfinitySectretaryCtrl', ['$scope', '$http', function($scope, $http) {


        $http.get("http://cmcair.in/apis/secretaries.php").then(function(response) {
            $scope.userlist = response.data;
        });
    }])


    

    .controller('InfinityHeadCtrl', ['$scope', '$http', function($scope, $http) {

        $http.get("http://cmcair.in/apis/heads.php").then(function(response) {
            $scope.userlist = response.data;
        });
    }])

    .controller('InfinityEmergencyCtrl', ['$scope', '$http', function($scope, $http) {

        $http.get("http://cmcair.in/apis/emergency_contacts.php").then(function(response) {
            $scope.userlist = response.data;
        });
    }])


    .controller('InfinityShopCtrl', ['$scope', '$http', function($scope, $http) {

        $http.get("http://cmcair.in/apis/shops.php").then(function(response) {
            $scope.userlist = response.data;
        });
    }])

    .controller('InfinityServiceCtrl', ['$scope', '$http', function($scope, $http) {

        $http.get("http://cmcair.in/apis/services.php").then(function(response) {
            $scope.userlist = response.data;
        });
    }])



    .controller('EventsCtrl', ['$ionicScrollDelegate', '$scope', '$http', '$ionicPopup', '$state', '$ionicLoading', function($ionicScrollDelegate, $scope, $http, $ionicPopup, $state, $ionicLoading) {

        //NOT logged in case.
        if (localStorage.getItem("token") == null || localStorage.getItem("token") == "LOGOUT") {
            $state.go('login');
        }


        $scope.goToTiles = function() {
            $state.go('main.app.tiles')
        }

        if (localStorage.getItem("postAdminFlag") == 1) {
            $scope.adminFlag = true;
        } else {
            $scope.adminFlag = false;
        }


        //FIRST LOAD

        $scope.renderFailed = false;
        $scope.isRenderLoaded = false;

        $ionicLoading.show({
            template: '<ion-spinner></ion-spinner>'
        });

        $http.get("http://cmcair.in/apis/events.php?value=0", {
                timeout: 10000
            })
            .success(function(response) {
                $scope.feedsList = response;
                $scope.left = 1;
                $ionicLoading.hide();
                $scope.renderFailed = false;
                $scope.isRenderLoaded = true;
            })
            .error(function(data) {
                $ionicLoading.hide();
                $ionicLoading.show({
                    template: "Not responding. Check your connection.",
                    duration: 3000
                });

                $scope.renderFailed = true;
                $scope.$broadcast('scroll.refreshComplete');

            });



        $scope.feedsList = [];
        $scope.limiter = 1;




        //REFRESHER

        $scope.doRefresh = function() {

            $http.get("http://cmcair.in/apis/events.php?value=0", {
                    timeout: 10000
                })
                .success(function(response) {
                    $scope.feedsList = response;
                    $scope.left = 1;
                    $scope.limiter = 1;
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.renderFailed = false;
                    $scope.isRenderLoaded = true;
                })
                .error(function(data) {
                    $ionicLoading.show({
                        template: "Not responding. Check your connection.",
                        duration: 3000
                    });

                    $scope.$broadcast('scroll.refreshComplete');

                });

        };



        $scope.deleteEvent = function(eventID, index) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Delete Event',
                template: 'Are you sure you want to delete this event?'
            });

            confirmPopup.then(function(res) {
                if (res) {
                    $http.get("http://cmcair.in/apis/deleteevent.php?id=" + eventID);
                    $scope.feedsList.splice(index, 1);
                }
            });
        };



        $scope.loadMore = function() {
            $http.get('http://cmcair.in/apis/events.php?value=' + $scope.limiter, {
                    timeout: 10000
                })
                .success(function(items) {
                    if (items.length == 0) {
                        $scope.left = 0;
                    }
                    $scope.feedsList = $scope.feedsList.concat(items)
                    $scope.limiter++;
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                })
                .error(function(data) {
                    $ionicLoading.show({
                        template: "Not responding. Check your connection.",
                        duration: 3000
                    });

                    $scope.$broadcast('scroll.infiniteScrollComplete');

                });
        };


    }])





    .controller('AcadsCtrl', ['$cordovaFileTransfer', '$rootScope', '$timeout', '$interval', '$scope', '$http', '$ionicPopup', '$state', '$ionicLoading', function($cordovaFileTransfer, $rootScope, $timeout, $interval, $scope, $http, $ionicPopup, $state, $ionicLoading) {


        $scope.goToTiles = function() {
            $state.go('main.app.tiles')
        }

        //NOT logged in case.
        if (localStorage.getItem("token") == null || localStorage.getItem("token") == "LOGOUT") {
            $state.go('login');
        }


        //FIRST LOAD

        $scope.renderFailed = false;
        $scope.isRenderLoaded = false;

        $ionicLoading.show({
            template: '<ion-spinner></ion-spinner>'
        });



        $http.get("http://cmcair.in/apis/acads.php?value=0&user="+localStorage.getItem("token"), {
                timeout: 10000
            })
            .success(function(response) {
                $scope.feedsList = response;
                $scope.left = 1;
                $ionicLoading.hide();
                $scope.renderFailed = false;
                $scope.isRenderLoaded = true;

            })
            .error(function(data) {
                $ionicLoading.hide();
                $ionicLoading.show({
                    template: "Not responding. Check your connection.",
                    duration: 3000
                });

                $scope.renderFailed = true;
                $scope.$broadcast('scroll.refreshComplete');

            });



        $scope.feedsList = [];
        $scope.limiter = 5;


        //Leader Board data
        $scope.leadersData = [];
        $scope.leadersDataLoaded = false;

        $scope.loadLeaderBoard = function(){
        
            $http.get("http://cmcair.in/apis/testtoppers.php?value=0&user="+localStorage.getItem("token"), {
                timeout: 10000
            })
            .success(function(response) {

                if(response.status){
                    $scope.leadersData = response;
                    $scope.leadersDataLoaded = true;
                }
            })
            .error(function(data) {

            });
        }

        $scope.loadLeaderBoard();


        //REFRESHER

        $scope.doRefresh = function() {

            $http.get("http://cmcair.in/apis/acads.php?value=0&user="+localStorage.getItem("token"), {
                    timeout: 10000
                })
                .success(function(response) {
                    $scope.feedsList = response;
                    $scope.left = 1;
                    $scope.limiter = 5;
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.renderFailed = false;
                    $scope.isRenderLoaded = true;
                })
                .error(function(data) {
                    $ionicLoading.show({
                        template: "Not responding. Check your connection.",
                        duration: 3000
                    });

                    $scope.$broadcast('scroll.refreshComplete');

                });

            $scope.loadLeaderBoard();
        };



        $scope.loadMore = function() {
            $http.get('http://cmcair.in/apis/acads.php?value=' + $scope.limiter+"&user="+localStorage.getItem("token"), {
                    timeout: 10000
                })
                .success(function(items) {
                    if (items.length == 0) {
                        $scope.left = 0;
                    }
                    $scope.feedsList = $scope.feedsList.concat(items)
                    $scope.limiter = $scope.limiter + 5;
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                })
                .error(function(data) {
                    $ionicLoading.show({
                        template: "Not responding. Check your connection.",
                        duration: 3000
                    });

                    $scope.$broadcast('scroll.infiniteScrollComplete');

                });
        };


/* Celebrations Confeti */

 var COLORS, Confetti, NUM_CONFETTI, PI_2, canvas, confetti, context, drawCircle, drawCircle2, drawCircle3, i, range, xpos;
 NUM_CONFETTI = 40;
 COLORS = [
   [235, 90, 70],
   [97, 189, 79],
   [242, 214, 0],
   [0, 121, 191],
   [195, 119, 224]
 ];
 PI_2 = 2 * Math.PI;
 canvas = document.getElementById("confeti");
 context = canvas.getContext("2d");
 window.w = 0;
 window.h = 0;
 window.resizeWindow = function() {
   window.w = canvas.width = window.innerWidth;
   return window.h = canvas.height = window.innerHeight
 };
 window.addEventListener("resize", resizeWindow, !1);
 window.onload = function() {
   return setTimeout(resizeWindow, 0)
 };
 range = function(a, b) {
   return (b - a) * Math.random() + a
 };
 drawCircle = function(a, b, c, d) {
   context.beginPath();
   context.moveTo(a, b);
   context.bezierCurveTo(a - 17, b + 14, a + 13, b + 5, a - 5, b + 22);
   context.lineWidth = 2;
   context.strokeStyle = d;
   return context.stroke()
 };
 drawCircle2 = function(a, b, c, d) {
   context.beginPath();
   context.moveTo(a, b);
   context.lineTo(a + 6, b + 9);
   context.lineTo(a + 12, b);
   context.lineTo(a + 6, b - 9);
   context.closePath();
   context.fillStyle = d;
   return context.fill()
 };
 drawCircle3 = function(a, b, c, d) {
   context.beginPath();
   context.moveTo(a, b);
   context.lineTo(a + 5, b + 5);
   context.lineTo(a + 10, b);
   context.lineTo(a + 5, b - 5);
   context.closePath();
   context.fillStyle = d;
   return context.fill()
 };
 xpos = 0.9;
 document.onmousemove = function(a) {
   return xpos = a.pageX / w
 };
 window.requestAnimationFrame = function() {
   return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(a) {
     return window.setTimeout(a, 5)
   }
 }();
 Confetti = function() {
   function a() {
     this.style = COLORS[~~range(0, 5)];
     this.rgb = "rgba(" + this.style[0] + "," + this.style[1] + "," + this.style[2];
     this.r = ~~range(2, 6);
     this.r2 = 2 * this.r;
     this.replace()
   }
   a.prototype.replace = function() {
     this.opacity = 0;
     this.dop = 0.03 * range(1, 4);
     this.x = range(-this.r2, w - this.r2);
     this.y = range(-20, h - this.r2);
     this.xmax = w - this.r;
     this.ymax = h - this.r;
     this.vx = range(0, 2) + 8 * xpos - 5;
     return this.vy = 0.7 * this.r + range(-1, 1)
   };
   a.prototype.draw = function() {
     var a;
     this.x += this.vx;
     this.y += this.vy;
     this.opacity +=
       this.dop;
     1 < this.opacity && (this.opacity = 1, this.dop *= -1);
     (0 > this.opacity || this.y > this.ymax) && this.replace();
     if (!(0 < (a = this.x) && a < this.xmax)) this.x = (this.x + this.xmax) % this.xmax;
     drawCircle(~~this.x, ~~this.y, this.r, this.rgb + "," + this.opacity + ")");
     drawCircle3(0.5 * ~~this.x, ~~this.y, this.r, this.rgb + "," + this.opacity + ")");
     return drawCircle2(1.5 * ~~this.x, 1.5 * ~~this.y, this.r, this.rgb + "," + this.opacity + ")")
   };
   return a
 }();
 confetti = function() {
   var a, b, c;
   c = [];
   i = a = 1;
   for (b = NUM_CONFETTI; 1 <= b ? a <= b : a >= b; i = 1 <= b ? ++a : --a) c.push(new Confetti);
   return c
 }();
 window.step = function() {
   var a, b, c, d;
   requestAnimationFrame(step);
   context.clearRect(0, 0, w, h);
   d = [];
   b = 0;
   for (c = confetti.length; b < c; b++) a = confetti[b], d.push(a.draw());
   return d
 };
 step();;


    $scope.secondsToHms = function(d) {
        d = Number(d);

        var h = Math.floor(d / 3600);
        var m = Math.floor(d % 3600 / 60);
        var s = Math.floor(d % 3600 % 60);

        if(h == 0){
            return ('0' + m).slice(-2) + ":" + ('0' + s).slice(-2);
        }
        else{
            return ('0' + h).slice(-2) + ":" + ('0' + m).slice(-2) + ":" + ('0' + s).slice(-2);
        }

        
    }

    $rootScope.examTimer;

    $scope.isTakingTest = false;
    $scope.isTestCompleted = false;

    $scope.startTest = function(exam){


        $ionicLoading.show({
            template: '<ion-spinner></ion-spinner>'
        });

        $http.get("http://cmcair.in/apis/getexam.php?code="+exam.code, {
                timeout: 10000
            })
            .success(function(response) {

                $ionicLoading.hide();

                if(response.status){
                    $scope.testData = response;
                   

                    //Make request to sever
                    var testMeta = {};
                    testMeta.testCode = $scope.testData.testCode;
                    testMeta.user = localStorage.getItem("token");

                    $ionicLoading.show({
                        template: "<ion-spinner></ion-spinner>"
                    });  


                    $http({
                        method: 'POST',
                        url: 'http://cmcair.in/apis/initializetest.php',
                        data: testMeta, //forms user object
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        timeout: 10000
                    })
                    .success(function(data) {
                        $ionicLoading.hide();

                        if(data.status){

                            if(data.isAttempted){
                                $ionicLoading.show({
                                    template: "<ion-spinner></ion-spinner><br><tag style='font-size: 21px; font-weight: bold'>Re-Attempting Test</tag><br>Your already recored Score won't change!",
                                    duration: 3000
                                });
                            }
                            else{
                                $ionicLoading.show({
                                    template: "<ion-spinner></ion-spinner><br><tag style='font-size: 21px; font-weight: bold'>Brace Yourself!</tag><br>The Test is about to Start!",
                                    duration: 3000
                                });    
                            }

                             

                            $timeout( function(){
                                $scope.initializeTest();
                            }, 3000 );
                        }
                        else{
                            $ionicLoading.show({
                                template: data.error,
                                duration: 3000
                            });  
                        }

                    })
                    .error(function(data) {
                        $ionicLoading.hide();
                        $ionicLoading.show({
                            template: "Unable to load the test. Try again.",
                            duration: 3000
                        });  
                    });




                }
                else{
                   $ionicLoading.show({
                        template: response.error, 
                        duration: 3000
                    });    
                }    
            })
            .error(function(data) {
                $ionicLoading.hide();
                $ionicLoading.show({
                    template: "Not responding. Check your connection.",
                    duration: 3000
                });

                $scope.$broadcast('scroll.refreshComplete');

            });
    }


    $scope.initializeTest = function(){

        $scope.isTakingTest = true; 
        $scope.isTestCompleted = false;
        $scope.markingAccepted = true;
        $scope.timeLeftCounterDisplay = 'Starting Test';

        $scope.timeLeftCounter = $scope.testData.duration;
        $scope.responseList = []; // <-- Initialize with 0's equivalent to number of questions

        var n = 0;
        while(n < $scope.testData.numberOfQuestions){
            $scope.responseList.push(0);
            n++;
        }



        $rootScope.examTimer = $interval(function () {
                $scope.timeLeftCounterDisplay = 'Complete Test in '+ $scope.secondsToHms($scope.timeLeftCounter);
                $scope.timeLeftCounter--;
                if($scope.timeLeftCounter == -1){
                    $interval.cancel($rootScope.examTimer);

                    $scope.markingAccepted = false;
                    $scope.timeLeftCounterDisplay = 'Time Over! Submit Responses.';

                    //$scope.preSubmit();
                }
            }, 1000);   
    }


    $scope.preSubmit = function(){

                $ionicLoading.show({
                    template: "<ion-spinner></ion-spinner><br><tag style='font-size: 21px; font-weight: bold'>Time Over!</tag><br>Submitting your Responses...",
                    duration: 3000
                });  

                $timeout( function(){
                    if($scope.respondedQuestions == 0)
                    {

                    }
                    else{
                        $scope.submitAnswers();
                    }
                }, 3000 );

    }

    $scope.submitAnswers = function(){

        $interval.cancel($rootScope.examTimer);

        document.getElementById("confeti").style.display = 'none';



                    //Evaluate Answers
                    var testMeta = {};
                    testMeta.testCode = $scope.testData.testCode;
                    testMeta.user = localStorage.getItem("token");
                    testMeta.responses = $scope.responseList.toString();

                    $ionicLoading.show({
                        template: "<ion-spinner></ion-spinner>"
                    });  


                    $http({
                        method: 'POST',
                        url: 'http://cmcair.in/apis/evaluatetest.php',
                        data: testMeta, //forms user object
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        timeout: 10000
                    })
                    .success(function(data) {
                        $ionicLoading.hide();

                        if(data.status){
                            $scope.processAnswers(data.answers);
                        }
                        else{
                            $ionicLoading.show({
                                template: data.error,
                                duration: 3000
                            });  
                        }

                    })
                    .error(function(data) {
                        $ionicLoading.hide();
                        $ionicLoading.show({
                            template: "Failed to save your responses. Try again.",
                            duration: 3000
                        });  
                    });
    }

    $scope.processAnswers = function(answerObj){

        $scope.answerData = answerObj;

        $scope.totalQuestions = $scope.answerData.length;
        $scope.respondedQuestions = 0;
        $scope.correctlyAnswered = 0;

        var n = 0;
        for(n=0; n < $scope.answerData.length; n++){
            if($scope.responseList[$scope.answerData[n].id - 1] == 0){
                //Skip --> Not answered
                document.getElementById("question_head_"+$scope.answerData[n].id).style.background = 'rgb(139, 146, 148)'; 
                document.getElementById("ques_"+$scope.answerData[n].id+"_opt_"+$scope.answerData[n].answer).classList.add("acadTestBubbledGreen");
            }
            else{
                $scope.respondedQuestions++;

                if($scope.responseList[$scope.answerData[n].id - 1] == $scope.answerData[n].answer){
                    //Correct Answer
                    console.log($scope.answerData[n].id + ' is CORRECT');
                    document.getElementById("question_head_"+$scope.answerData[n].id).style.background = '#23a955';  
                    document.getElementById("ques_"+$scope.answerData[n].id+"_opt_"+$scope.responseList[$scope.answerData[n].id - 1]).classList.add("acadTestBubbledGreen");
                
                    $scope.correctlyAnswered++;
                }
                else{
                    console.log($scope.answerData[n].id + ' is FALSE');  
                    document.getElementById("question_head_"+$scope.answerData[n].id).style.background = '#d60b35';    
                    document.getElementById("ques_"+$scope.answerData[n].id+"_opt_"+$scope.responseList[$scope.answerData[n].id - 1]).classList.add("acadTestBubbledRed");
                    document.getElementById("ques_"+$scope.answerData[n].id+"_opt_"+$scope.answerData[n].answer).classList.add("acadTestBubbledGreen");
                }
            }
        }

        //Show Results
        if($scope.respondedQuestions == 0){
            //No questions answered
            $scope.resultSmiley = './img/smileys/smiley_sad.png';
            $scope.resultMessage = 'Oops! No questions answered.';
            $scope.resultColor = 'acadResultNegative';
            $scope.resultRound = 'resultRed';
        }
        else if($scope.totalQuestions == $scope.correctlyAnswered){
            //ALL ANSWERED CORRECTLY
            $scope.resultSmiley = './img/smileys/smiley_awesome.png';
            $scope.resultMessage = 'Excellent!';
            $scope.resultColor = 'acadResultPositive';
            $scope.resultRound = 'resultGreen';

            document.getElementById("confeti").style.display = 'block';
        }
        else if($scope.respondedQuestions == $scope.correctlyAnswered){ //ALL ANSWERED ARE CORRECT
            if($scope.respondedQuestions/$scope.totalQuestions < 0.6){ //VERY FEW ANSWERED
                $scope.resultSmiley = './img/smileys/smiley_smile.png';
                $scope.resultMessage = 'Good Accuracy. Attempt more questions.';
                $scope.resultColor = 'acadResultPositive';
                $scope.resultRound = 'resultGreen';
            }
            else{
                $scope.resultSmiley = './img/smileys/smiley_love.png';
                $scope.resultMessage = 'Great Going!';
                $scope.resultColor = 'acadResultPositive';
                $scope.resultRound = 'resultGreen';
            }
        }
        else if($scope.respondedQuestions != $scope.correctlyAnswered){ //SOME ARE NOT CORRECT
            var accuracy = $scope.correctlyAnswered/$scope.respondedQuestions;
            if(accuracy >= 0.9 ){ //VERY FEW INCORRECT
                $scope.resultSmiley = './img/smileys/smiley_love.png';
                $scope.resultMessage = 'Great Going!';
                $scope.resultColor = 'acadResultPositive';
                $scope.resultRound = 'resultGreen';
            }
            else if(accuracy >= 0.5){ //VERY FEW INCORRECT
                $scope.resultSmiley = './img/smileys/smiley_smile.png';
                $scope.resultMessage = 'Good Job';
                $scope.resultColor = 'acadResultPositive';
                $scope.resultRound = 'resultGreen';
            }
            else if(accuracy > 0.2){ //VERY FEW INCORRECT
                $scope.resultSmiley = './img/smileys/smiley_sad.png';
                $scope.resultMessage = 'Less Accuracy';
                $scope.resultColor = 'acadResultNegative';
                $scope.resultRound = 'resultRed';
            }
            else if(accuracy <= 0.2){ //ALMOST ALL INCORRECT
                $scope.resultSmiley = './img/smileys/smiley_cry.png';
                $scope.resultMessage = 'That\'s Sad!';
                $scope.resultColor = 'acadResultSad';
                $scope.resultRound = 'resultRed';
            }
        }

        $scope.isTestCompleted = true;


        document.getElementById("resultPopup").style.display = 'block';        
    }




    $scope.goProceed = function(){
        document.getElementById("resultPopup").style.display = 'none';
    }


    $scope.testDone = function(){
        $scope.isTakingTest = false;
        $scope.isTestCompleted = false; 
        $ionicScrollDelegate.scrollTop();      
    }


        

        $scope.getBubbleClass = function(id, choice){
            var n = 0;
            for(n = 0; n < $scope.responseList.length; n++){

                if(id == n+1 && $scope.responseList[n] == choice){
                    return 'acadTestBubbled';
                    break;
                }

                if(n == $scope.responseList.length - 1){ //last iteration and not found!
                    return 'acadTestNotBubbled';
                }
            }


        }

        $scope.markChoice = function(questionId, choice){

            if(!$scope.markingAccepted){
                return '';
            }

            //remove selection if already exists
            if($scope.responseList[questionId-1] != 0){
                document.getElementById("ques_"+questionId+"_opt_"+$scope.responseList[questionId-1]).classList.remove("acadTestBubbled");
                
                if($scope.responseList[questionId-1] == choice){ //Selecting same choice --> UNSELECT
                    $scope.responseList[questionId-1] = 0;
                    return '';
                }
            }

            var n = 0;
            for(n = 0; n < $scope.responseList.length; n++){
                if(questionId == n+1){
                    $scope.responseList[n] = choice;
                    break;
                }
            } 
            
            document.getElementById("ques_"+questionId+"_opt_"+choice).classList.add("acadTestBubbled");   
        

        }


        //Download References
          $scope.downloadReference = function (url) {

                ionic.Platform.ready(function(){
                    var hostUrl = encodeURI(url);
                    //var ref = cordova.InAppBrowser.open(hostUrl, '_system', 'location=yes');
                    window.open(hostUrl, "_system", "toolbar=yes");
                    return false;
                });
          }



    }])


    .controller('BlogsCtrl', ['$ionicScrollDelegate', '$scope', '$http', '$ionicPopup', '$state', '$ionicLoading', function($ionicScrollDelegate, $scope, $http, $ionicPopup, $state, $ionicLoading) {


        //NOT logged in case.
        if (localStorage.getItem("token") == null || localStorage.getItem("token") == "LOGOUT") {
            $state.go('login');
        }

        $scope.goToTiles = function() {
            $state.go('main.app.tiles')
        }

        
        if (localStorage.getItem("postAdminFlag") == 1) {
            $scope.adminFlag = true;
        } else {
            $scope.adminFlag = false;
        }



        $scope.getRandomTitleColor = function(code) {
            var token = code % 7;
            token++;
            return 'gradient' + token;
        }



        $scope.isViewing = false;
        $scope.viewBlog = function(content){

            $scope.firstTimeLoad = false;

            $scope.isViewing = true;
            $scope.viewContent = content;

            $ionicScrollDelegate.scrollTop();

                var myData = {};
                myData.id = content.blogID;

                $ionicLoading.show({ template: '<ion-spinner></ion-spinner>' });

                    $http({
                        method: 'POST',
                        url: 'http://cmcair.in/apis/updateblogviews.php',
                        data: myData, //forms user object
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        timeout: 10000
                    })
                    .success(function(data) {
                        $ionicLoading.hide();
                    })
                    .error(function(data) {
                        $ionicLoading.hide();
                    });

        }

        $scope.cancelViewBlog = function(){
            $scope.isViewing = false;
            $scope.doRefresh();
            $scope.firstTimeLoad = false;
        }


        $scope.getBlogBackground = function(){
            if($scope.isViewing){
                return {"background" : "#FFF"}
            }
            else{
                return {"background" : "#ecf0f1"}
            }
        }





        //FIRST LOAD

        $scope.renderFailed = false;
        $scope.isRenderLoaded = false;

        $scope.firstTimeLoad = true;  //<<<< To display contact editor banner on top.   

        $ionicLoading.show({
            template: '<ion-spinner></ion-spinner>'
        });

        $http.get("http://cmcair.in/apis/blogs.php?value=0", {
                timeout: 10000
            })
            .success(function(response) {
                $scope.feedsList = response;
                $scope.left = 1;
                $ionicLoading.hide();
                $scope.renderFailed = false;
                $scope.isRenderLoaded = true;
            })
            .error(function(data) {
                $ionicLoading.hide();
                $ionicLoading.show({
                    template: "Not responding. Check your connection.",
                    duration: 10000
                });

                $scope.renderFailed = true;
                $scope.$broadcast('scroll.refreshComplete');

            });



        $scope.feedsList = [];
        $scope.limiter = 1;




        //REFRESHER

        $scope.doRefresh = function() {

            $scope.firstTimeLoad = false;

            $http.get("http://cmcair.in/apis/blogs.php?value=0", {
                    timeout: 10000
                })
                .success(function(response) {
                    $scope.feedsList = response;
                    $scope.left = 1;
                    $scope.limiter = 1;
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.renderFailed = false;
                    $scope.isRenderLoaded = true;
                })
                .error(function(data) {
                    $ionicLoading.show({
                        template: "Not responding. Check your connection.",
                        duration: 3000
                    });

                    $scope.$broadcast('scroll.refreshComplete');

                });

        };


        $scope.loadMore = function() {

            $scope.firstTimeLoad = false;

            $http.get('http://cmcair.in/apis/blogs.php?value=' + $scope.limiter, {
                    timeout: 10000
                })
                .success(function(items) {
                    if (items.length == 0) {
                        $scope.left = 0;
                    }
                    $scope.feedsList = $scope.feedsList.concat(items)
                    $scope.limiter++;
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                })
                .error(function(data) {
                    $ionicLoading.show({
                        template: "Not responding. Check your connection.",
                        duration: 3000
                    });

                    $scope.$broadcast('scroll.infiniteScrollComplete');

                });
        };


    }])


    .controller('SettingsCtrl', ['$scope', '$http', '$rootScope', '$interval', '$state', function($scope, $http, $rootScope, $interval, $state) {


        //NOT logged in case.
        if (localStorage.getItem("token") == null || localStorage.getItem("token") == "LOGOUT") {
            $state.go('login');
        }


        //Tweak --> To stop timer incase state changed while taking test
        $rootScope.$on('$stateChangeStart', 
        function(event, toState, toParams, fromState, fromParams){ 
            if(fromState.name == 'main.mycmc-acads.acads'){
                $interval.cancel($rootScope.examTimer);

            }
        })


        if (localStorage.getItem("postFlag") == 1) {
            $scope.flag = true;
        } else {
            $scope.flag = false;
        }
        if (localStorage.getItem("postAdminFlag") == 1) {
            $scope.adminFlag = true;
        } else {
            $scope.adminFlag = false;
        }

        $scope.checkStatus = function(){
            if(!$scope.flag){
                $http.get("http://cmcair.in/apis/checkflag.php?user=" + localStorage.getItem("token")).then(function(response) {
                    if(response.data.status){
                        localStorage.setItem("postFlag", 1);
                        $scope.flag = true;
                    }

                    $scope.$broadcast('scroll.refreshComplete');
                });            
            }   
            else{
                $scope.$broadcast('scroll.refreshComplete');
            }
        }

        $scope.checkStatus();

        $scope.user_mob = localStorage.getItem("token");

        $http.get("http://cmcair.in/apis/userinfo.php?user=" + $scope.user_mob).then(function(response) {
            $scope.userdata = response.data;
        });

        //Log Out
        $scope.logoutMe = function() {
            localStorage.setItem("token", "LOGOUT");
            localStorage.setItem("postFlag", "");
            localStorage.setItem("postAdminFlag", "");
            localStorage.setItem("notification", "");
            
            $state.go('login');
        };

        // NOTIFICATION CUSTOMISATION
        //  TUTORIAL - https://www.npmjs.com/package/cordova-plugin-fcm
        if (localStorage.getItem("notification") == 1) {
            $scope.notify = true;
        } else {
            $scope.notify = false;
        }
        $scope.pushNotificationChange = function() {
            if ($scope.notify) { //ON --> OFF
                console.log('Switching OFF');
                // FCMPlugin.unsubscribeFromTopic('campuswide');
                // FCMPlugin.subscribeToTopic('55');
            } else //OFF --> ON
            {
                console.log('Switching ON');
                // FCMPlugin.unsubscribeFromTopic('55');
                // FCMPlugin.subscribeToTopic('campuswide');
            }
        };

        $scope.pushNotification = {
            checked: $scope.notify
        };



    }])

    .controller('PostTimelineCtrl', ['$scope', '$http', '$state', '$cordovaImagePicker', '$cordovaFileTransfer', '$ionicLoading', function($scope, $http, $state, $cordovaImagePicker, $cordovaFileTransfer, $ionicLoading) {

        //NOT logged in case.
        if (localStorage.getItem("token") == null || localStorage.getItem("token") == "LOGOUT") {
            $state.go('login');
        }

        if (localStorage.getItem("postAdminFlag") == 1) {
            $scope.adminFlag = true;
        } else {
            $scope.adminFlag = false;
        }


        //Upload Images - Select the image first.
        $scope.isFotoAttached = false;
        $scope.imageURI = "";
        $scope.pickImageFromGallery = function() {
            var options = {
                maximumImagesCount: 1,
                width: 800,
                height: 800,
                quality: 90
            };

            $cordovaImagePicker.getPictures(options).then(function(results) {
                // Loop through acquired images
                for (var i = 0; i < results.length; i++) {
                    $scope.imageURI = results[i];
                    $scope.isFotoAttached = true;
                }

            }, function(error) {
                $scope.isFotoAttached = false;
                alert('Error: ' + JSON.stringify(error));
            });
        };


        $scope.goToAccount = function(){
            $state.go('tab.settings');
        }


        $scope.data = {};

        $scope.resetData = function(){
            $scope.data.title = '';
            $scope.data.content = '';
            $scope.isFotoAttached = false;
            $scope.errorFlag = 0;
            $scope.errorMsg = "";
        }

        $scope.resetData();

        $scope.data.userID = localStorage.getItem("token");
        $scope.errorFlag = 0;

        $scope.postTimeline = function() {
            if (!$scope.data.title) {
                $scope.errorFlag = 1;
                $scope.errorMsg = "Title can not be empty.";
            } else if (!$scope.data.content) {
                $scope.errorFlag = 1;
                $scope.errorMsg = "Content can not be empty.";
            } else if ($scope.data.title.length > 200) {
                $scope.errorFlag = 1;
                $scope.errorMsg = "Maximum Title length is 200 characters.";
            } else if ($scope.data.content.length > 2000) {
                $scope.errorFlag = 1;
                $scope.errorMsg = "Maximum Content length is 2000 characters.";
            } else { //Success Case - accept input.


                $ionicLoading.show({ template: '<ion-spinner></ion-spinner>' });

                $http({
                        method: 'POST',
                        url: 'http://cmcair.in/apis/posttimeline.php',
                        data: $scope.data, //forms user object
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        timeout: 10000
                    })
                    .success(function(data) {
                        $ionicLoading.hide();

                        console.log(data)


                        if (data.status) {

                            if ($scope.isFotoAttached) {
                                var server = "http://cmcair.in/apis/uploadimage.php";
                                var options = {};
                                options.fileName = data.code + ".jpg";
                                options.chunkedMode = false;

                                $cordovaFileTransfer.upload(server, $scope.imageURI, options)
                                    .then(function(result) {
                                        $ionicLoading.hide();
                                        $scope.resetData();
                                        $state.go('tab.timeline');
                                    }, function(err) {
                                        $ionicLoading.show({
                                            template: "Warning! Image was not uploaded. Upload only JPG Images.",
                                            duration: 3000
                                        });
                                    }, function(progress) {
                                        $ionicLoading.show({
                                            template: '<ion-spinner></ion-spinner>'
                                        });
                                    });
                            } else {
                                $scope.resetData();
                                $state.go('tab.timeline');
                            }

                        } else {
                            $ionicLoading.show({
                                template: "Failed. Something went wrong.",
                                duration: 3000
                            });
                        }
                    })
                    .error(function(data) {
                        $ionicLoading.hide();
                        $ionicLoading.show({
                            template: "Not responding. Check your connection.",
                            duration: 3000
                        });
                    });

            }
        }

    }])


    .controller('PostEventCtrl', ['$scope', '$http', '$state', '$ionicLoading', function($scope, $http, $state, $ionicLoading) {


        $scope.goToAccount = function(){
            $state.go('tab.settings');
        }

        //NOT logged in case.
        if (localStorage.getItem("token") == null || localStorage.getItem("token") == "LOGOUT") {
            $state.go('login');
        }

        $scope.data = {};


        $scope.resetData = function(){
            $scope.data.title = '';
            $scope.data.brief = '';
            $scope.data.time = '';
            $scope.data.venue = '';
            $scope.data.host = "College Union";

            $scope.errorFlag = 0;
            $scope.errorMsg = "";
        }

        $scope.resetData();


        $scope.data.userID = localStorage.getItem("token");
        $scope.errorFlag = 0;

        
        $scope.postEvent = function() {
            if (!$scope.data.title) {
                $scope.errorFlag = 1;
                $scope.errorMsg = "Title can not be empty.";
            } else if (!$scope.data.brief) {
                $scope.errorFlag = 1;
                $scope.errorMsg = "Brief can not be empty.";
            } else if (!$scope.data.time) {
                $scope.errorFlag = 1;
                $scope.errorMsg = "Time and Date can not be empty.";
            } else if (!$scope.data.venue) {
                $scope.errorFlag = 1;
                $scope.errorMsg = "Venue can not be empty.";
            } else if (!$scope.data.host) {
                $scope.errorFlag = 1;
                $scope.errorMsg = "Host can not be empty.";
            } else if ($scope.data.title.length > 200) {
                $scope.errorFlag = 1;
                $scope.errorMsg = "Maximum Title length is 200 characters.";
            } else if ($scope.data.brief.length > 2000) {
                $scope.errorFlag = 1;
                $scope.errorMsg = "Maximum Content length is 2000 characters.";
            } else { //Success Case - accept input.

                $ionicLoading.show({ template: '<ion-spinner></ion-spinner>' });

                $http({
                        method: 'POST',
                        url: 'http://cmcair.in/apis/postevent.php',
                        data: $scope.data, //forms user object
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        timeout: 10000
                    })
                    .success(function(data) {
                        $ionicLoading.hide();
                        if (data.status) {
                            $scope.resetData();
                            $state.go('main.mycmc-events.events');
                        } else {
                            $ionicLoading.show({
                                template: "Failed. Something went wrong.",
                                duration: 3000
                            });
                        }
                    })
                    .error(function(data) {
                        $ionicLoading.hide();
                        $ionicLoading.show({
                            template: "Not responding. Check your connection.",
                            duration: 3000
                        });
                    });
            }
        }

    }])


    .controller('PostAnnouncementCtrl', ['$scope', '$http', '$state', '$ionicLoading', function($scope, $http, $state, $ionicLoading) {
        
        //NOT logged in case.
        if (localStorage.getItem("token") == null || localStorage.getItem("token") == "LOGOUT") {
            $state.go('login');
        }

        $scope.goToAccount = function(){
            $state.go('tab.settings');
        }

        //Fetch meta data - all batches
        $http.get("http://cmcair.in/apis/getbatches.php")
            .then(function(response) {
                $scope.batchList = response.data;
            });



        $scope.data = {};


        $scope.resetData = function(){
            $scope.data.content = '';
            $scope.data.for = 0;
            $scope.errorFlag = 0;
            $scope.errorMsg = "";
        }

        $scope.resetData();


        $scope.data.userID = localStorage.getItem("token");
        $scope.errorFlag = 0;

        $scope.postAnnouncement = function() {
            if (!$scope.data.content) {
                $scope.errorFlag = 1;
                $scope.errorMsg = "Content can not be empty.";
            } else if (!$scope.data.for) {
                $scope.errorFlag = 1;
                $scope.errorMsg = "Please select audience.";
            } else if ($scope.data.content.length > 200) {
                $scope.errorFlag = 1;
                $scope.errorMsg = "Maximum Content length is 200 characters.";
            } else { //Success Case - accept input.

                $ionicLoading.show({ template: '<ion-spinner></ion-spinner>' });
                $http({
                        method: 'POST',
                        url: 'http://cmcair.in/apis/postannouncement.php',
                        data: $scope.data, //forms user object
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        timeout: 10000
                    })
                    .success(function(data) {
                        $ionicLoading.hide();
                        if (data.status) {
                            $scope.resetData();
                            $state.go('main.mycmc-announcements.announcements');
                        } else {
                            $ionicLoading.show({
                                template: "Failed. Something went wrong.",
                                duration: 3000
                            });
                        }
                    })
                    .error(function(data) {
                        $ionicLoading.hide();
                        $ionicLoading.show({
                            template: "Not responding. Check your connection.",
                            duration: 3000
                        });
                    });
            }
        }
    }])

    .controller('tabNotificationCtrl', ['$scope', '$http', '$rootScope', function($scope, $http, $rootScope) {
        $http.get("http://cmcair.in/apis/notificationcount.php?user=" + localStorage.getItem("token"))
            .then(function(response) {
                $rootScope.notificationCount = response.data.count;
                if ($rootScope.notificationCount == 0) {
                    $rootScope.notificationCount = "";
                }
            });

    }])

    .controller('LoginCtrl', ['$ionicModal', '$scope', '$state', '$http', '$ionicPopup', '$ionicLoading', function($ionicModal, $scope, $state, $http, $ionicPopup, $ionicLoading) {

        $ionicLoading.show({
            template: '<ion-spinner></ion-spinner>'
        });

        //Already logged in case.
        if (localStorage.getItem("token") != null && localStorage.getItem("token") != "LOGOUT") {
            $ionicLoading.hide();
            $state.go('tab.timeline')
        } else {
            $ionicLoading.hide();

            $scope.login = function(mobile) {

                //By default, do not show any error message.
                $scope.errorFlag = 0;


                if (/^\d{10}$/.test(mobile)) {
                    //Valid Mobile Number. Send OTP and verify it.

                    $scope.otp_original = {};


                    $ionicLoading.show({
                        template: '<ion-spinner></ion-spinner>'
                    });

                    $http.get('http://cmcair.in/apis/useractivate.php?mobile=' + mobile, {
                            timeout: 10000
                        })
                        .success(function(response) {
                            $ionicLoading.hide();

                            $scope.validity = response.valid;


                            if ($scope.validity) { //Valid, Registered User.


                                $scope.otp_original = response.code;
                                if (response.postFlag) {
                                    $scope.userPostAccess = 1;
                                } else {
                                    $scope.userPostAccess = 0;
                                }
                                if (response.isAdmin) {
                                    $scope.adminPostAccess = 1;
                                } else {
                                    $scope.adminPostAccess = 0;
                                }


                                if(response.hasError){
                                    $ionicLoading.show({
                                        template: response.error,
                                        duration: 3000
                                    });
                                }


                                //OTP Validation happens here.
                                $scope.userdata = {};
                                $ionicPopup.show({
                                    template: '<input maxlength="4" type="tel" ng-model="userdata.otp" style="text-align: center; font-size: 21px; height: 50px; letter-spacing: 5px; font-weight: bold;">',
                                    title: "One Time Password",
                                    subTitle: "Hello "+response.name+"! Please enter the OTP received on your registered mobile number " + mobile,
                                    scope: $scope,
                                    buttons: [{
                                            text: 'Cancel'
                                        },
                                        {
                                            text: '<b>Submit</b>',
                                            type: 'button-positive',
                                            onTap: function(e) {
                                                if (!$scope.userdata.otp) {
                                                    //don't allow the user to close unless he enters wifi password
                                                    e.preventDefault();
                                                } else {
                                                    if ($scope.userdata.otp == $scope.otp_original) { //OTP Match
                                                        $scope.token = mobile;
                                                        localStorage.setItem("token", $scope.token);
                                                        localStorage.setItem("postFlag", $scope.userPostAccess);
                                                        localStorage.setItem("postAdminFlag", $scope.adminPostAccess);
                                                        localStorage.setItem("notification", 1);

                                                        $http.get('http://cmcair.in/apis/usersignin.php?mobile=' + mobile);
                                                        $state.go('tab.timeline');
                                                    } else {
                                                        $scope.errorFlag = 1;
                                                        $scope.errorMessage = "Sorry! You have entered a wrong OTP.";
                                                    }

                                                }
                                            }
                                        }
                                    ]
                                });
                            } else {
                                //Not registered --> ask for one time registration

                                if(response.hasError){
                                    $ionicLoading.show({
                                        template: response.error,
                                        duration: 3000
                                    });

                                    if(!response.code || response.code == ''){
                                        return '';
                                    }
                                }

                                //Fetch meta data - all batches
                                $http.get("http://cmcair.in/apis/getbatches.php")
                                    .then(function(response) {
                                        $scope.batchList = response.data;
                                    });




                                $scope.otp_original = response.code;

                                $scope.newuser = {};
                                $scope.newuser.name = '';
                                $scope.newuser.otp = '';
                                $scope.newuser.batch = '';
                                $scope.newuser.mobile = mobile;

                                document.getElementById('registrationPopup').style.display = 'block';

                            }

                        })
                        .error(function(data) {
                            $ionicLoading.hide();
                            $ionicLoading.show({
                                template: "Not responding. Check your connection.",
                                duration: 3000
                            });
                        });


                } else {

                    $scope.errorFlag = 0;
                    $ionicPopup.alert({
                        title: "Invalid Mobile Number",
                        content: "Please enter a valid 10 digit mobile number"
                    });
                }
            };

        } //End of else.

        $scope.setUserBatch = function(batch){
            $scope.newuser.batch = batch;
            document.getElementById("customInputBatch").value = '';
        }

        $scope.customBatch = function(){
            $scope.newuser.batch = '';
        }

        $scope.registerUser = function(new_name, new_batch, new_mobile, new_otp){

            if(!new_batch || new_batch == ''){
                new_batch = document.getElementById("customInputBatch").value;
            }

            if(new_name == '' || new_batch == '' || new_mobile == '' || new_otp == ''){
                $ionicLoading.show({
                    template: "Please fill all the fields.",
                    duration: 3000
                });     
                return '';           
            }

            var myData = {};
            myData.name = new_name;
            myData.batch = new_batch;
            myData.mobile = new_mobile;
            myData.otp = new_otp;

                $ionicLoading.show({
                    template: '<ion-spinner></ion-spinner>'
                });

                $http({
                    method: 'POST',
                    url: 'http://cmcair.in/apis/registernewuser.php',
                    data: myData, //forms user object
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    timeout: 10000
                })
                .success(function(data) {
                    $ionicLoading.hide();

                    if(data.status){
                        localStorage.setItem("token", data.mobile);
                        localStorage.setItem("postFlag", data.postFlag ? 1 : 0);
                        localStorage.setItem("postAdminFlag", data.isAdmin ? 1 : 0);
                        localStorage.setItem("notification", 1);

                        $state.go('tab.timeline');
                    }
                    else{
                        $ionicLoading.show({
                            template: data.error,
                            duration: 3000
                        });
                    }

                })
                .error(function(data) {
                    $ionicLoading.hide();
                    $ionicLoading.show({
                        template: "Not responding. Check your connection.",
                        duration: 3000
                    });
                });                

        }



        $ionicModal.fromTemplateUrl('templates/legal/privacy-policy.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.privacy_policy_modal = modal;
        });

        $ionicModal.fromTemplateUrl('templates/legal/terms-of-service.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.terms_of_service_modal = modal;
        });

        $scope.showTerms = function() {
            $scope.terms_of_service_modal.show();
        };

        $scope.showPrivacyPolicy = function() {
            $scope.privacy_policy_modal.show();
        };



    }]);
