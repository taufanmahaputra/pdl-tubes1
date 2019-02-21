var express = require('express');
var router = express.Router();

var { sequelizeClient } = require('../core/database')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'PDL TUBES 1', results: [] });
});

router.post('/select', function(req, res, next) {
  sequelizeClient.query("SELECT * FROM room_reservations").spread((results, metadata) => {
    res.render('index', { title: 'PDL TUBES 1 | SELECT', results: results})
  })
});

router.post('/insert', function(req, res, next) {
  sequelizeClient.query("SELECT * FROM room_reservations").spread((results, metadata) => {
    res.render('index', { title: 'PDL TUBES 1 | SELECT', results: results})
  })
});

router.post('/union', function(req, res, next) {
  sequelizeClient.query("SELECT * FROM room_reservations").spread((results, metadata) => {
    res.render('index', { title: 'PDL TUBES 1 | SELECT', results: results})
  })
});

module.exports = router;

