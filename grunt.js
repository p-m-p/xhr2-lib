module.exports = function (grunt) {
  grunt.initConfig({
    jshint: {
      options: {
          laxcomma: true
        , browser: true
        , supernew: true 
      }
    },
    lint: { files: ['src/xhr2lib.js']},
    min: {
      dist: {
          src: 'src/xhr2lib.js'
        , dest: 'src/xhr2lib.min.js'
      }
    }
  });

  grunt.registerTask('default', 'lint min');
};
