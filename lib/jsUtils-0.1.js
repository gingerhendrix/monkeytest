(function(){
  var _savedNamespaces = {}
  _savedNamespaces["Utils"] = window.Utils;
  var Utils = window.Utils = {};
  
  function getNamespace(nameParts){
    var root = window;
    for(var i=0; i<nameParts.length; i++){
      root = root[nameParts[i]];
    }
    return root;  
  }
  

  Utils.namespace = function(name /*, extensions */){
    var nameParts = name.split(".");
    var root = (this != Utils) ? this : window;
    var extend =  Array.prototype.slice.call(arguments, 1)
    
    for(var i=0; i<nameParts.length; i++){
      if(typeof(root[nameParts[i]]) == "undefined"){
        root[nameParts[i]] = {};
      }
      Utils.extend(root[nameParts[i]], {__NAMESPACE__ : name}, extend);
      root = root[nameParts[i]];
    }
    return root;
  }
  
  
  Utils.replaceNamespace = function(name /*, extensions */){
    Utils.namespace(name);
    
    var head = name.split(".").slice(0, -1);
    var tail = name.split(".").slice(-1)[0];
    
    var parent = getNamespace(head);
    _savedNamespaces[name] = parent[tail];
    parent[tail] = {};
    Utils.extend(parent[tail], {__NAMESPACE__ : name}, Array.prototype.slice.call(arguments, 1));
     
    return parent[tail];
  }
  
  Utils.revertNamespace = function(name){
    if(arguments.length==0){
      name = "Utils";
    }
    var head = name.split(".").slice(0, -1);
    var tail = name.split(".").slice(-1);
    var parent = getNamespace(head);
    var namespace = parent[tail] 
    parent[tail] = _savedNamespaces[name];
    return namespace; 
  }
  
  Utils.extend = function(obj, extension /*, extensions */){
    if(arguments.length > 2){
      for(var i=1; i<arguments.length; i++){
        Utils.extend(obj, arguments[i])
      }
      return;
    }
    if(extension.constructor == Array){
      for(var i=0; i<extension.length; i++){
        Utils.extend(obj, extension[i])
      }
      return;
    }
    if(typeof(extension) == "function"){
      Utils.extend(obj, extension.call())
    }
    
    for(var prop in extension){
      obj[prop] = extension[prop];
    }
    return obj;
  }
  
  Utils.Extendable = {
    extend : function(extension /*, extensions */){
      return Utils.extend(this,  Array.prototype.slice.call(arguments));
    }
  }
  
  Utils.Namespaceable = {
    namespace : function(namespace /*, extensions */){
     return  Utils.namespace.apply(this, Array.prototype.slice.call(arguments));
    }
  }
  
  Utils.Revertable = {
    revertNamespace : function(){
      return Utils.revertNamespace(this.__NAMESPACE__);
    }
  }
  
})();
