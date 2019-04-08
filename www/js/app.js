// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('newsApp', ['ionic']);
app.controller('newsCtrl',function($scope,$http,$ionicModal,$ionicPopup, $timeout){
  $scope.news = [];
  $scope.totalResults = 0;
  $scope.pageSize = 10;
  $scope.currentPage = 1;
  $scope.noMoreItemsAvailable = false;
  $scope.api = "https://newsapi.org/v2/top-headlines?country=in&apiKey=49a521f45a0343c9bac0eabfafdc5936&pageSize=10&page="+$scope.currentPage;
  //$scope.listCanSwipe = true;
  
  $scope.loadMore = function() {

// 'https://newsapi.org/v2/top-headlines?country=in&apiKey=49a521f45a0343c9bac0eabfafdc5936&pageSize='+$scope.pageSize+'&page='+$scope.currentPage
// https://newsapi.org/v2/top-headlines?country=in&apiKey=49a521f45a0343c9bac0eabfafdc5936



$http({
  method : "GET",
  url : $scope.api
}).then(function(newsData){

  if(newsData.data.articles.length == 0){
    console.log('Empty response');
    $scope.noMoreItemsAvailable = true;
  }
  newsData.data.articles.forEach(function(feed){
    $scope.news.push(feed);  
  });

  console.log($scope.news.length +" items, page :"+$scope.currentPage);
  $scope.currentPage++;
    //$scope.api = "https://newsapi.org/v2/top-headlines?country=in&apiKey=49a521f45a0343c9bac0eabfafdc5936&pageSize=10&page="+$scope.currentPage;
    $scope.api = $scope.api.substr(0,$scope.api.lastIndexOf('=')+1) + $scope.currentPage;
    $scope.$broadcast('scroll.infiniteScrollComplete');
  },function(error){
    $scope.$broadcast('scroll.infiniteScrollComplete');
    console.log(error);
  });
};

$scope.$on('$stateChangeSuccess', function() {
 //$scope.loadMore();
});

$scope.doRefresh = function() {

 $http({
  method : "GET",
  url : "https://newsapi.org/v2/top-headlines?country=in&apiKey=49a521f45a0343c9bac0eabfafdc5936&pageSize=10&page=1"
}).then(function(newsData){
  console.log(newsData.data);
  $scope.news = newsData.data.articles;
  console.log('onRefresh '+$scope.news.length+'items');
  $scope.currentPage = 2;
  $scope.api = "https://newsapi.org/v2/top-headlines?country=in&apiKey=49a521f45a0343c9bac0eabfafdc5936&pageSize=10&page="+$scope.currentPage;
  $scope.noMoreItemsAvailable = false;
  $scope.$broadcast('scroll.refreshComplete');
});

};


$ionicModal.fromTemplateUrl('my-modal.html', {
  scope: $scope,
  animation: 'slide-in-up'
}).then(function(modal) {
  $scope.modal = modal;
});
$scope.openModal = function() {
  $scope.modal.show();
};
$scope.closeModal = function() {
  $scope.modal.hide();
};
  // Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    console.log('modal hidden');
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    console.log('modal removed');
  });

  $scope.applyCustomFilter = function(filters){
    console.log(filters);
    $scope.api = "https://newsapi.org/v2/top-headlines?country="+filters.country+"&apiKey=49a521f45a0343c9bac0eabfafdc5936&pageSize=10";
    if(filters.category != 'select')
      $scope.api += "&category="+filters.category;
    $scope.api  += "&page=1";
    $scope.currentPage = 1;
    $scope.news = [];
    $scope.noMoreItemsAvailable = false;
    $scope.loadMore();
    $scope.modal.hide();
  };



  $scope.inputSearchKeyword = function(){
    $scope.searchInput = {};

    var myPopup = $ionicPopup.show({
      template: '<input type="text" ng-model="searchInput.keyword">',
      title: "What's in your mind",
      subTitle: '<div class="searchAlert" style="text-align: left;"><ul type="circle"><li>Surround phrases with quotes (") for exact match.</li><li>Prepend words or phrases that must appear with a + symbol. Eg: +bitcoin</li><li>Prepend words that must not appear with a - symbol. Eg: -bitcoin</li></ul></div>',
      scope: $scope,
      buttons: [
      { 
        text: 'Cancel'
        
      },
      {
        text: '<b>Search</b>',
        type: 'button-light',
        onTap: function(e) {
          if (!$scope.searchInput.keyword) {
            e.preventDefault();
          } else {
            return $scope.searchInput.keyword;
          }
        }
      }
      ]
    });

    myPopup.then(function(res) {

      console.log('Tapped!', res);
      if(res==null)
        return;

      $scope.api = "https://newsapi.org/v2/everything?apiKey=49a521f45a0343c9bac0eabfafdc5936&pageSize=10&sortBy=publishedAt";
      
      $scope.api += "&q="+res+"&page=1";
      $scope.currentPage = 1;
      $scope.news = [];
      $scope.noMoreItemsAvailable = false;
      $scope.loadMore();
      $scope.modal.hide();
    });

    $timeout(function() {
       myPopup.close(); //close the popup after 3 seconds for some reason
     }, 30000);
  };

});


app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {

    var notificationOpenedCallback = function(jsonData) {
      //alert('notificationOpenedCallback: ' + JSON.stringify(jsonData));
    };

    try{

      window["plugins"].OneSignal
      .startInit("1a0ac00a-118c-4692-b5be-abdbad477aa5", "340054534436")
      .handleNotificationOpened(notificationOpenedCallback)
      .endInit();

    }
    catch(err)
    {
      alert(err);
    }



    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }

    if(window.StatusBar) {
      StatusBar.styleDefault();
    }





});
});

