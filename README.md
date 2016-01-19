# chasm `\ˈka-zəm\`

*Module to asynchronously determine UNIX socket and port availabilities.*

[![Build Status](https://travis-ci.org/METACEO/nodejs.chasm.svg)](https://travis-ci.org/METACEO/nodejs.chasm)
[![Dependency Status](https://david-dm.org/metaceo/nodejs.chasm.svg)](https://david-dm.org/metaceo/nodejs.chasm)

```
npm install chasm
```

## Usage

* **Single Port** - provide a single numerical value to have Chasm return the its availability.
* **Smallest** - will return the smallest available port.
* **Largest** - will return the largest available port.
* **Port Array** - provide an array of numerical values to have Chasm return each of the availabilities in the order provided.
* **Port Range** - provide a minimum or maximum, or both, to have Chasm return the available port(s) within the specified range. You can additionally specify if you'd want the `last` port in the range or `all` the ports (without specification, Chasm will assume the `first`.) Specifying `last` will return the largest available port within the range. Specifying `all` will return all the ports with the range and their availabilities. While all port lookups are non-blocking, large ranges with `all` resulting ports will take additional time.
* **Allow Reserved** - will set the floor of the port range from `1025` to `1`, expect the unexpected.
* **UNIX Socket** - provide a file system path and Chasm will determine if it is available to listen on. `true` will mean the file descriptor does not exist *or* that it does but it's not responsive (see also **passive** and **wait** below.) `false` will mean the file descriptor exists and that it's responsive to the Chasm probe.
* **Passive** - will tell Chasm not to delete non-responsive file descriptors when probing for UNIX sockets.
* **Wait** - will tell Chasm how long to wait (in milliseconds) for a UNIX socket file descriptor to respond to its probe. If the time expires without a response from the file descriptor, then Chasm will report it as non-responsive. The default amount of time is two seconds (2,000 milliseconds.)

While asynchronous, depending on the amount of `ports` to process, some statements may take longer to finish than others (even if they were called a way ahead of time.)

### Programmatically

Chasm will `callback` with two variables, the first will be an error (usually defined if anything messed up with Node.js' `net` or `fs` module) and the second will be the result(s).

**General Example**

```javascript
var Chasm   = require('chasm');
var server1 = require('net').createServer();
var server2 = require('net').createServer();

/* We'll simulate a used port and a UNIX socket file
// descriptor. After this, both the port '10100' and
// the UNIX socket '/tmp/my.service.socket' will be in
// use and Chasm will report both their availabilities
// as 'false'.
*/
server1.listen(10100);
server2.listen('/tmp/my.service.socket');
server2.on('connection',(s) => s.write('Hi!'));

Chasm.smallest(console.log); // null 1025
Chasm.largest(console.log);  // null 65535

Chasm.port(10100,console.log); // null false
Chasm.port(10101,console.log); // null 10101

Chasm.ports([10099,10100,10001],console.log); // null [10099,false,10001]

Chasm.first({'min':10100,'max':10102},console.log); // null 10101
Chasm.last({'min':10098,'max':10100},console.log);  // null 10099
Chasm.all({'min':10099,'max':10101},console.log);   // null [10099,false,10101]

Chasm.socket('/tmp/my.service.socket',console.log);     // null false
Chasm.socket('/tmp/my.new.service.socket',console.log); // null true
```

**Non-responsive File Descriptor**

```javascript
var Chasm  = require('./');
var server = require('net').createServer();

/* We'll simulate a non-responsive file
// descriptor (something possibly left over
// from a previous process that possibly failed
// to clean up after itself.) When Chasm is set
// to passive, the file descriptor will still
// report as available, but Chasm will not
// delete it.
*/
Chasm.passive(); // true

server.listen('./nonresponsive.file.descriptor',server.close);
server.on('connection',(s) => s.write('Hi!'));
server.on('close',() => {
  
  Chasm.socket('./nonresponsive.file.descriptor',console.log); // null true
});
```

**Reserved Ports**

```javascript
var Chasm = require('chasm');

/* When Chasm is allowed into the reserved
// ports, 'smallest' requests will begin
// with those system ports... again, expect
// the unexpected.
*/
Chasm.smallest(console.log); // null 1025
Chasm.allowReserved(); // true
Chasm.smallest(console.log); // null 1
```

## To-dos

* Have a reservation system that will hold a provided port and release it on command?.. provide the user the ability to reserve a port and switch it when the application is ready.
* Have a service identifier, similar to [Wireshark](https://www.wireshark.org/)?.. without creating any new standards, it'd be useful to determine what service is behind the port (assuming it wants to be identified.)
* Have a random port feature that will return the first randomly available port.

