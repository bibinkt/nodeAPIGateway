var assembler   = require('../lib/assembler');
var http        = require('http');

// add some routes
conductor.router.load({
    getProduct: {
        pattern: "/productDetail/:id",
        facade: "ppInfo"
    }
});

assembler.loadConfigFile('./config.yml');

http.createServer(conductor.run()).listen(8000);
console.log("server started on port 8080")