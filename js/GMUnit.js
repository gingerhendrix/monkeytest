function Test(name, body){
  var testEl = document.getElementById(name);
  testEl.setAttribute("class", "test passed");
  var logEl = getSingleNode("id('"+name+"')//*[@class='log']");
  var expectError = false;
  
  this.assert = function(cond, msg){
    if(!cond){
      throw new AssertionFailureError("Assertion Failed: " + msg);
    }
  }
  
  this.log = function(msg){
    logEl.innerHTML += msg + "<br/>"
  }
  
  this.expectError = function(func){
    expectError = true;
    func();
    if(expectError){
      throw new AssertionFailureError("Expected Error");
    }
  }
  
  this.throwAndPass = function(e){
    expectError = true;
    throw e;
  }
  
  try{
    body(this);
  }catch(e){
    if(e instanceof AssertionFailureError){
      testEl.setAttribute("class", "test failure");
      this.log("FAILURE: " +e.message);      
    }else{
      if(!expectError){    
        testEl.setAttribute("class", "test error");
        this.log("ERROR: " + e.message);
      }else{
        expectError = false;
        this.log("Ignored Error: " + e.message);
      } 
      throw e;
    }
  }
}

function AssertionFailureError(message){
   this.message = message;
   this.name = "AssertionFailureError";
}
AssertionFailureError.prototype = new Error();

function getSingleNode(xpath, root){
        return document.evaluate(xpath,
                       document, 
                       null, 
                       XPathResult.FIRST_ORDERED_NODE_TYPE, 
                       null).singleNodeValue;
}
