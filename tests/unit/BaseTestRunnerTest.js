new TestSuite("BaseTestRunner", {
  setUp : function(t){
    t.runnerDefaults = {
        suites : 2,
        tests : 2,
        successes : 2,
        failures : 2,
        errors : 2,
        assertions : 2,
        passed : true,
        suiteTests : 2,
        suiteSuccesses : 2,
        suiteErrors : 2,
        suiteFailures : 2,
        suitePassed : true    
      }
    t.initRunner = function(overrides){
      if(typeof(overrides)=="undefined"){overrides = {}}
      var runner = new BaseTestRunner();
      for(var prop in t.runnerDefaults){
        runner[prop] = (typeof(overrides[prop]) != "undefined" ? overrides[prop] : t.runnerDefaults[prop]); 
      }
      return runner;
    }  
    t.assertRunnerEqual = function(expected, actual){
      for(var prop in t.runnerDefaults){
        var expectedValue = (typeof(expected[prop]) != "undefined" ? expected[prop] : t.runnerDefaults[prop]);
        t.assert(actual[prop] == expectedValue, 
              "Incorrect " + prop + " expected " + expectedValue + "(" + expected[prop] + ") got " + actual[prop]);  
      }
    }
  },
  
  testSanity : function(t){
    var runner = t.initRunner();
    t.assertRunnerEqual({}, runner);
  },
  
  testInitRun : function(t){
    var runner = t.initRunner();
    runner.initRun();
    t.assertRunnerEqual({
      suites: 0,
      tests: 0,
      successes: 0,
      failures: 0,
      errors: 0,
      assertions: 0,
      passed: true
    }, runner);
  },
  
  testFinishRun : function(t){
    var runner = t.initRunner();
    runner.finishRun();
    t.assertRunnerEqual({}, runner);
  },
  
  testSuiteInit : function(t){
    var runner = t.initRunner();
    runner.suiteInit();
    t.assertRunnerEqual({
      suites : t.runnerDefaults.suites + 1,
      suiteTests: 0,
      suiteSuccesses: 0,
      suiteFailures: 0,
      suiteErrors: 0,
      suitePassed: true
    }, runner);
  },
  
  testSuiteFinish : function(t){
    var runner = t.initRunner();
    runner.suiteFinish();
    t.assertRunnerEqual({}, runner);
  },
  
  testTestInit : function(t){
    var runner = t.initRunner();
    runner.testInit();
    t.assertRunnerEqual({
      assertions: 0,
      tests : t.runnerDefaults.tests + 1,
      suiteTests : t.runnerDefaults.suiteTests + 1 
   }, runner);
  },
  
  testTestSuccess : function(t){
    var runner = t.initRunner();
    runner.testSuccess();
    t.assertRunnerEqual({
      successes : t.runnerDefaults.successes + 1,
      suiteSuccesses : t.runnerDefaults.suiteSuccesses + 1
    }, runner);
  },
  
  testTestFailure : function(t){
    var runner = t.initRunner();
    runner.testFailure();
    t.assertRunnerEqual({
      failures : t.runnerDefaults.failures + 1,
      suiteFailures : t.runnerDefaults.suiteSuccesses + 1,
      suitePassed : false,
      passed : false
    }, runner);
  },
  
  testTestError : function(t){
    var runner = t.initRunner();
    runner.testError();
    t.assertRunnerEqual({
      errors : t.runnerDefaults.failures + 1,
      suiteErrors : t.runnerDefaults.suiteSuccesses + 1,
      suitePassed : false,
      passed : false
    }, runner);
  },
  
  testTestAssertion : function(t){
    var runner = t.initRunner();
    runner.testAssertion();
    t.assertRunnerEqual({
      assertions : t.runnerDefaults.assertions + 1,
    }, runner);
  },
  
  
  
});