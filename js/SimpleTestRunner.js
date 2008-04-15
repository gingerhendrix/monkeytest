
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


