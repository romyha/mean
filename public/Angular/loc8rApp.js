angular.module('loc8rApp', []);


//get geoData from browser
var geolocation = function () {
    var getPosition = function (cbSuccess, cbError, cbNoGeo) {
        if (navigator.geolocation) {        //check if browser supports geoloc
            navigator.geolocation.getCurrentPosition(cbSuccess, cbError);   //if so call it
        } else {
            cbNoGeo();
        }
    };
    return {
        getPosition: getPosition        //return object with function to call with 3 callbacks
    };
};


//control services
var locationListCtrl = function ($scope, loc8rData, geolocation) {
    $scope.message = "Checking your location";

    $scope.getData = function (position) {      //function to run if location successful
        var lat = position.coords.latitude,
            lng = position.coords.longitude;
        $scope.message = "Searching for nearby places";
        loc8rData.locationByCoords(lat, lng)
            .success(function (data) {
                $scope.message = data.length > 0 ? "" : "No locations found.";
                $scope.data = { locations: data };
            }).error(function (e) {
                $scope.message = "Sorry, something's gone wrong."
            });
    };

    $scope.showError = function (error) {       //function to run if geolocation not successful
        $scope.$apply(function () {
            $scope.message = error.message;
        });
    };

    $scope.noGeo = function () {            //function to run if not supported
        $scope.$apply(function () {
            $scope.messgae = "Geolocation not supported by this browser.";
        });
    };

    geolocation.getPosition($scope.getData, $scope.showError, $scope.noGeo);
};


//display distance with m & km
var formatDistance = function () {
    return function (distance) {
        var numDistance, unit;
        if (distance > 1000) {
            numDistance = parseFloat(distance / 1000).toFixed(1); //display km with 1 dig after point
            unit = ' km';
        } else {
            numDistance = parseInt(distance);
            unit = ' m';
        }
        return numDistance + unit;
    };
};


//display stars for rating
var ratingStars = function () {
    return {
        scope: {
            thisRating: '=rating'
        },
        templateUrl: '/Angular/rating-stars.html'
    };
};


//call API for locations data
var loc8rData = function ($http) {
    var locationByCoords = function (lat, lng) {
        return $http.get('/api/locations?lng=' + lng + '&lat=' + lat + '&maxDistance=200000000');
    };
    return {
        locationByCoords: locationByCoords
    };
};




angular.module('loc8rApp')
    .controller('locationListCtrl', locationListCtrl)
    .filter('formatDistance', formatDistance)
    .directive('ratingStars', ratingStars)
    .service('loc8rData', loc8rData)
    .service('geolocation', geolocation);