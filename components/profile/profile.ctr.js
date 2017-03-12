(function () {

    'use strict';

    angular
        .module('authApp')
        .controller('profileController', profileController);

    function profileController($http, store) {

        var viewModel = this;

        viewModel.getMessage = getMessage;
        viewModel.getSecretMessage = getSecretMessage;
        viewModel.message;

        viewModel.profile = store.get('profile');

        function getMessage() {
            $http.get('http://localhost:3001/api/public', {
                skipAuthorization: true
            }).then(function (response) {
                viewModel.message = response.data.message;
            });
        }

        function getSecretMessage() {
            console.log($http.defaults);
            $http.get('http://localhost:3001/api/private', {
                headers: {
                    "Authorization": "Bearer " + store.get('id_token')
                }
            }).then(function (response) {
                console.log($http.defaults);
                viewModel.message = response.data.message;
            });
        }

    }
})();