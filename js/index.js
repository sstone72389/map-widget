$(document).ready(function() {

  $(window).scrollTop(0);
  return false;

})

var app = angular.module('myApp', []);

app.service('Map', function($q) {

  this.init = function() {
    var options = {
      // starting point for maps
      center: new google.maps.LatLng(42.3656132, -71.00956020000001),
      // zoom control
      zoom: 13,
      //disables default UI (i.e. zoom controls, street view, etc.)
      disableDefaultUI: true
    }
    // define a JavaScript function that creates a map in the div
    this.map = new google.maps.Map(
      document.getElementById("map"), options
    );
    // Create the PlaceService and send the request.
    this.places = new google.maps.places.PlacesService(this.map);
  }

  this.search = function(str) {
    // use $q.defer() to create a new Promise and assign it to a variable
    var d = $q.defer();
    // Google Places API Text Search Service
    this.places.textSearch({
      query: str
    }, function(results, status) {
      if (status == 'OK') {
        // show results if found
        d.resolve(results[0]);
      }
      // else reject and show status
      else d.reject(status);
    });
    return d.promise;
  }

  // add new marker to map
  this.addMarker = function(res) {
    if (this.marker) this.marker.setMap(null);
    this.marker = new google.maps.Marker({
      map: this.map,
      position: res.geometry.location,
      animation: google.maps.Animation.DROP
    });
    this.map.setCenter(res.geometry.location);
  }

});

app.controller('newPlaceCtrl', function($scope, Map) {

  $scope.place = {};

  $scope.search = function() {
    $scope.apiError = false;
    Map.search($scope.searchPlace)
      .then(
        function(res) { // success
          Map.addMarker(res);
          $scope.place.name = res.name;
          $scope.place.lat = res.geometry.location.lat();
          $scope.place.lng = res.geometry.location.lng();
        },
        function(status) { // error
          $scope.apiError = true;
          $scope.apiStatus = status;
        }
      );
  }
  // display data to user and push into array for future use

  // array to be used for places selected by user
  $scope.favorites = [];
  $scope.send = function() {
    // appends GPS locations to <ul> including coordinates
    $("ul").append("<li><span class='list-span'><i class='fa fa-trash-o' aria-hidden='true'></i></span>" + $scope.place.name + " : " + $scope.place.lat + ", " + $scope.place.lng + "</li>");

    // pushes into "favorites" array
    $scope.favorites.push($scope.place.name + " : " + $scope.place.lat + ", " + $scope.place.lng);
    // Check off specific li by clicking

    // redundant? Remove and stick with removal only?
    // $("ul").on("click", "li", function() {
      // console.log(this.textContent + " on crossout");
      // $(this).toggleClass("completed");
      // if completed (crossed out) do not use in array
      // seems to be emptying entire array
      // if ($( "li" ).hasClass( "completed" )) {
      //   console.log("has completed applied");
      //   $scope.favorites.splice($.inArray(this.textContent, $scope.favorites),1);
      //   console.log($scope.favorites + " array after crossout");

      // }
    // });

    // Click on X to delete a todo(li)
    // also remove from places array

    $("ul").on("click", "span", function(event) {
      $(this).parent().fadeOut(500, function() {
        // asign item to remove to variable
        var itemtoRemove = this.textContent;
        // remove from array
        $scope.favorites.splice($.inArray(itemtoRemove, $scope.favorites),1);
        $(this).remove();
      });
      event.stopPropagation();
    });

    // randomly picks an item in the array on click
    $(".picker-btn").on("click", function() {
      // dsiplays random pick to user
      if ($scope.favorites && $scope.favorites.length > 0) {
        var placePicked = $scope.favorites[Math.floor(Math.random() * $scope.favorites.length)];
        $(".place-picked-two").html("Goto " + placePicked);
        console.log(placePicked + " place picked");
      } else {
        // logging multiple lines...need to refactor this
        console.log($scope.favorites + " when empty after click");
      $(".place-picked-two").html("There is nothing in your list :-(");
      }
    });
  }


  //init map function
  Map.init();
});
