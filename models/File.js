const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({

    projectId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true
    },

    name:{
        type:String,
        required:true
    },

    path:{
        type:String,
        default:""
    },

    type:{
        type:String
    },

    content:{
        type:String,
        default:""
    },

    createdAt:{
        type:Date,
        default:Date.now
    }

});

module.exports = mongoose.model("File",FileSchema);
