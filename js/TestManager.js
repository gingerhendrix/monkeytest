
var TestManager = new function(){
  this.runner = new SimpleTestRunner(); 
  this.asynchronous = false;
  var tests = [];
  
  this.addTest = function(test){
    tests.push(test);
  }
  
  this.run = function(){
    if(this.asynchronous){
      return this.asynchronousRun();
    }
    var runner = this.runner;
    runner.initRun(tests);
    tests.forEach(function(test){
      try{
        test.run(runner);
      }catch(e){
        
      }
    })
    runner.finishRun();
  };
  
  this.asynchronousRun  = function(){
    var runner = this.runner;
    var currentTest = 0;
    var state = "initRun";
    var timer = window.setInterval(function(){
      if(state=="initRun"){
        state = "nextTest"
        runner.initRun(tests);
      }else if(state=="nextTest"){
        if(currentTest < tests.length){
          var test = tests[currentTest];
          state = "nextTest";
          currentTest++;
        }else{
          state = "finishRun";
        }
        try{
          if(test.asynchronousRun){
            test.asynchronousRun(runner);
          }else{
            test.run(runner);
          }
        }catch(e){
        
        }
      }else if(state=="finishRun"){
        window.clearInterval(timer);
        runner.finishRun();
      }
    }, 10);
  }
}();