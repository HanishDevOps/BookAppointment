const express = require('express');
const bodyparser = require('body-parser');
const app = express();
const path = require('path');

const userAuthRoutes = require('./user/userAuth');
const userAppointmentRoutes = require('./user/userAppointment');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'views')));

app.listen(3000);

app.use(bodyparser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,PUT,OPTIONS');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }

});

app.use('/', userAuthRoutes);
app.use('/', userAppointmentRoutes);



module.exports = app;