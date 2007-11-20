

function GreasemonkeyTestRunner(name){
  this.testEl;
  this.logEl;
  var assertions = 0;
  
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
    for(var i=0; i<tests.length; i++){
      var testNameEl = document.createElement("li");
      testNameEl.innerHTML = tests[i].name;
      tests[i].element = testNameEl;
      this.testsEl.appendChild(testNameEl);
    }                      
  }
  
  this.log = function(msg){
    
  }
  
  this.finishRun = function(){
  
  }
  
  this.testInit = function(test){
    test.element.setAttribute("class", "running")
    assertions = 0;
  }
  
  this.testAssertion = function(test){
    assertions++;
  }
  
  this.testSuccess = function(test){
    this.testEl.setAttribute("class", "test passed");
    test.element.setAttribute("class", "success")
    test.element.innerHTML += " (" + assertions + " assertions)"
  }
  
  this.testFailure = function(test, e){
    this.testEl.setAttribute("class", "test failure");
    test.element.setAttribute("class", "failure")
    this.log("FAILURE: " +e.message); 
  }
  
  this.testError = function(test, e){
     this.testEl.setAttribute("class", "test error");
     test.element.setAttribute("class", "error")
     this.log("ERROR: " + e.message);
  }
}