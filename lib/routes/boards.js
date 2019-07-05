'use strict';
const express = require('express');
const Boards = require('../models/boards');
const router = express.Router();
const {commentIssue, closeIssue, enabledAuth} = require('../utils/github');
router.put('/:boardId/ticket/:ticketId/:listName', (req, res, next) => {
    const {boardId, ticketId, listName} = req.params;
    Boards.findOne({_id:boardId})
        .then((board) => {
            if(!board || !board.lists.includes(listName)) {
                return next(new Error('Not found'));
            }
            const ticket = board.tickets.find((current) => current.ticket.equals(ticketId));
            ticket.list = listName;
            return board.save();
        })
        .then(async(board) => {
            if(listName === 'Done' && enabledAuth(board.configuration)) {
                let resp = await commentIssue(board.configuration, ticketId, '`Pluton Bot: ` Solved.');
                console.log('resp: ', resp);
                await closeIssue(board.configuration, ticketId);
            }
            return res.json(board);
        })
        .catch(next);
});
router.delete('/:boardId/lists/:listName', (req, res, next) => {
    const {boardId, listName} = req.params;
    Boards.findOne({_id:boardId})
        .then((board) => {
            if(!board || !board.lists.includes(listName)) {
                throw new Error('Not found');
            }
            if(listName === board.defaultList) {
                throw new Error('Can\'t delete default list');
            }
            board.lists = board.lists.filter((list) => list !== listName);
            board.tickets.forEach((ticket) => {
                if(ticket.list === listName) {
                    ticket.list = board.defaultList;
                }
            });
            return board.save();
        })
        .then((board) => {
            return res.json(board);
        })
        .catch(next);
});
module.exports = router;
