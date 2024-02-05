//installing required modules
var express = require('express');
var app = express()
var router = express.Router();
var bodyParser = require('body-parser')
var con = require('./../../models/connectionDB')
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const { check, body, validationResult } = require('express-validator');
app.use(bodyParser.json())
var loginDetailId;
var nodemailer = require('nodemailer');
var config = require('./../../config')

//nodemailer for email service
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.useremail,
    pass: config.password
  }
});

//using ejs for templating
app.set('view engine', 'ejs');
const path = require('path');
app.set('views', path.join(__dirname, 'views'));


// get route for login
router.get('/login', function (req, res) {
  res.render('./../views/login.ejs')
})

// get route for homepage
router.get('/home/:id', function (req, res) {

  res.render('./../views/home.ejs', {
    loginResult: req.params.id,
    addAppointmentResult: "",
    updateAppointmentResult: "",
    delAppointmentResult: ""
  });
});

// get route for view appointment
router.get('/viewAppointment/:id', function (req, res) {

  let id = req.params.id;
  con.getUserDetail('auth', id, function (result) {
    con.getAppointmentDetail('appointmentDetail', result[0].email, function (newResult) {

      if (newResult.length == 0) {
        var url = '/home/' + req.params.id
        res.redirect(url);
      }
      else {
        res.render('./../views/viewAppointment.ejs', {
          loginResult: req.params.id,
          addAppointmentResult: newResult[0],
          updateAppointmentResult: newResult[0],
          delAppointmentResult: newResult[0]
        });
      }


    })
  })
});

// get route for aboutus page

router.get('/aboutus/:id', function (req, res) {

  res.render('./../views/aboutUs.ejs', {
    loginResult: req.params.id,
    addAppointmentResult: "",
    updateAppointmentResult: "",
    delAppointmentResult: ""
  });
});

router.get('/', function (req, res) {
  res.redirect('/login')
});

//get route for updateProfile page
router.get('/updateProfile/:id', function (req, res) {
  let id = req.params.id;
  loginDetailId = id;
  con.getUserDetail('auth', id, function (result) {
    res.render('./../views/updateProfile.ejs', {
      alert:"undefined",
      loginResult: req.params.id,
      addAppointmentResult: result[0],
      updateAppointmentResult: result[0],
      delAppointmentResult: result[0]
    });
  })

})

// get route for addAppointment page
router.get('/addAppointment/:id', function (req, res) {
  let id = req.params.id;
  loginDetailId = id;
  con.getUserDetail('auth', id, function (result) {
    con.getAppointmentDetail('appointmentDetail', result[0].email, function (newResult) {
      if (newResult.length != 0) {
        var url = '/home/' + req.params.id
        res.redirect(url);
      }
      else {
        res.render('./../views/addAppointment.ejs', {
          alert: 'undefined',
          loginResult: req.params.id,
          addAppointmentResult: result[0],
          updateAppointmentResult: result[0],
          delAppointmentResult: result[0]
        });
      }

    })
  })
});


// get route for updateAppointment page
router.get('/updateAppointment/:id', function (req, res) {

  let id = req.params.id;
  loginDetailId = id;
  con.getUserDetail('auth', id, function (result) {
    con.getAppointmentDetail('appointmentDetail', result[0].email, function (newResult) {

      if (newResult.length == 0) {
        var url = '/home/' + req.params.id
        res.redirect(url);
      }
      else {
        res.render('./../views/updateAppointment.ejs', {
          alert: 'undefined',
          loginResult: req.params.id,
          addAppointmentResult: newResult[0],
          updateAppointmentResult: newResult[0],
          delAppointmentResult: newResult[0]
        });
      }


    })
  })

});

//get route for deleteAppointment
router.get('/deleteAppointment/:id', function (req, res) {
  let id = req.params.id;
  loginDetailId = id;
  con.getUserDetail('auth', id, function (result) {
    con.getAppointmentDetail('appointmentDetail', result[0].email, function (newResult) {
      if (newResult.length == 0) {
        var url = '/home/' + req.params.id
        res.redirect(url);
      }
      else {
        res.render('./../views/deleteAppointment.ejs', {
          loginResult: req.params.id,
          addAppointmentResult: newResult[0],
          updateAppointmentResult: newResult[0],
          delAppointmentResult: newResult[0]
        });
      }

    })
  })
})

