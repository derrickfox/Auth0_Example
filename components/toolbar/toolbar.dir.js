(function () {
    'use strict'

    angular
        .module('authApp')
        .directive('toolbar', toolbar);

    function toolbar() {
        return {
            templateUrl: 'components/toolbar/toolbar.tpl.html',
            controller: toolbarController,
            controllerAs: 'toolbar'
        }
    }

    function toolbarController(auth, store, $location) {

        var viewModel = this;
        viewModel.test = testFunc;
        viewModel.login = login;
        viewModel.logout = logout;
        viewModel.auth = auth;

        function testFunc() {
            console.log("Test function working");
            alert("Working");
        }

        function login() {
            auth.signin({}, function (profile, token) {
                store.set('profile', profile);
                store.set('id_token', token);
                $location.path('/home');
            }, function (error) {
                console.log(error);
            });
        }

        function logout() {
            store.remove('profile');
            store.remove('id_token');
            auth.signout();
            $location.path('/home');
        }

    }
})();