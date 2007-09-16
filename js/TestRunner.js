
var TestRunner = new function(){
  this.runner = new FunctionalTestRunner(); 
  var tests = [];
  
  this.addTest = function(test){
    tests.push(test);
  }
  
  this.run = function(){
    this.runner.initRun(tests);
    var self = this;
    tests.forEach(function(test){
      test.run(self);
    })
    this.runner.finishRun();
  }
  
  this.initRun = function(tests){
    this.runner.initRun(tests);
  }
  
  this.finishRun = function(){
    this.runner.finishRun();
  }
  
  this.testInit = function(test){
    this.runner.testInit(test);
  }
  
  this.testSuccess = function(test){
    this.runner.testSuccess(test);
  }
  
  this.testFailure = function(test, e){
    this.runner.testFailure(test, e);
  }
  
  this.testError = function(test, e){
    this.runner.testError(test, e);
  }

  
}();