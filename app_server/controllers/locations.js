var request = require('request');

var apiOptions = {
    server: "http://localhost:3000"
};
if (process.env.NODE_ENV === 'production') {
    apiOptions.server = "https://limitless-reef-17194.herokuapp.com";
}



//-------------------------------------------------------------------------
//homepage listing locations

/**Build homepage from API */
var renderHomepage = function (req, res) {
    res.render('locations-list', {
        title: 'Loc8r - find wifi places',
        pageHeader: {
            title: 'Loc8r',
            strapline: 'Find places to work with wifi near you!'
        }
    });
};

/* GET 'home' page*/
module.exports.homelist = function (req, res, next) {
    renderHomepage(req, res);
};

var _formatDistance = function (distance) {
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



//---------------------------------------------------------------------
//Details page of location

var renderDetailPage = function (req, res, locDetail) {
    res.render('location-info', {
        title: 'Loc8r - ' + locDetail.name,
        pageHeader: {
            title: locDetail.name,
            strapline: 'Find places to work with wifi near you!'
        },
        location: locDetail
    });
}


/* GET 'Location Info' page*/
module.exports.locationInfo = function (req, res, next) {
    getLocationInfo(req, res, function (req, res, responseData) {
        renderDetailPage(req, res, responseData);
    });
};

var _showError = function (req, res, statusCode) {
    var title, content;
    if (statusCode === 404) {
        title = "404, page not found";
        content = "Oh dear. Looks like we can't find this page. Sorry.";
    } else {
        title = statusCode + ", something's gone wrong";
        content = "Something, somewhere, has gone wrong.";
    }
    res.status(statusCode);
    res.render('generic-text', {
        title: title,
        content: content
    });
};




//-----------------------------------------------------------------------
//Add review to location page

var renderReviewForm = function (req, res, locDetail) {
    res.render('location-review-form', {
        title: 'Review' + locDetail.name + ' on Loc8r',
        pageHeader: {
            title: 'Review ' + locDetail.name
        },
        error: req.query.err,            //to check if sth went wrong when inputting data
        url : req.originalUrl       //to pass it to action for the get request after submitting form
    });
};


/* GET 'Add Review' page*/
module.exports.addReview = function (req, res, next) {
    getLocationInfo(req, res, function (req, res, responseData) {
        renderReviewForm(req, res, responseData);
    });
};

module.exports.doAddReview = function (req, res) {
    var requestOptions, path, locationid, postdata;
    locationid = req.params.locationid;
    path = '/api/locations/' + locationid + '/reviews';
    postdata = {
        author: req.body.name,
        rating: parseInt(req.body.rating, 10),
        message: req.body.review
    };
    requestOptions = {
        url: apiOptions.server + path,
        method: "POST",
        json: postdata
    };
    if (!postdata.author || !postdata.rating || !postdata.message) {
        res.redirect('/location/' + locationid + '/reviews/new?err=val');
    } else {
        request(requestOptions, function (err, response, body) {
            if (response.statusCode === 201) {
                res.redirect('/location/' + locationid);
            } else if (response.statusCode === 400 && body.name && body.name === "ValidationError") {
                res.redirect('/location/' + locationid + '/reviews/new?err=val');
            }
            else {
                _showError(req, res, response.statusCode);
            }
        });
    }
};




//----------------------------------------------------------------------
//


var getLocationInfo = function (req, res, callback) {
    var requestOptions, path;
    path = '/api/locations/' + req.params.locationid;
    requestOptions = {
        url: apiOptions.server + path,
        method: "GET",
        json: {}
    };
    request(requestOptions, function (err, response, body) {
        var data = body;
        if (response.statusCode === 200) {
            data.coords = {
                lng: body.coords[0],
                lat: body.coords[1]
            };
            callback(req, res, data);
        } else {
            _showError(req, res, response.statusCode);
        }
    });
};