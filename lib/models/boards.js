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
    defaultList: {
        type: String,
        default: 'Todo'
    },
    public: {
        type: Boolean,
        default: false
    },
    githubRepositories: [{
        username: String,
        project: String
    }],
    configuration: {
        githubEnabled: {
            type: Boolean,
            default: false
        },
        githubRepository: String,
        githubUsername: String,
        githubAuth:{
            username: String,
            password: String,
            token: String
        },
        updateNow: {
            type: Boolean,
            default: false
        }
    },
    latestSyncRemote: {type: Date, default: Date.now()}
}, {
    timestamps: true
});
const defaultLists = ['Todo', 'In Progress', 'Done'];
BoardsSchema.pre('save', function(next) {
    var self = this;
    if(self.isNew && self.lists.length === 0) {
        self.lists = defaultLists;
    }
    next();
});
BoardsSchema.index({'_id':1, 'lists.title':1}, {unique: true});
module.exports = mongoose.model('Boards', BoardsSchema);
