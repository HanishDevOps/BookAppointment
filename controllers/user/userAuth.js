var express = require('express');
var app = express();
var router = express.Router();
const { check, body, validationResult } = require('express-validator');
const path = require('path');
var con = require('./../../models/authDB')
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({extended: false});
app.use(bodyParser.json())

//post route for user registration
router.post('/auth/register',urlencodedParser, [check('email', "Not Email").isEmail(), body('password').isLength({ min: 5 }), body('name').isLength({ min: 3 }),body('mobile_number').isLength({ min: 10 })], function (req, res) {
    if (!validationResult(req).isEmpty()) {
        res.render('./../views/login.ejs',{
            registererror:"All fields are mandatory!"
        })
    }
    else{
        con.register('auth',req.body,function(result){
            console.log(result)
            if(result=="Email already in use"){
                console.log(result)
                res.render('./../views/login.ejs',{
                    registererror:"Email already in use!"
                })
            }
            else if(result==1){
               res.render('./../views/login.ejs',{
                registererror:"Oops! Something went wrong!"
            })
            }
            else{
                res.redirect('/login')
            }
            
          });
    }
    
    
});

//post route for user login
router.post('/auth/login',urlencodedParser, [check('email', "Not Email").isEmail(), body('password').isLength({ min: 5 })],async function (req, res) {
     if (!validationResult(req).isEmpty()) {
            
            res.render('./../views/login.ejs',{
                loginerror:"All fields are mandatory!"
            })
        }
        else{
        con.login('auth',req.body,function(result){
            if(result.length==0){
                res.render('./../views/login.ejs',{
                    loginerror:"Wrong Credentials"
                })
            }
            else{
                console.log(result)
                var url = '/home/'+result[0]._id;
                res.redirect(url)
            }
          });
        }
});

//get route for userAccountDetails
router.get('/auth/userAccountDetails',function(req,res){
    con.getUserDetail('auth',req.body,function(result){
        if(result.length==0){
            res.status(400).send('No user Found!')
        }
        else{
            console.log('response',result);
            res.status(200).send(result);
        }
        
      });
});



module.exports = router;