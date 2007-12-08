function Test(name, body, addTest){
  this.ignoreError = false;
  this.waitForFinish = false;
  this.continuationTimeout = false;
  
  this.name = name;
  this.body = body;
  
  if(typeof(addTest)=="undefined" || addTest == true){
    TestManager.addTest(this);
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
    this.runner.log(msg);
  }
  
  this.expectError = function(func){
    try{
      func();
      throw new AssertionFailureError("Expected Error");
    }catch(e){
    }
  }
  
  this.throwAndPass = function(e){
    this.ignoreError = true;
    throw e;
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
        if(!this.ignoreError){
          this.runner.testError(this, e);
          throw e;
        }else{
          this.ignoreError = false;
          this.log("Throwing and ignoring error " + e);
          this.runner.testSuccess(this);
          window.setTimeout(function(){
            throw e;
          }, 1);
        } 
      }
    }

  }
  
  this.run = function(runner){
    this.runner = runner;
    this.runner.testInit(this);
    _run.apply(this,[this.body]);
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