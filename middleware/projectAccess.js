const ProjectMember = require("../models/ProjectMember")
const Project = require("../models/Project")

module.exports = async function(req,res,next){

try{

const projectId = req.params.projectId

const project = await Project.findById(projectId)
console.log("PARAM:", req.params.projectId)

if(!project){
return res.status(404).send("Project not found")
}

console.log(req.user._id)
 console.log(project.owner)

if(project.owner.toString() === req.user._id.toString()){
req.projectRole = "admin"
return next()
}

const member = await ProjectMember.findOne({
projectId,
userId:req.user._id
})

if(!member){
return res.status(403).send("Access denied")
}

req.projectRole = member.projectRole

next()

}catch(err){

console.log(err)
res.status(500).send("Server error")

}

}
