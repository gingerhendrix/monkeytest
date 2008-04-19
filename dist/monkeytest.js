
(function(){
  var _savedNamespaces = {}
  _savedNamespaces["Utils"] = window.Utils;
  var Utils = window.Utils = {};

  function getNamespace(nameParts){
    var root = window;
    for(var i=0; i<nameParts.length; i++){
      root = root[nameParts[i]];
    }
    return root;
  }


  Utils.namespace = function(name /*, extensions */){
    var nameParts = name.split(".");
    var root = (this != Utils) ? this : window;
    var extend =  Array.prototype.slice.call(arguments, 1)

    for(var i=0; i<nameParts.length; i++){
      if(typeof(root[nameParts[i]]) == "undefined"){
        root[nameParts[i]] = {};
      }
      Utils.extend(root[nameParts[i]], {__NAMESPACE__ : name}, extend);
      root = root[nameParts[i]];
    }
    return root;
  }


  Utils.replaceNamespace = function(name /*, extensions */){
    Utils.namespace(name);

    var head = name.split(".").slice(0, -1);
    var tail = name.split(".").slice(-1)[0];

    var parent = getNamespace(head);
    _savedNamespaces[name] = parent[tail];
    parent[tail] = {};
    Utils.extend(parent[tail], {__NAMESPACE__ : name}, Array.prototype.slice.call(arguments, 1));

    return parent[tail];
  }

  Utils.revertNamespace = function(name){
    if(arguments.length==0){
      name = "Utils";
    }
    var head = name.split(".").slice(0, -1);
    var tail = name.split(".").slice(-1);
    var parent = getNamespace(head);
    var namespace = parent[tail]
    parent[tail] = _savedNamespaces[name];
    return namespace;
  }

  Utils.extend = function(obj, extension /*, extensions */){
    if(arguments.length > 2){
      for(var i=1; i<arguments.length; i++){
        Utils.extend(obj, arguments[i])
      }
      return;
    }
    if(extension.constructor == Array){
      for(var i=0; i<extension.length; i++){
        Utils.extend(obj, extension[i])
      }
      return;
    }
    if(typeof(extension) == "function"){
      Utils.extend(obj, extension.call())
    }

    for(var prop in extension){
      obj[prop] = extension[prop];
    }
    return obj;
  }

  Utils.Extendable = {
    extend : function(extension /*, extensions */){
      return Utils.extend(this,  Array.prototype.slice.call(arguments));
    }
  }

  Utils.Namespaceable = {
    namespace : function(namespace /*, extensions */){
     return  Utils.namespace.apply(this, Array.prototype.slice.call(arguments));
    }
  }

  Utils.Revertable = {
    revertNamespace : function(){
      return Utils.revertNamespace(this.__NAMESPACE__);
    }
  }

})();
var __utils = Utils;
Utils.revertNamespace();

