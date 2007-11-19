function Test(name, body){
  this.expectsError = false;
  this.waitForFinish = false;
  this.continuationTimeout = false;
  
  this.name = name;
  this.body = body;
  
  TestRunner.addTest(this);
    
  this.assert = function(cond, msg){
    if(!cond){
      throw new AssertionFailureError("Assertion Failed: " + msg);
    }
  }
  
  this.fail = function(msg){
     throw new AssertionFailureError("Failure: " + msg);
  }
  
  this.log = function(msg){
  }
  
  this.expectError = function(func){
    this.expectsError = true;
    func();
    if(expectsError){
      throw new AssertionFailureError("Expected Error");
    }
  }
  
  this.throwAndPass = function(e){
    expectError = true;
    throw e;
  }
  
  this.continueWithTimeout = function(continuation, timeout){
    this.waitForFinish = true;
    var test = this;
    
    var timer = window.setTimeout(function(){
      
      test.continuationTimeout = true;
      _run.apply(test, [function(test){
         GM_log("In timeout");
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
  
  this.finish = function(){
    this.runner.testSuccess(this);
  }
  
  function _run(fn){
    try{
      GM_log("Running " + fn.toSource());
      fn(this);
      if(!this.waitForFinish){
         this.finish();  
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
          GM_log("Ignored Error: " + e.message);
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

