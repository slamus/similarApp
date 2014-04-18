var similarApp = angular.module('similarApp', [
	'ngRoute',
	'ngCookies',
	'similarControllers'
]);

similarApp.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
			when('/:website', {
				templateUrl: 'partials/main.html',
				controller: 'ApiController'
			}).
			when('/', {
				templateUrl: 'partials/main.html',
				controller: 'ApiController'
			}).
			otherwise({
				redirectTo: '/'
			});
	}
]);