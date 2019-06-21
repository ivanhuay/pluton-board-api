'use strict';
const express = require('express');
const Boards = require('../models/boards');
const Tickets = require('../models/tickets');
const router = express.Router();
router.post('/board/:id', function(req, res, next) {
  const defaultList = 'Todo';
  const title = req.body.title;
  if (!title) {
    return next(new Error('Title required'));
  }
  Boards.findOne({
      _id: req.params.id
    })
    .then(async(board) => {
      if (!board) {
        return next(new Error('Not found'));
      }
      const todoList = board.lists.find((list)=>{
        return list.title === defaultList;
      });
      const newTicket = new Tickets({title:title});
      await newTicket.save();
      if(!todoList.list){
          todoList.list = [];
      }
      todoList.list.push(newTicket._id);
      return board.save();
    })
    .then((board) => {
      return res.json(board);
    })
    .catch(next);
});

module.exports = router;
