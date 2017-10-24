var app = angular.module('myApp', []);

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
            // else reject and show
            else d.reject(status);
        });
        return d.promise;
    }
