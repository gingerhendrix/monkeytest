
function BaseTestRunner(){

  this.initRun = function(){
    this.suites = 0;
    this.tests = 0;
    this.successes = 0;
    this.failures = 0;
    this.errors = 0;
    this.assertions = 0;
    this.passed = true;
  };
  this.finishRun = function(){};
  
  this.suiteInit = function(){
    this.suites++;
    this.suiteTests = 0;
    this.suiteSuccesses = 0;
    this.suiteErrors = 0;
    this.suiteFailures = 0;
    this.suitePassed = true;
  };
  this.suiteFinish = function(){};
   
  this.testInit = function(){
    this.assertions = 0;
    this.tests++;
    this.suiteTests++;    
  };
  this.testAssertion = function(){
    this.assertions++;
  };
  this.testSuccess = function(){
    this.successes++;
    this.suiteSuccesses++;
  };
  this.testFailure = function(){
    this.failures++;
    this.suiteFailures++;
    this.passed = false;
    this.suitePassed = false;
  };
  this.testError = function(){
    this.errors++;
    this.suiteErrors++;
    this.passed = false;
    this.suitePassed = false;
  };
}

BaseTestRunner.prototype = new AbstractTestRunner();