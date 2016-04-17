'use strict';

var NET   = require('net');
var PORTS = {};

function CreateServer(
  port,
  callback
){
  
  var server;
  var port_string;
  
  if(
    (typeof port === 'number')
  ){
    
    port = parseFloat(port);
    port_string = port.toString();
    
    if(
      (PORTS[port_string])
    ){
      
      process.nextTick(function CreateServerAgain(){
        
        CreateServer(port,callback);
      });
      
      return;
    }
    
    PORTS[port_string] = true;
    
    server = new NET.Server;
    
    server.on('error',function CreateServerError(
      error
     ){
      
      CloseServer(server);
      
      delete PORTS[port_string];
      
      callback(
        (error.code === 'EADDRINUSE') ? null : error,
        false,
        port
      );
    });
    
    server.on('listening',function CreateServerListening(
    ){
      
      CloseServer(server);
      
      delete PORTS[port_string];
      
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
    
    if(typeof server.unref === 'function') server.unref();
    server.close();
  }
  catch(error){}
}

module.exports = CreateServer;

