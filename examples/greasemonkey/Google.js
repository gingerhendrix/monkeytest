
var Google = new function(){
 function getSingleNode(xpath){
    return document.evaluate(xpath,
                             document, 
                             null, 
                             XPathResult.FIRST_ORDERED_NODE_TYPE, 
                             null).singleNodeValue;
   }

  this.elements = {
    searchInput : function(){
      return getSingleNode("//input[@name='q']");    
    },
    searchButton : function(){
      return getSingleNode("//input[@name='btnG']");    
    },
    luckyButton : function(){
      return getSingleNode("//input[@name='btnI']");        
    }   
  }  
}
