
function AbstractTestRunner(){
   this.initRun = function(){};
   this.finishRun = function(){};
   
   this.suiteInit = function(){};
   this.suiteFinish = function(){};
   
   this.testInit = function(){};
   this.testAssertion = function(){};
   this.testSuccess = function(){};
   this.testFailure = function(){};
   this.testError = function(){};
   
   this.log = function(msg){};
}