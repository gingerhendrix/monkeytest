
new TestSuite("Google Tests", {
  testSearchInput : function(t){
    var result = Google.elements.searchInput();
    t.assert(result, "Result is undefined or null");
    t.assert(result.tagName == "INPUT", "Expected input got " + result.tagName);
    t.assert(result.title == "Google Search", "Expected Google Search got " + result.title);
  },
  
  testSearchButton : function(t){
    var result = Google.elements.searchButton();
    t.assert(result, "Result is undefined or null");
    t.assert(result.tagName == "INPUT", "Expected input got " + result.tagName);
    t.assert(result.type == "submit", "Expected submit got " + result.type);
    t.assert(result.value == "Google Search", "Expected Google Search got " + result.value);
  },
  
  testLuckyButton : function(t){
    var result = Google.elements.luckyButton();
    t.assert(result, "Result is undefined or null");
    t.assert(result.tagName == "INPUT", "Expected input got " + result.tagName);
    t.assert(result.type == "submit", "Expected submit got " + result.type);
    t.assert(result.value == "I'm Feeling Lucky", "Expected I'm Feeling Lucky got " + result.value);
  }
});

