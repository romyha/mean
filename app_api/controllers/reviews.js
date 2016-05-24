var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

module.exports.reviewsCreate = function (req, res) { 
    var locationid = req.params.locationid;
    console.log(locationid);
    if (locationid) {
        Loc.findById(locationid).select('reviews').exec(function (err, location) {
            console.log("test");
            if (err) {
                sendJsonResponse(res, 400, err);
            } else { 
                doAddReview(req, res, location);
            }
        });
    } else {
        sendJsonResponse(res, 404, {
            "message": "Not found, locationid required"
        });
    }
    //sendJsonResponse(res, 200, {"status" : "succes"})
};

var doAddReview = function(req, res, location) { console.log("no push");
    if (!location) { 
        sendJsonResponse(res, 404, {
            "message": "locationid not found"
        });
    } else { console.log("pushing");
        location.reviews.push({
            author: req.body.author,
            rating: req.body.rating,
            message: req.body.message
        });
        location.save(function (err, location) {
            var thisReview;
            if (err) {
                sendJsonResponse(res, 400, err);
            } else {
                updateAverageRating(location._id);
                thisReview = location.reviews[location.reviews.length - 1];
                sendJsonResponse(res, 201, thisReview);
            }
        });
    }
}

var updateAverageRating = function(locationid){
    if(locationid) {
        Loc.findById(locationid).select('rating reviews').exec(function(err, location){
            if(!err) {doSetAverageRating(location);}
        });
    }
};

var doSetAverageRating = function(location) {
    var reviewCount, ratingAverage, ratingTotal;
    if(location.reviews && location.reviews.length>0){
        reviewCount = location.reviews.length;
        ratingTotal = 0;
        for(var i=0; i<reviewCount; i++) {
            ratingTotal += location.reviews[i].rating;
        }
        ratingAverage = parseInt(ratingTotal/reviewCount, 10);
        location.rating = ratingAverage;
        location.save(function(err){
            if(err) {
                console.log(err);
            } else {
                console.log("Average rating updated to", ratingAverage);
            }
        });
    }
};

module.exports.reviewsReadOne = function (req, res) {
    console.log("Getting single review");
    if (req.params && req.params.locationid && req.params.reviewid) {
        Loc.findById(req.params.locationid).select('name reviews').exec(function (err, location) {
            console.log(location);
            var response, review;
            if (!location) {
                console.log("no loc");
                sendJsonResponse(res, 404, {
                    "message": "locationid not found"
                });
                return;
            } else if (err) {
                console.log(err);
                sendJsonResponse(res, 400, err);
                return;
            }
            if (location.reviews && location.reviews.length > 0) {
                review = location.reviews.id(req.params.reviewid);
                if (!review) {
                    sendJsonResponse(res, 404, {
                        "message": "reviewid not found"
                    });
                } else {
                    console.log("found");
                    response = {
                        location: {
                            name: location.name,
                            id: req.params.locationid
                        },
                        review: review
                    };
                    sendJsonResponse(res, 200, response);
                }
            } else {
                console.log("3rd");
                sendJsonResponse(res, 404, {
                    "message": "No reviews found"
                });
            }
        }
        );
    } else {
        console.log("nothing");
        sendJsonResponse(res, 404, {
            "message": "Not found, locationid and reviewid are both required"
        });
    }

};

module.exports.reviewsUpdateOne = function (req, res) { 
    if(!req.params.locationid||!req.params.reviewid) {
        sendJsonResponse(res, 404, {
            "message": "Not found, locationid and reviewid reqiured"
        });
        return;        
    }
    Loc.findById(req.params.locationid).select('reviews').exec(function(err, location){
        var thisReview;
        if(!location) {
            sendJsonResponse(res, 404, {
                "message": "locationid not found"
            });
            return;
        } else if(err) {
            sendJsonResponse(res, 400, err);
            return;
        }
        if(location.reviews && location.reviews.length>0) {
            thisReview = location.reviews.id(req.params.reviewid);
            if(!thisReview) {
                sendJsonResponse(res, 404, {
                    "message": "reviewid not found"
                });                
            } else {
                thisReview.author = req.body.author;
                thisReview.rating = req.body.rating;
                thisReview.message = req.body.message;
                location.save(function(err, location) {
                    if (err) {
                        sendJsonResponse(res, 404, err);
                    } else {
                        updateAverageRating(location._id);
                        sendJsonResponse(res, 200, thisReview);
                    }
                });
            }
        } else {
            sendJsonResponse(res, 404, {
                "message": "No review to update"
            });
        }
    });
};

module.exports.reviewsDeleteOne = function (req, res) { 
    if(!req.params.locationid || !req.params.reviewid) {
        sendJsonResponse(res, 404, {
            "message": "Not found, locationid and reviewid reqiured"
        });
        return;
    }
    Loc.findById(req.params.locationid).select('reviews').exec(function(err, location) {
        if(!location) {
            sendJsonResponse(res, 404, {
                "message": "locationid not found"
            });
            return;
        } else if(err) {
            sendJsonResponse(res, 400, err);
            return;
        }
        if(location.reviews && location.reviews.length>0) {
            if(!location.reviews.id(req.paramsreviewid)) {
                sendJsonResponse(res, 404, {
                    "message": "reviewid not found"
                });
            } else {
                location.reviews.id(req.params.reviewid).remove();
                location.save(function(err) {
                    if(err) {
                        sendJsonResponse(res, 404, err);
                    } else {
                        updateAverageRating(location._id);
                        sendJsonResponse(res, 204, null);
                    }
                });
            }
        } else {
            sendJsonResponse(res, 404, {
                "message": "No review to delete"
            });
        }
    });
};

var sendJsonResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
}