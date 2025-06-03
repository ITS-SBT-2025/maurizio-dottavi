const http = require('http');
http.createServer(function (req, res) {
  if (req.url === '/books') {
    res.writeHead(404,
      { 'Content-Type': 'text/html' });
    res.write('<html><body><h1>Page Not Found</h1></body></html>');
    res.end();
  } else {
    res.writeHead(200,
      { 'Content-Type': 'text/plain' });
    res.write('Hello World!!!!');
    res.end();
  }
  }).listen(8080);