module.exports = function(req,res,next){
	console.log("TEST Policy");
	next();
};