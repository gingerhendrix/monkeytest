
var TestRunner = new function(){
  this.runner = new SimpleTestRunner(); 
  var tests = [];
  
  this.addTest = function(test){
    tests.push(test);
  }
  
  this.run = function(){
    var runner = test.runner();
    runner.initRun(tests);
    tests.forEach(function(test){
      test.run(runner);
    })
    runner.finishRun();
  }
}();