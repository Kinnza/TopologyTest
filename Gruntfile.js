'use strict';

/* global module */
module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({

        connect: {
            options: {
                port: 9900,
                // change this to '0.0.0.0' to access the server from outside
                hostname: '0.0.0.0'
            },

            server: {
                options: {
                    port: 9900,
                    base: '.',
                    middleware: function(connect, options) {
                        return [
                            // Serve static files.
                            connect.static(options.base),
                            // Make empty directories browsable.
                            connect.directory(options.base)
                        ];
                    }
                },
            }
        },

        open: {
            server: {
                path: 'http://localhost:9900'
            }
        },

        watch: {
            options: {
                nospawn: true,
                livereload: 9999
            } //,
            // compass: {
            //     files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
            //     tasks: ['compass']
            // }
        }
    });

    grunt.registerTask('server', function(target) {
        grunt.task.run([
            'connect',
            'open:server',
            'watch'
        ]);
    });

};