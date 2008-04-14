
var TestManager = new function(){
  this.runner = new SimpleTestRunner(); 
  var tests = [];
  var queue;
  
  this.addTest = function(test){
    tests.push(test);
  }
  
  this.run = function(){
    this.queue = queue = new RunQueue();
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

var RunQueue = function(){
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
