(function () {
    angular.module('loc8rApp').directive('ratingStars', ratingStars);

    //display stars for rating
    function ratingStars() {
        return {
            restrict: 'EA',     //only use ratingSt dir when string rating-stars(HTML version of ratingStars) is found in particular places (here E=element, A=attribute | C=class | M=comment)
            scope: {
                thisRating: '=rating'
            },
            templateUrl: '/common/directives/ratingStars/ratingStars.template.html'
        };
    };
})();