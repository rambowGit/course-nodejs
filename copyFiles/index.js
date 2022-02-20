const fs = require('fs');
const path = require('path');
const util = require('util')

const mkDir = util.promisify(fs.mkdir); 
const rmDir = util.promisify(fs.rm);
const readDir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);
const copyFile = util.promisify(fs.link);

const baseDir = process.argv[2];
const newBaseDir = process.argv[3];
const deleteFlag = process.argv[4];

console.log("args: ", baseDir, newBaseDir, deleteFlag);

 
/*
  Get files list
*/ 
const lsDir = async (baseDir) => {
  let filesToCopy = {},
  filesObject = {};  
  
   // curent not sorted  base dir 
  const files = await readDir(baseDir);
  
  files.forEach(item => {
    let localBase = path.join(baseDir, item);
    stat(localBase)
      .then(state => {
        if (state.isDirectory()) {
          lsDir(localBase);
        } else {
          // if object key exist, add fool file path to array
          if (filesToCopy[item.charAt(0).toLowerCase()]) {
            filesToCopy[item.charAt(0)].push(localBase);
          } else {              
            filesToCopy[item.charAt(0).toLowerCase()] = [localBase];
          }
          // sort by alphabet
          filesObject = Object.keys(filesToCopy).sort().reduce((r, k) => (r[k] = filesToCopy[k], r), {});
          copyFiles(filesObject, newBaseDir);
        }
      })     
  })
}  
 
/*
  Copy file to new dir
*/ 
const copyFiles = async (filesObj, targetDir) => {  
      // create new sub-dirs
      for (let key in filesObj) {
      let newAlphabetDir = path.join(targetDir, key);
      await createNewDir(newAlphabetDir);

      // copy files to new dirs
      filesObj[key].forEach(file => {    
        const newFileName = path.join(newAlphabetDir, path.basename(file));      
        copyFile(file, newFileName)
        .catch(err =>{
          if (err.code !== 'EEXIST') {
            console.error(err);
          }
        });
      });
    }   
}

/*
 Create new base dir for alphabet sub-dirs
*/
const createNewDir = async (dirName) => {
  // create new base dir for sorted files
  await mkDir(dirName)
  .catch(err => {
    if (err.code !== 'EEXIST') {
      console.error(err);
    }
  });
}

/*
  Remove old baseDir
*/
const removeOldBaseDir = async (oldBaseDir, removeFlag) => {
  if (removeFlag === '--delete') {
    await rmDir(oldBaseDir, 
                {
                  recursive: true,
                });         
    console.log(`${oldBaseDir}: Directory deleted!`);    
  }
} 

// entry point
createNewDir(newBaseDir)
.then(()=>{
  if (newBaseDir === process.argv[3])
    console.log(`New base dir ${newBaseDir} successfully created!`)
});
lsDir(baseDir)
removeOldBaseDir(baseDir, deleteFlag)
.catch( err => {
  console.log(`Error occurs, 
  Error code -> ${err.code},
  Error No -> ${err.errno}`);
});

