const http = require('http');
//const getUtcDate = require('./timer.js');

const port = 8080;
let connections = [];
const curDate = new Date();

const timerInterval = process.env.TIMER_INTERVAL;
const timeToStop = process.env.STOP_INTERVAL;

if (!timerInterval || !timeToStop) {
  console.log('TIMER_INTERVAL or STOP_INTERVAL not defined!');
  return;
}

const requestListener = function (req, res) {

  connections.push(res);

  if (req.url == '/start') {
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(200);
    res.write('Session started \n');
    
    // show date in browser
    const showDate = setInterval(function(i) {      
      res.write(`UTC time is: ${curDate.toUTCString()} \n`);
    }, 
    timerInterval);
    
    // iterating through different connections
    connections.map(() => showDate );
    
    // stop setInterval
    setTimeout(() => {
                      if (timeToStop > 0) {
                        clearInterval(showDate);
                        res.write(`Disconected at  ${curDate.toUTCString()} \n`);
                        res.end();
                        connections = [];
                      }                      
                    }, timeToStop)
    
  } 
}

// run server
const server = http.createServer(requestListener)
  .listen(port, () => {
    console.log(`Server running on port: ${port}`);
  });



