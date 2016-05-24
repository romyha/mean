var request = require('request');

var apiOptions = {
    server: "http://localhost:3000"
};
if (process.env.NODE_ENV === 'production') {
    apiOptions.server = "https://limitless-reef-17194.herokuapp.com";
}

/**Build homepage from API */
var renderHomepage = function (req, res, responseBody) {
    res.render('locations-list', {
        title: 'Loc8r - find wifi places',
        pageHeader: {
            title: 'Loc8r',
            strapline: 'Find places to work with wifi near you!'
        },
        locations: responseBody
    });
};

/* GET 'home' page*/
module.exports.homelist = function (req, res, next) {
    var requestOptions, path;
    path = '/api/locations';
    requestOptions = {
        url : apiOptions.server + path,
        method : "GET",
        json : {},
        qs : {
            lng : 30,
            lat : 52,
            maxDistance: 20
        }
    };
    request(requestOptions, function(err, response, body) {
        renderHomepage(req, res, body);
    });
};

/* GET 'Location Info' page*/
module.exports.locationInfo = function (req, res, next) {
    res.render('location-info', {
        title: 'Loc8r - find wifi places',
        pageHeader: {
            title: 'Loc8r',
            strapline: 'Find places to work with wifi near you!'
        },
        location: {
            name: 'Starcups',
            address: 'some street',
            rating: 3,
            facilities: ['Hot drinks', 'Food', 'Premium wifi'],
            coords: {
                lat: 51.455041,
                lng: -0.9690884
            },
            openingTimes: [{
                days: 'Monday-Friday',
                opening: '7:00am',
                closing: '7:00pm',
                closed: false
            }, {
                    days: 'Saturday',
                    opening: '8:00am',
                    closing: '5:00pm',
                    closed: false
                }, {
                    days: 'Sunday',
                    closed: true
                }],
            reviews: [{
                author: 'Romy Haacke',
                message: 'What a great Place!',
                rating: 5,
                timestamp: '19 May 2016',
            }, {
                    author: 'Ben Miller',
                    message: 'Nice coffee, but slow internet.',
                    rating: 3,
                    timestamp: '10 May 2016',
                }, {
                    author: 'Max Mustermann',
                    message: 'Very impolite people, never go there again',
                    rating: 1,
                    timestamp: '4 April 2016',
                }
            ]
        }
    });
};

/* GET 'Add Review' page*/
module.exports.addReview = function (req, res, next) {
    res.render('location-review-form', {
        title: 'Review Starcups on Loc8r',
        pageHeader: {
            title: 'Review Starcups'
        }
    });
};