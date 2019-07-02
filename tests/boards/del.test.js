'use strict';
const request = require('supertest');
const assert = require('assert');
const {getApp} = require('../mocks/get-app');
let app;
const Boards = require('../../lib/models/boards');
describe('DEL /api/boards', () => {
    before(() => {
        return getApp()
            .then((application) => {
                app = application;
            })
            .catch((err) => {
                return process.exit(1);
            });
    });
    before(() => {
        return Promise.all([
            Boards.deleteMany({})
        ]);
    });
    after(() => {
        return Promise.all([
            Boards.deleteMany({})
        ]);
    });

    describe('update lists', () => {
        before(() => {
            return Boards.create({
                'lists': [
                    'Todo',
                    'In Progress',
                    'Done'
                ],
                'defaultList': 'Todo',
                'public': false,
                '_id': '5d1b5b5e8221fd0cfad69751',
                'title': 'Projects',
                'tickets': [
                    {
                        '_id': '5d1b5b648221fd0cfad69753',
                        'ticket': '5d1b5b648221fd0cfad69752',
                        'list': 'Todo'
                    },
                    {
                        '_id': '5d1b5b698221fd0cfad69755',
                        'ticket': '5d1b5b698221fd0cfad69754',
                        'list': 'Todo'
                    },
                    {
                        '_id': '5d1b5b6b8221fd0cfad69757',
                        'ticket': '5d1b5b6b8221fd0cfad69756',
                        'list': 'Done'
                    }
                ],
                'createdAt': '2019-07-02T13:25:50.465Z',
                'updatedAt': '2019-07-02T13:26:45.469Z',
                '__v': 4
            });
        });
        after(() => {
            return Boards.deleteMany({});
        });
        it('should assign ticket after delete "Done" list', () => {
            return request(app)
                .del('/api/boards/5d1b5b5e8221fd0cfad69751/lists/Done')
                .set('Accept', 'application/json')
                .expect(200)
                .then((response) => {
                    const doneTicket = response.body.tickets.filter((ticket) => ticket.list === 'Done');
                    const todoTicket = response.body.tickets.filter((ticket) => ticket.list === 'Todo');
                    assert.equal(doneTicket.length, 0);
                    assert.equal(todoTicket.length, 3);
                    assert.equal(response.body.defaultList, 'Todo');
                    assert.equal(response.body.title, 'Projects');
                });
        });
    });
});
