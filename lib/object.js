'use strict';

var CreateServer = require('./createServer');

function ChasmObject(
  get,
  min,
  max,
  callback
){
  
  var results = [];
  
  CreateServer((get === 'last') ? max : min,function ChasmObjectIterate(
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
        else CreateServer((get === 'last') ? max : min,ChasmObjectIterate);
      }
    }
    else{
      
      results.push((isOpen === true) ? port : false);
      
      if(min > max) callback(null,results);
      else CreateServer(min,ChasmObjectIterate);
    }
  });
}

module.exports = ChasmObject;

