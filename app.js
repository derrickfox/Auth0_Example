'use strict';

angular
    .module('authApp', ['auth0', 'angular-storage', 'angular-jwt', 'ngMaterial', 'ui.router'])
    .config(function ($provide, authProvider, $urlRouterProvider, $stateProvider, $httpProvider, jwtInterceptorProvider, jwtOptionsProvider) {

        authProvider.init({
            // TODO Configure Me or I Won't Work!!
            domain: 'your server from xxxx.auth0.com',
            clientID: 'client ID from manage.auth0.com'
        });

        jwtInterceptorProvider.tokenGetter = function (store) {
            console.info(store.get('id_token'));
            return store.get('id_token');
        };

        $urlRouterProvider.otherwise('/home');

        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'components/home/home.tpl.html'
            })
            .state('profile', {
                url: '/profile',
                templateUrl: 'components/profile/profile.tpl.html',
                controller: 'profileController',
                controllerAs: 'user'
            });

        // This function redirects the user if their token gets rejected to the homepage
        function redirect($q, $injector, $timeout, store, $location) {
            var auth;
            $timeout(function () {
                auth = $injector.get('auth');
            });

            return {
                responseError: function (rejection) {
                    if (rejection.status === 401) {
                        auth.signout();
                        store.remove('profile');
                        store.remove('id_token');
                        $location.path('/home');
                    }

                    return $q.reject(rejection);
                }
            }
        }

        jwtOptionsProvider.config({ whiteListedDomains: ['http://localhost'] });
        $provide.factory('redirect', redirect);
        $httpProvider.interceptors.push('redirect');
        $httpProvider.interceptors.push('jwtInterceptor');
    })
    // This run-block will preserve the user's state
    .run(function ($rootScope, auth, store, jwtHelper, $location) {

        $rootScope.$on('$locationChangeStart', function () {

            var token = store.get('id_token');
            if(token){
                if(!jwtHelper.isTokenExpired(token)){
                    if(!auth.isAuthenticated){
                        auth.authenticate(store.get('profile'), token);
                    }
                }
            } else {
                $location.path('/home');
            }
        })
    });