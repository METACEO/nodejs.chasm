'use strict';

var Create = require('./create');

function ChasmObject(
  get,
  min,
  max,
  callback
){
  
  var results = [];
  
  Create((get === 'last') ? max : min,function ChasmObjectIterate(
    error,
    isOpen,
    port
  ){
    
    if(get === 'last') max--;
    else min++;
    
    if(
      (get === 'first')
      ||
      (get === 'last')
    ){
      
      if(isOpen === true) callback(null,port);
      else{
        
        if(min > max) callback(null,false);
        else Create((get === 'last') ? max : min,ChasmObjectIterate);
      }
    }
    else{
      
      results.push((isOpen === true) ? port : false);
      
      if(min > max) callback(null,results);
      else Create(min,ChasmObjectIterate);
    }
  });
}

module.exports = ChasmObject;

