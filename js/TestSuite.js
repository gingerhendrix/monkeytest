
function TestSuite(name, tests){
  this.name = name;
  this.tests = [];
  this.setUp = function(){};
  this.tearDown = function(){};
  
  TestRunner.addTest(this);
  
  function init(){
    for(var test in tests){
      if(isTestMethod(tests, test)){
        this.tests.push(new GMTest.Test(test, tests[test], false));  
      }
    }
    if(typeof(tests[TestSuite.setUpProperty]) == 'function'){
      this.setUp = tests[TestSuite.setUpProperty];
    }
    if(typeof(tests[TestSuite.tearDownProperty]) == 'function'){
      this.tearDown = tests[TestSuite.tearDownProperty];
    }    
  }
  
  this.run = function(runner){
    runner.suiteInit(this);
    for(var i=0; i<this.tests.length; i++){
      var test = this.tests[i];
      var suite = this;
      (function(test){
        window.setTimeout(function(){
          suite.setUp.apply(test, [test]);
        },1);
        window.setTimeout(function(){
          test.run.apply(test,[runner]);
        },1);
        window.setTimeout(function(){
          suite.tearDown.apply(test, [test]);
        },1);
      })(test);
    }
    window.setTimeout(function(){
      runner.suiteFinish(suite);
    }, 1);
  }
  
  
  function isTestMethod(obj, prop){
    return obj.hasOwnProperty(prop) 
      && typeof(obj[prop])=="function" 
      && prop != TestSuite.setUpProperty
      && prop != TestSuite.tearDownProperty 
      && prop.indexOf("_") != 0;
  }
  
  init.apply(this);
}

TestSuite.setUpProperty = "setUp"
TestSuite.tearDownProperty = "tearDown"