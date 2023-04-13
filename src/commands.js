let child_process = require("child_process");
const startButton = document.getElementById("startButton")

const executeCommand = (program,parametersArray,callback) =>{
    return new Promise ((res,rej)=>{
        const bat = child_process.spawn(program, parametersArray,{encoding: 'utf8'});
        bat.stdout.setEncoding('utf8');
        bat.stdout.on("data", data => {
            if(data) 
                callback(data.toString())
        });
    
        bat.stderr.on("data", (data) => {
            if(data) 
                callback(data.toString())
        });
    
        bat.on('close', (code) => {
            res(code)
        });
        startButton.addEventListener('click',(event)=>{
            bat.kill()
        })
    })
}



module.exports = executeCommand