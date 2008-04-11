new TestSuite("Bowling Game Tests", {
  setUp : function(test){
    test.game = new BowlingGame()
  },
  
  testGutterGame : function(test){
     for(var i=0; i<20; i++){
      test.game.roll(0)
     }
     test.assert(test.game.score() == 0, "Expected 0 score got " + test.game.score());
  },
  testAllOnes : function(test){
    for(var i=0; i<20; i++){
      test.game.roll(1);
    }
    test.assert(test.game.score() == 20, "Expected 20 score got " + test.game.score());
  }
});
    

