angular.module('app.issues.factories',['ngRoute']);
angular.module('app.issues.factories')

.service('computeFactory', function($http, $scope){

	var compute = {};
	var scenesDeferred = $.Deferred();

	compute.scenes = function(scenes){

		if (scenes === null) {

			console.log('no scenes');

		} else {

			var scenesArr = scenes.split(',');
			var sceneObj = {};
			var sceneVal = 0;

			var computeScene = scenesDeferred.pipe(function(size, total_value){
				var _overall = size * 100;
				var _partial = total_value / _overall;
				var _total = _partial * 100;

				return _total == isNaN ? 0 : Math.round(_total) ;
			});

			for(var scene in scenesArr){
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

		return compute;
	};

});
