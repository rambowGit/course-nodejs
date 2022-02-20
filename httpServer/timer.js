
/*
 Time server response
*/

const getUtcDate = () => {
  const utcDate = new Date();
  console.log(utcDate.toUTCString());
}

/*
 Stop timer function
*/
const timer = (timerInterval, timeToStop) => {
  const showDate = setInterval(getUtcDate, timerInterval)
 
  setTimeout(() => {
                    if (timeToStop > 0) {
                      clearInterval(showDate);
                      console.log('Disconected at: ', new Date().toUTCString());
                    }
                  }, timeToStop)
}


module.exports =  timer;
