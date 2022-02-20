const http = require('http');
const timer = require('./timer.js')

const port = 8080;
// const timerInterval = 1000;
// const timeToStop = 5000
const timerInterval = process.env.TIMER_INTERVAL;
const timeToStop = process.env.STOP_INTERVAL;

if (!timerInterval || !timeToStop) {
  console.log('TIMER_INTERVAL or STOP_INTERVAL not defined!');
  return;
}

const requestListener = function (req, res) {
 // console.log(`Method: ${req.method}`);
 // console.log(`URL: ${req.url}`);

 if (req.url == '/start') {
  timer(timerInterval, timeToStop);
 }

  res.writeHead(200);
  res.end('Hello, World!');
}

const server = http.createServer(requestListener)
.on('error', (err) => console.log(err.message));

server.listen(port, () => {
  console.log(`Server running on port: ${port}`);
})

