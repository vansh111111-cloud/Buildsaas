const mongoose = require("mongoose");

const EnvSchema = new mongoose.Schema({

    projectId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true
    },

    key:{
        type:String,
        required:true
    },

    value:{
        type:String,
        required:true
    }

});

module.exports = mongoose.model("Environment",EnvSchema);
