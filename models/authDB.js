const mongoClient = require('mongodb').MongoClient;
const db_url = "mongodb+srv://hanishdb:Hanish8013@cluster0.381hf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
//const url = "mongodb+srv://admin:qwerty123@cluster0.h7iox.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const db_name = "appointment";
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { ObjectId }  = require("mongodb");
module.exports = {

// for login of user
 async  login(colName,theObject,retFunc){
        mongoClient.connect(db_url, function (err, dbServer) {
            if (err) throw err;
            else {
                console.log("Conected to db server" + dbServer);
                var myDB = dbServer.db(db_name)
                
                myDB.collection(colName).find({email:theObject.email}).toArray(function (err, result) {
                    if (err) {
                        return retFunc(1);
                    }
                    else {
                        if(result.length!=0){
                            bcrypt.compare(theObject.password, result[0].password, function(err, new_result) {
                                if(new_result){
                                    retFunc(result);
                                }
                                else
                                retFunc([]);
                            });
                        }
                        else{
                            retFunc([]);
                        }
                        
                    }
                });
        
            }
        })
    },

// for user registration
async  register(colName,theObject,retFunc){
        mongoClient.connect(db_url, function (err, dbServer) {
            if (err) throw err;
            else {
                console.log("Conected to db server" + dbServer);
                var myDB = dbServer.db(db_name)
                myDB.collection(colName).find({email:theObject.email}).toArray(function (err, result) {
                    if (err) {
                        return retFunc(1);
                    }
                    else {
                        if(result.length==0){
                            console.log("The result here is ",result)
                            var hashedPassword;
                            var theNewObject={};
                            theNewObject = theObject;
                            bcrypt.hash(theObject.password, saltRounds, function(err, hash) {
                               
                                theNewObject.password = hash;
                                myDB.collection(colName).insertOne(theNewObject, function(err, resultNew){
                                    if(err) {
                                        return retFunc(1)
                                    }
                                     else{
                                        var rslt = JSON.stringify(resultNew);
                                        return retFunc(rslt)
                                       
                                    }
                                })
                            });  
                        }
                        else{
                            return retFunc("Email already in use")
                        }
                    }
                });
        
            }
        })
    }
}