// post route for addAppointment page
router.post('/addAppointment', urlencodedParser, [check('email', "Not Email").isEmail(), body('fname').isLength({ min: 3 }), body('lname').isLength({ min: 3 }), body('time').isLength({ min: 5 })], body('doctorName').isLength({ min: 3 }), function (req, res) {
  if (!validationResult(req).isEmpty()) {
    const errors = validationResult(req)
    const alert = errors.array();
    con.getUserDetail('auth', req.body.loginId, function (result) {
      console.log(errors)
      //con.getAppointmentDetail('appointmentDetail', result[0].email, function (newResult) {
        res.render('./../views/addAppointment.ejs', {
          alert: "All fields are required in Appointment form.Please fill again.",
          loginResult: req.body.loginId,
          addAppointmentResult: result[0],
          updateAppointmentResult: result[0],
          delAppointmentResult: result[0]
        });
      //})
    }
    )

  }
  else {

    con.checkDoctorAvailability('appointmentDetail', req.body, function (resssult) {
      //const allValues =  resssult.toArray();
      resssult.toArray().then(ress => {
        console.log(ress)

        var flag = false;
        for (var i = 0; i < ress.length; i++) {
          if (ress[i].time.split(" ")[0] == req.body.time.split(" ")[0]) {
            if ((ress[i].time.split(" ")[1].split(":")[0] == req.body.time.split(" ")[1].split(":")[0]) && (ress[i].time.split(" ")[1].split(":")[1] == req.body.time.split(" ")[1].split(":")[1]) && (ress[i].time.split(" ")[2] == req.body.time.split(" ")[2])) {
              console.log("Appointment already exists")
              flag = true;
              break;
            }
          }

        }
        if (flag == false) {
          console.log("can be booked")
          con.addAppointmentIntoCollection('appointmentDetail', req.body, function (result) {
            if (result.insertedCount == 0) {
              con.getUserDetail('auth', req.body.loginId, function (newResult) {
                var url = '/home/' + req.body.loginId
                res.redirect(url);
              }
              )
            }
            else {
              emailtext = 'Your appointment is booked at ' + req.body.time + ' with ' + req.body.doctorName;

              var mailOptions = {
                from: '"QUICK DENTAL CLINIC" <hanishkrchander@gmail.com>',
                to: 'yogeshkrchander@gmail.com',
                subject: 'Dental Appointment ',
                text: 'Greeting',
                html: '<b>Hello Sir/Mam </b><br>' + `${emailtext}`
              };

              transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                  return console.log(error);
                }

                console.log('Message sent: ' + info.response);
              });

              con.getUserDetail('auth', req.body.loginId, function (newResult) {
                var url = '/home/' + req.body.loginId
                res.redirect(url);
              }
              )
            }

          })
        }
        else {
          console.log("cannot be booked")
          con.getUserDetail('auth', req.body.loginId, function (result) {
            con.getAppointmentDetail('appointmentDetail', result[0].email, function (newResult) {
              res.render('./../views/addAppointment.ejs', {
                alert: "The doctor is unavailable at the selected time. Please Choose another time slot",
                loginResult: req.body.loginId,
                addAppointmentResult: newResult[0],
                updateAppointmentResult: newResult[0],
                delAppointmentResult: newResult[0]
              });
            })
          })

        }

      })
    })
  }
})

