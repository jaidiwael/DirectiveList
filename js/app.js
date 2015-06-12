'use strict';

var App = angular.module('FetchApp', ['ngResource']);


App.directive('listItems', function () {
  return {
      restrict: "E",
      scope: {
          listdata: '=',
          nbitems :'=',
          refdelay:'='
      },
      controller:"crtlItem",
      template: "<ul class='list-group' ><li ng-repeat='x in listdata | limitTo: nbitems' class='list-group-item' >{{ x.title }}</li></ul>",
  }
});


App.controller("crtlItem", function($scope,$interval,$http,$timeout,GetListItems,$element, $attrs, ListStack){
       
       if(isNaN($attrs.refdelay)) $attrs.refdelay =1;

        $attrs.refdelay = parseInt($attrs.refdelay+"000");
    
          GetListItems.GetListStack().then(function(d){
              $scope.stack = [];
              d.items.forEach(function(r) { $scope.stack.push(r);});
          });

          GetListItems.GetListFilkr().then(function(d){
              $scope.filkr = [];
              d.items.forEach(function(r) { $scope.filkr.push(r);});
          });
         /*
          switch ($attrs.listdata) {
                case 'filkr':
                     $interval( function(){ 
                                 GetListItems.GetListFilkr().then(function(d){
                                      $scope.filkr = [];
                                      d.items.forEach(function(r) { $scope.filkr.push(r);});
                                  });
                          }, $attrs.refdelay);
                    break;
                case 'stack':
                        $interval( function(){ 
                                 GetListItems.GetListStack().then(function(d){
                                      $scope.stack = [];
                                      d.items.forEach(function(r) { $scope.stack.push(r);});
                                  });
                          }, $attrs.refdelay);
                    break;
            }

          */
          $scope.changeSource = function(src){

           var myEl = angular.element(document.querySelector('list-Items'));
          
              if(src == "filkr") {
                    GetListItems.GetListFilkr().then(function(d){
                         if(myEl.attr('listdata') == "filkr"){
                                $scope.filkr = [];
                                d.items.forEach(function(r) {  $scope.filkr.push(r); });
                            }
                            else{
                                 $scope.stack = [];
                                d.items.forEach(function(r) {  $scope.stack.push(r); });     
                            }
                      });
                }
                else {
                    GetListItems.GetListStack().then(function(d){
                           if(myEl.attr('listdata') == "filkr"){
                                $scope.filkr = [];
                                d.items.forEach(function(r) { $scope.filkr.push(r); });
                           }
                           else{
                                $scope.stack = [];
                                d.items.forEach(function(r) { $scope.stack.push(r); });
                           }
                      });
               }
             
          };

});


App.factory('GetListItems', function($http,$q) {
        var listStack = function() {
               var promiseStack;
                
                promiseStack = $http.jsonp("http://api.stackexchange.com/2.2/questions?order=desc&sort=activity&site=stackoverflow&format=json&callback=JSON_CALLBACK")
                .then(function (response) {
                  return response.data;
                });
                    
                return promiseStack;

        };
        
        var listFilkr = function() {
         
           var promiseFilkr;

            promiseFilkr = $http.jsonp("http://api.flickr.com/services/feeds/photos_public.gne?tagmode=all&format=json&jsoncallback=JSON_CALLBACK")
            .then(function (response) {
              return response.data;
            });
          return promiseFilkr;

        };
        return {
          GetListStack: listStack,
          GetListFilkr: listFilkr
        };
  });


