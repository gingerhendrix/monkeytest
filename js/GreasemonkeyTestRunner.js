

function GreasemonkeyTestRunner(name){
  this.testEl;
  this.logEl;
  this.base = new BaseTestRunner();
 
  this.initRun = function(tests){
    this.base.initRun(tests);
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
    this.testEl.setAttribute("class", "test running");
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
    this.base.finishRun();
    if(this.base.passed){
      this.testEl.setAttribute("class", "test passed");
    }else{
      this.testEl.setAttribute("class", "test failure");
    }
  }
  
  this.suiteInit = function(suite){
    this.base.suiteInit(suite);
    suite.element.setAttribute("class", "suite running")
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
      suite.element.setAttribute("class", "suite success")
    }else{
      suite.element.setAttribute("class", "suite failure")
    } 
  }
  
  this.testInit = function(test){
    this.base.testInit(test);
    test.element.setAttribute("class", "running")
  }
  
  this.testAssertion = function(test){
    this.base.testAssertion(test);
  }
  
  this.testSuccess = function(test){
    this.base.testSuccess(test);
    test.element.setAttribute("class", "success")
    test.element.innerHTML += " (" + this.base.assertions + " assertions)"
  }
  
  this.testFailure = function(test, e){
    this.base.testFailure(test, e);
    test.element.setAttribute("class", "failure")
    test.element.innerHTML += " FAILED"
    this.log("FAILURE: "+ test.name + " : " + e.message); 
  }
  
  this.testError = function(test, e){
     this.base.testError(test, e);
     test.element.setAttribute("class", "error")
     test.element.innerHTML += " ERROR"
     this.log("ERROR: " + test.name + " : " + e.message);
  }
}

GreasemonkeyTestRunner.prototype = new AbstractTestRunner();