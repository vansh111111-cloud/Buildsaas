const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const auth = require("../middleware/auth");
const ProjectMember = require("../models/ProjectMember")

router.get("/projects", auth , async (req,res)=>{

try{

const userId = req.user._id;

const projects = await Project.find({owner:userId})
.sort({createdAt:-1});

res.render("projects",{projects});

}catch(error){

console.log(error);
res.status(500).send("Server Error");

}

});



// CREATE PROJECT

router.post("/projects/create", auth , async (req,res)=>{

try{

const {name,description} = req.body;

const project = await Project.create({

name,
description,
owner:req.user._id

});
await ProjectMember.create({
projectId: project._id,
userId: req.user._id,
projectRole: "admin"
})

res.json({id:project._id});

}catch(error){

console.log(error);
res.status(500).send("Server Error");

}

});


module.exports = router;
