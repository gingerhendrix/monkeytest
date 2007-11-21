function Test(name, body, addTest){
  this.expectsError = false;
  this.waitForFinish = false;
  this.continuationTimeout = false;
  
  this.name = name;
  this.body = body;
  
  if(typeof(addTest)=="undefined" || addTest == true){
    TestRunner.addTest(this);
  }
    
  this.assert = function(cond, msg){
    this.runner.testAssertion(this);
    if(!cond){
      throw new AssertionFailureError(msg);
    }
    
  }
  
  this.fail = function(msg){
     throw new AssertionFailureError(msg);
  }
  
  this.log = function(msg){
  }
  
  this.expectError = function(func){
    try{
      func();
      throw new AssertionFailureError("Expected Error");
    }catch(e){
    }
  }
    
  this.continueWithTimeout = function(continuation, timeout){
    this.waitForFinish = true;
    var test = this;
    
    var timer = window.setTimeout(function(){
      
      test.continuationTimeout = true;
      _run.apply(test, [function(test){
         test.fail("Continuation Timed out after: " + timeout);
      }])    
    }, timeout);
     
    return function(){
      test.waitForFinish = false;
      window.clearTimeout(timer);
      
      if(!test.continuationTimeout){
        _run.apply(test, [continuation]);
      }
    }
  }
  
  function _run(fn){
    try{
      fn(this);
      if(!this.waitForFinish){
        this.runner.testSuccess(this);
      }
    }catch(e){
      if(e instanceof AssertionFailureError  ){
         this.runner.testFailure(this, e);
      }else if(JsUnitException && e instanceof JsUnitException){
          this.runner.testFailure(this, new AssertionFailureError(e.comment + " : " + e.jsUnitMessage));
      }else{
        if(!this.expectsError){
          this.runner.testError(this, e);
          throw e;
        }else{
          this.expectsError = false;
        } 
      }
    }

  }
  
  this.run = function(runner){
    this.runner = runner;
    this.runner.testInit(this);
    _run.apply(this,[body]);
  }
}

function AssertionFailureError(message){
   this.message = message;
   this.name = "AssertionFailureError";
}
AssertionFailureError.prototype = new Error();

if(typeof JsUnitException == "undefined"){
  JsUnitException = function(){};
}

if (typeof(GMTest) == "undefined") GMTest = {}
GMTest.Test = Test