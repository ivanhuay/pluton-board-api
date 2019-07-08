'use strict';
const express = require('express');
const router = express.Router();
const addUser = require('../middlewares/add-user');
const {getRepos, addRepoToBoard} = require('../utils/github');
router.get('/repositories', addUser, (req, res, next) => {
    return getRepos(req.user.data.access_token)
        .then((repos) => {
            res.json(repos);
        })
        .catch(next);
});
router.post('/enable/:boardId/:username/:project', addUser, (req, res, next) => {
    const {boardId, username, project} = req.params;
    return addRepoToBoard(boardId, username, project)
        .then((repos) => {
            res.json(repos);
        })
        .catch(next);
});

module.exports = router;
