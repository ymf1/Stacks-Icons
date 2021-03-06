module.exports = function(grunt) {
    grunt.initConfig({
        clean: ["build"],
        svgmin: {
            options: {
                plugins: [{
                    convertPathData: {
                        floatPrecision: 2,
                        transformPrecision: 4,
                    }
                }, {
                    cleanupNumericValues: {
                        floatPrecision: 2,
                    }
                }, {
                    collapseGroups: true,
                }, {
                    removeTitle: true,
                }, {
                    removeViewBox: false,
                }, {
                    removeUselessStrokeAndFill: true,
                }, {
                    removeAttrs: {
                        attrs: ['xmlns', 'fill-rule', 'clip-rule']
                    }
                }]
            },
            build: {
                files: [{
                    expand: true,
                    cwd: 'src/Icon',
                    src: '*.svg',
                    dest: 'build/lib',
                }]
            },
            multipass: {
                files: [{
                    expand: true,
                    cwd: 'build/lib',
                    src: '*.svg',
                    dest: 'build/lib',
                }]
            }
        },
        'string-replace': {
            build: {
                files: [{
                    expand: true,
                    cwd: 'build/lib',
                    src: '**/*',
                    dest: 'build/lib'
                }],
                options: {
                    replacements: [{
                        pattern: '<svg',
                        replacement: '<svg aria-hidden="true" class="svg-icon icon@@__TARGET_FILENAME__"'
                    }, {
                        pattern: /<\/?g(\s.+?)*>/g,
                        replacement: ''
                    }, {
                        pattern: / fill="#000"/gm,
                        replacement: ''
                    }, {
                        pattern: / fill="none"/gm,
                        replacement: ''
                    }, {
                        pattern: / fill="#222426"/gm,
                        replacement: ' fill="var(--black-800)"'
                    }, {
                        pattern: / fill="#fff"/gm,
                        replacement: ' fill="var(--white)"'
                    }, {
                        pattern: / fill="#6A7E7C"/gm,
                        replacement: ' fill="var(--black-500)"'
                    }, {
                        pattern: / fill="#1A1104"/gm,
                        replacement: ' fill="var(--black-900)"'
                    }]
                }
            },
            replaceSvg: {
                files: [{
                    expand: true,
                    cwd: 'build/lib',
                    src: '**/*',
                    dest: 'build/lib'
                }],
                options: {
                    replacements: [{
                        pattern: '.svg',
                        replacement: ''
                    }]
                }
            },
            manifestIcons: {
                files: {
                    'icons.js': 'icons.js',
                },
                options: {
                    replacements: [{
                        pattern: /<svg aria-hidden="true" class="svg-icon icon/g,
                        replacement: '- helper: '
                    }, {
                        pattern: /" width=".*<\/svg>/g,
                        replacement: ''
                    }, {
                        pattern: /build\/lib\/.*\.svg/g,
                        replacement: ''
                    }]
                }
            },
            manifestHelper: {
                files: {
                    'helper.js': 'helper.js',
                },
                options: {
                    replacements: [{
                        pattern: /<svg aria-hidden="true" class="svg-icon icon/g,
                        replacement: 'public static SvgImage '
                    }, {
                        pattern: /" width=".*<\/svg>/g,
                        replacement: ' { get; } = GetImage();'
                    }, {
                        pattern: /build\/.*\.svg/g,
                        replacement: ''
                    }]
                }
            },
            finalRemove: {
                files: [{
                    expand: true,
                    cwd: 'build/lib',
                    src: '**/*',
                    dest: 'build/lib'
                }],
                options: {
                    replacements: [{
                        pattern: ' fill="#000"',
                        replacement: ''
                    }]
                }
            },
        },
        replace: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'build/',
                    src: '**/*',
                    dest: 'build/'
                }]
            }
        },
        concat: {
            options: {
                process: function(src, filename) {
                    return src.replace(/\.svg/g, '') + filename;
                }
            },
            manifestIcons: {
                src: ['build/**/*.svg'],
                dest: 'icons.js',
            },
            manifestHelper: {
                src: ['build/**/*.svg'],
                dest: 'helper.js',
            },
        },
        rename: {
            helper: {
                files: [{
                    src: ['helper.js'],
                    dest: 'build/helper.cs'
                },]
            },
            icons: {
                files: [{
                    src: ['icons.js'],
                    dest: 'build/icons.yml'
                },]
            },
        }
    });

    // Load the plugins
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-svgmin');
    grunt.loadNpmTasks('grunt-string-replace');
    grunt.loadNpmTasks('grunt-replace-regex');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-rename');

    // Default task(s).
    grunt.registerTask('default', ['clean', 'svgmin:build', 'svgmin:multipass', 'string-replace:build', 'replace', 'string-replace:replaceSvg', 'concat:manifestIcons', 'string-replace:manifestIcons', 'concat:manifestHelper', 'string-replace:manifestHelper', 'rename:helper', 'rename:icons', 'string-replace:finalRemove']);
};