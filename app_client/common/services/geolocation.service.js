(function () {
    angular.module('loc8rApp').service('geolocation', geolocation);

    //get geoData from browser
    function geolocation () {
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
})();
