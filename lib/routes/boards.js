'use strict';
const express = require('express');
const Boards = require('../models/boards');
const router = express.Router();

router.put('/:boardId/ticket/:ticketId/:listName', (req, res, next) => {
    const {boardId, ticketId, listName} = req.props;
    Boards.findOne({_id:boardId})
        .then((board) => {
            if(!board) {
                return next(new Error('Not found'));
            }
            const ticket = board.tickets.find((current) => current._id.equals(ticketId));
            ticket.list = listName;
            return board.save();
        })
        .then((board) => {
            return res.json(board);
        })
        .catch(next);
});
module.exports = router;
