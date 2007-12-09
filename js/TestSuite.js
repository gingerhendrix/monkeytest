
function TestSuite(name, tests){
  this.name = name;
  this.tests = [];
  this.setUp = function(){};
  this.tearDown = function(){};
  this.asynchronous = false;
  
  TestManager.addTest(this);
  
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