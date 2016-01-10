'use strict';

var CreateServer = require('./createServer');

function ChasmArray(
  MIN,
  MAX,
  ports,
  callback
){
  
  var results = [];
  
  CreateServer(
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
        else CreateServer(ports.shift(),ChasmArrayIterate);
      }
    }
  );
}

module.exports = ChasmArray;

