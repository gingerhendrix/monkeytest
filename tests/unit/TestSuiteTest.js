
new TestSuite("TestSuite Test", {

  constructorTest : function(t){
        var tests = {
          setUp : function(){ assert(true, "setUp") },
          tearDown : function(){ assert(true, "tearDown") },
          testOne : function(){ assert(true) },
          _ignoreMe : function(){ 3 + 3; },
          ignoreMeToo : 5
        } 
        var testSuite = new TestSuite("NAME", tests);
        t.assert(testSuite.name == "NAME", "Incorrect Name");
        t.assert(testSuite.setUp === tests.setUp, "Incorrect setUp " + testSuite.setUp);
        t.assert(testSuite.tearDown === tests.tearDown, "Incorrect tearDown " + testSuite.tearDown);
        t.assert(testSuite.tests.length == 1, "Incorrect tests length " + testSuite.tests.length);
        t.assert(testSuite.tests[0].constructor == Test, "Incorrect test class " + testSuite.tests[0].constructor);
        t.assert(testSuite.tests[0].name == "testOne", "Incorrect test name " + testSuite.tests[0].name);
        t.assert(testSuite.tests[0].body == tests.testOne, "Incorrect test body " + testSuite.tests[0].body);
   },
  
  
  runTest : function(t){
        var mockControl = new MockControl();
        
        runnerMock = mockControl.createMock(SimpleTestRunner);
      
        var tests = {
          setUp : function(){ },
          tearDown : function(){  },
          testOne : function(t){ t.assert(true) },
          _ignoreMe : function(){ 3 + 3; },
          ignoreMeToo : 5
        }
        //testsMock = mockControl.createMock(tests);
     
         
        var testSuite = new TestSuite("NAME", tests);
        
        mockControl.reset();
        
        runnerMock.expects().suiteInit(testSuite)
        runnerMock.expects().testInit(TypeOf.isA(Test))
        //testsMock._expects().setUp(TypeOf.isA(Test));
        //testsMock._expects().testOne(TypeOf.isA(Test));
        runnerMock.expects().testAssertion(TypeOf.isA(Test));
        //testsMock._expects().tearDown();
        runnerMock.expects().testSuccess(TypeOf.isA(Test));
        runnerMock.expects().suiteFinish(testSuite)
        
        testSuite.run(runnerMock);
        
        mockControl.verify();
        t.assert(true);
   },
   
   asynchronousRunTest : function(t){
     
   }

});