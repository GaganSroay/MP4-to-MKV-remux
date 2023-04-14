const fs = require('fs');

const { ipcRenderer,remote } = require("electron");
const path = require('path');
const {env} = require('process');

const outputFileName = "mp4RemuxDefaultLocation.txt"

let pathName = env.APPDATA

const outPath = path.join(pathName, outputFileName)

fs.readFile(outPath,(err,data)=>{
    if(!err){
        const filePath = data.toString();
        document.getElementById("outputFolderTextField").value = filePath
    }
})


document.getElementById("browserButton").addEventListener('click', async (event) =>{
    const files = await ipcRenderer.invoke("folderPathBrowser", "message");
    const filePath = files.filePaths[0];
    if(filePath){
        document.getElementById("outputFolderTextField").value = filePath
        fs.writeFile(outPath, filePath,()=>{});
    }
})