
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
  
  this.run = function(runner){
    if(this.asynchronous){
     this.asynchronousRun(runner); 
     return;
    }
    runner.suiteInit(this);
    for(var i=0; i<this.tests.length; i++){
      var test = this.tests[i];
      var suite = this;
      
      suite.setUp(test);
      try{
        test.run(runner);
      }catch(e){
      }
      suite.tearDown(test);
    }
    runner.suiteFinish(this);
  }
  
  this.asynchronousRun = function(runner){
    var tests = this.tests;
    var suite = this;
    var state = "suiteInit";
    var currentTest = 0;
    var timer = window.setInterval(function(){
      if(state=="suiteInit"){
        state = "nextTest"
        runner.suiteInit(suite);
        currentTest = 0;
      }else if(state=="nextTest"){
        if(currentTest < tests.length){
          state = "runTest";
          var test = tests[currentTest];
          try{ 
            suite.setUp(test);
          }catch(e){
            
          }
        }else{
          state = "suiteFinished"
        }
      }else if(state=="runTest"){
          state = "finishTest";
          var test = tests[currentTest]; 
          try{
            test.run(runner);
          }catch(e){
            
          }
      }else if(state=="finishTest"){
          state = "nextTest";
          var test = tests[currentTest];
          try{ 
            suite.tearDown(runner);
          }catch(e){
          
          }finally{
            currentTest++;
          }
      }else if(state=="suiteFinished"){
          runner.suiteFinish(suite);
          window.clearInterval(timer);
      }
    }, 10);  
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