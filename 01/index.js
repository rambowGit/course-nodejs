const fs = require('fs');
const path = require('path');
 
const baseDir = './music';
const newDir =  './alphabetDirs'

 
/*
  Get files list
*/ 
const lsDir = (baseDir) => {
  let filesToCopy = {},
  filesObject = {};  
  
   // curent not sorted  base dir 
  fs.readdir(baseDir, (err, files) => {
    if (err) {
      console.error(err);
      return;
    } 
    files.forEach(item => {
        let localBase = path.join(baseDir, item);
        fs.stat(localBase, (err, state) => {
          if (err) {
            console.error(err);
            return;
          } 
          if (state.isDirectory()) {
            lsDir(localBase);
          } else {
            // if object key exist, add fool file path to array
            if (filesToCopy[item.charAt(0).toLowerCase()]) {
              filesToCopy[item.charAt(0)].push(localBase);
            } else {              
              filesToCopy[item.charAt(0).toLowerCase()] = [localBase];
            }

            filesObject = Object.keys(filesToCopy).sort().reduce((r, k) => (r[k] = filesToCopy[k], r), {});
            copyFiles(filesObject, newDir);
          }
        });     
      })
  });    
  
};
 
/*
  Copy file to new dir
*/ 
const copyFiles = (filesObj, targetDir) => { 

   const curentDir = process.cwd();
   const requiredDir = __dirname;   
   try {
     // check curent process location
    if (curentDir == requiredDir) {     
       // create new sub-dirs
       for (let key in filesObj) {
        let newAlphabetDir = path.join(targetDir, key);
        fs.mkdir(newAlphabetDir, (err) => {
          if (err) {
            if (err.code == 'EEXIST') {

            }else console.error(err);
          }
          console.log(`Directory ${newAlphabetDir} created successfully!`);
        });     
        // copy files to new dirs
        filesObj[key].forEach(file => {          
          fs.link(file, path.join(newAlphabetDir, path.basename(file)), err => {
            if (err) {
              console.error(err.message);
              return;
            }
          });
        });
      }   
    } 
   } catch (err) {
    console.error('crete directory error: ', err); 
  }
}

/*
 Create new base dir for alphabet sub-dirs
*/

const createNewBaseDir = (newBaseDir) => {
  // create new base dir for sorted files
  console.log('trying to create new base dir');
  fs.mkdir(newBaseDir, err => {
    if (err) {
      if (err.code == 'EEXIST') {

      }else console.error(err);
    }
  console.log(`Directory ${newBaseDir} created successfully!`);
  }); 
}

// entry point
createNewBaseDir(newDir);
lsDir(baseDir);


