var express = require('express');
var router = express.Router();
app.use('/api-docs', swaggerUi.serve, swagger)

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
