/*
For start use: node ./index.js ./music ./alphabetDirs --delete
*/
const fs = require('fs');
const path = require('path');

const baseDir = process.argv[2];
const newDir = process.argv[3];
const deleteFlag = process.argv[4];

console.log("args: ", baseDir, newDir, deleteFlag);
 
/*
  Get curent files list
*/ 
const lsDir = (baseDir) => {
   // curent not sorted  base dir 
  fs.readdir(baseDir, (err, files) => {
    if (err) {
      console.error(err.message);
      return;
    } 
    files.forEach(item => {
        let localBase = path.join(baseDir, item);
        fs.stat(localBase, (err, state) => {
          if (err) {
            console.error(err.message);
            return;
          } 
          if (state.isDirectory())
            lsDir(localBase);
          else       
            copyFiles(localBase, newDir);
        });     
      })
  });
};



/*
  Copy file to new dir
*/ 
const copyFiles = (fileToCopy, targetDir) => { 
  const curentDir = process.cwd();
  const requiredDir = __dirname;   
  try {
    // check curent process location
    if (curentDir == requiredDir) {     
        // create new sub-dirs
        let newAlphabetDir = path.join(targetDir, path.basename(fileToCopy).charAt(0).toLowerCase());
        createNewDir(newAlphabetDir, () => {
                 // copy files to new dirs
                 console.log("copy files: ",  fileToCopy + " to " + path.join(newAlphabetDir, path.basename(fileToCopy)));
                 fs.link(fileToCopy, path.join(newAlphabetDir, path.basename(fileToCopy)), err => {
                  if (err) {
                    console.error(err.message);
                    return;
                  }
                });
        });        
 
    } 
  } catch (err) {
    console.error('crete directory error: ', err.message); 
  }
}


/*
  Remove old baseDir
*/
const removeOldBaseDir = (oldBaseDir, removeFlag) => {
  if (removeFlag === '--delete') {
    fs.rm(oldBaseDir, {
      recursive: true,
    }, (error) => {
      if (error)
        console.error(error.message);
      else
        console.log(`${oldBaseDir}: Directories Deleted!`);
    })
 }
} 


/*
 Create new dir (helper)
*/
const createNewDir = (dirName, cb) => {
  // create new base dir for sorted files
  fs.mkdir(dirName, (err) => {
    if (err) {
      if (err.code !== 'EEXIST' )
          console.error(err);
    }
  cb();     
  });  
}


// entry point
createNewDir(newDir, () => {
  console.log(`Directory ${newDir} created succeffuly.`)
});
lsDir(baseDir)
removeOldBaseDir(baseDir, deleteFlag);


