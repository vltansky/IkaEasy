module.exports = function(grunt) {

    grunt.initConfig({
        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            target: {
                files: {
                    'dist/css/ikaeasy.css': [
                        'master/css/ikaeasy.css',
                        //'master/css/ikalogs.css'
                    ]
                }
            }
        },
        uglify: {
            options: {
                mangle: false,
                compress: {
                    drop_console: true,
                    hoist_funs: false
                },
                //sourceMap: true
            },
            my_target: {
                files: {
                    'dist/inner/ikaeasy.js': ['master/inner/ikaeasy.js'],
                    'dist/inner/background.min.js': ['master/inner/background.js'],
                    //'dist/jquery.min.js': ['master/jquery.min.js'],
                    'dist/app.min.js': [
                        'master/jquery.min.js',
                        'master/langs/*.js',
                        "master/zJS/utils.js",
                        "master/zJS/lng.js",
                        "master/zJS/var.js",
                        "master/zJS/db.js",
                        "master/init.js",
                        "master/ikalogs.js",
                        'master/page/*.js',
                        "master/hotkeysPlugin.js",
                        "master/page/sendIKMessage.js",
                        "master/zJS/navigation.js",
                    ]
                }
            }
        },
        copy: {
            main: {
                files: [
                    // includes files within path
                    //{expand: true, src: ['master/icon/*'], dest: 'dist/icon/', filter: 'isFile'},

                    // includes files within path and its sub-directories
                    //{expand: true, src: ['master/icon/**'], dest: 'dist/icon/'},

                    //// makes all src relative to cwd
                    {expand: true, cwd: 'master/icon/', src: ['**'], dest: 'dist/icon/'},
                    {expand: true, cwd: 'master/images/', src: ['**'], dest: 'dist/images/'},
                    //
                    //// flattens results to a single level
                    //{expand: true, flatten: true, src: ['path/**'], dest: 'dest/', filter: 'isFile'},
                ]
            }
        },
        jshint: {
            //ignore_warning: {
            //    options: {
            //        '-W015': true,
            //    },
            //    src: ['master/**/*.js']
            //}
            all: ['Gruntfile.js', 'master/**/*.js', '!master/jquery.min.js']
        }
        //watch: {
        //    files: ['<%= jshint.files %>'],
        //    tasks: ['jshint']
        //}
    });

    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    //grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['cssmin', 'uglify', 'copy']);

};