'use strict';

var ChasmArray  = require('./lib/array');
var ChasmObject = require('./lib/object');
var Create      = require('./lib/create');
var MAX = 65535;
var MIN = 1025;

function Chasm(
  ports,
  callback
){
  
  if(typeof callback !== 'function') return false;
  
  if(
    (typeof ports === 'number')
  ){
    
    Create(ports,function ChasmPortCreate(
      error,
      isOpen,
      port
    ){
      
      if(error) callback(error);
      else if(isOpen === true) callback(null,port);
      else callback(null,false);
    });
    
    return true;
  }
  else if(
    (ports === 'largest')
  ){
    
    Create(MAX,function ChasmLargestCreate(
      error,
      isOpen,
      port
    ){
      
      if(error) callback(error);
      else if(isOpen === true) callback(null,port);
      else if(port < MIN) callback(null,false);
      else{
        
        process.nextTick(Create,(port-1),ChasmLargestCreate);
      }
    });
    
    return true;
  }
  else if(
    (ports === 'smallest')
  ){
    
    Create(MIN,function ChasmSmallestCreate(
      error,
      isOpen,
      port
    ){
      
      if(error) callback(error);
      else if(isOpen === true) callback(null,port);
      else if(port > MAX) callback(null,false);
      else{
        
        process.nextTick(Create,(port+1),ChasmSmallestCreate);
      }
    });
    
    return true;
  }
  else if(
    (Array.isArray(ports))
  ){
    
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
    
    return true;
  }
  else if(
    (typeof ports === 'object')
  ){
    
    ports.get = (ports.get === 'all' || ports.get === 'last') ? ports.get : 'first';
    ports.min = (typeof ports.min === 'number' && ports.min >= MIN) ? ports.min : MIN;
    ports.max = (typeof ports.max === 'number' && ports.max <= MAX) ? ports.max : MAX;
    
    ChasmObject(
      ports.get,
      ports.min,
      ports.max,
      function ChasmObjectCreate(
        error,
        results
      ){
        
        if(error) callback(error);
        else callback(null,results);
      }
    );
    
    return true;
  }
  
  callback(null,false);
  
  return false;
}

Chasm.allowReserved = function ChasmAllowReserved(
){
  
  MIN = 1;
  
  return true;
};

module.exports = Chasm;

