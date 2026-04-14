// CREATE PROJECT MODAL

const modal = document.getElementById("projectModal")

const openBtn = document.getElementById("newProjectBtn")
const firstBtn = document.getElementById("createFirstProject")

if(openBtn){
openBtn.onclick = ()=> modal.style.display="flex"
}

if(firstBtn){
firstBtn.onclick = ()=> modal.style.display="flex"
}

document.getElementById("cancelModal").onclick = ()=>{
modal.style.display="none"
}


// CREATE PROJECT

document.getElementById("saveProject").onclick = async ()=>{

const name = document.getElementById("projectName").value
const description = document.getElementById("projectDesc").value

if(!name){
alert("Project name required")
return
}

const res = await fetch("/projects/create",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({name,description})
})

const data = await res.json()

window.location="/workspace/"+data.id

}



// SETTINGS MODAL

const settingsModal = document.getElementById("settingsModal")

document.querySelectorAll(".settings").forEach(btn=>{

btn.onclick = ()=>{

settingsModal.style.display="flex"

document.getElementById("editName").value = btn.dataset.name
document.getElementById("editDesc").value = btn.dataset.desc

}

})


document.getElementById("closeSettings").onclick=()=>{

settingsModal.style.display="none"

}
