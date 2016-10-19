angular.module('app.issues.controllers', ['ngRoute']);

angular.module('app.issues.controllers')
.controller('issuesCtrl', function($scope, $location, issuesService, $element) {

    $scope.showloading = true;

    issuesService.getIssues.then(function(response) {

        $scope.attachment = [];
        $scope.showloading = false;

        response.forEach(function(issues, i) {

            issuesService.getIssue(issues.id).then(function(issue) {

                if (typeof issue.fields.attachment[0] == 'object') {
                    issues.attachment = issue.fields.attachment[0].content;
                } else {
                    issues.attachment = 'http://placehold.it/900x300';
                }

            });

        });


        $scope.issues = response;

    });

});

angular.module('app.issues.controllers')
.controller('issueCtrl', function($scope, $element, $location, $timeout, issuesService) {

    $scope.showloading = true;

    var $key = $element.find('#issue-key').val();
    var progress = ['progress-bar-danger progress-bar-striped',
        'progress-bar-warning progress-bar-striped active',
        'progress-bar-info progress-bar-striped active',
        'progress-bar-success progress-bar-striped active',
        'progress-bar-success',
        'progress-bar-danger progress-bar-striped active',
        'progress-bar-success progress-bar',
    ];

    function renderIssue(loader) {

        issuesService.getIssue($key).then(function(response) {
            var issue = response.fields;
            var scenes = issue.customfield_10201;
            var drawing = issue.customfield_10205 === null ? 'not-started' : issue.customfield_10205.value;
            var doc = issue.customfield_10206 === null ? 'not-started' : issue.customfield_10206.value;
            var doc_val = doc === 'done' ? 100 : 50;
            var drawing_val = drawing === 'done' ? 100 : 50;

            issuesService.computeScene($scope, scenes, progress);
            issuesService.computeDoc($scope, doc, progress);
            issuesService.computeDrawing($scope, drawing, progress);
            $scope.summary = issue.summary;
            $scope.description = issue.description.replace(/\*/g, ' ');
            $scope.attachment = issue.attachment[0].content;
            $scope.doc = doc;
            $scope.drawing = drawing;
            $scope.doc_value = doc_val;
            $scope.drawing_value = drawing_val;
            $scope.updated = 'updated: ' + moment(issue.updated).fromNow();
            issuesService.computeTotal($scope, progress);
        });

        if (loader) $scope.showloading = false;
        console.log('Beat at ' + new Date().getTime() + 'ms');

        $timeout(function(){renderIssue();},10000);

    }

    renderIssue(true);



});
