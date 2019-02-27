var express = require('express');
var moment = require('moment');
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

router.post('/update', function(req, res, next) {
  const roomNumber = req.body.room_number
  const pic = req.body.pic
  const about = req.body.about

  sequelizeClient.query(`UPDATE room_reservations SET pic = '${pic}', about = '${about}' WHERE room_number = ${roomNumber}`).spread((results, metadata) => {
    res.render('index', { title: 'PDL TUBES 1 | UPDATE', results: [] })
  })
});

router.post('/union', async function(req, res, next) {
  current = await sequelizeClient.query("SELECT * FROM room_reservations")
  histories = await sequelizeClient.query("SELECT * FROM room_reservations_history")

  
  var currentLength = current[0].length
  var historiesLength = histories[0].length

  var sameAttr = current[0]

  for(var i = 0; i < currentLength; i++){
      var unionValidTime = []
      
      unionValidTime.push(current[0][i].valid_time)
      for(var j = 0; j < historiesLength; j++){
          if(
            current[0][i].room_number == histories[0][j].room_number &&
            current[0][i].pic == histories[0][j].pic &&
            current[0][i].about == histories[0][j].about

            
            )
            {
              unionValidTime.push(histories[0][j].valid_time)
            }
          sameAttr[i].valid_time = unionValidTime
      }
      
  } 

  for(var i = 0; i < sameAttr.length; i++){
    var diffHistories = []
    var x = 0
    for(var j = 0; j < historiesLength; j++){
        if(
          sameAttr[i].room_number == histories[0][j].room_number &&
          sameAttr[i].pic == histories[0][j].pic &&
          sameAttr[i].about == histories[0][j].about
          )
          {
            x++
            break          
          }
        if(x == 0)
          diffHistories.push(histories[0][j])
    }
    
  } 
  if(diffHistories.length != 0){
    sameAttr.push(diffHistories)   
  }
  console.log(diffHistories)    
  console.log(current[0])
  console.log(histories[0])
  
  res.render('index', {title: 'PDL TUBES 1 | UNION', results: sameAttr})
   
});

module.exports = router;

