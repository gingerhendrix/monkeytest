
var TestRunner = new function(){
  this.runner = new SimpleTestRunner(); 
  var tests = [];
  
  this.addTest = function(test){
    tests.push(test);
  }
  
  this.run = function(){
    var runner = this.runner;
    runner.initRun(tests);
    tests.forEach(function(test){
      try{
        test.run(runner);
      }catch(e){
        
      }
    })
    runner.finishRun();
  }
}();