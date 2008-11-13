
#Monkey Test

MonkeyTest is a lightweight extensible testing library for javascript and greasemonkey.

    * It is designed to be usable in testing greasemonkey scripts,as well as regular javascript
    * It is compatible with many other testing libraries.
    * It is fully extensible.
    * Download [ latest | 0.2.1 ]
    * Source @ GitHub

##Basic Use

Tests are just javascript files you can embed these in an html document to run them, or a greasemonkey script, or run them from the command line with a javascript engine (not yet supported).

  <html>  
  <head>  
     <title>Bowling Game - Unit Tests</title>  
      
     <script src="../../dist/MonkeyTest.js"></script><!-- Load the library -->  
   
       
     <script src="bowling_game.js"></script><!-- Source code under test -->  
     <script src="bowling_game_tests.js"></script><!-- Unit Tests -->  
      
     <script>  
       TestManager.runner = new SimpleTestRunner() //Set up your test runner  
         
   
       window.addEventListener("load",function(){ //Run your tests  
   
        TestManager.run();  
   
       }, true);  

     </script>  
    </head>  
      
    <body>  
    </body>  
  </html>  


##Test Cases and Test Suites

A test consists of a name and a function which represents the test. Tests need to be registered with the TestManager.

  TestRunner.addTest("My Test", function(test){ /* Do some testing */});  

You can use the Test constructor to create a test and register it in one go.

  new Test("My Test", function(test){ /* Do some testing */ });  

Tests can also be arranged in suites.  The easiest way to declare a suite is with the TestSuite constructor, which takes the name of the suite and a javascript object.  Methods of the javascript object with names that begin with 'test' are used as the test functions and their names are used as the test names.  The object may also have the special methods setUp and tearDown which are executed before and after every test method.

  new TestSuite("My Tests", {  
    testOne : function(test){ /* .. */ },  
    testTwo : function(test){ /* .. */ }  
  });  


##Assertions

MonkeyTest only ships with two assertions:

* `test.assert(condition, message)` - This method fails the test with the given message if the condition is false
* `test.fail(message)` - This method always fails the test with the given message.

These assertions are designed to be used as the base for writing your own custom assertions, or for connecting with the assertions provided by another library.

##Test Runners

MonkeyTest presently ships with one test runner:

* `SimpleTestRunner` - This is a basic html test runner, by default it appends the test runner to the bottom of the page.  You can set `SimpleTestRunner.testInNewWindow = true`, to make the tests run in a separate popup window.  This is usefulfor functional tests of greasemonkey scripts that should be run on the target web page.

##Extending MonkeyTest

MonkeyTest is designed to be extremely extensible, but for now you're going to have to dive into the source for more information.
