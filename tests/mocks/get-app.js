'use strict';
const application = require('../../app');
let app;

function getApp() {
    if(app) {
        return Promise.resolve(app);
    }
    return application.connectMongoose()
        .then(() => {
            app = application.initialize();
            app.listen(process.env.SERVER_PORT);
            return app;
        })
        .catch((err) => {
            console.error(err);
            return process.exit(1);
        });
}

module.exports = {
    getApp
};
