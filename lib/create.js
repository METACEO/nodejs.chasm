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
      
      delete PORTS[port.toString()];
      
      if(error.code === 'EADDRINUSE'){
        
        callback(null,false,port);
      }
      else{
        
        callback(true,error,port);
      }
    })
    .listen(port,function CreateServerListening(){
      
      this.close(function CreateServerClose(){
        
        delete PORTS[port.toString()];
        
        callback(null,true,port);
      });
    });
  }
  else if(typeof callback === 'function') callback(null,false);
}

module.exports = CreateServer;

