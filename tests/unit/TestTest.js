/**
 * Unit tests for Test.js
 */

new Test("Sanity Test",  
  function(t){
   t.assert(true, "Assert true should not fail");
 }
);

new Test("Constructor", 
  function(t){
    var mockControl = new MockControl();
    TestRunner = mockControl.createMock(TestRunner);
    
    TestRunner.expects().addTest(TypeOf.isA(Test));
    var body = function(){};
    var test = new Test("NAME", body);
    t.assert(test.name == "NAME", "Incorrect name" + test.name)
    t.assert(test.body == body, "Incorrect body " + test.body)
    mockControl.verify();
    t.assert(true);
  }
);

new Test("Assertion Test",  
  function(t){
    var test = new Test("", function(){});
    
    var mockControl = new MockControl();
    runnerMock = mockControl.createMock(SimpleTestRunner);
    runnerMock.expects().testAssertion(test);
    test.runner = runnerMock;
    
    test.assert(true, "msg");
    
    mockControl.verify();
    t.assert(true);
 }
);


new Test("Assertion Failure Test",  
  function(t){
    var test = new Test("", function(){ });
    
    test.runner = {testAssertion : function(){}};
    
    try{
       test.assert(false, "msg");
       t.fail("AssertionFailureException expected, but not thrown");
    }catch(e){
       t.assert(e instanceof AssertionFailureError, "AssertionFailureError expected, got " + e);
    }
 }
);

new Test("Expect Error Test",  
  function(t){
    var test = new Test("", function(){});
     test.expectError(function(){
       throw Error;
     });
    t.assert(true);
 }
);

new Test("Expect Error Failure Test",  
  function(t){
    var test = new Test("", function(){});
    try{
       test.expectError(function(){
         //Don't throw
       });
       t.fail("AssertionFailureException expected, but not thrown");
    }catch(e){
       t.assert(e instanceof AssertionFailureError, "AssertionFailureError expected, got " + e);
    }
 }
);

new Test("Run Success", function(t){
  var mockControl = new MockControl();
  runnerMock = mockControl.createMock(SimpleTestRunner);
  
  var test = new Test("", function(t){  t.assert(true) });
  
  runnerMock.expects().testInit(test).andReturn(null);
  runnerMock.expects().testAssertion(test).andReturn(null);
  runnerMock.expects().testSuccess(test).andReturn(null);
  
  test.run(runnerMock);
  
  mockControl.verify();
  t.assert(true);
});

new Test("Run Failure", function(t){
  var mockControl = new MockControl();
  runnerMock = mockControl.createMock(SimpleTestRunner);
  
  var test = new Test("", function(t){ t.assert(false) });
  
  runnerMock.expects().testInit(test).andReturn(null);
  runnerMock.expects().testAssertion(test).andReturn(null);
  runnerMock.expects().testFailure(test, "AssertionFailureError: Assertion Failed: undefined").andReturn(null);
  
  test.run(runnerMock);
  
  mockControl.verify();
  t.assert(true);
});

new Test("Run Failure with Message", function(t){
  var mockControl = new MockControl();
  runnerMock = mockControl.createMock(SimpleTestRunner);
  
  var test = new Test("", function(t){ t.assert(false, "Message") });
  
  runnerMock.expects().testInit(test).andReturn(null);
  runnerMock.expects().testAssertion(test).andReturn(null);
  runnerMock.expects().testFailure(test, "AssertionFailureError: Assertion Failed: Message").andReturn(null);
  
  test.run(runnerMock);
  
  mockControl.verify();
  t.assert(true);
});

