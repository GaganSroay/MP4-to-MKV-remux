

const executeCommand = require('./commands')

const processLog = document.getElementById("process_log");
const droplocationtext = document.getElementById("droplocationtext");
const dropBox = document.getElementById("dragdroplocation");
const startButton = document.getElementById("startButton");

const fin = "{fin}"
const fout = "{fout}"

const PREPARING = "PREPARING"
const FINISHED = "FINISHED"
const READY = "ready"
const CONVERTING = "CONVERTING"
const STOPPED = "STOPPED"

let prog = {}


const converterParameters = (inputPath,outputPath) => [
    "-i", inputPath,
    "-c:a", "aac","-strict","-2",  //"copy",
    "-c:v", "copy",
    outputPath,"-y"
]

    
    


const converterParametersFromField = ()=> {
    const argumentsString = document.getElementById("argumentsField").value
    const argArray = argumentsString.split(" ")
    const program = argArray[0];
    const args = [];
    argArray.forEach( (a, i) => {if(i>0) args.push(a)});
    args.push("-y")
    return { program, args }
}

const fillFilesInArray = (array,inputFile ,outputFile) => {
    const nArray = array.slice();
    for(let i=0;i<nArray.length;i++){
        if(nArray[i] == fin)
            nArray[i] = inputFile
        else if(nArray[i] == fout)
            nArray[i] = outputFile
    }
    return nArray
}


const metadataProbeParameters = (inputPath) => [
    "-loglevel","0",
    "-print_format","json",
    "-show_format",
    "-show_streams",
    "-select_streams","v:0",
    inputPath
]


const durationFunction = async (inputPath) => {
    const params = [
        "-v","error",
        "-show_entries","format=duration",
        "-of","default=noprint_wrappers=1:nokey=1",
        "-sexagesimal",
        inputPath
    ]
    let duration = "";
    const code = await executeCommand("ffprobe",params, data => {if(data) duration = duration + data.toString();})
    duration = convertTimeFormat(duration);
    return duration;
}

const timeKeyword = "time="

const converterFunction = async(parameters,inputPath,outputPath,callback) => {
    const parametersArray = converterParameters(inputPath,outputPath)
    
    const arr = fillFilesInArray(parameters.args, inputPath,outputPath)
    
    const code = await executeCommand("ffmpeg",arr, data => {
        if(data) {
            const log = data.toString()
            //console.log(log)
            processLog.innerHTML = log;

            if(log.includes(timeKeyword)){
                const i = log.indexOf(timeKeyword);
                const j = log.indexOf(" ",i);
                const p = log.substring(i+timeKeyword.length,j);
                callback(convertTimeFormat(p))
            }
        }
    })
    return code
}



const convert = async (files,callback) =>{

    if(!files) return

    callback(0,2,"preparing")
    callback(0,3,`0`)
    
    const outputPath =  document.getElementById("outputFolderTextField").value;
    const doneFileCount = document.getElementById("progressnumber");
    const processingFileName = document.getElementById("bottomFileName");
    const parameters = converterParametersFromField()

    doneFileCount.innerHTML = `0 / ${files.length}`

    let stopped = false;

    startButton.addEventListener('click',()=> stopped = true)

    for (let i=0; i<files.length; i++){
        const f = files[i];
        let fileName = f.name
        if(!prog[fileName]){
            prog[fileName] = {
                status:READY
            }
        }
    }

    for (let i=0; i<files.length; i++) {

        if(stopped) break

        const f = files[i];
        let outName = `${outputPath}\\${f.name.substring(0, f.name.length - 4)}.mp4`
        let fileName = f.name

        if(prog[fileName].status == FINISHED){
            callback(i,3,`100`)
            callback(i,2, FINISHED)
            continue
        }

        processingFileName.innerHTML = `File Name : <b>${f.name}</b>`

        callback(i,3,`0`)
        callback(i,2,PREPARING)
        prog[fileName].status = PREPARING
        const duration = await durationFunction(f.path)

        let processing = true;
        callback(i,2,CONVERTING)
        prog[fileName].status = CONVERTING

        if(stopped) break
        const code = await converterFunction(
            parameters,
            f.path , 
            outName,
            progress => callback(i,3,`${getPercentage(progress,duration,processing)}`)
        )

        if(stopped) break

        processing = false;
        callback(i,3,`100`)
        callback(i,2,FINISHED)

        prog[fileName].status = FINISHED

        doneFileCount.innerHTML = `${i+1} / ${files.length}`
    }

    if(stopped){
        for (let i=0; i<files.length; i++){
            const f = files[i];
            let fileName = f.name
            if(prog[fileName]){
                if(prog[fileName].status != FINISHED){
                    prog[fileName].status = STOPPED
                    callback(i,3,`0`)
                    callback(i,2,STOPPED)
                }
            }
            
            
        }
    }

    doneFileCount.innerHTML = `${files.length} / ${files.length}`
}

const getPercentage = (progress,duration,processing) => {
    let p = progress*100.0;
    //console.log(p+"      "+progress+"     "+duration+"     "+p/duration+"      "+parseInt(p/duration))
    let pf = parseFloat(p)/parseFloat(duration);

    if(processing){
        if(pf<0 || progress > duration) return 0;
        return parseInt(pf);
    }
    return 100;
}

const convertTimeFormat = (time)=>{
    const ta = time.split(":")
    let t = (ta[0]*60*60) + (ta[1]*60) + (ta[2])
    return parseInt(Math.abs(t))
}




module.exports = convert
