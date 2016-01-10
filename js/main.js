console.log("Scripts loading... ");

// Here's a skeleton app.  Fork this plunk, or create your own from scratch.
var app = angular.module('demonstrateissue', ['ui.router']);

// Empty config block.  Define your example states here.
app.config(function ($locationProvider, $stateProvider, $urlRouterProvider) {
    $locationProvider.html5Mode(true);

    $urlRouterProvider.otherwise("/people");

    $stateProvider
        .state("people", {
            url: "/people?page&metafilter&orderBy&reverse",
            templateUrl: "/partials/people.html",
            controller: "PeopleController",
            reloadOnSearch: false,
            resolve: criticalResourceResolver()
        })
        .state("people.add", {
            url: "/new"
        });

    //$stateProvider.state({ name: 'home', url: '/home?foo', controller: function() { }, templateUrl: '/partials/home.html'});
    //$stateProvider.state({ name: 'home.foo', url: '/foo', controller: function() { }, templateUrl: '/partials/foo.html'});
});

function criticalResourceResolver() {
    return {
        preload: function () {
            return {};
        }
    };
}

app.controller("PeopleController", PeopleController);
function PeopleController($scope, $state) {
    $scope.currentPage = parseInt( $state.params.page || 1 );
    $scope.$watch( "currentPage", onPageChanged );

    function onPageChanged( newPage, oldPage ) {
        if( !newPage || newPage === oldPage ) {
            return;
        }

        $state.go( "people", {
            page : newPage
        } );
    }
}

// Adds state change hooks; logs to console.
app.run(function ($rootScope, $state, $location) {

    $rootScope.$state = $state;
    $rootScope.$location = $location;

    function message(to, toP, from, fromP) {
        return from.name + angular.toJson(fromP) + " -> " + to.name + angular.toJson(toP);
    }

    $rootScope.$on("$stateChangeStart", function (evt, to, toP, from, fromP) {
        console.log("Start:   " + message(to, toP, from, fromP));
    });
    $rootScope.$on("$stateChangeSuccess", function (evt, to, toP, from, fromP) {
        console.log("Success: " + message(to, toP, from, fromP));
    });
    $rootScope.$on("$stateChangeError", function (evt, to, toP, from, fromP, err) {
        console.log("Error:   " + message(to, toP, from, fromP), err);
    });
});

app.directive("stateSelector", function () {
    return {
        restrict: "E",
        template: '  <select ng-model="ctrl.currentstate" ng-change="ctrl.$state.go(ctrl.currentstate);" ' +
        '    ng-options="state as state.name for state in ctrl.$state.get()">' +
        '     <option value="">Choose a state</option>' +
        '  </select>',
        controller: function ($scope, $state) {
            var ctrl = this;
            ctrl.$state = $state;
            ctrl.currentstate = $state.current;
            $scope.$on("$stateChangeSuccess", function (evt, to) {
                ctrl.currentstate = $state.current
            });
        },
        controllerAs: "ctrl"
    }
});

app.controller("issueController", function ($scope, $state) {
    $scope.$state = $state;
});