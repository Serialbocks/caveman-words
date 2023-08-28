var express = require('express');
var log = require('../utils/log')
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.html', { title: 'Express' });
});

router.get('/tcping', function(req, res, next) {
  log(`TCPing ${req.query.version}`);
  res.json(true);
});

module.exports = router;
