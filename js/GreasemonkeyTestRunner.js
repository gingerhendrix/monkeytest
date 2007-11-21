

function GreasemonkeyTestRunner(name){
  this.testEl;
  this.logEl;
  var assertions = 0;
  var suiteTests = 0;
  var suiteErrors = 0;
  var suiteFailures = 0;
  var suiteSuccesses = 0;
  var suitePassed = true;
  
  this.initRun = function(tests){
    this.testEl = document.getElementById(name);
    this.logEl = document.evaluate("id('"+name+"')//*[@class='log']",
                       document, 
                       null, 
                       XPathResult.FIRST_ORDERED_NODE_TYPE, 
                       null).singleNodeValue;
    this.testsEl = document.evaluate("id('"+name+"')//*[@class='tests']",
                       document, 
                       null, 
                       XPathResult.FIRST_ORDERED_NODE_TYPE, 
                       null).singleNodeValue;
    makeList(this.testsEl, tests);
  }
  
  function makeList(testsEl, tests){
    for(var i=0; i<tests.length; i++){
      var testLi = document.createElement("li");
      
      var testNameEl = document.createElement("span");
      testNameEl.innerHTML = tests[i].name;
      
      tests[i].element = testNameEl;
      testLi.appendChild(testNameEl);
      
       if(tests[i].tests){
         var subList =document.createElement("ul");
         makeList(subList, tests[i].tests);
         testLi.appendChild(subList);          
      }
      
      testsEl.appendChild(testLi);
    }
  }
  
  this.log = function(msg){
    var msgNode = document.createElement("div");
    msgNode.innerHTML = msg;
    this.logEl.appendChild(msgNode);
  }
  
  this.finishRun = function(){
  
  }
  
  this.suiteInit = function(suite){
    suite.element.setAttribute("class", "suite running")
    suiteTests = 0;
    suiteErrors = 0;
    suiteFailures = 0;
    suiteSuccesses = 0;
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
      suite.element.setAttribute("class", "suite success")
    }else{
      suite.element.setAttribute("class", "suite failure")
    } 
  }
  
  this.testInit = function(test){
    test.element.setAttribute("class", "running")
    assertions = 0;
    suiteTests++;
  }
  
  this.testAssertion = function(test){
    assertions++;
  }
  
  this.testSuccess = function(test){
    test.element.setAttribute("class", "success")
    test.element.innerHTML += " (" + assertions + " assertions)"
    suiteSuccesses++;
    }
  
  this.testFailure = function(test, e){
    this.testEl.setAttribute("class", "test failure");
    test.element.setAttribute("class", "failure")
    test.element.innerHTML += " FAILED"
    suiteFailures++;
    suitePassed = false;
    this.log("FAILURE: "+ test.name + " : " + e.message); 
  }
  
  this.testError = function(test, e){
     this.testEl.setAttribute("class", "test error");
     test.element.setAttribute("class", "error")
     test.element.innerHTML += " ERROR"
     suiteErrors++;
     suitePassed = false;
     this.log("ERROR: " + test.name + " : " + e.message);
  }
}

GreasemonkeyTestRunner.prototype = new AbstractTestRunner();