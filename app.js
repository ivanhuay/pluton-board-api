'use strict';
const express = require('express');
const path = require('path');
const logger = require('./lib/logger');
const expressWinston = require('express-winston');
require('dotenv').config({path:path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`)});
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const routes = require('./lib/routes');
const app = express();
const extractJwt = require('./lib/middlewares/extract-jwt');
const publicPath = require('./config/public');
const cors = require('cors');
const {createFirstUser} = require('./lib/utils/create-first-user');
const {startCronJobs} = require('./lib/cron');
function connectMongoose() {
    const mongoose = require('mongoose');
    mongoose.Promise = Promise;
    return mongoose.connect('mongodb://' + process.env.MONGODB_HOST + ':' + process.env.MONGODB_PORT + '/' + process.env.MONGODB_DB, {useNewUrlParser: true})
        .then(() => createFirstUser())
        .then(() => {
            startCronJobs();
        });

}

function initialize() {
    app.use(expressWinston.logger({
        winstonInstance: logger,
        expressFormat: true,
        colorize: false,
        meta: false,
        statusLevels: true
    }));
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));

    app.use(publicPath.pathRegex, extractJwt);

    Object.keys(routes).forEach((key) => {
        app.use(`/api/${key}`, routes[key]);
    });

    const buildHiroki = require('./build-hiroki');
    app.use(buildHiroki());


    app.use(function(req, res, next) {
        let err = new Error('Not Found');
        err.status = 404;
        next(err);
    });
    // eslint-disable-next-line no-unused-vars
    app.use(function(err, req, res, next) {
        logger.error('handleError: ', err);
        if (res.headersSent) {
            return next(err);
        }
        let error = {};
        error.status = err.status;
        error.message = err.message;
        if (req.app.get('env') === 'development') {
            error.stack = err.stack;
        }
        return res.status(err.status || 500).json({
            error
        });
    });

    return app;
}

module.exports = {
    initialize,
    connectMongoose
};
