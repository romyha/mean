var express = require('express');
var router = express.Router();



var homePageController = function (req, res, next) {
  res.render('index', { title: 'Express' });
}

/* GET home page. */
router.get('/', homePageController);

module.exports = router;
