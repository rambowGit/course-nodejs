const fs = require('fs');
const path = require('path');
 
const baseDir = './music';
const newDir =  './alphabetDirs'
let filesToCopy={};
 
/*
  Get files list
*/ 
const readDir = (baseDir, tabLevel) => {
  const files = fs.readdirSync(baseDir);
 
  files.forEach(item => {
    let localBase = path.join(baseDir, item);
    let state = fs.statSync(localBase);
   
    if (state.isDirectory()) {
      console.log('-'.repeat(tabLevel) + ' DIR: ' + item);
      readDir(localBase, tabLevel + 1);
    } else {
        // if object key exist, add fool file path to array
        if (filesToCopy[item.charAt(0).toLowerCase()]) {
          filesToCopy[item.charAt(0)].push(localBase);
        } else {
          filesToCopy[item.charAt(0).toLowerCase()] = [localBase];
        }
      console.log('-'.repeat(tabLevel) + ' File: ' + item);
    }
  })

  return Object.keys(filesToCopy).sort().reduce((r, k) => (r[k] = filesToCopy[k], r), {});
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
      console.log('trying to create new dir');
      if (!fs.existsSync(targetDir)){
        fs.mkdirSync(targetDir);
      }else {
        console.log(`${targetDir} exist!`);
       }
     
       // create new dirs
       for (let key in filesObj) {
        let newAlphabetDir = path.join(targetDir, key);
        fs.mkdirSync(newAlphabetDir);
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

 
};


const filesObject = readDir(baseDir, 1);
console.log("filesObject: ", filesObject);
copyFiles(filesObject, newDir);