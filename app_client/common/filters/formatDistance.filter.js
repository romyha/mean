(function () {
    angular.module('loc8rApp').filter('formatDistance', formatDistance);


    function formatDistance() {
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
})();

