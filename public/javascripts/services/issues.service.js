angular.module('app.issues.services',[]);
angular.module('app.issues.services')
.service('issuesService', function($http){

	this.getIssues = $http({
		method: 'GET',
		url: '/jira/issues',
		headers: {'Content-type': 'application/json'}

	}).then(function successCallback(response) {

		return response.data.issues;

	}, function errorCallback(response) {

		throw new Error(response.responseText);

	});

	this.getIssue = function(key){

		return $http({
			method: 'GET',
			url: '/jira/issue/'+key,
			headers: {'Content-type': 'application/json'}

		}).then(function successCallback(response) {

			return response.data;

		}, function errorCallback(response) {

			throw new Error(response.responseText);

		});
	}


});
