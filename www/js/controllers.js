angular.module('starter.controllers', ['ngCordova'])


    .controller('TimelineCtrl', ['$scope', '$http', '$ionicPopup', '$cordovaNetwork', '$timeout', '$state', '$ionicLoading', function($scope, $http, $ionicPopup, $cordovaNetwork, $timeout, $state, $ionicLoading) {



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
            $state.go('tab.login');
            ionic.Platform.exitApp();
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

    // .controller('postDetailCtrl', function($scope) {
    //  // $scope.chat = Chats.get($stateParams.chatId);
    //  $scope.chat="Title";
    //  $scope.content="Content";
    //  console.log("Hit");
    // })



    .controller('AppCtrl', function($scope, $state, $http, $ionicLoading, $timeout) {

    })

    .controller('tilesCtrl', function($scope, $state, $http, $ionicLoading, $timeout) {

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
    })




    .controller('postDetailCtrl', ['$scope', '$http', '$stateParams', function($scope, $http, $stateParams) {
        $http.get("http://cmcair.in/apis/viewpost.php?id=" + $stateParams.postID + "&user=" + localStorage.getItem("token")).then(function(response) {
            $scope.post = response.data;
            $scope.liked = response.data.likeFlag;
        });

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
                    $scope.liked = !$scope.liked;
                    $scope.refresher();
                });
        };

        $scope.refresher = function() {
            $http.get("http://cmcair.in/apis/viewpost.php?id=" + $stateParams.postID + "&user=" + localStorage.getItem("token"))
                .then(function(response) {
                    $scope.feedsList = response.data;
                })
                .finally(function() {
                    $scope.$broadcast('scroll.refreshComplete');
                });
        };


    }])


    .controller('AnnouncementsCtrl', ['$scope', '$http', '$rootScope', '$ionicPopup', '$state', '$ionicLoading', function($scope, $http, $rootScope, $ionicPopup, $state, $ionicLoading) {


        $scope.goToTiles = function() {
            $state.go('main.app.tiles')
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


        $scope.goToTiles = function() {
            $state.go('main.app.tiles')
        }

$scope.isRenderLoaded = 1;
$scope.renderFailed = 0;


        $scope.isViewingExpanded = false;

        $scope.directoryData = [{
        "mainName": "Emergency Contacts",
        "isPublic": false,
        "hasSubCategories": false,
        "content": [{
                "isPerson": true,
                "title": "Anti Ragging Head",
                "name": "Dr. Ajith Mohan",
                "address": "Address Goes Here",
                "photo": "",
                "contact": "9842013102"
            },
            {
                "isPerson": true,
                "title": "Anti Ragging Lead",
                "name": "Dr. Mohan Perera",
                "address": "",
                "photo": "",
                "contact": "9842013102"
            },
            {
                "isPerson": false,
                "title": "Fire Force Station",
                "name": "",
                "address": "Near Kizhakkethala, Calicut",
                "photo": "http://cmcair.in/images/people/9946724139.jpg",
                "contact": "9842013102"
            }
        ]
    },
    {
        "mainName": "Unit Heads",
        "isPublic": true,
        "hasSubCategories": true,
        "content": [{
                "subName": "General Medicine",
                "content": [{
                        "isPerson": true,
                        "title": "Head of Dept",
                        "name": "Dr. Anupam Siva",
                        "address": "",
                        "photo": "",
                        "contact": "9024184922"
                    },
                    {
                        "isPerson": true,
                        "title": "Assist. Professor",
                        "name": "Dr. Jameela Hanan",
                        "address": "",
                        "photo": "",
                        "contact": "9842013102"
                    }
                ]
            },
            {
                "subName": "Orthopedriatics",
                "content": [{
                        "isPerson": true,
                        "title": "Lab Head",
                        "name": "Dr. Krishan",
                        "address": "Krishnan Purayil Veedulla Krishnan, Krishnan Purayil Veedulla Krishnan, Krishnan Purayil Veedulla Krishnan",
                        "photo": "",
                        "contact": "9024184922"
                    },
                    {
                        "isPerson": true,
                        "title": "Assist. Surgeon",
                        "name": "Dr. Haridasan",
                        "address": "",
                        "photo": "",
                        "contact": "8129024900"
                    }
                ]
            }
        ]
    }

]


        $scope.expandCategory = function(hasSubCategories, content){

            $scope.isViewingExpanded = true;
            $scope.expandHasSubCategories = hasSubCategories;
            $scope.expandContent = content;
        }

        $scope.cancelExpandView = function(){
            $scope.isViewingExpanded = false;
        }



        // //FIRST LOAD
        // $scope.renderFailed = false;
        // $scope.isRenderLoaded = false;

        // $ionicLoading.show({
        //     template: '<ion-spinner></ion-spinner>'
        // });

        // $http.get("http://cmcair.in/apis/secretaries.php", {
        //         timeout: 10000
        //     })
        //     .success(function(response) {
        //         $scope.userlist = response;

        //         $ionicLoading.hide();
        //         $scope.renderFailed = false;
        //         $scope.isRenderLoaded = true;
        //     })
        //     .error(function(data) {
        //         $ionicLoading.hide();
        //         $ionicLoading.show({
        //             template: "Not responding. Check your connection.",
        //             duration: 3000
        //         });

        //         $scope.renderFailed = true;
        //         $scope.$broadcast('scroll.refreshComplete');

        //     });


        // $http.get("http://cmcair.in/apis/heads.php", {
        //         timeout: 10000
        //     })
        //     .success(function(response) {
        //         $scope.headlist = response;
        //     })
        //     .error(function(data) {

        //     });

        // //REFRESHER
        // $scope.doRefresh = function() {

        //     $http.get("http://cmcair.in/apis/secretaries.php", {
        //             timeout: 10000
        //         })
        //         .success(function(response) {
        //             $scope.userlist = response;
        //             $scope.$broadcast('scroll.refreshComplete');
        //         })
        //         .error(function(data) {
        //             $ionicLoading.show({
        //                 template: "Not responding. Check your connection.",
        //                 duration: 3000
        //             });

        //             $scope.$broadcast('scroll.refreshComplete');

        //         });
        
                
        //         $http.get("http://cmcair.in/apis/heads.php", {
        //                 timeout: 10000
        //             })
        //             .success(function(response) {
        //                 $scope.headlist = response;
        //                 $scope.$broadcast('scroll.refreshComplete');
        //             })
        //             .error(function(data) {
        //                 $scope.$broadcast('scroll.refreshComplete');
        //             });

        // };




    }])

    .controller('unionCtrl', ['$scope', '$http', '$ionicLoading', '$state', function($scope, $http, $ionicLoading, $state) {


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



    .controller('EventsCtrl', ['$scope', '$http', '$ionicPopup', '$state', '$ionicLoading', function($scope, $http, $ionicPopup, $state, $ionicLoading) {


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





    .controller('AcadsCtrl', ['$scope', '$http', '$ionicPopup', '$state', '$ionicLoading', function($scope, $http, $ionicPopup, $state, $ionicLoading) {

        $scope.renderFailed = false;
        $scope.isRenderLoaded = 1;



        $scope.testData = {
    "testCode": "BTS001",
    "title": "Bhatia Test Series 1",
    "brief": "Complete the test in 10 mins time",
    "duration": 10,
    "numberOfQuestions": 3,
    "datePosted": "08:00 pm, 31.01.2018",
    "dateLastSubmission": "08:00 pm, 10.02.2018",
    "questions": [{
            "id": 1,
            "question": "Who is the prime minister of India?",
            "options": ["Narendra Modi", "Manmohan Singh", "Sonia Gandhi", "None of These"]
        },
        {
            "id": 2,
            "question": "What color is Black Box?",
            "options": ["Dark Black", "Matt Black", "Gray", "None of These"]
        },
        {
            "id": 3,
            "question": "Who put first steps to Moon?",
            "options": ["Neil Amstrong", "Yurie Gagarin", "Ajay Hambabe", "Kalpana Chavla"]
        }
    ]
};




    }])


    .controller('BlogsCtrl', ['$scope', '$http', '$ionicPopup', '$state', '$ionicLoading', function($scope, $http, $ionicPopup, $state, $ionicLoading) {


        $scope.goToTiles = function() {
            $state.go('main.app.tiles')
        }



        if (localStorage.getItem("postAdminFlag") == 1) {
            $scope.adminFlag = true;
        } else {
            $scope.adminFlag = false;
        }


        $scope.isViewing = false;
        $scope.viewBlog = function(content){
            content = {
                'title': 'Spirit of Travel in Europe',
                'author': 'Abhijith C S',
                'date': '08:00 pm, 31st December, 2017',
                'content': '<p style="font-size: 18px; color: #000; font-weight: 400; line-height: 1.5em;">I travelled to England and Netherlands. Took a bike on rent.<br><br> I travelled to England and Netherlands. Took a bike on rent. I travelled to England and Netherlands. Took a bike on rent. I travelled to England and Netherlands. Took a bike on rent. I travelled to England and Netherlands. Took a bike on rent. I travelled to England and Netherlands. Took a bike on rent. I travelled to England and Netherlands. Took a bike on rent. I travelled to England and Netherlands. Took a bike on rent. I travelled to England and Netherlands. Took a bike on rent. </p>',
                'photo': 'http://localhost:8100/img/blog_test.jpeg',
                'category': 'TRAVEL',
                'views': 1203 

            };
            $scope.isViewing = true;
            $scope.viewContent = content;
            $scope.sample = 'http://localhost:8100/img/blog_test.jpeg';
            console.log(content)
        }

        $scope.cancelViewBlog = function(){
            $scope.isViewing = false;
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

        $ionicLoading.show({
            template: '<ion-spinner></ion-spinner>'
        });

        $http.get("http://cmcair.in/apis/blogs.php?value=0", {
                timeout: 1
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
                    duration: 1
                });

                $scope.renderFailed = true;
                $scope.$broadcast('scroll.refreshComplete');

            });



        $scope.feedsList = [];
        $scope.limiter = 1;




        //REFRESHER

        $scope.doRefresh = function() {

            $http.get("http://cmcair.in/apis/blogs.php?value=0", {
                    timeout: 10000
                })
                .success(function(response) {
                    $scope.feedsList = response;
                    $scope.left = 1;
                    $scope.limiter = 1;
                    $scope.$broadcast('scroll.refreshComplete');
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


    .controller('SettingsCtrl', ['$scope', '$http', function($scope, $http) {
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
            ionic.Platform.exitApp();
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
        

        $scope.goToAccount = function(){
            $state.go('tab.settings');
        }

        $scope.batchList = [
            {'batch': 55, 'strength': 150},
            {'batch': 56, 'strength': 150},
            {'batch': 57, 'strength': 150},
            {'batch': 58, 'strength': 150},
            {'batch': 59, 'strength': 150},
            {'batch': 60, 'strength': 150},
            {'batch': 61, 'strength': 150},
            {'batch': 62, 'strength': 150},
            {'batch': 63, 'strength': 150},
            {'batch': 64, 'strength': 150},
            {'batch': 65, 'strength': 150}
        ]


        //Fetch meta data - all batches
        $http.get("http://cmcair.in/apis/fetchbatchdata.php")
            .then(function(response) {
                $scope.batchList = response.data.response;
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

                alert($scope.data.for)


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

    .controller('LoginCtrl', ['$scope', '$state', '$http', '$ionicPopup', '$ionicLoading', function($scope, $state, $http, $ionicPopup, $ionicLoading) {

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
                    $http.get('http://cmcair.in/apis/useractivate.php?mobile=' + mobile).then(function(response) {
                        $scope.otp_original = response.data.code;
                        $scope.validity = response.data.valid;
                        if (response.data.postFlag) {
                            $scope.userPostAccess = 1;
                        } else {
                            $scope.userPostAccess = 0;
                        }
                        if (response.data.isAdmin) {
                            $scope.adminPostAccess = 1;
                        } else {
                            $scope.adminPostAccess = 0;
                        }


                        if ($scope.validity) { //Valid, Registered User.

                            //OTP Validation happens here.
                            $scope.userdata = {};
                            $ionicPopup.show({
                                template: '<input type="tel" ng-model="userdata.otp">',
                                title: "One Time Password",
                                subTitle: "Please enter the OTP received on your registered mobile number " + mobile,
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
                            $scope.errorFlag = 1;
                            $scope.errorMessage = "Not registered.";
                        }
                    });
                } else {

                    $scope.errorFlag = 0;
                    $ionicPopup.alert({
                        title: "Invalid Mobile Number",
                        content: "Please enter a valid 10 digit mobile number, which is registered with CMC Air."
                    });
                }
            };

        } //End of else.


    }]);



//Trial Codes
function MorePosts($scope, $http) {

};