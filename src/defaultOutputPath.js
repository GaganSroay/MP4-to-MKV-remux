const fs = require('fs');

const { ipcRenderer } = require("electron");

const outputFileName = "output_path.txt";

fs.readFile(outputFileName,(err,data)=>{
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
        fs.writeFile(outputFileName, filePath,()=>{});
    }
})