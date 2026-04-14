const express = require("express");
const router = express.Router();
const Environment = require("../models/Environment");


// get variables
router.get("/:projectId/environment", async (req,res)=>{

    const env = await Environment.find({
        projectId:req.params.projectId
    });

    res.json(env);

});


// create variable
router.post("/:projectId/environment/create", async (req,res)=>{

    const env = await Environment.create(req.body);

    res.json(env);

});


// update variable
router.post("/environment/update/:id", async (req,res)=>{

    const env = await Environment.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new:true}
    );

    res.json(env);

});


module.exports = router;
