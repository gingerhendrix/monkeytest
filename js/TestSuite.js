
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
    if(typeof(tests['setUp']) == 'function'){
      this.setUp = tests['setUp'];
    }
    if(typeof(tests['tearDown']) == 'function'){
      this.tearDown = tests['tearDown'];
    }    
  }
  
  this.run = function(runner){
    runner.suiteInit(this);
    for(var i=0; i<this.tests.length; i++){
      var test = this.tests[i];
      try{
        this.setUp.apply(test)
        test.run(runner);
        this.tearDown.apply(test)
      }catch(e){
        //Swallow and continue
      }
    }
    runner.suiteFinish(this);
  }
  
  
  function isTestMethod(obj, prop){
    return obj.hasOwnProperty(prop) 
      && typeof(obj[prop])=="function" 
      && prop != "setUp" 
      && prop != "tearDown" 
      && prop.indexOf("_") != 0;
  }
  
  init.apply(this);
}