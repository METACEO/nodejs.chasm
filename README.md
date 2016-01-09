# chasm

*Module to asynchronously determine port availability.*

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

While asynchronous, depending on the amount of `ports` to process, some statements may take longer to finish than others (even if they were called a way ahead of time.)

### Programmatically

```javascript
var Chasm = require('chasm')

Chasm(ports,function(err,result){
    
    if(err) console.error('Uh-oh!',err)
    else console.log('Done!',result)
  }
);
```

Call Chasm with `ports` and a `callback`. Valid `ports` arguments are just below. The `callback` will include two variables, the first will be an error (defined if anything messed up with Node.js' `net` module) and the second will be the results.

```javascript
var Chasm = require('chasm')

/* We'll simulate a used port. After this,
// port '10100' will be in use and Chasm
// will report its availability as 'false'.
*/
require('net').createServer().listen(10100);

Chasm('smallest',console.log); // null 1025
Chasm('largest',console.log); // null 65535

Chasm(10100,console.log); // null false
Chasm(10101,console.log); // null 10101

Chasm([10099,10100,10001],console.log); // null [10099,false,10001]

Chasm({'min':10100,'max':10102},console.log); // null 10101
Chasm({'get':'first','min':10100,'max':10102},console.log); // null 10101
Chasm({'get':'last','min':10100,'max':10102},console.log);  // null 10102
Chasm({'get':'all','min':10100,'max':10102},console.log);   // null [false,10101,10102]
```

```javascript
var Chasm = require('chasm');

Chasm('smallest',console.log); // null 1025
Chasm.allowReserved();
Chasm('smallest',console.log); // null 1
```

## To-dos

* Have a reservation system that will hold a provided port and release it on command?.. provide the user the ability to reserve a port and switch it when the application is ready.
* Have a service identifier, similar to [Wireshark](https://www.wireshark.org/)?.. without creating any new standards, it'd be useful to determine what service is behind the port (assuming it wants to be identified.)
