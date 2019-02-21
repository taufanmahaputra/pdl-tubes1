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
  const roomNumber = req.body.room_number
  const pic = req.body.pic
  const about = req.body.about

  sequelizeClient.query(`INSERT INTO room_reservations (room_number, pic, about)  VALUES (${roomNumber}, '${pic}', '${about}')`).spread((results, metadata) => {
    res.render('index', { title: 'PDL TUBES 1 | INSERT', results: [] })
  })
});

module.exports = router;
