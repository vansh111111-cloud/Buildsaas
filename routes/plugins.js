const express = require("express")
const router = express.Router()
const File = require("../models/File")

router.post("/:projectId/plugins/install", async (req, res) => {
  try {

    const { plugin } = req.body
    const projectId = req.params.projectId

    let files = []

    // HTML STARTER
    if (plugin === "html-starter") {

      files = [
        {
          name: "index.html",
          content: "<h1>Hello from BuildSaaS</h1>",
          projectId
        },
        {
          name: "style.css",
          content: "body{font-family:sans-serif}",
          projectId
        },
        {
          name: "script.js",
          content: "console.log('Hello')",
          projectId
        }
      ]

    }

    // NODE EXPRESS
    else if (plugin === "node-express") {

      files = [
        {
          name: "server.js",
          content: `const express=require("express")
const app=express()

app.get("/",(req,res)=>{
res.send("Hello from BuildSaaS")
})

app.listen(3000,()=>{
console.log("Server running")
})`,
          projectId
        },
        {
          name: "package.json",
          content: `{
"name":"buildsaas-app",
"version":"1.0.0",
"dependencies":{
"express":"^4.18.2"
}
}`,
          projectId
        }
      ]

    }

    else {
      return res.status(400).json({ error: "Plugin not found" })
    }

    // prevent duplicates
    for (const file of files) {

      const exists = await File.findOne({
        projectId,
        name: file.name
      })

      if (!exists) {
        await File.create(file)
      }

    }

    res.json({ success: true })

  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "Server error" })
  }
})

module.exports = router
