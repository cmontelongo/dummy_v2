angular.module('mynotes.pacientestore', [])
    .factory('PacienteStore', function() {

        //var pacientes = angular.fromJson(window.localStorage['pacientes'] || '[]');
        var pacientes = [{
            id:'101',
            nombre:'Paciente 1'
        },
        {
            id:'102',
            nombre:'Paciente 2'
        }];

        function persist() {
            window.localStorage['pacientes'] =  angular.toJson(pacientes);
        }

        return {
            
            list: function() {
                return pacientes;
            },
            
            get: function(noteId) {
                for (var i = 0; i < pacientes.length; i++) {
                    if (pacientes[i].id == noteId) {
                        return pacientes[i];
                    }
                };
                return undefined;
            },

            create: function(note) {
                pacientes.push(note);
                persist();
            },
            
            update: function(note) {
                for (var i = 0; i < pacientes.length; i++) {
                    if (pacientes[i].id == note.id) {
                        pacientes[i] = note;
                        persist();
                        return;
                    }
                };
            },

            move: function(note, fromIndex, toIndex) {
                pacientes.splice(fromIndex, 1);
                pacientes.splice(toIndex, 0, note);
                persist();
            },
            
            remove: function(noteId) {
                for (var i = 0; i < pacientes.length; i++) {
                    if (pacientes[i].id == noteId) {
                        pacientes.splice(i, 1);
                        persist();
                        return;
                    }
                };
            }
        };
    });

