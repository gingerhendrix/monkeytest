/**
 * Unit tests for Test.js
 */

new MonkeyTestDist.TestSuite("TestTests", {
 sanityTest : function(t){
   t.assert(true, "Assert true should not fail");
 },
 constructorTest : function(t){
    var body = function(){};
    var test = new Test("NAME", body);
    t.assert(test.name == "NAME", "Incorrect name" + test.name)
    t.assert(test.body == body, "Incorrect body " + test.body)
    t.assert(true);
  },
  assertionTest : function(t){
    var test = new Test("", function(){});
    
    var mockControl = new MockControl();
    runnerMock = mockControl.createMock(SimpleTestRunner);
    runnerMock.expects().testAssertion(test);
    test.runner = runnerMock;
    
    test.assert(true, "msg");
    
    mockControl.verify();
    t.assert(true);
  },
  assertionFailureTest : function(t){
    var test = new Test("", function(){ });
    
    test.runner = {testAssertion : function(){}};
    
    try{
       test.assert(false, "msg");
       t.fail("Should never be executed");
    }catch(e){
       t.assert(e instanceof AssertionFailureError, "AssertionFailureError expected, got " + e);
    }
  },
  expectErrorTest : function(t){
    var test = new Test("", function(){});
    test.expectError(function(){
       throw new Error("Should be caught");
     });
    t.assert(true);
  },
  expectErrorFailureTest : function(t){
    var test = new Test("", function(){});
    try{
       test.expectError(function(){
         //Don't throw
       });
       t.fail("Shouldn't be reached");
    }catch(e){
       t.assert(e instanceof AssertionFailureError, "AssertionFailureError expected, got " + e);
    }
 },
 
 throwAndPassTest : function(t){
    var mockControl = new MockControl();
    runnerMock = mockControl.createMock(SimpleTestRunner);
    
    var test = new Test("", function(t){  t.throwAndPass(new Error("message")) });
    
    runnerMock.expects().testInit(test).andReturn(null);
    runnerMock.expects().log("Throwing and ignoring error Error: message").andReturn(null);
    runnerMock.expects().testSuccess(test).andReturn(null);
    
    test.run(runnerMock);
    
    mockControl.verify();
 },

 runSuccess : function(t){
    var mockControl = new MockControl();
    runnerMock = mockControl.createMock(SimpleTestRunner);
    
    var test = new Test("", function(t){  t.assert(true) });
    
    runnerMock.expects().testInit(test).andReturn(null);
    runnerMock.expects().testAssertion(test).andReturn(null);
    runnerMock.expects().testSuccess(test).andReturn(null);
    
    test.run(runnerMock);
    
    mockControl.verify();
    t.assert(true);  
  },
  
  runFailure : function(t){
    var mockControl = new MockControl();
    runnerMock = mockControl.createMock(SimpleTestRunner);
    
    var test = new Test("", function(t){ t.assert(false) });
    
    runnerMock.expects().testInit(test).andReturn(null);
    runnerMock.expects().testAssertion(test).andReturn(null);
    runnerMock.expects().testFailure(test, TypeOf.isA(AssertionFailureError)).andReturn(null);
    
    test.run(runnerMock);
    
    mockControl.verify();
    t.assert(true);
  },

  runFailureWithMessage : function(t){
      var mockControl = new MockControl();
      runnerMock = mockControl.createMock(SimpleTestRunner);
      
      var test = new Test("", function(t){ t.assert(false, "Message") });
      
      runnerMock.expects().testInit(test)
      runnerMock.expects().testAssertion(test)
      runnerMock.expects().testFailure(test, TypeOf.isA(AssertionFailureError)).andReturn(null);
      
      test.run(runnerMock);
      
      mockControl.verify();
      t.assert(true);
  },
  
  
  continuation : function(t){
    var mockControl = new MockControl();
    runnerMock = mockControl.createMock(SimpleTestRunner);
    var test = new Test("", function(t){   });
    test.runner = runnerMock;
    //TestManager = mockControl.createMock(TestManager);
    
    //TestManager.expects().pause();
    var testContinuation = test.continueWithTimeout(function(){
      //Note these tests will fail on the object under test, rather than the dist test library
      //Hard to debug.
      t.assert(arguments.length == 3, "Wrong length " + arguments.length);
      t.assert(arguments[0] == test, "First argument should be test, got " + arguments[0]);
      t.assert(arguments[1] == "arg1", "Second argument should be 'arg1', got " + arguments[1]);
      t.assert(arguments[2] == "arg2", "Second argument should be 'arg2', got " + arguments[2]);
     }, 1000);
    mockControl.verify();    
    t.assert(true);
    
    var continuation = t.continueWithTimeout(function(){    
      runnerMock.expects().testSuccess(test);
      //TestManager.expects().restart();
      
      testContinuation("arg1", "arg2");
      
      mockControl.verify();
      //TestManager = oldTM;
      t.assert(true);
    }, 1000);
    
    window.setTimeout(function(){ continuation(); }, 10);
  }
});
