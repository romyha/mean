require('./locations');
var mongoose = require("mongoose");

var dbURI = 'mongodb://localhost/Loc8r';
if(process.env.NODE_ENV === 'production') {
    dbURI = 'mongodb://romy:rocla1@ds025802.mlab.com:25802/loc8r';
}
mongoose.connect(dbURI);

mongoose.connection.on('connected', function () {
    console.log('Mongoose connected to '+dbURI);
});

mongoose.connection.on('error', function (err) {
    console.log('Mongoose connection error: '+err);
});

mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected');
});

var gracefulShutdown = function(message, callback) {
    mongoose.connection.close(function() {
        console.log('Mongoose disconnected through ' + message);
        callback();
    });
};


//fornodemon restarts
process.once('SIGUSR2', function(){
    gracefulShutdown('nodemon restart', function() {
        process.exit(0);
    });
});


//for app closing
process.on('SIGINT', function(){
    gracefulShutdown('app termination', function() {
        process.exit(0);
    });
});


//for heroku app closing
process.on('SIGTERM', function(){
    gracefulShutdown('Heroku app shutdown', function() {
        process.exit(0);
    });
});