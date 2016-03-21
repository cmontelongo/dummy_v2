(function() {

var app = angular.module('mynotes', ['ionic', 'mynotes.notestore', 'miscitas.user', 'mynotes.pacientestore'])

app.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
    });

    $stateProvider.state('logout', {
        url: '/logout',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
    });

    $stateProvider.state('list', {
        url: '/',
        templateUrl: 'templates/list.html'
    });

    $stateProvider.state('edit', {
        url: '/edit/:citaId',
        templateUrl: 'templates/edit.html',
        controller: 'EditCtrl'
    });

    $stateProvider.state('add', {
        url: '/add',
        templateUrl: 'templates/edit.html',
        controller: 'AddCtrl'
    });

    $stateProvider.state('exp', {
        url: '/exp/:pacienteId',
        templateUrl: 'templates/expediente.html',
        controller: 'ExpCtrl'
    });

    $urlRouterProvider.otherwise('/');

});

//---------------------------------------------------------------------
app.controller('LoginCtrl', function($scope, $state, $ionicHistory, $rootScope, User) {
  User.logout();
  $rootScope.hideMenu = true;

  $scope.credentials = {
    user: '',
    password: ''
  };

  $scope.login = function() {
      if (User.login($scope.credentials)){
        $ionicHistory.nextViewOptions({historyRoot: true});    
        $state.go('list');
        $rootScope.hideMenu = false;
      };
  };

});

app.controller('ListCtrl', function($scope, $ionicHistory, $state, NoteStore, User) {

    $scope.reordering = false;    
    $scope.citas = NoteStore.list();

    $scope.remove = function(noteId) {
        NoteStore.remove(noteId);
    }

    $scope.move = function(note, fromIndex, toIndex) {
        NoteStore.move(note, fromIndex, toIndex);
    }

    $scope.toggleReordering = function() {
        $scope.reordering = !$scope.reordering; 
    }

    $scope.logout = function() {
        User.logout();
        $ionicHistory.nextViewOptions({historyRoot: true});    
        $state.go('login');
    };

});

app.controller('EditCtrl', function($scope, $state, $rootScope, NoteStore, PacienteStore) {

    $scope.cita = angular.copy(NoteStore.get($state.params.citaId));
    $scope.pacientes = angular.copy(PacienteStore.list());
    $scope.paciente = PacienteStore.get($scope.cita.pacienteId);
    $scope.fecha = $scope.cita.fecha_cita;

    $scope.save = function() {
        NoteStore.update($scope.cita);
        $state.go('list');
    };

    $rootScope.expediente = function() {
        $state.go("exp");
    };
});

app.controller('AddCtrl', function($scope, $state, NoteStore, PacienteStore) {
    $scope.pacientes = angular.copy(PacienteStore.list());

    $scope.cita = {
        id: new Date().getTime().toString(),
        paciente: '',
        nombre: '',
        fecha_cita: '01/02/2016 08:00',
        observaciones: ''
    };

    $scope.save = function() {
        $scope.cita.nombre = $scope.cita.paciente.nombre;
        NoteStore.create($scope.cita);
        $state.go('list');
    };

});

app.controller('ExpCtrl', function($scope, $ionicHistory, $state, NoteStore, User) {

    $scope.citas = NoteStore.list();

    $scope.remove = function(noteId) {
        NoteStore.remove(noteId);
    }

    $scope.move = function(note, fromIndex, toIndex) {
        NoteStore.move(note, fromIndex, toIndex);
    }

    $scope.toggleReordering = function() {
        $scope.reordering = !$scope.reordering; 
    }

    $scope.logout = function() {
        User.logout();
        $ionicHistory.nextViewOptions({historyRoot: true});    
        $state.go('login');
    };

});

app.run(function($rootScope, $state, $ionicPlatform, User) {
  $rootScope.$on('$stateChangeStart', function(event, toState) {
    if (!User.isLoggedIn() && toState.name !== 'login') {
      event.preventDefault();
      $state.go('login');
    }
  });

  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

}());