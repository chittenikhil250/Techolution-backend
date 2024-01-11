const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const passport = require('passport');
const cors = require('cors');
const config = require('./Config/config');
const loginRoute = require('./Routes/auth/login');
const signupRoute = require('./Routes/auth/signup');
const mongoose = require('mongoose');
const profileRoute = require('./Routes/user/profile');
const adminRoute = require('./Routes/user/admin');
const itemsRoute = require('./Routes/items');
require('dotenv').config();


const port = process.env.port || 4000;

const corsOptions = {
    // origin: '*',
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: false})); 
app.use(cors(corsOptions));
app.use(express.json());

app.use((error, req, res, next) => {
    error.status = error.status || 500;
    res.status(error.status);
    res.render('error_40x', { error });
});

app.use((req, res, next)=>{
    res.locals.user = req.user;
    next();
});


app.use('/auth', loginRoute);
app.use('/auth', signupRoute);
app.use('/user', profileRoute);
app.use('/user', adminRoute);
app.use('/', itemsRoute);
require('./Utils/auth');

const server = async() => {
    try {
        await mongoose.connect(config.db_url, {
            dbName: config.db_name
        });
        console.log('db connected...');
        app.listen(port, ()=> console.log('app listening on port '+port ));
    } catch (err) {
        console.error(err);
        throw new Error(`couldn't connect to db`);
        server();
    }
}

server();