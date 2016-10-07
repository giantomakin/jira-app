angular.module('app.issues.controllers',['ngRoute']);

angular.module('app.issues.controllers')
.controller('issuesCtrl', function($scope, $location, issuesService, $element) {

	$scope.showloading = true;


	issuesService.getIssues.then(function(response){

		$scope.attachment = [];

		response.forEach(function(issues, i){

			issuesService.getIssue(issues.id).then(function(issue){

				if (typeof issue.fields.attachment[0] == 'object') {
					issues.attachment = issue.fields.attachment[0].content
				} else {
					issues.attachment = 'http://placehold.it/900x300';
				}

			});

		});

		$scope.showloading = false;

		$scope.issues = response;

	});
});

angular.module('app.issues.controllers')
.controller('issueCtrl', function($scope, $element, $location, issuesService) {

	$key = $element.find('#issue-key').val();

	$scope.total = 0;
	$scope.scene_progress = '';
	$scope.scene_total =0;
	$scope.doc = '';
	$scope.doc_progress = '';
	$scope.doc_value = 0;
	$scope.drawing = '';
	$scope.drawing_value = 0;
	$scope.total_progress= 0;
	$scope.total_progressbar= '';
	$scope.showloading = true;
	$scope.showcontent = false;

	var progress = ['progress-bar-danger progress-bar-striped',
					'progress-bar-warning progress-bar-striped active',
					'progress-bar-info progress-bar-striped active',
					'progress-bar-success progress-bar-striped active',
					'progress-bar-success',
					'progress-bar-danger progress-bar-striped active',
					'progress-bar-success progress-bar',
					]

	function renderIssue(loader){

		$scope.showloading = true;

		issuesService.getIssue($key).then(function(response){

			var issue = response.fields;
			var scenes = issue.customfield_10201;
			var totalDeferred = $.Deferred();
			var scenesDeferred = $.Deferred();
			var drawing = issue.customfield_10205 === null ? 'not-started' : issue.customfield_10205.value;
			var doc = issue.customfield_10206 === null ? 'not-started' : issue.customfield_10206.value;
			var doc_val = doc === 'done' ? 100 : 50
			var drawing_val = drawing === 'done' ? 100 : 50;
			var addup = 0;

			if (scenes == null) {

				console.log('no scenes');

			} else {

				var scenesArr = scenes.split(',');
				var sceneObj = {};
				var sceneVal = 0;

				var computeScene = scenesDeferred.pipe(function(size, total_value){
					var _overall = size * 100;
					var _partial = total_value / _overall;
					var _total = _partial * 100;

					return _total == NaN ? 0 : Math.round(_total) ;
				});


				for(scene in scenesArr){
					var _scene = scenesArr[scene].split(':');
					var _key = _scene[0];
					var _val = _scene[1];

					sceneVal += parseInt(_val);
					sceneObj[_key] = _val;
				}


				scenesDeferred.resolve(Object.keys(sceneObj).length,sceneVal);

				computeScene.done(function(value){

					$scope.total = value;

					if ( value < 25 ) $scope.scene_progress = progress[0];

					if ( value >= 25 && value <= 50 ) $scope.scene_progress = progress[1];

					if ( value >= 50 && value <= 75 ) $scope.scene_progress = progress[2];

					if ( value >= 75 && value <= 99 ) $scope.scene_progress = progress[3];

					if ( value == 100 ) $scope.scene_progress = progress[4];

				});
			}

			if ( doc == null ) {

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

			if ( drawing == null ) {

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

			$scope.summary = issue.summary;
			$scope.description = issue.description;
			$scope.attachment = issue.attachment[0].content;
			$scope.doc = doc;
			$scope.drawing = drawing;
			$scope.doc_value = doc_val;
			$scope.drawing_value = drawing_val;
			addup = $scope.doc_value + $scope.drawing_value + $scope.total;

			var computeTotal = totalDeferred.pipe(function(t){
				var _total_value = t;
				var _partial = _total_value / 300;
				var _total = _partial * 100;

				return _total == NaN ? 0 : Math.round(_total);
			});


			totalDeferred.resolve(addup);

			$scope.updated = 'updated: '+moment(issue.updated).fromNow();

			computeTotal.done(function(value){

				$scope.total_progress = value;

				if ( value < 25 ) $scope.total_progressbar = progress[0];

				if ( value >= 25 && value <= 50 ) $scope.total_progressbar = progress[1];

				if ( value >= 50 && value <= 75 ) $scope.total_progressbar = progress[2];

				if ( value >= 75 && value <= 99 ) $scope.total_progressbar = progress[3];

				if ( value == 100 ) $scope.total_progressbar = progress[4];

			});

			if(loader) $scope.showloading = false;

		});


}

renderIssue(true);
setInterval(function(){
	renderIssue();
}, 300000);


});
