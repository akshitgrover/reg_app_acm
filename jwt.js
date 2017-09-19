var jwt = require('jsonwebtoken');
var secret = "Deathadder";

module.exports.issue = function(payload){ 
	return jwt.sign(payload,secret,{expiresIn:'1d'});
}; 

module.exports.verify = function(token,next){
	jwt.verify(token,secret,function(err,data){
		if(err){
			next(err);
			return;
		}
		next();
	});
};

module.exports.verifySync = function(token){
	try{
		var flag = jwt.verify(token,secret);
		return 1;
	}
	catch(err){
		return 0;
	}
};

module.exports.decode = function(token){
 	return jwt.decode(token)
};