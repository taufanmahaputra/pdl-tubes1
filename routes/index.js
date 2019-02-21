var express = require('express');
var router = express.Router();

var { sequelizeClient } = require('../core/database')

/* GET home page. */
router.get('/', function(req, res, next) {
  sequelizeClient.query("SELECT * FROM room_reservations").spread((results, metadata) => {
    res.json(results)
  })
});

module.exports = router;
