const Project = require("../models/Project");

module.exports = async function(req,res,next){

const project = await Project.findById(req.params.id);

if(!project){
return res.status(404).send("Project not found");
}

if(project.owner.toString() !== req.user._id.toString()){
return res.status(403).send("Unauthorized");
}

req.project = project;

next();

};
