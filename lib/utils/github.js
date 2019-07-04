'use strict';
const GitHub = require('github-api');
const Tickets = require('../models/tickets');
const moment = require('moment');
function getIssues(config) {
    const auth = config && config.auth || null;
    const gh = new GitHub(auth);
    const issues = gh.getIssues(config.username, config.repository);
    return issues.listIssues();
}
function checkTicket(ghTicket) {
    return Tickets.findOne(({externalId: ghTicket.node_id}))
        .then((ticket) => {
            if(!ticket) {
                let newTicket = new Tickets({
                    externalId: ghTicket.node_id,
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

module.exports = {
    getIssues,
    updateBoard
};
