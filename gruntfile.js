module.exports = function(grunt){

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
			uglify: {
				options: {
					banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
					drop_console: true,
					},
				mytarget: {
					files: [{
						expand: true,
						cwd: 'src',
						src: '*.js',
						dest: 'build',
						ext: '-min.js'
						}]
					}
				},
			yuidoc: {
				all: {
					name: '<%= pkg.name %>',
					description: '<%= pkg.description %>',
					version: '<%= pkg.version %>',
					url: '<%= pkg.homepage %>',
					options: {
						paths: 'src/',
						outdir: 'docs/'
						}
					}
				},
			jshint: {
				all: ['src/scrawlPath.js']
				}
		});

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-yuidoc');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	
	// Default task(s).
	grunt.registerTask('default', ['uglify']);
	grunt.registerTask('docs', ['yuidoc']);
	grunt.registerTask('lint', ['jshint']);
	};
	