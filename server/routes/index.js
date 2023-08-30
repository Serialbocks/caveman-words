var express = require('express');
var log = require('../utils/log')
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.html', { title: 'Express' });
});

router.get('/tcping', function(req, res, next) {
  let ip = req.headers['x-forwarded-for'] || req.ip || req.socket.remoteAddress || 'null';
  log(`${ip} TCPing ${req.query.version}`);
  res.json(true);
});

module.exports = router;
