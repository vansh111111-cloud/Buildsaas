const express = require("express")
const router = express.Router()
const auth = require("../middleware/auth")
const Project = require("../models/Project")
const { exec } = require("child_process")
const path = require("path")
const fs = require("fs")

// Render plugins page
router.get("/:projectId/plugins", auth, async (req, res) => {

  try {

    const project = await Project.findById(req.params.projectId)

    if (!project) return res.status(404).send("Project not found")

    res.render("workspace-plugins", { project })

  } catch (error) {

    console.log(error)
    res.status(500).send("Server error")

  }

})


// Install plugin
router.post("/:projectId/install-plugin", auth, async (req,res)=>{

  try{

    const plugin = req.body.plugin
    const projectId = req.params.projectId

    const project = await Project.findById(projectId)

    if(!project){
      return res.status(404).json({success:false})
    }

    // folder where project files exist
    const projectPath = path.join(__dirname,"../projects",projectId)

    // create package.json if not exists
    if(!fs.existsSync(path.join(projectPath,"package.json"))){

      exec("npm init -y",{cwd:projectPath})

    }

    // install plugin
    exec(`npm install ${plugin}`,{cwd:projectPath},(err)=>{

      if(err){
        return res.json({success:false})
      }

      res.json({success:true})

    })

  }catch(err){

    console.log(err)
    res.json({success:false})

  }

})

module.exports = router
