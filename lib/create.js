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
      
      /* Older versions of Node.js throw hard
      // errors when .closing an error'd server.
      */
      try{
        
        this.close();
      }
      catch(error){
        /* Ignore the error, simply try and close
        // the server if for whatever reason it
        // is somehow listening.
        */
      }
      
      if(error.code === 'EADDRINUSE') callback(null,false,port);
      else callback(true,error,port);
    })
    .on('listening',function CreateServerListening(){
      
      this.close(function CreateServerClose(){
        
        delete PORTS[port.toString()];
        
        callback(null,true,port);
      });
    })
    .listen(port);
  }
  else if(typeof callback === 'function') callback(null,false);
}

module.exports = CreateServer;

