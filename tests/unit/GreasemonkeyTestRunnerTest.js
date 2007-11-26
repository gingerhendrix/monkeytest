
new TestSuite("GreasemonkeyTestRunner Test", (function(){
  var testEl;
  var logEl;
  var testsEl;
  var testNameEl;
  
  return {
    setUp : function(){  
      testEl = document.createElement("div");
      testEl.id = "TestElement"
      
       testsEl = document.createElement("ul");
       testsEl.setAttribute("class", "tests");
       testEl.appendChild(testsEl);
       logEl = document.createElement("div");
       logEl.setAttribute("class", "log");
       testEl.appendChild(logEl);
      
       testNameEl = document.createElement("li");
      
       document.body.appendChild(testEl);
     },
    
     tearDown : function (){
      document.body.removeChild(testEl);
     },
    
     testInitRun : function(t){
        runner = new GreasemonkeyTestRunner("TestElement");
        runner.initRun([{name: "NAME"}]);
        t.assert(runner.testEl == testEl, "Incorrect testEl got: " + runner.testEl);
        t.assert(runner.logEl == logEl, "Incorrent logEl got: " + runner.logEl);
        t.assert(runner.testsEl == testsEl, "Incorrent testsEl got: " + runner.testsEl);
        
        t.assert(testsEl.childNodes.length == 1, "Incorrect number of tests");
        t.assert(testsEl.childNodes[0].innerHTML == "NAME", "Incorrect test name");
     },
     testTestSuccess : function(t){
        runner = new GreasemonkeyTestRunner("TestElement");
        runner.testEl = testEl;
        
        runner.testSuccess({element : testNameEl});
        t.assert(testEl.getAttribute("class") == "test passed", "Incorrent class: " + testEl.getAttribute("class"));
        t.assert(testNameEl.getAttribute("class") == "success", "Incorrent element class: " + testNameEl.getAttribute("class"));
        t.assert(testNameEl.innerHTML.indexOf("0 assertions") != -1, "Assertions statement not found" + testNameEl.innerHTML);
       
     },
    
     testTestFailure : function(t){
        runner = new GreasemonkeyTestRunner("TestElement");
        runner.testEl = testEl;
        runner.logEl = logEl;
        
        runner.testFailure({element : testNameEl}, {message: "TestFailure"});
        t.assert(testEl.getAttribute("class") == "test failure", "Incorrent class: " + testEl.getAttribute("class"));
        t.assert(testNameEl.getAttribute("class") == "failure", "Incorrent element class: " + testNameEl.getAttribute("class"));
        //t.assert(logEl.innerHTML.indexOf("TestElement") != -1, "Message not found: " + logEl.innerHTML);
        tearDown();
     },
    
     testTestError :  function(t){
        setUp();    
        runner = new GreasemonkeyTestRunner("TestElement");
        runner.testEl = testEl;
        runner.logEl = logEl;
        
        runner.testError({ element : testNameEl }, {message: "TestFailure"});
        t.assert(testEl.getAttribute("class") == "test error", "Incorrent class: " + testEl.getAttribute("class"));
        t.assert(testNameEl.getAttribute("class") == "error", "Incorrent element class: " + testNameEl.getAttribute("class"));
        //t.assert(logEl.innerHTML.indexOf("TestElement") != -1, "Message not found: " + logEl.innerHTML);
        tearDown();
     }
  }
})());
