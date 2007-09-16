// ==UserScript==
// @name          FunctionalTest
// @description   Tests for GMFunctionalTest Library
// @namespace     http://gandrew.com
// @include       http://localhost/eclipse/GMTest/tests/test.html
// @require       ../js/jsUnitCore.js
// @require       ../js/TestRunner.js
// @require       ../js/FunctionalTestRunner.js
// @require       ../js/Test.js
// ==/UserScript==


new Test("PassingTest", function(test){
  test.assert(true);  
});

new Test("FailingTest", function(test){
  test.assert(false, "this test should fail");  
});

new Test("ContinuationSuccess", function(test){
  var continuation = test.continueWithTimeout(function(test){
    test.assert(true);
  }, 1000);
  window.setTimeout(continuation, 10);  
});

new Test("ContinuationFailure", function(test){
  var continuation = test.continueWithTimeout(function(test){
    test.assert(false, "this test should fail");
  }, 1000);
  window.setTimeout(continuation, 10);  
});

new Test("ContinuationTimeout", function(test){
  var continuation = test.continueWithTimeout(function(test){
    alert("In continuation");
    test.assert(true);
  }, 10);
  window.setTimeout(continuation, 1000);  
});

TestRunner.run();