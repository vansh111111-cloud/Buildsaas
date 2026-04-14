const loader = document.getElementById("loader")
const workspace = document.getElementById("workspace")

window.onload = ()=>{

setTimeout(()=>{

loader.style.display="none"
workspace.style.display="block"

},3000)

}
function openTab(tab){

const panels = document.querySelectorAll(".tab-panel")

panels.forEach(p=>{
p.style.display="none"
})

document.getElementById(tab).style.display="block"

}

window.inviteUser = async function(){

console.log("Invite button clicked");  // debug

const email = document.getElementById("inviteEmail").value
const role = document.getElementById("inviteRole").value
const projectId = document.body.dataset.projectId

console.log(projectId) // debug

if(!email){
alert("Please enter email")
return
}

const confirmInvite = confirm(`Invite ${email} as ${role}?`)

if(!confirmInvite){
return
}

try{

const res = await fetch(`/projects/${projectId}/invite`,{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({email,role})

})

const data = await res.json()

if(res.ok){
alert("Invitation sent successfully")
}else{
alert(data.message || "Failed to send invitation")
}

}catch(err){

console.log(err)
alert("Server error")

}

}

const inviteBtn = document.getElementById("inviteBtn")
const inviteModal = document.getElementById("inviteModal")
const closeInvite = document.getElementById("closeInvite")

inviteBtn.onclick = () =>{
inviteModal.style.display="flex"
}

closeInvite.onclick = () =>{
inviteModal.style.display="none"
}

window.onclick = (e)=>{
if(e.target == inviteModal){
inviteModal.style.display="none"
}
}
