(function () {
    angular.module('loc8rApp').filter('addHtmlLineBreaks', addHtmlLineBreaks);

    function addHtmlLineBreaks() {
        return function (text) {
            if (text) {
                var output = text.replace(/\n/g, '<br/>');
                return output;
            } else return;
        };
    }
})();