(function(Utils){
  // Make jsUtils private to anonymous function scope
  var __should_export = ((typeof(MonkeyTest) != "undefined") ? MonkeyTest.__export__ : true);

  Utils.replaceNamespace("MonkeyTest", {
    Version: '0.2.1',
    __export__ : __should_export
  });


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
    }catch(e){
      failed = false;
      return;
    }
    throw new AssertionFailureError("Expected Error but none was thrown");
  }

  this.throwAndPass = function(e){
    this.ignoreError = true;
    throw e;
  }

  this.continueWithTimeout = function(continuation, timeout){
    this.waitForFinish = true;
    TestManager.pause();
    var test = this;

    var timer = window.setTimeout(function(){
      test.continuationTimeout = true;
      _run.apply(test, [function(test){
         test.fail("Continuation Timed out after: " + timeout);
      }]);
      TestManager.restart();
    }, timeout);

    return function(){
      test.waitForFinish = false;
      window.clearTimeout(timer);

      if(!test.continuationTimeout){
        _run.apply(test, [continuation]);
        TestManager.restart()
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
          window.setTimeout(function(){
            throw e;
           }, 1);
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
//AssertionFailureError.prototype = new Error();

if(typeof JsUnitException == "undefined"){
  JsUnitException = function(){};
}

function AbstractTestRunner(){
   this.initRun = function(){};
   this.finishRun = function(){};

   this.suiteInit = function(){};
   this.suiteFinish = function(){};

   this.testInit = function(){};
   this.testAssertion = function(){};
   this.testSuccess = function(){};
   this.testFailure = function(){};
   this.testError = function(){};

   this.log = function(msg){};
}

function BaseTestRunner(){

  this.initRun = function(){
    this.suites = 0;
    this.tests = 0;
    this.successes = 0;
    this.failures = 0;
    this.errors = 0;
    this.assertions = 0;
    this.passed = true;
  };
  this.finishRun = function(){};

  this.suiteInit = function(){
    this.suites++;
    this.suiteTests = 0;
    this.suiteSuccesses = 0;
    this.suiteErrors = 0;
    this.suiteFailures = 0;
    this.suitePassed = true;
  };
  this.suiteFinish = function(){};

  this.testInit = function(){
    this.assertions = 0;
    this.tests++;
    this.suiteTests++;
  };
  this.testAssertion = function(){
    this.assertions++;
  };
  this.testSuccess = function(){
    this.successes++;
    this.suiteSuccesses++;
  };
  this.testFailure = function(){
    this.failures++;
    this.suiteFailures++;
    this.passed = false;
    this.suitePassed = false;
  };
  this.testError = function(){
    this.errors++;
    this.suiteErrors++;
    this.passed = false;
    this.suitePassed = false;
  };
}

BaseTestRunner.prototype = new AbstractTestRunner();

var SimpleTestRunner = function(){
  this.testInNewWindow = false;
  this.window;
  this.testListEl;
  this.overviewEl;
  this.progressBar;

  this.base = new BaseTestRunner();

  function makeWindow(){
    var w = window.open("", "functional_test_runner", "width=600, height=600, location=no, toolbar=no, menubar=no, resizable=yes");
    w.document.body.innerHTML = "<h1>Functional Test Runner</h1>";
    return w;
  }

  function listTests(tests){
    this.testListEl = makeList.apply(this, [tests])
    this.window.document.body.appendChild(this.testListEl);
  }

  function makeList(tests){
    var doc = this.window.document;
    var testList = doc.createElement("ul");

    tests.forEach(function(test){
      var testEl = doc.createElement("li");
      var testNameEl = doc.createElement("span");
      testNameEl.innerHTML = test.name;
      testEl.appendChild(testNameEl);

      if(test.constructor == TestSuite){
        var subList = makeList(test.tests);
        testEl.appendChild(subList);
      }

      testList.appendChild(testEl);
      test.element = testNameEl;
    });
    return testList;
  }

  function countTests(tests){
    var count = 0;
    tests.forEach(function(test){
      if(test.constructor == TestSuite){
        count += countTests(test.tests);
      }else{
        count += 1;
      }
    });
    return count;
  }

  this.initRun = function(tests){
    this.base.initRun(tests);
    if(this.testInNewWindow){
      this.window = makeWindow();
    }else{
      this.window = window;
    }
    var doc = this.window.document;
    var numTests = countTests(tests)
    this.progressBar = new ProgressBar(numTests);
    doc.body.appendChild(this.progressBar.element);

    this.overviewEl = this.window.document.createElement("div");
    this.overviewEl.innerHTML = numTests + " tests";
    doc.body.appendChild(this.overviewEl);

    listTests.apply(this, [tests]);
  }

  this.finishRun = function(){
    this.base.finishRun();
  }

  this.suiteInit = function(suite){
    this.base.suiteInit(suite);
    suite.element.style.color = "#0000ff";
  }

  this.suiteFinish = function(suite){
    this.base.suiteFinish(suite);
    var msg = " (" + this.base.suiteTests + " tests";
    if(this.base.suiteFailures > 0){
      msg += ", "  + this.base.suiteFailures + " failures";
    }
    if(this.base.suiteErrors > 0){
      msg += ", "  + this.base.suiteErrors + " errors";
    }
    msg += ")";
    suite.element.innerHTML += msg;
    if(this.base.suitePassed){
      suite.element.style.color = "#00ff00";
    }else{
      suite.element.style.color = "#ff0000";
    }
  }

  this.testInit = function(test){
    this.base.testInit(test);
    test.element.style.color = "#0000ff";
  }

  this.testAssertion = function(test){
    this.base.testAssertion(test);
  }

  this.testSuccess = function(test){
    this.base.testSuccess(test);
    test.element.style.color = "#00ff00";
    test.element.innerHTML += " (" + this.base.assertions + " assertions)"
    this.progressBar.increment();
  }

  this.testFailure = function(test, e){
    this.base.testFailure(test);
    _failure.call(this, test, "Failure: " + e.message)
  }

  this.testError = function(test, e){
     this.base.testError(test);
    _failure.call(this, test, "Error: " + e.message)
  }

  function _failure(test, message){
    test.element.style.color = "#ff0000";
    var msg = this.window.document.createElement("div");
    msg.innerHTML = message;
    test.element.appendChild(msg);
    this.progressBar.increment();
    this.progressBar.fail();
    suitePassed = false;
  }

  function ProgressBar(numTests){
    this.element;
    var bar;
    var testsRan = 0;

    function init(){
      this.element = document.createElement("div");

      var barContainer = document.createElement("div");
      this.element.appendChild(barContainer);
      barContainer.style.width = "200px";
      barContainer.style.height = "40px";
      barContainer.style.border = "1px solid black";

      bar = document.createElement("div");
      barContainer.appendChild(bar);
      bar.style.width = "1px";
      bar.style.height = "40px";
      bar.style.backgroundColor = "#00ff00";
    }
    init.apply(this, []);

    this.increment = function(){
      testsRan+=1.0;
      bar.style.width = Math.ceil((testsRan/numTests)*200)+"px";
    }

    this.fail = function(){
      bar.style.backgroundColor = "#ff0000";
    }
  }
}

SimpleTestRunner.prototype = new AbstractTestRunner();


function RunQueue(){
  var runnables = [];
  var currentRunnable = 0;
  var paused = false;
  var timer;

  this.add = function(self, func, args){
    if(!self || !func){
      throw new Error("Cannot create runnable " + self + ", " + func + ", " + args);
    }
    runnables.push({self : self, func : func, args : args});
  }

  this.start = function(){
    currentRunnable = 0;
    timer = window.setTimeout(next, 10);
  }

  this.pause = function(){
    paused = true;
  }

  this.restart = function(){
    paused = false;
    timer = window.setTimeout(next, 10);
  }

  function next(){
    if(currentRunnable >= runnables.length){
      return;
    }
    var runnable = runnables[currentRunnable++];
    runnable.func.apply(runnable.self, runnable.args || []);
    if(!paused){
      paused = false;
      timer = window.setTimeout(next, 10);
    }
  }
};

var TestManager = new function(){
  this.runner = new SimpleTestRunner();
  var tests = [];
  var queue = new RunQueue();

  this.addTest = function(test){
    tests.push(test);
  }

  this.run = function(){
    queue = new RunQueue();
    var runner = this.runner;
    var self = this;
    queue.add(runner, runner.initRun, [tests]);
    tests.forEach(function(test){
      if(test.constructor == TestSuite){
        self.runSuite(queue, test);
      }else{
        self.runTest(queue, test);
      }
    });
    queue.add(runner, runner.finishRun);

    queue.start();
  }

  this.pause = function(){
    queue.pause();
  }

  this.restart = function(){
    queue.restart();
  }

  this.runSuite = function(queue, suite){
   var runner = this.runner;
   queue.add(runner, runner.suiteInit, [suite]);
   suite.tests.forEach(function(test){
     queue.add(runner, runner.testInit, [test]);
     queue.add(test, suite.setUp, [test]);
     queue.add(test, test.run, [runner]);
     queue.add(test, suite.tearDown, [test]);
   });
   queue.add(runner, runner.suiteFinish, [suite]);
  }

  this.runTest = function(queue, test){
    var runner = this.runner;
    queue.add(runner, runner.testInit, [test]);
    queue.add(test, test.run, [runner]);
  }

}();


var TestSuite = function (name, tests){
  this.name = name;
  this.tests = [];
  this.setUp = function(){};
  this.tearDown = function(){};
  this.asynchronous = false;

  TestManager.addTest(this);

  function init(){
    for(var test in tests){
      if(isTestMethod(tests, test)){
        this.tests.push(new Test(test, tests[test], false));
      }
    }
    if(typeof(tests[TestSuite.setUpProperty]) == 'function'){
      this.setUp = tests[TestSuite.setUpProperty];
    }
    if(typeof(tests[TestSuite.tearDownProperty]) == 'function'){
      this.tearDown = tests[TestSuite.tearDownProperty];
    }
  }

  function isTestMethod(obj, prop){
    return obj.hasOwnProperty(prop)
      && typeof(obj[prop])=="function"
      && prop != TestSuite.setUpProperty
      && prop != TestSuite.tearDownProperty
      && prop.indexOf("_") != 0;
  }

  init.apply(this);
}

TestSuite.setUpProperty = "setUp"
TestSuite.tearDownProperty = "tearDown"

  Utils.namespace("MonkeyTest", {
    Test : Test,
    TestSuite : TestSuite,
    TestManager : TestManager,
    BaseTestRunnner : BaseTestRunner,
    SimpleTestRunner : SimpleTestRunner,
    AssertionFailureError : AssertionFailureError
  });

})(__utils);



if(MonkeyTest.__export__){
  Test = MonkeyTest.Test
  TestManager = MonkeyTest.TestManager
  TestSuite = MonkeyTest.TestSuite
  SimpleTestRunner = MonkeyTest.SimpleTestRunner
}