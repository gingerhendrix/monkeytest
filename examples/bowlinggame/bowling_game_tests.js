new TestSuite("Bowling Game Tests", function(){
  var game;
  
  function rollMany(n, pins){
    for(var i=0; i<n; i++){
      game.roll(pins)
    }
  }
  
  function rollSpare(){
    game.roll(5);
    game.roll(5);
  }
  
  function rollStrike(){
    game.roll(10);
  }
  
  var assertions = {
    assertScore : function(expected){
      var actual = game.score();
      this.assert(expected == actual, "Expected a score of " + expected + ", got " + actual);
    }
  }
  
  return {
    setUp : function(test){
      game = new BowlingGame()
      Utils.extend(test, assertions);
    },
    
    testGutterGame : function(test){
       rollMany(20,0);
       test.assertScore(0);
    },
    testAllOnes : function(test){
      rollMany(20, 1);
      test.assertScore(20);
    },
    testOneSpare : function(test){
      rollSpare();
      game.roll(3);
      rollMany(17, 0);
      test.assertScore(16);
    },
    testOneStrike : function(test){
      rollStrike();
      game.roll(3);
      game.roll(4);
      rollMany(16, 0);
      test.assertScore(24);
    },
    
    testPerfectGame : function(test){
      rollMany(12, 10);
      test.assertScore(300);
    }
  }
}());
    

