$(document).ready(function () {

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
        this.places.textSearch({query: str}, function(results, status) {
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
        if(this.marker) this.marker.setMap(null);
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
    // display data to user
    $scope.send = function() {
        // alert($scope.place.name + ' : ' + $scope.place.lat + ', ' + $scope.place.lng);
        $("ul").append('<li>'+ $scope.place.name + " : " + $scope.place.lat + ", " + $scope.place.lng + '</li>');
    }

    //init map function
    Map.init();
});

// Check off specific li by clicking


$("ul").on("click", "li", function() {
  $(this).toggleClass("completed");
});
