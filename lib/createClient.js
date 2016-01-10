'use strict';

var NET   = require('net');
var PATHS = {};

function CreateClient(
  wait,
  path,
  callback
){
  
  var client;
  
  if(
    (typeof path === 'string')
    &&
    (path.length > 0)
  ){
    
    if(
      (PATHS[path])
    ){
      
      process.nextTick(CreateClient,path,callback);
      
      return;
    }
    
    PATHS[path] = true;
    
    client = new NET.Socket;
    
    client.setTimeout(wait,function CreateClientTimedout(
    ){
      
      CloseClient(client);
      
      delete PATHS[path];
      
      callback(null,false,path);
      
    });
    
    client.on('data',function CreateClientData(
      data
    ){
      
      CloseClient(client);
      
      delete PATHS[path];
      
      callback(null,true,path);
    });
    
    client.on('error',function CreateClientError(
      error
    ){
      
      CloseClient(client);
      
      delete PATHS[path];
      
      if(
        (error.code === 'ECONNREFUSED') // Connection refused
        ||
        (error.code === 'EPIPE') // Broken pipe
      ){
        
        callback(null,false,path);
      }
      
      /* Some of these codes may not even
      // be emitted by 'net' sockets. We
      // want to catch any errors related 
      // to connecting, other errors will
      // be passed directly to the user.
      */
      else if(
        (error.code === 'EACCES') // Permission denied
        ||
        (error.code === 'EADDRINUSE') // Address already in use
        ||
        (error.code === 'ECONNRESET') // Connection reset by peer
        ||
        (error.code === 'EISDIR') // Is a directory
        ||
        (error.code === 'EMFILE') // Too many open files in system
        ||
        (error.code === 'ENOENT') // No such file or directory
        ||
        (error.code === 'EPERM') // Operation not permitted
        ||
        (error.code === 'ETIMEDOUT') // Operation timed out
      ){
        
        callback(null,true,path);
      }
      else callback(error,true,path);
    });
    
    client.on('connect',function CreateClientConnection(
    ){
      
      if(client.tested === true) return;
      
      client.write([
        '/* Node.js Chasm Probe',
        '//  Github: https://www.github.com/METACEO/nodejs.chasm',
        '//  NPM: https://www.npmjs.com/package/chasm',
        '//  Stopping by, just to say hi!',
        '*/'
      ].join('\n'));
    });
    
    client.connect(path);
  }
  else if(typeof callback === 'function') callback(null,false);
}

/* This function is to allow 'CreateClient'
// to be optimized by isolating the 'try'.
// Because this is just to try and close the
// client, if it's somehow connected after
// erroring, we won't handle any errors that
// come out of this `CloseClient`.
*/
function CloseClient(
  client
){
  
  client.tested = true;
  
  try{
    
    client.end();
    client.destroy();
  }
  catch(error){}
}

module.exports = CreateClient;

