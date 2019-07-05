'use strict';
const GitHub = require('github-api');
const Tickets = require('../models/tickets');
const logger = require('../logger');
const moment = require('moment');

function getIssues(config) {
    const auth = config && config.auth || null;
    const gh = new GitHub(auth);
    const issues = gh.getIssues(config.username, config.repository);
    return issues.listIssues();
}
function commentIssue(config, ticketId, comment) {
    const auth = config && config.githubAuth || false;
    if(!config || !(auth.password || auth.token)) {
        logger.info('commentIssue canceled');
        return false;
    }
    const gh = new GitHub(auth);
    const Issues = gh.getIssues(config.githubUsername, config.githubRepository);
    return Tickets.findOne({_id: ticketId})
        .then((ticket) => {
            if(!ticket || !ticket.externalId) {
                return false;
            }
            return Issues.createIssueComment(ticket.externalId, comment)
                .catch((error) => {
                    logger.error('githubError: ', error.message);
                    throw new Error(`GihubError: ${error.message}`);
                });
        });
}
function closeIssue(config, ticketId) {
    const auth = config && config.auth || false;
    if(!config || !(config.githubAuth.password || config.githubAuth.token)) {
        return false;
    }
    const gh = new GitHub(auth);
    const Issues = gh.getIssues(config.githubUsername, config.githubRepository);
    return Tickets.findOne({_id: ticketId})
        .then((ticket) => {
            if(!ticket || !ticket.externalId) {
                return false;
            }
            return Issues.editIssue(ticket.externalId, {state: 'close'})
                .catch((error) => {
                    logger.error('githubError: ', error.message);
                    throw new Error(`GihubError: ${error.message}`);
                });
        });
}
function checkTicket(ghTicket) {
    return Tickets.findOne(({externalId: ghTicket.number}))
        .then((ticket) => {
            if(!ticket) {
                let newTicket = new Tickets({
                    externalId: ghTicket.number,
                    externalUrl: ghTicket.html_url,
                    createdAt: moment(ghTicket.created_at),
                    updatedAt: moment(ghTicket.updated_at),
                    title: ghTicket.title,
                    description: ghTicket.body
                });
                return newTicket.save();
            }
            if(moment(ticket.updatedAt).isBefore(moment(ghTicket.updated_at))) {
                ticket.updatedAt = moment(ghTicket.updated_at).toDate();
                ticket.title = ghTicket.title;
                ticket.description = ghTicket.body;
                return ticket.save();
            }
            return ticket;
        });
}
function updateBoard(board) {
    let config = board.configuration;
    return getIssues({
        auth:config.githubAuth,
        username: config.githubUsername,
        repository: config.githubRepository
    })
        .then(async({data}) => {
            const issues = data;
            let boardModified = false;
            for (let i = 0; i < issues.length; i++) {
                let ticket = await checkTicket(issues[i]);
                if(!board.tickets.find((boardTicket) => boardTicket.ticket.equals(ticket._id))) {
                    board.tickets.push({ticket:ticket._id, list: board.defaultList});
                    boardModified = true;
                }
            }
            if(boardModified) {
                board.configuration.updateNow = false;
                return board.save();
            }
            return board;
        });

}
function enabledAuth(configurations) {
    const auth = configurations.githubAuth;
    return configurations.githubEnabled && auth.username && (auth.password || auth.token);
}
function getUserData(token) {
    const gh = new GitHub({token});
    const User = gh.getUser();
    return User.getProfile()
        .then(({data}) => data)
        .catch((error) => {
            logger.error('githubError: ', error.message);
            throw new Error(`GihubError: ${error.message}`);
        });
}
module.exports = {
    getIssues,
    updateBoard,
    closeIssue,
    commentIssue,
    enabledAuth,
    getUserData
};
