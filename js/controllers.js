var similarControllers = angular.module('similarControllers', []);

similarControllers.controller('ApiController', ['$scope', '$http', '$location', '$routeParams', '$cookieStore', '$sce',
	function ($scope, $http, $location, $routeParams, $cookieStore, $sce) {

		document.getElementById("websiteInput").focus();

		$scope.submit = function() {
			if ($scope.text) {
				var path = '/' + cleanUrl($scope.text);
				$location.path(path);
			}
		};

		$scope.deleteCookies = function(elem, order) {
			var history = $cookieStore.get('similarHistory');
			var index = -1;
			for (var i = history.length - 1; i >= 0; i--) {
				if (history[i].url == elem.url) {
					index = i;
				}
			};
			history.splice(index, 1);
			saveHistoryAndUpdate($scope, $cookieStore, history);
			if (order == 0) {
				if (history[0]) {
					$location.path('/' + history[0].url);
				} else {
					$location.path('/');
				}
			}
		}

		$scope.history = $cookieStore.get('similarHistory');
		if ($routeParams) {
			var query = $routeParams.website;
			if (query) {
				getWebsiteInfo($scope, $http, $cookieStore, $sce, query);
			} else {
				throwError($scope, $cookieStore, query);
			}
		} else {
			console.log('hi');
		}
		
}]);


function cleanCategory(str) {
	str = str.replace(/.*\//g, "");
	str = str.replace(/_/g, " ");
	return str;
}

function cleanUrl(str) {
	str = str.replace(/http:\/\//g, "");
	str = str.replace(/www./g, "");
	return str;
}

function getWebsiteInfo($scope, $http, $cookieStore, $sce, query) {
	$scope.query = query;
	var formattedQuery = 'http://api.similarweb.com/site/' + query + '/rankoverview?userkey=a6fd04d833f2c28ce7c30dc957bf481e';
	$http.get(formattedQuery).success(function(data){
		$scope.result = data;
		$scope.result.query = query;
		$scope.result.Category = cleanCategory($scope.result.Category);
		$scope.result.iframeUrl = $sce.trustAsResourceUrl("http://" + query);
		$scope.error = false;
		setCookie($scope, $cookieStore, query);
	}).error(function(data){
		throwError($scope, $cookieStore, query);
	});
}

function saveHistoryAndUpdate ($scope, $cookieStore, history) {
	$cookieStore.put('similarHistory', history);
	$scope.history = $cookieStore.get('similarHistory');
}

function throwError ($scope, $cookieStore) {
	$scope.error = true;
	var history = $cookieStore.get('similarHistory');
	if (history) {
		for (var i = history.length - 1; i >= 0; i--) {
			history[i].isCurrent = false;
		};
		saveHistoryAndUpdate($scope, $cookieStore, history);
	}
}

function setCookie ($scope, $cookieStore, query) {
	var history = $cookieStore.get('similarHistory');

	if (!history) {
		history = [];
	}

	for (var i = history.length - 1; i >= 0; i--) {
		history[i].isCurrent = false;
		if (query == history[i].url) {
			history[i].count++;
			history[i].isCurrent = true;
			query = null;
		}
	};

	if (query) {
		var newValue = {
			'url' : query,
			'count' : 1,
			'isCurrent' : true
		}
		history.push(newValue);
	}
	saveHistoryAndUpdate($scope, $cookieStore, history);
}

