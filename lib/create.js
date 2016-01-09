'use strict';

var NET   = require('net');
var PORTS = {};

function CreateServer(
  port,
  callback
){
  
  if(
    (typeof port === 'number')
  ){
    
    port = parseFloat(port);
    
    if(
      (PORTS[port.toString()])
    ){
      
      process.nextTick(CreateServer,port,callback);
      
      return;
    }
    
    PORTS[port.toString()] = true;
    
    NET.createServer()
    .on('error',function CreateServerError(error){
      
      CloseServer(this);
      
      delete PORTS[port.toString()];
      
      if(error.code === 'EADDRINUSE') callback(null,false,port);
      else callback(true,error,port);
    })
    .on('listening',function CreateServerListening(){
      
      CloseServer(this);
      
      delete PORTS[port.toString()];
      
      callback(null,true,port);
    })
    .listen(port);
  }
  else if(typeof callback === 'function') callback(null,false);
}

/* Older versions of Node.js throw hard
// errors when closing an error'd server.
// This function is to allow 'CreateServer'
// to be optimized by moving out the 'try'.
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

