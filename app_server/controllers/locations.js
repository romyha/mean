/* GET 'home' page*/
module.exports.homelist = function (req, res, next) {
    res.render('locations-list', {
        title: 'Loc8r - find wifi places',
        pageHeader: {
            title: 'Loc8r',
            strapline: 'Find places to work with wifi near you!'
        },
        locations: [{
            name: 'Starcups',
            address: 'some street',
            rating: 3,
            facilities: ['Hot drinks', 'Food', 'Premium wifi'],
            distance: '100m'
        }, {
                name: 'Cafe Hero',
                address: '1234city, herostreet 5',
                rating: 4,
                facilities: ['icecream', 'Premium wifi'],
                distance: '120m'
            }, {
                name: 'Burger Queen',
                address: 'somewhere in the world 3, 12345 world',
                rating: 2,
                facilities: ['Food', 'Premium wifi'],
                distance: '300m'
            }
        ]
    });
}

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
                closed:false
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
}

/* GET 'Add Review' page*/
module.exports.addReview = function (req, res, next) {
    res.render('location-review-form', { 
        title: 'Review Starcups on Loc8r',
        pageHeader: {
            title: 'Review Starcups'
        }
    });
}