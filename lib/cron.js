'use strict';
const CronJob = require('cron').CronJob;
const logger = require('./logger');
const moment = require('moment');
const TIME_ZONE = process.env.TIME_ZONE;
const Boards = require('./models/boards');
const {updateBoard} = require('./utils/github');
const running = new Set();
function syncBoardsNow() {
    logger.debug('starting cron syncBoardsNow');
    if(running.has('syncBoardsNow')) {
        return false;
    }
    running.add('syncBoardsNow');
    return Boards.find({
        'configuration.githubEnabled': true,
        'configuration.updateNow': true
    })
        .then(async(boards) => {
            logger.debug(`syncBoardsNow: before update boards: ${boards.length}`);
            for (var i = 0; i < boards.length; i++) {
                logger.debug(`syncBoardsNow: updating board: ${boards[i]._id}`);
                await updateBoard(boards[i]);
                logger.debug(`syncBoardsNow: end board: ${boards[i]._id}`);
            }
        })
        .then(() => {
            running.delete('syncBoardsNow');
        })
        .catch((error) => {
            logger.error('syncBoardsNowError:', error);
            running.delete('syncBoardsNow');
        });
}
function syncBoards() {
    logger.debug('starting cron syncBoards');
    if(running.has('syncBoards')) {
        return false;
    }
    running.add('syncBoards');
    return Boards.find({
        'configuration.githubEnabled': true,
        'configuration.updateNow': false,
        'latestSyncRemote': {$lt:moment().subtract(5, 'minutes')
        }})
        .then(async(boards) => {
            logger.debug(`before update boards: ${boards.length}`);
            for (var i = 0; i < boards.length; i++) {
                logger.debug(`updating board: ${boards[i]._id}`);
                await updateBoard(boards[i]);
            }
        })
        .then(() => {
            running.delete('syncBoards');
        })
        .catch((error) => {
            logger.error('syncBoardsError:', error);
            running.delete('syncBoards');
        });
}
function startCronJobs() {
    let boardsNowCron = new CronJob('* * * * *', syncBoardsNow, null, true, TIME_ZONE);
    let boardsCron = new CronJob('*/5 * * * *', syncBoards, null, true, TIME_ZONE);

    return {
        boardsNowCron,
        boardsCron
    };
}


module.exports = {
    startCronJobs
};
