var express = require('express');
var router = express.Router();
var JiraClient = require('jira-connector');

var jira = new JiraClient( {
    host: 'housetipster.atlassian.net',
    basic_auth: {
        username: 'Kyle Jurasin',
        password: 'granitemarble44'
    }
});

router.get('/:key', function(req, res) {

	res.render('pages/issue', { key: req.params.key});


});

module.exports = router;
