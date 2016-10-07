var express = require('express');
var router = express.Router();
var JiraClient = require('jira-connector');

var jira = new JiraClient( {
    host: 'housetipster.atlassian.net',
    basic_auth: {
        base64: 'a3lsZUBob3VzZXRpcHN0ZXIuY29tOm1hcmJsZXJvY2tzNDQ='
    }
})
router.get('/issues', function(req, res) {

	jira.search.search({
	    project: '10300',
	    startAt: '0',
	    maxResults: '30',
	}, function(error, response) {
		try {
		  res.send(response);
		} catch (e) {
		  res.status(400).send('cant fetch issues');
		}

	});


});

router.get('/issue/:key', function(req, res) {
	jira.issue.getIssue({
	    issueKey: req.params.key
	}, function(error, response) {
		try {
		  res.send(response);
		} catch (e) {
		  res.status(400).send('cant fetch issues');
		}
	});

});

module.exports = router;
