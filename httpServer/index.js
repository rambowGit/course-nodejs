const http = require('http');
//const getUtcDate = require('./timer.js');

const port = 8080;
let connections = [];

const timerInterval = process.env.TIMER_INTERVAL;
const timeToStop = process.env.STOP_INTERVAL;

if (!timerInterval || !timeToStop) {
  console.log('TIMER_INTERVAL or STOP_INTERVAL not defined!');
  return;
}

const requestListener = function (req, res) {

  connections.push(res);

  res.setHeader('Content-Type', 'text/html');
  res.writeHead(200);
  res.write('Session started \n');
  
  // show date in browser
  const showDate = setInterval(function(i) {      
    console.log(`UTC time is: ${new Date().toUTCString()}`);
  }, 
  timerInterval);
  
  // iterating through different connections
  connections.map(() => showDate );
  
  // stop setInterval
  setTimeout(() => {
                    if (timeToStop > 0) {
                      clearInterval(showDate);
                      const curDate = new Date().toUTCString();
                      res.write(`Disconected at  ${curDate} \n`);
                      res.end();
                      connections = [];
                    }                      
                  }, timeToStop)
  
}

// run server
const server = http.createServer(requestListener)
  .listen(port, () => {
    console.log(`Server running on port: ${port}`);
  });



