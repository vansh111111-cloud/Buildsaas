const express = require("express")
const router = express.Router()

const auth = require("../middleware/auth")
const ProjectMember = require("../models/ProjectMember")

router.get("/notifications", auth, async (req,res)=>{

try{

const invites = await ProjectMember
.find({
userId:req.user._id,
status:"pending"
})
.populate("projectId","name")

res.render("notifications",{invites})

}catch(err){

console.log(err)
res.status(500).send("Server error")

}

})

module.exports = router
