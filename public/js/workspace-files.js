const fileTree = document.getElementById("fileTree")
const codeEditor = document.getElementById("codeEditor")
const currentFile = document.getElementById("currentFile")

let activeFile = null


// LOAD FILES

function loadFiles(){

fetch(`/workspace/${projectId}/files`)
.then(res=>res.json())
.then(files=>{

fileTree.innerHTML=""

files.forEach(file=>{

const li=document.createElement("li")
li.innerText=file

li.onclick=()=>openFile(file)

fileTree.appendChild(li)

})

})

}

loadFiles()



// OPEN FILE

function openFile(file){

fetch(`/workspace/${projectId}/file?name=${file}`)
.then(res=>res.text())
.then(data=>{

codeEditor.value=data
currentFile.innerText=file
activeFile=file

})

}



// EDIT BUTTON

document.getElementById("editBtn").onclick=()=>{
codeEditor.removeAttribute("readonly")
}



// SAVE FILE

document.getElementById("saveBtn").onclick=()=>{

if(!activeFile) return

fetch(`/workspace/${projectId}/save-file`,{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
file:activeFile,
content:codeEditor.value
})

})

.then(()=>{

alert("File saved")

codeEditor.setAttribute("readonly",true)

})

}



// CREATE FILE

document.getElementById("newFileBtn").onclick=()=>{

const name=prompt("File name")

fetch(`/workspace/${projectId}/create-file`,{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({name})

})

.then(()=>loadFiles())

}



// CREATE FOLDER

document.getElementById("newFolderBtn").onclick=()=>{

const name=prompt("Folder name")

fetch(`/workspace/${projectId}/create-folder`,{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({name})

})

.then(()=>loadFiles())

}



// TERMINAL

const terminalInput=document.getElementById("terminalInput")
const terminalOutput=document.getElementById("terminalOutput")

terminalInput.addEventListener("keypress",function(e){

if(e.key==="Enter"){

const cmd=terminalInput.value

terminalOutput.innerHTML+=`<div>> ${cmd}</div>`

fetch(`/workspace/${projectId}/terminal`,{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({cmd})

})

.then(res=>res.text())
.then(data=>{

terminalOutput.innerHTML+=`<div>${data}</div>`

})

terminalInput.value=""

}

})
