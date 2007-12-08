/**
 * Unit tests for Test.js
 */

new TestSuite("TestTests", {
 sanityTest : function(t){
   t.assert(true, "Assert true should not fail");
 },
 constructorTest : function(t){
    var mockControl = new MockControl();
    TestManager = mockControl.createMock(TestManager);
    
    TestManager.expects().addTest(TypeOf.isA(Test));
    var body = function(){};
    var test = new Test("NAME", body);
    t.assert(test.name == "NAME", "Incorrect name" + test.name)
    t.assert(test.body == body, "Incorrect body " + test.body)
    mockControl.verify();
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
       t.fail("AssertionFailureException expected, but not thrown");
    }catch(e){
       t.assert(e instanceof AssertionFailureError, "AssertionFailureError expected, got " + e);
    }
  },
  expectErrorTest : function(t){
    var test = new Test("", function(){});
     test.expectError(function(){
       throw new Error("expected error");
     });
    t.assert(true);
  },
  expectErrorFailureTest : function(t){
    var test = new Test("", function(){});
    try{
       test.expectError(function(){
         //Don't throw
       });
       t.fail("AssertionFailureException expected, but not thrown");
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
    
    t.expectError(function(){
      test.run(runnerMock);
    });
    
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
    runnerMock.expects().testFailure(test, "AssertionFailureError").andReturn(null);
    
    test.run(runnerMock);
    
    mockControl.verify();
    t.assert(true);
  },

  runFailureWithMessage : function(t){
    function(t){
      var mockControl = new MockControl();
      runnerMock = mockControl.createMock(SimpleTestRunner);
      
      var test = new Test("", function(t){ t.assert(false, "Message") });
      
      runnerMock.expects().testInit(test).andReturn(null);
      runnerMock.expects().testAssertion(test).andReturn(null);
      runnerMock.expects().testFailure(test, "AssertionFailureError: Message").andReturn(null);
      
      test.run(runnerMock);
      
      mockControl.verify();
      t.assert(true);
    }
  }     
});
