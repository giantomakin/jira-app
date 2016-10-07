angular.module('app.issues.services', []);
angular.module('app.issues.services')
.service('issuesService', function($http) {

    this.getIssues = $http({
        method: 'GET',
        url: '/jira/issues',
        headers: {
            'Content-type': 'application/json'
        }

    }).then(function successCallback(response) {

        return response.data.issues;

    }, function errorCallback(response) {

        throw new Error(response.responseText);

    });

    this.getIssue = function(key) {

        return $http({
            method: 'GET',
            url: '/jira/issue/' + key,
            headers: {
                'Content-type': 'application/json'
            }

        }).then(function successCallback(response) {

            return response.data;

        }, function errorCallback(response) {

            throw new Error(response.responseText);

        });
    };

    this.computeScene = function(scope, scenes, progress) {

        var scenesDeferred = $.Deferred();

        if (scenes === null) {

            console.log('no scenes');

        } else {

            var scenesArr = scenes.split(',');
            var sceneObj = {};
            var sceneVal = 0;

            var computeScene = scenesDeferred.pipe(function(size, total_value) {
                var _overall = size * 100;
                var _partial = total_value / _overall;
                var _total = _partial * 100;

                return _total == isNaN ? 0 : Math.round(_total);
            });

            for (var scene in scenesArr) {
                var _scene = scenesArr[scene].split(':');
                var _key = _scene[0];
                var _val = _scene[1];

                sceneVal += parseInt(_val);
                sceneObj[_key] = _val;
            }


            scenesDeferred.resolve(Object.keys(sceneObj).length, sceneVal);

            computeScene.done(function(value) {

                scope.total = value;

                if (value < 25) scope.scene_progress = progress[0];

                if (value >= 25 && value <= 50) scope.scene_progress = progress[1];

                if (value >= 50 && value <= 75) scope.scene_progress = progress[2];

                if (value >= 75 && value <= 99) scope.scene_progress = progress[3];

                if (value == 100) scope.scene_progress = progress[4];

            });
        }

    };

    this.computeDoc = function($scope, doc, progress) {

        if (doc === null) {

            console.log('no docs');

        } else {

            if (doc == 'not-started') {
                $scope.doc_progress = progress[5];
            } else if (doc == 'in-progress') {
                $scope.doc_progress = progress[1];
            } else if (doc == 'done') {
                $scope.doc_progress = progress[6];
            }

        }


    };

    this.computeDrawing = function($scope, drawing, progress) {


        if (drawing === null) {

            console.log('no drawing');

        } else {

            if (drawing == 'not-started') {
                $scope.drawing_progress = progress[5];
            } else if (drawing == 'in-progress') {
                $scope.drawing_progress = progress[1];
            } else if (drawing == 'done') {
                $scope.drawing_progress = progress[6];
            }

        }


    };

    this.addUp = function(addup) {

        var result = addup;

        return result;
    };

    this.computeTotal = function($scope, progress) {

        var totalDeferred = $.Deferred();
        var addup = $scope.doc_value + $scope.drawing_value + $scope.total;
        var computeTotal = totalDeferred.pipe(function(t) {
            var _total_value = t;
            var _partial = _total_value / 300;
            var _total = _partial * 100;

            return _total == isNaN ? 0 : Math.round(_total);
        });


        totalDeferred.resolve(this.addUp(addup));

        computeTotal.done(function(value) {

            $scope.total_progress = value;

            if (value < 25) $scope.total_progressbar = progress[0];

            if (value >= 25 && value <= 50) $scope.total_progressbar = progress[1];

            if (value >= 50 && value <= 75) $scope.total_progressbar = progress[2];

            if (value >= 75 && value <= 99) $scope.total_progressbar = progress[3];

            if (value == 100) $scope.total_progressbar = progress[4];

        });

    };


});
