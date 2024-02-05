const mongoClient = require('mongodb').MongoClient;
const db_url = "mongodb+srv://hanishdb:Hanish8013@cluster0.381hf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
//const url = "mongodb+srv://admin:qwerty123@cluster0.h7iox.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const db_name = "appointment";
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { ObjectId } = require("mongodb");
module.exports = {

    // to updateProfile of loggedIn user
    async updateProfile(colName, updateQuery, updateClause, retFunc) {
        mongoClient.connect(db_url, function (err, dbServer) {
            if (err)
                throw err;
            else {
                var myDatabase = dbServer.db(db_name);

                myDatabase.collection(colName).updateOne(updateQuery, updateClause, function (er, result) {
                    if (err)
                        retFunc(1);
                    else {
                        return retFunc(result)
                    }
                })
            }
        })
    },

    // to get the userDetails
    async getUserDetail(colName, id, retFunc) {
        mongoClient.connect(db_url, function (err, dbServer) {
            if (err) throw err;
            else {
                var myDatabase = dbServer.db(db_name);
                var ObjectId = require('mongodb').ObjectId;
                var o_id = new ObjectId(id);
                myDatabase.collection(colName).find({ _id: o_id }).toArray(function (err, result) {
                    if (err) {
                        return retFunc(1)

                    }
                    else {
                        return retFunc(result)
                    }
                })
            }
        })
    },

    // To get the login details of user
    async getLoginDetail(colName, myEmail, retFunc) {
        mongoClient.connect(db_url, function (err, dbServer) {
            if (err) throw err;
            else {
                var myDatabase = dbServer.db(db_name);
                myDatabase.collection(colName).find(myEmail).toArray(function (err, result) {
                    if (err) {
                        return retFunc(1)

                    }
                    else {
                        console.log(result, "this is from getLoginDetail function", result);
                        return retFunc(result)

                    }
                })
            }
        })
    },

    // to retrieve data for appointment details
    async getAppointmentDetail(colName, myEmail, retFunc) {
        mongoClient.connect(db_url, function (err, dbServer) {
            if (err) throw err;
            else {
                var myDatabase = dbServer.db(db_name);
                myDatabase.collection(colName).find({ email: myEmail }).toArray(function (err, result) {
                    if (err) {
                        return retFunc(1)
                    }

                    else {
                        return retFunc(result)
                    }
                })
            }
        })
    }
    ,

    //inserting appointment details
    async addAppointmentIntoCollection(colName, theObject, retFunc) {

        mongoClient.connect(db_url, function (err, dbServer) {
            if (err) throw err;
            else {
                var myDatabase = dbServer.db(db_name);
                myDatabase.collection(colName).insertOne(theObject, function (err, result) {
                    if (err) {
                        return retFunc(1)

                    }
                    else {
                        return retFunc(result)
                    }
                })
            }
        })
    },

    // update appointment of user
    async updateAppointmentIntoCollection(colName, updateQuery, updateClause, retFunc) {

        mongoClient.connect(db_url, function (err, dbServer) {
            if (err)
                throw err;
            else {
                var myDatabase = dbServer.db(db_name);
                myDatabase.collection(colName).updateOne(updateQuery, updateClause, function (er, result) {
                    if (err)
                        retFunc(1);
                    else {
                        return retFunc(result)
                    }
                })
            }
        })
    },

    // cancel an appointment 
    async deleteAppointmentFromCollection(colName, delQuery, retFunc) {

        mongoClient.connect(db_url, function (err, dbServer) {
            if (err)
                throw err;
            else {

                var myDatabase = dbServer.db(db_name);
                myDatabase.collection(colName).deleteOne({ email: delQuery }, function (err, result) {
                    if (err)
                        return retFunc(1);
                    else {
                        return retFunc(result);
                    }
                });
            }
        })
    },

    // check if doctor is available at particular time
    async checkDoctorAvailability(colName, theObject, retFunc) {

        mongoClient.connect(db_url, function (err, dbServer) {
            if (err)
                throw err;
            else {
                console.log(theObject)

                var myDatabase = dbServer.db(db_name);
                myDatabase.collection(colName).find({ doctorName: theObject.doctorName }, function (err, result) {
                    if (err)
                        return retFunc(1);
                    else {
                        return retFunc(result);
                    }
                });
            }
        })


    }

}


