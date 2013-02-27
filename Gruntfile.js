module.exports = function(grunt) {
  grunt.initConfig({
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: [ 'src/board.js', 'src/cell.js', 'src/utils.js' ],
        dest: 'dist/tictactoe.js'
      }
    },

    mochacli: {
      options: {
        require: ['should'],
        bail: true
      },
      all: ['test/*.js']
    }
  });

  grunt.registerTask('default', [ 'concat', 'mochacli' ]);

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-mocha-cli');
}