const converter = require('./converter')
const Table = require("./table");
const {shell} = require('electron');

const dropBox = document.getElementById("dragdroplocation");
const droplocationtext = document.getElementById("droplocationtext");
const bottomContent = document.getElementById("footerContent");
const bottom_part_1 = document.getElementById("bottom_part_1");

const startButton = document.getElementById("startButton")

let started = false;


let filesCollection = [];
let table;

dropBox.addEventListener('drop', async (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    bottomContent.style.display = "none"
    bottom_part_1.style.display = "block"

    const files = []

    for(let i=0;i<event.dataTransfer.files.length;i++){
        if(event.dataTransfer.files[i].name.trim().endsWith(".mkv")){
            files.push(event.dataTransfer.files[i])
        }
        else{
            bottom_part_1.innerHTML = `Only MKV files allowed`
        }
    }
    filesRecieved(files)
  });
  

const filesRecieved = (files) => {
    //console.log(files)
    if(files){
        filesCollection = mergeFilesList(filesCollection,files)
        bottom_part_1.innerHTML = `${files.length} files added, Press start to begin.`
        sortArray(filesCollection)
        updateTable()
    }
}

const updateTable = () => {
    console.log(filesCollection)
    droplocationtext.style.display = (filesCollection.length === 0)? "visible" : "none";
    //document.getElementsByTagName("table")[0].style.display = (filesCollection.length === 0)?"none":"visible"
    if(filesCollection.length > 0) if(!table) table = new Table(dropBox)
    
    table.setData(filesCollection)
    var deleteButtons = document.getElementsByClassName("trash_icon")
    if(deleteButtons.length>0)
    for(let i=0;i<deleteButtons.length;i++){
        
        deleteButtons[i].addEventListener("click",function handler(){
            if(deleteButtons[i]){
                deleteButtons[i].removeEventListener('click', handler)
                filesCollection.splice(i, 1);
                updateTable()
            }
        })
    }
}

startButton.addEventListener('click', async (event) =>{
    if(!started ){

        started = true
        startButton.innerHTML = "STOP"

        bottomContent.style.display = "flex"
        bottom_part_1.style.display = "none"

        await converter(
            filesCollection,
            (row,col,message) =>  table.updateData(row,col,message),
        )

        bottomContent.style.display = "none"
        bottom_part_1.style.display = "block"
        bottom_part_1.innerHTML = "Conversion Finished"

    }
    else{
        started = false
        startButton.innerHTML = "START"
    }


})

document.getElementById("clearButton").addEventListener('click', async (event) =>{
    
    filesCollection = [];
    updateTable()
})

document.getElementById("sortButton").addEventListener('click', async (event) =>{
    sortArray(filesCollection)
})

document.getElementById("OutFolder").addEventListener('click', async (event) =>{
    const outFolder = document.getElementById("outputFolderTextField").value
    //shell.showItemInFolder(outFolder);
    shell.openPath(outFolder)
})


const sortArray = (array) => {
    for(let i=0;i<array.length; i++){
        for(let j=0;j<array.length; j++){
            if(array[i].name < array[j].name){
                let a = array[i];
                array[i] = array[j];
                array[j] = a;
            }

        }
    }
}
 




const mergeFilesList = (l1,l2) => {
    if(!l1 && !l2) return
    if(!l1) return l2;
    if(!l2) return l1;
    if(l1.length === 0 && l2.length === 0) return
    if(l1.length === 0) return l2
    if(l2.length === 0) return l1

    let l3 = l1.concat(l2);
    return l3

    for(let i=0; i<l1.length; i++) 
        l3.push(l1[i]);
        
    const l = l3.length;
    for(let i=0; i<l2.length; i++) {
        let pass = true;
        for(let j=0; j<l; j++){
            if(l3[j].name == l2[i].name){
                pass = false;
                break;
            }
        }
        if (pass) 
            l3.push(l2[i]);
    }

    return l3;
}











dropBox.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
});

dropBox.addEventListener('dragenter', (event) => {
    console.log('File is in the Drop Space');
});

dropBox.addEventListener('dragleave', (event) => {
    console.log('File has left the Drop Space');
});

