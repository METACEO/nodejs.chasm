'use strict';

var Create = require('./create');

function ChasmArray(
  MIN,
  MAX,
  ports,
  callback
){
  
  var results = [];
  
  Create(
    ports.shift(),
    function ChasmArrayIterate(
      error,
      isOpen,
      port
    ){
      
      if(error) callback(error);
      else{
        
        results.push((isOpen === true && port >= MIN && port <= MAX) ? port : false);
        
        if(ports.length === 0) callback(null,results);
        else Create(ports.shift(),ChasmArrayIterate);
      }
    }
  );
}

module.exports = ChasmArray;

