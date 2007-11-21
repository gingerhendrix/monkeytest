
function SimpleTestRunner(){
  var testWindow;  
  var progressBar;
  var suiteTests = 0;
  var suiteErrors = 0;
  var suiteFailures = 0;
  var suiteSuccesses = 0;
  var suitePassed = true;
  var assertions = 0;
  
  function makeWindow(){
    testWindow = window.open("", "functional_test_runner", "width=600, height=600, location=no, toolbar=no, menubar=no, resizable=yes");
    testWindow.document.body.innerHTML = "<h1>Functional Test Runner</h1>";
  }
  
  function listTests(tests){
    var testList = makeList(tests)
    testWindow.document.body.appendChild(testList);
  }
  
  function makeList(tests){
    var testList = document.createElement("ul");
    tests.forEach(function(test){
      var testEl = document.createElement("li");
      var testNameEl = document.createElement("span");
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
  
  
  this.initRun = function(tests){
    if(SimpleTestRunner.testInNewWindow){
      makeWindow();
    }else{
      testWindow = window;
    }
    progressBar = new ProgressBar(tests.length);
     testWindow.document.body.appendChild(progressBar.element);
    listTests(tests);
  }
  
  this.finishRun = function(){
    
  }
  
  this.suiteInit = function(suite){
    suite.element.style.color = "#0000ff";
    suiteTests = 0;
    suiteSuccesses = 0;
    suiteErrors = 0;
    suiteFailures = 0;
    suitePassed = true;
  }
  
  this.suiteFinish = function(suite){
    var msg = " (" + suiteTests + " tests";
    if(suiteFailures > 0){
      msg += ", "  + suiteFailures + " failures";
    }
    if(suiteErrors > 0){
      msg += ", "  + suiteErrors + " errors";
    }
    msg += ")";
    suite.element.innerHTML += msg;
    if(suitePassed){
      suite.element.style.color = "#00ff00";
    }else{
      suite.element.style.color = "#00ff00";
    }
  }
  
  this.testInit = function(test){
    test.element.style.color = "#0000ff";
    assertions = 0;
    suiteTests++;
  }
  
  this.testAssertion = function(test){
    assertions++;
  }
  
  this.testSuccess = function(test){
    test.element.style.color = "#00ff00";
    test.element.innerHTML += " (" + assertions + " assertions)"
    progressBar.increment();
    suiteSuccesses++;
    
  }
  
  this.testFailure = function(test, e){
    _failure(test, "Failure: " + e.message)
    suiteFailures++;
    
  }
  
  this.testError = function(test, e){
    _failure(test, "Error: " + e.message)
    suiteErrors++;
  }
  
  function _failure(test, message){
    test.element.style.color = "#ff0000";
    var msg = document.createElement("div");
    msg.innerHTML = message;
    test.element.appendChild(msg);
    progressBar.increment();
    progressBar.fail();
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

SimpleTestRunner.testInNewWindow = false;