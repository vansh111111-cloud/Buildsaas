const projectId = window.location.pathname.split("/").pop();

let editor;
let currentFileId=null;

require.config({ paths: { vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/vs" }});

require(["vs/editor/editor.main"], function () {

editor = monaco.editor.create(document.getElementById("editor"), {

value:"",
language:"html",
theme:"vs-dark",
automaticLayout:true

});

});


async function loadFiles(){

const res = await fetch(`/files/${projectId}`);
const files = await res.json();

const list = document.getElementById("file-list");

list.innerHTML="";

files.forEach(file=>{

const li = document.createElement("li");

li.innerText=file.name;

li.onclick=()=>openFile(file._id);

list.appendChild(li);

});

}


async function openFile(id){

const res = await fetch(`/files/open/${id}`);
const file = await res.json();

currentFileId=file._id;

editor.setValue(file.content);

}


document.getElementById("save-file").onclick = async ()=>{

const content = editor.getValue();

await fetch(`/files/save/${currentFileId}`,{

method:"POST",
headers:{ "Content-Type":"application/json"},
body:JSON.stringify({content})

});

alert("Saved");

};

loadFiles();
