
<%= include '../lib/jsUtils-0.1.js' %>
var __utils = Utils;
Utils.revertNamespace();

(function(Utils){
  // Make jsUtils private to anonymous function scope
  var __should_export = ((typeof(MonkeyTest) != "undefined") ? MonkeyTest.__export__ : true);
  
  Utils.replaceNamespace("MonkeyTest", {
    Version: '<%= APP_VERSION %>',
    __export__ : __should_export
  });
  
  <%= include 'Test.js' %>
  <%= include 'AbstractTestRunner.js' %>
  <%= include 'BaseTestRunner.js' %>
  <%= include 'SimpleTestRunner.js' %>
  <%= include 'TestManager.js' %>
  <%= include 'TestSuite.js' %>

  Utils.namespace("MonkeyTest", {
    Test : Test,
    TestSuite : TestSuite,
    TestManager : TestManager,
    BaseTestRunnner : BaseTestRunner,
    AbstractTestRunner : AbstractTestRunner,
    SimpleTestRunner : SimpleTestRunner,
    AssertionFailureError : AssertionFailureError
  });
  MonkeyTest.BaseTestRunner = BaseTestRunner; //No idea why this is required!

})(__utils);



if(MonkeyTest.__export__){
  Test = MonkeyTest.Test
  TestManager = MonkeyTest.TestManager
  TestSuite = MonkeyTest.TestSuite
  SimpleTestRunner = MonkeyTest.SimpleTestRunner
}
