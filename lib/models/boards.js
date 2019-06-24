'use strict';
const mongoose = require('mongoose');

const BoardsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    lists: [String],
    tickets: [{
        ticket: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tickets'
        },
        list: String
    }],
    startDate: Date,
    endDate: Date,
    status: String,
    public: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
const defaultLists = ['Todo', 'Done', 'In Progress'];
BoardsSchema.pre('save', function(next) {
    var self = this;
    if(self.isNew && self.lists.length === 0) {
        self.lists = defaultLists;
    }
    next();
});
BoardsSchema.index({'_id':1, 'lists.title':1}, {unique: true});
module.exports = mongoose.model('Boards', BoardsSchema);
