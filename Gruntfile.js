'use strict';

module.exports = function(grunt) {
	grunt.initConfig({
		jshint: {
			client: {
				src: [
					'client/assets/js/**/*.js',
					'client/app/**/*.js'
				],
				options: {
					jshintrc: 'build/rules/.jshintrc-client'
				}
			},
			server: {
				src: [
					'server/**/*.js',
					'server.js'
				],
				options: {
					jshintrc: 'build/rules/.jshintrc-server'
				}
			}
		},
		jscs: {
			client: {
				src: '<%= jshint.client.src %>',
				options: {
					config: 'build/rules/.jscsrc'
				}
			},
			server: {
				src: '<%= jshint.server.src %>',
				options: {
					config: 'build/rules/.jscsrc'
				}
			}
		},
		watch: {
			options: {
				maxListeners: 99,
				spawn: false,
				interrupt: true,
				debounceDelay: 2000,
				interval: 500
			},
			client: {
				files: [
					'<%= jshint.client.src %>'
				],
				tasks: ['verify']
			},
			server: {
				files: [
					'server/**/*.js',
					'server.js'
				],
				tasks: ['verify']
			}
		}
	});

	require('load-grunt-tasks')(grunt);

	grunt.registerTask('verify', [ 'jshint', 'jscs' ]);
	grunt.registerTask('default', [ 'verify', 'watch' ]);
}
