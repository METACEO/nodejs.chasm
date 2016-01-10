'use strict';

var FS    = require('fs');
var NET   = require('net');
var Chasm = require('./');

/* This will reserve a port for
// our test.
*/
var _port = NET.createServer().listen(10100);

/* This will create a UNIX socket
// server that we will test against.
*/
var _socket = NET.createServer()
.on('connection',function TestSocketConnection(s){s.write(_socket._pipeName);})
.listen('Chasm.delete.me.socket.' + (new Date).getTime().toString());

/* This will create a non-responsive
// file descriptor that we will test
// against.
*/
var UnresponsiveSocket = 'Chasm.delete.me.socket.unresponsive';
FS.writeFileSync(UnresponsiveSocket,'');

/* Define the tests that we will be
// iterating through.
*/
var tests = [
  {'func':'smallest','data':false,'name':'smallest','answers':'1025'},
  {'func':'largest','data':false,'name':'largest','answers':'65535'},
  {'func':'port','data':10100,'name':'port in use','answers':'false'},
  {'func':'port','data':10101,'name':'port not in use','answers':'10101'},
  {'func':'ports','data':[10099,10100,10101],'name':'ports','answers':'[10099,false,10101]'},
  {'func':'first','data':{'min':10100,'max':10102},'name':'first','answers':'10101'},
  {'func':'last','data':{'min':10098,'max':10100},'name':'last','answers':'10099'},
  {'func':'all','data':{'min':10099,'max':10101},'name':'all','answers':'[10099,false,10101]'},
  {'func':'socket','data':_socket._pipeName,'name':'descriptor with a socket','answers':'false'},
  {'func':'socket','data':_socket._pipeName + 'x','name':'no descriptor with no socket','answers':'true'},
  {'func':'socket','data':UnresponsiveSocket,'name':'descriptor with no socket','answers':'true'},
];

function TestIterator(
  test
){
  
  var args = [];
  
  if(test.data) args.push(test.data);
  
  args.push(function TestResponse(
    error,
    results
  ){
    
    results = JSON.stringify(results);
    
    if(
      (error)
      ||
      (test.answers !== results)
    ){
      
      throw new Error([
        'Test Error\'d: ' + test.name,
        '  Error: ' + JSON.stringify(error),
        '  Answer: ' + test.answers,
        '  Result: ' + results
      ].join('\n'));
    }
    else{
      
      console.log('Good!.. ' + test.name + '.');
      
      if(tests.length > 0) process.nextTick(TestNext);
      else{
        
        console.log('Cleaning up...');
        
        _port.close();
        _socket.close();
        
        FS.access(
          UnresponsiveSocket,
          function TestCleanUpSocket(
            error
          ){
            
            if(
              (error)
              &&
              (typeof error === 'object')
              &&
              (error.code === 'ENOENT')
            ){
              
              console.log('Ok!.. done!');
            }
            else throw new Error(error);
          }
        );
      }
    }
  });
  
  Chasm[test.func].apply(null,args);
}

function TestNext(
){
  
  TestIterator(tests.shift());
}

TestNext();

