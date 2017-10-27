var jwt = require('../jwt.js');

module.exports = function(req,res,next){
	console.log(req.headers.authorization);
	var token;
	if(req.headers.authorization){
		console.log("TEST1");
		var flag = req.headers.authorization.split(' ');
		console.log(flag.length + flag[0]);
		if(!flag.length==2 || flag[0]!='Bearer'){
			return res.status(404).json({err:"Invalid Token Format."});
		}
		token = flag[1];
	}
	else if(req.params.token){
		token = req.params.token;
	}
	else{
		return res.status(401).json({err:"No Authorization Header/Token Parameter Found."});
	}
	var result = jwt.verifySync(token);
	console.log(result);
	if(!result){
		return res.status(401).json({err:"Invalid Token."});
	}
	next();
};