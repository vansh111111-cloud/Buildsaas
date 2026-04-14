const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const auth = require("../middleware/auth");
const projectAccess = require("../middleware/projectAccess")


router.get("/workspace/:projectId", auth , projectAccess, async (req,res)=>{

try{

const project = await Project.findById(req.params.projectId);

if(!project){
return res.status(404).send("Project not found");
}

res.render("workspace",{project , projectRole: req.projectRole });

}catch(error){

console.log(error);
res.status(500).send("Server Error");

}

});
router.get("/workspace/:projectId/files", async (req,res)=>{

const project = await Project.findById(req.params.projectId)

if(!project){
return res.status(404).send("Project not found")
}

res.render("workspace-files",{
project
})

})

router.post("/projects/:projectId/invite", async(req,res)=>{

const {email,role} = req.body

const user = await User.findOne({email})

if(!user){
return res.status(404).json({message:"User not found"})
}

await ProjectMember.create({
projectId:req.params.projectId,
userId:user._id,
projectRole:role
})

res.json({message:"User invited"})
})

router.get("/projects/:projectId/members", async(req,res)=>{

const members = await ProjectMember
.find({projectId:req.params.projectId})
.populate("userId","email")

res.json(members)

})

router.post("/projects/:projectId/invite/respond", async (req, res) => {
  const { response } = req.body; // 'accepted' or 'declined'
  const projectId = req.params.projectId;
  const userId = req.user._id;

  const member = await ProjectMember.findOne({ projectId, userId });
  if (!member) return res.status(404).json({ message: "Invitation not found" });

  if (response !== "accepted" && response !== "declined") {
    return res.status(400).json({ message: "Invalid response" });
  }

  member.status = response;
  await member.save();

  res.json({ message: `Invitation ${response}` });
});

module.exports = router;
