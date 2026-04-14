const mongoose = require("mongoose");

const ProjectMemberSchema = new mongoose.Schema({

projectId:{
type: mongoose.Schema.Types.ObjectId,
ref:"Project",
required:true
},

userId:{
type: mongoose.Schema.Types.ObjectId,
ref:"User",
required:true
},

role:{
type:String,
enum:["admin","developer","viewer"],
default:"viewer"
}

},{
timestamps:true
});

module.exports = mongoose.model("ProjectMember",ProjectMemberSchema);
