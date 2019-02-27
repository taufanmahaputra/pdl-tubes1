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

router.post('/join', async function(req, res, next) {
  // sequelizeClient.query("SELECT room_reservations.room_number, room_reservations.pic, room_reservations.about, room_doctors.name, room_reservations.valid_time, room_doctors.valid_time FROM room_doctors INNER JOIN room_reservations ON (room_doctors.room_number = room_reservations.room_number)")
  // .spread((results, metadata) => {
  //   res.render('index', { title: 'PDL TUBES 1 | JOIN', results: results})
  // })

  current = await sequelizeClient.query("SELECT room_reservations_history.room_number, room_reservations_history.pic, room_reservations_history.about, room_doctors_history.name, room_reservations_history.valid_time as A, room_doctors_history.valid_time as B, room_doctors_history.valid_time as valid_time FROM room_doctors_history INNER JOIN room_reservations_history ON (room_doctors_history.room_number = room_reservations_history.room_number)")

  // console.log(current[0])
  result_array = []

  for(var i = 0; i < current[0].length; i++) {
    
    vs_a = await current[0][i].a[0]
    ve_a = await current[0][i].a[1]

    vs_b = await current[0][i].b[0]
    ve_b = await current[0][i].b[1]

    if (ve_a != null && ve_b != null) {
      if (moment(vs_a).isSameOrBefore(vs_b)) {
        // start a sama atau sebelum b

        if (moment(ve_a).isSameOrBefore(vs_b)) {
          // start a sama atau sebelum start b
          // ending a sama atau sebelum start b
          vs_result = null
          ve_result = null

        } else {
          // start a sama atau sebelum start b
          // ending a setelah start b

          vs_result = vs_b

          if (moment(ve_a).isSameOrBefore(ve_b)) {
            // start a sama atau sebelum start b
            // ending a setelah start b
            // ending a sebelum ending b

            ve_result = ve_a

          } else {
            // start a sama atau sebelum start b
            // ending a setelah start b
            // ending a setelah ending b

            ve_result = ve_b

          }
        }
      } else {
        // start b sebelum start a

        if (moment(ve_b).isSameOrBefore(vs_a)) {
          vs_result = null
          ve_result = null

        } else {

          vs_result = vs_a

          if (moment(ve_b).isSameOrBefore(ve_a)) {
            ve_result = ve_b

          } else {
            ve_result = vs_a

          }
        }
      }
    } else if (ve_a == null && ve_b == null) {
      vs_result = null
      ve_result = null

    } else if (ve_b != null) {
      // ve_a == null

      if (moment(vs_b).isSameOrBefore(vs_a)) {
        if (moment(ve_b).isSameOrBefore(vs_a)) {
          vs_result = null
          ve_result = null

        } else {
          vs_result = vs_a
          ve_result = ve_b

        }
      } else {
        vs_result = vs_b
        ve_result = ve_b

      }
    } else if (ve_a != null) {
      // ve_b == null

      if (moment(vs_a).isSameOrBefore(vs_b)) {
        if (moment(ve_a).isSameOrBefore(vs_b)) {
          vs_result = null
          ve_result = null

        } else {
          vs_result = vs_b
          ve_result = ve_a

        }
      } else {
        vs_result = vs_a
        ve_result = ve_a

      }
    }

  current[0][i].valid_time[0] = vs_result
  current[0][i].valid_time[1] = ve_result

  if (vs_result != null && ve_result != null) {
    delete current[0][i].a
    delete current[0][i].b
    result_array.push(current[0][i])
  }

  }

  res.render('index', {title: 'PDL TUBES 1 | JOIN', join_results: result_array})

  // console.log(result_array)

});

module.exports = router;


