module.exports = function(req,res,next){

if(!req.user){
return res.redirect("/login");
}

if(req.user.role === "admin"){
return next();
}

if(!req.user.subscriptionActive){
return res.redirect("/pricing");
}

next();

};