// post route for updateAppointment
router.post('/updateAppointment', urlencodedParser, [check('email', "Not Email").isEmail(), body('fname').isLength({ min: 3 }), body('lname').isLength({ min: 3 }), body('time').isLength({ min: 5 })], body('doctorName').isLength({ min: 3 }), function (req, res) {
  con.getAppointmentDetail('appointmentDetail', req.body.email, function (apptResult) {

    if (apptResult.length == 0) {
      var url = '/addAppointment/' + req.body.loginId
      res.redirect(url);

    }
    else {


      if (!validationResult(req).isEmpty()) {
        const errors = validationResult(req)
        con.getUserDetail('auth', req.body.loginId, function (result) {
          console.log(errors)
          con.getAppointmentDetail('appointmentDetail', result[0].email, function (newResult) {
            res.render('./../views/updateAppointment.ejs', {
              alert: "All fields are required!",
              loginResult: req.body.loginId,
              addAppointmentResult: newResult[0],
              updateAppointmentResult: newResult[0],
              delAppointmentResult: newResult[0]
            });
          })
        }
        )
      }
      else {

        con.checkDoctorAvailability('appointmentDetail', req.body, function (resssult) {
          resssult.toArray().then(ress => {
            console.log(ress)

            var flag = false;
            for (var i = 0; i < ress.length; i++) {
              if (ress[i].time.split(" ")[0] == req.body.time.split(" ")[0]) {
                if ((ress[i].time.split(" ")[1].split(":")[0] == req.body.time.split(" ")[1].split(":")[0]) && (ress[i].time.split(" ")[1].split(":")[1] == req.body.time.split(" ")[1].split(":")[1]) && (ress[i].time.split(" ")[2] == req.body.time.split(" ")[2])) {
                  console.log("Appointment already exists")
                  flag = true;
                  break;
                }
              }

            }
            if (flag == false) {
              console.log("can be booked")
              con.updateAppointmentIntoCollection('appointmentDetail', { email: req.body.email }, { $set: { time: req.body.time, doctorName: req.body.doctorName } }, function (result) {
                if (result.modifiedCount == 0) {
                  con.getUserDetail('auth', req.body.loginId, function (newResult) {

                    var url = '/home/' + req.body.loginId
                    res.redirect(url);
                  }
                  )
                }
                else {
                  emailtext = 'Your appointment booking is now updated at ' + req.body.time + ' with ' + req.body.doctorName;

                  var mailOptions = {
                    from: '"QUICK DENTAL CLINIC" <hanishkrchander@gmail.com>', // sender address (who sends)
                    to: 'yogeshkrchander@gmail.com', // list of receivers (who receives)
                    subject: 'Dental Appointment ', // Subject line
                    text: 'Greeting', // plaintext body
                    html: '<b>Hello Sir/Mam </b><br>' + `${emailtext}` // html body
                  };

                  transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                      return console.log(error);
                    }

                    console.log('Message sent: ' + info.response);
                  });
                  con.getUserDetail('auth', req.body.loginId, function (newResult) {
                    var url = '/home/' + req.body.loginId
                    res.redirect(url);

                  }
                  )
                };

              });
            }
            else {
              console.log("cannot be booked")
              con.getUserDetail('auth', req.body.loginId, function (result) {
                con.getAppointmentDetail('appointmentDetail', result[0].email, function (newResult) {
                  res.render('./../views/updateAppointment.ejs', {
                    alert: "The doctor is unavailable at the selected time. Please Choose another time slot",
                    loginResult: req.body.loginId,
                    addAppointmentResult: newResult[0],
                    updateAppointmentResult: newResult[0],
                    delAppointmentResult: newResult[0]
                  });
                })
              })

            }

          })
        })

      }
    }
  });
});

// post route for deleteAppointment
router.post('/deleteAppointment', urlencodedParser, function (req, res) {
  con.getAppointmentDetail('appointmentDetail', req.body.email, function (apptResult) {

    if (apptResult.length == 0) {
      var url = '/addAppointment/' + req.body.loginId
      res.redirect(url);

    }
    else {

      con.deleteAppointmentFromCollection('appointmentDetail', req.body.email, function (result) {
        if (result.deletedCount == 0) {
          con.getUserDetail('auth', req.body.loginId, function (newResult) {

            var url = '/home/' + req.body.loginId
            res.redirect(url);
          }
          )
        }
        else {
          emailtext = 'This is to inform that your appointment booking is cancelled';

          var mailOptions = {
            from: '"QUICK DENTAL CLINIC" <hanishkrchander@gmail.com>',
            to: 'yogeshkrchander@gmail.com',
            subject: 'Dental Appointment ',
            text: 'Greeting',
            html: '<b>Hello Sir/Mam </b><br>' + `${emailtext}`
          };

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              return console.log(error);
            }

            console.log('Message sent: ' + info.response);
          });

          con.getUserDetail('auth', req.body.loginId, function (newResult) {

            var url = '/home/' + req.body.loginId
            res.redirect(url);
          })
        }

      });
    }
  })


});

// post route for updateProfile page
router.post('/updateProfile', urlencodedParser,[check('email', "Not Email").isEmail(), body('name').isLength({ min: 3 }), body('mobile_number').isLength({ min: 8 })], function (req, res) {

  console.log(req.body)

  if (!validationResult(req).isEmpty()) {
   // const errors = validationResult(req)
    con.getUserDetail('auth', req.body.loginId, function (result) {
    //  console.log(errors)
     // con.getAppointmentDetail('appointmentDetail', result[0].email, function (newResult) {
        res.render('./../views/updateProfile.ejs', {
          alert: "Please fill all the fields in the form properly",
          addAppointmentResult: result[0],
          loginResult: req.body.loginId,
          updateAppointmentResult: result[0],
        });
     // })
    }
    )
  }
  else{
    con.updateProfile('auth', { email: req.body.email }, { $set: { mobile_number: req.body.mobile_number, name: req.body.name } }, function (result) {
      if (result.modifiedCount == 0) {
        con.getUserDetail('auth', req.body.loginId, function (newResult) {
  
          var url = '/home/' + req.body.loginId
          res.redirect(url);
        }
        )
      }
      else {
        con.getUserDetail('auth', req.body.loginId, function (newResult) {
  
          var url = '/home/' + req.body.loginId
          res.redirect(url);
        }
        )
      };
    })
  }


 
});



module.exports = router;
