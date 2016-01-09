'use strict';

var Chasm  = require('./');
var server = require('net').createServer().listen(10100);

function TestHandler(test){
  
  return function TestHandler(error,results){
    
    if(error) throw new Error('Test Error\'d: ' + test + '\n' + JSON.stringify([error,results]));
    else console.log(test,results)
  }
}


Chasm('smallest',TestHandler('1025'));
Chasm('largest',TestHandler('65535'));

Chasm(10100,TestHandler('single (false)'));
Chasm(10101,TestHandler('single (10101)'));

Chasm([10099,10100,10101],TestHandler('array (10099,false,10101)'));

Chasm({'min':10100,'max':10101},TestHandler('object (10101)'));
Chasm({'get':'first','min':10100,'max':10101},TestHandler('object (10101)'));
Chasm({'get':'last','min':10099,'max':10100},TestHandler('object (10099)'));
Chasm({'get':'all','min':10099,'max':10101},TestHandler('object (10099,false,10101)'));

setTimeout(function(){
  
  server.close();
  
},2000);

