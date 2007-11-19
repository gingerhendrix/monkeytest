
function TestRunnerUI(){
  var testWindow;  
  var progressBar;
  function makeWindow(){
    testWindow = window.open("", "functional_test_runner", "width=600, height=600, location=no, toolbar=no, menubar=no, resizable=yes");
    testWindow.document.body.innerHTML = "<h1>Functional Test Runner</h1>";
    
  }
  
  function listTests(tests){
    var testList = document.createElement("ul");
    tests.forEach(function(test){
      var testEl = document.createElement("li");
      testEl.innerHTML = test.name;
      testList.appendChild(testEl);
      test.element = testEl;
    });
    testWindow.document.body.appendChild(testList);
  }
  
  
  this.initRun = function(tests){
    if(TestRunnerUI.testInNewWindow){
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
  
  this.testInit = function(test){
    test.element.style.color = "#0000ff";
  }
  
  this.testSuccess = function(test){
    test.element.style.color = "#00ff00";
    progressBar.increment();
  }
  
  this.testFailure = function(test, e){
    _failure(test, "Failure: " + e.message)
  }
  
  this.testError = function(test, e){
    _failure(test, "Error: " + e.message)
  }
  
  function _failure(test, message){
    test.element.style.color = "#ff0000";
    var msg = document.createElement("div");
    msg.innerHTML = message;
    test.element.appendChild(msg);
    progressBar.increment();
    progressBar.fail();
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

TestRunnerUI.testInNewWindow = false;