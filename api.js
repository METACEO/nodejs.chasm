'use strict';

var ChasmArray   = require('./lib/array');
var ChasmObject  = require('./lib/object');
var CreateServer = require('./lib/createServer');
var CreateClient = require('./lib/createClient');
var NET     = require('net');
var FS      = require('fs');
var MAX     = 65535;
var MIN     = 1025;
var PASSIVE = false;
var WAIT    = 2000;

function ChasmAll(
  range,
  callback
){
  
  if(typeof callback !== 'function') return false;
  if(typeof range !== 'object') callback(null,[]);
  else{
    
    ChasmObject(
      'all',
      (typeof range.min === 'number' && range.min >= MIN) ? range.min : MIN,
      (typeof range.max === 'number' && range.max <= MAX) ? range.max : MAX,
      function ChasmAllCreate(
        error,
        results
      ){
        
        if(error) callback(error);
        else callback(null,results);
      }
    );
  }
}

function ChasmAllowReserved(
){
  
  MIN = 1;
  
  return true;
};

function ChasmFirst(
  range,
  callback
){
  
  if(typeof callback !== 'function') return false;
  if(typeof range !== 'object') callback(null,[]);
  else{
    
    ChasmObject(
      'first',
      (typeof range.min === 'number' && range.min >= MIN) ? range.min : MIN,
      (typeof range.max === 'number' && range.max <= MAX) ? range.max : MAX,
      function ChasmFirstCreate(
        error,
        results
      ){
        
        if(error) callback(error);
        else callback(null,results);
      }
    );
  }
}

function ChasmLargest(
  callback
){
  
  if(typeof callback !== 'function') return false;
  
  ChasmLast({'min':MIN,'max':MAX},callback);
}

function ChasmLast(
  range,
  callback
){
  
  if(typeof callback !== 'function') return false;
  if(typeof range !== 'object') callback(null,[]);
  else{
    
    ChasmObject(
      'last',
      (typeof range.min === 'number' && range.min >= MIN) ? range.min : MIN,
      (typeof range.max === 'number' && range.max <= MAX) ? range.max : MAX,
      function ChasmLastCreate(
        error,
        results
      ){
        
        if(error) callback(error);
        else callback(null,results);
      }
    );
  }
}

function ChasmPort(
  port,
  callback
){
  
  if(typeof callback !== 'function') return false;
  if(typeof port !== 'number') callback(null,false);
  else{
    
    CreateServer(port,function ChasmPortCreate(
      error,
      isOpen,
      port
    ){
      
      if(error) callback(error);
      else if(isOpen === true) callback(null,port);
      else callback(null,false);
    });
  }
}

function ChasmPorts(
  ports,
  callback
){
  
  if(typeof callback !== 'function') return false;
  if(
    !(Array.isArray(ports))
    ||
    (ports.length < 1)
  ){
    
    callback(null,false);
  }
  else{
    
    ChasmArray(
      MIN,
      MAX,
      ports,
      function ChasmArrayCreate(
        error,
        results
      ){
        
        if(error) callback(error);
        else callback(null,results);
      }
    );
  }
}

function ChasmSmallest(
  callback
){
  
  if(typeof callback !== 'function') return false;
  
  ChasmFirst({'min':MIN,'max':MAX},callback);
}

function ChasmSocket(
  path,
  callback
){
  
  if(typeof callback !== 'function') return false;
  if(
    (typeof path !== 'string')
    ||
    (path.length < 1)
  ){
    
    callback(null,false);
  }
  else{
    
    FS.access(
      path,
      FS.R_OK | FS.W_OK,
      function ChasmSocketAccess(
        err
      ){
        
        var client;
        
        /* A socket file descriptor was found,
        // we will further test it to see if
        // it's responsive.
        */
        if(
          (err === null)
          ||
          (err.code === 'EEXIST') // File exists
        ){
          
          CreateClient(
            WAIT,
            path,
            function ChasmSocketCreate(
              error,
              isResponsive
            ){
              
              if(error) callback(error);
              
              /* The socket file descriptor
              // responds to our created
              // client, report the path as
              // invalid, or taken.
              */
              else if(isResponsive === true) callback(null,false);
              
              /* No sort of response from the
              // file descriptor. If Chasm is
              // set to passive, then leave
              // the file descriptor alone...
              // otherwise delete it and report
              // back as an available spot!
              */
              else if(PASSIVE) callback(null,true);
              else{
                
                FS.unlink(
                  path,
                  function ChasmSocketDelete(
                    error
                  ){
                    
                    if(error) callback(error);
                    else callback(null,true);
                  }
                );
              }
            }
          );
        }
        
        /* A file descriptor of some sort is
        // found, with error. Report back as
        // not a valid place for a socket.
        */
        else if(
          (err.code === 'EACCES') // Permission denied
          ||
          (err.code === 'EISDIR') // Is a directory
          ||
          (err.code === 'EMFILE') // Too many open files in system
          ||
          (err.code === 'EPERM') // Operation not permitted
        ){
          
          callback(null,false);
        }
        
        /* No file descriptor or any sort
        // was found!.. easy! Report back
        // as a valid place for a socket.
        */
        else if(
          (err.code === 'ENOENT') // No such file or directory
        ){
          
          callback(null,true);
        }
        
        /* Some other error was found,
        // maybe related to the user's
        // file system? Send them the
        // error to work with.
        */
        else callback(error);
      }
    );
  }
}

function ChasmSocketPassive(
){
  
  PASSIVE = true;
  
  return true;
}

function ChasmSocketWait(
  time
){
  
  if(typeof time !== 'number') return false;
  
  time = Math.floor(time);
  
  if(time <= 0) return false;
  
  WAIT = Math.floor(time);
  
  return true;
}

module.exports = {
  'all':ChasmAll,
  'allowReserved':ChasmAllowReserved,
  'first':ChasmFirst,
  'largest':ChasmLargest,
  'last':ChasmLast,
  'passive':ChasmSocketPassive,
  'port':ChasmPort,
  'ports':ChasmPorts,
  'smallest':ChasmSmallest,
  'socket':ChasmSocket,
  'wait':ChasmSocketWait
};

