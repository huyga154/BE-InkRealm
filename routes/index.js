var express = require('express');
var router = express.Router();
require('dotenv').config();

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
    res.send("Hello from index route");
    console.log("here is router // index.js ")
    res.redirect(process.env.BACKEND_URL + '/api-docs');
});

module.exports = router;
