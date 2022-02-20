const http = require('http');

const port = 8080;

const requestListener = function (req, res) {
  console.log(`Method: ${req.method}`);
  console.log(`URL: ${req.url}`);

  res.writeHead(200);
  res.end('Hello, World!');
}

const server = http.createServer(requestListener);

server.listen(port, () => {
  console.log(`Server running on port: ${port}`);
})


const timer = (interval) => {
  const utcDate1 = new Date();
  utcDate1.toUTCString()

}

