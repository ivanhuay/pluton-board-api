'use strict';
const request = require('supertest');
const assert = require('assert');
const {getApp} = require('../mocks/get-app');
let app;
const Boards = require('../../lib/models/boards');
describe('GET /api/boards', () => {
    before(() => {
        return getApp()
            .then((application) => {
                app = application;
            })
            .catch(() => {
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
    describe('empty data', () => {
        it('should return empty array', () => {
            return request(app)
                .get('/api/boards')
                .set('Accept', 'application/json')
                .expect(200)
                .then((response) => {
                    return assert.equal(response.body.length, 0);
                });
        });
    });
    describe('preloaded data', () => {
        before(() => {
            return Boards.create({
                'lists': [
                    'Todo',
                    'In Progress'
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
                        'list': 'Todo'
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
        it('should get 1 board', () => {
            return request(app)
                .get('/api/boards')
                .set('Accept', 'application/json')
                .expect(200)
                .then((response) => {
                    assert.equal(response.body.length, 1);
                    assert.equal(response.body[0].title, 'Projects');
                });
        });
        it('should get 1 board by id', () => {
            return request(app)
                .get('/api/boards/5d1b5b5e8221fd0cfad69751')
                .set('Accept', 'application/json')
                .expect(200)
                .then((response) => {
                    assert.equal(response.body._id, '5d1b5b5e8221fd0cfad69751');
                });
        });
    });
});
