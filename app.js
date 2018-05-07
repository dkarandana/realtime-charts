console.log("App js listening..");

// const http = require('http');
// const url = require('url');

// const server = http.createServer();




var http = require('http'),
    qs = require('querystring');

var server = http.createServer(function(req, res) {
  if (req.method === 'POST' && req.url === '/login') {
    var body = '';
    req.on('data', function(chunk) {
      body += chunk;
    });
    req.on('end', function() {
      var data = qs.parse(body);
      // now you can access `data.email` and `data.password`

      console.log( data);
      res.writeHead(200);
      res.end(JSON.stringify(data));
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(3000);

// server.on('request',(req, res) => {

//   console.log("Method", req.method);

//   res.writeHead(200);

//   //req.setEncoding('utf8');

//   req.on('data', function(chunk) {
//       console.log(JSON.stringify(chunk) );
//   });

//   res.write('Data');

//   res.end();

// });

// server.listen(3000);