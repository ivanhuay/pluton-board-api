'use strict';
const Board = require('../models/boards');
const logger = require('../logger');
function userDecorator(controller) {

    // controller.request('put', (req, res, next) => {
    //     if(req.body.lists) {
    //         Reflect.deleteProperty(req.body, 'lists');
    //     }
    //     next();
    // });
    // controller.request('put', function(req, res, next) {
    //     const boardId = req.params.id;
    //     const body = req.body;
    //     if(!req.body.lists) {
    //         return next();
    //     }
    //     logger.info('body: ', body);
    //     // Board.findOne({_id: boardId})
    //     Board.findOne({
    //         _id: boardId
    //     })
    //         .then((board) => {
    //             if(!board) {
    //                 const error = new Error('Not found');
    //                 error.status = 404;
    //                 throw error;
    //             }
    //             if(!req.body.list.includes(board.defaultList)) {
    //                 req.body.list.push(board.defaultList);
    //             }
    //             const deletedLists = board.list.filter((item) => !req.body.list.includes(item));
    //
    //             board.tickets.forEach((ticket) => {
    //                 if(deletedLists.includes(ticket.list)) {
    //                     ticket.list = board.defaultList;
    //                 }
    //             });
    //         });
    //     next();
    // });
}
module.exports = userDecorator;
