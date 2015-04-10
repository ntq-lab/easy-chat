'use strict';
var assetDef = require('./build/assets.json'),
	arrName;

function getFileName(){
	if (!arrName) {
		arrName = {};
		var fileName = require('./build/rev.json');
		for ( var i in fileName ) {
			if (fileName.hasOwnProperty(i)){
				var key = i.match(/\/([^/]*)$/)[1];
				var val = fileName[i];
				val = val.match(/\/([^/]*)$/)[1];

				arrName[key] = val;
			}
		}
	}

	return arrName;
}

function rename(content, srcpath) {
	var arrName = getFileName();

	var	oldName, newName;

	for (oldName in arrName) {
		newName = arrName[oldName];
		content = content.replace(oldName, newName);
	}

	return content;
}

module.exports = function(grunt) {
	grunt.initConfig({
		clean: {
			tmp: [
				'build/.tmp/**'
			],
			build: [
				'build/public',
				'build/rev.json'
			]
		},
		csslint: {
			options: {
				csslintrc: 'build/rules/.csslintrc',
				absoluteFilePathsForFormatters: false,
				formatters: [ {
					id: 'lint-xml',
					dest: 'build/reports/csslint.xml'
				} ]
			},
			src: [ 'app/css/**/*.css' ]
		},
		jshint: {
			client: {
				src: [
					'client/app/**/*.js',
					'client/assets/js/**/*.js'
				],
				options: {
					jshintrc: 'build/rules/.jshintrc-client',
					reporter: 'jslint',
					reporterOutput: 'build/reports/jshint-client.xml'
				}
			},
			server: {
				src: [
					'server/**/*.js',
					'env/**/*.js',
					'app.js'
				],
				options: {
					jshintrc: 'build/rules/.jshintrc-server',
					reporter: 'jslint',
					reporterOutput: 'build/reports/jshint-server.xml'
				}
			}
		},
		cssmin: {
			min: {
				files: assetDef.css
			}
		},
		uglify: {
			min: {
				options: {
					sourceMap: false
				},
				files: assetDef.js
			}
		},
		filerev: {
			img: {
				files: [ {
					expand: true,
					cwd: 'client/assets/img/',
					src: [ '**/*' ],
					dest: 'build/public/img/'
				} ]
			},
			js: {
				files: [ {
					expand: true,
					cwd: 'build/.tmp/jsmin',
					src: [ '**/*' ],
					dest: 'build/public/js/'
				} ]
			},
			css: {
				files: [ {
					expand: true,
					cwd: 'build/.tmp/cssmin',
					src: [ '**/*.css' ],
					dest: 'build/public/css/'
				} ]
			}
		},
		filerev_assets: {
			rev: {
				options: {
					dest: 'build/rev.json',
					cwd: 'build/public'
				}
			}
		},
		copy: {
			index: {
				src: 'app/index-tmp.html',
				dest: 'build/public/index.html',
				options: {
					processContent: rename
				}
			},
			partials: {
				expand: true,
				dest: 'build/public/partials/',
				cwd: 'app/partials/',
				src: '**/*.html'
			}
		}
	});
	// load all plugins
	require('load-grunt-tasks')(grunt);

	grunt.registerTask('verify', [ 'jshint' ]);
	grunt.registerTask('build', [ 'clean:build', 'filerev:img', 'csslint', 'cssmin', 'uglify', 'filerev:css', 'filerev:js', 'filerev_assets', 'clean:tmp' ]);
};
