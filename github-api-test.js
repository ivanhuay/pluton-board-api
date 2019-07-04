'use strict';
const GitHub = require('github-api');
const gh = new GitHub();

const issues = gh.getIssues('ivanhuay', 'pluton-board-api');
// console.log('issues: ', issues);
issues.listIssues()
    .then(({data}) => {
        console.log('resp: ', data);
    });
