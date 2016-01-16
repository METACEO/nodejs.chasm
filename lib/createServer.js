'use strict';

var NET   = require('net');
var PORTS = {};

function CreateServer(
  port,
  callback
){
  
  var server;
  
  if(
    (typeof port === 'number')
  ){
    
    port = parseFloat(port);
    
    if(
      (PORTS[port.toString()])
    ){
      
      process.nextTick(function CreateServerAgain(){
        
        CreateServer(port,callback);
      });
      
      return;
    }
    
    PORTS[port.toString()] = true;
    
    server = new NET.Server;
    
    server.on('error',function CreateServerError(
      error
     ){
      
      CloseServer(server);
      
      delete PORTS[port.toString()];
      
      if(error.code === 'EADDRINUSE') callback(null,false,port);
      else callback(error,false,port);
    });
    
    server.on('listening',function CreateServerListening(
    ){
      
      CloseServer(server);
      
      delete PORTS[port.toString()];
      
      callback(null,true,port);
    });
    
    server.listen(port);
  }
  else if(typeof callback === 'function') callback(null,false);
}

/* This function is to allow 'CreateServer'
// to be optimized by isolating the 'try'.
// Because this is just to try and close the
// server, if it's somehow listening after
// erroring, we won't handle any errors that
// come out of this `CloseServer`.
*/
function CloseServer(
  server
){
  
  try{
    
    server.close();
  }
  catch(error){}
}

module.exports = CreateServer;

