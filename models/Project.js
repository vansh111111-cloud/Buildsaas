const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({

name:{
type:String,
required:true,
trim:true,
maxlength:100
},

description:{
type:String,
default:""
},

owner:{
type:mongoose.Schema.Types.ObjectId,
ref:"User",
required:true
},

status:{
type:String,
enum:["active","archived"],
default:"active"
}

},
{
timestamps:true
});

module.exports = mongoose.model("Project",projectSchema);
