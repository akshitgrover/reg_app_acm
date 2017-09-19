var User = require('../models/user.js');
var Events = require('../models/events.js');
var express = require('express');
var router = express.Router();
var jwt = require('../jwt.js');

router.get('/create',function(req,res){
	if(req.session.authenticated){
		console.log("TEST");
		return res.render('create');
	}
	return res.render('login');
});

router.post('/create',function(req,res){
	if(!req.session.authenticated){
		return res.render('login');
	}
	User.find({username:req.body.username},function(err,data){
		if(err){
			return res.status(500).json({err:"Something Went Wrong."});
		}
		if(data.length>0){
			return res.status(409).json({err:"Username Already Exists."});
		}
		User.create({username:req.body.username},function(err,user){
			if(err){
				return res.status(500).json({err:"Something Went Wrong."});
			}
			var bcrypt = require('bcrypt-nodejs');
			user.password = bcrypt.hashSync(req.body.password);
			user.expiredtoken = [];
			user.save();
			return res.status(200).json({msg:"User Created Successfully."});
		});
	});
});

router.post('/login',function(req,res){
	User.findOne({username:req.body.username},function(err,user){
		if(err || !user){
			return res.status(401).json({err:"Invalid Username/Password."});
		}
		var bcrypt=require('bcrypt-nodejs');
		if(bcrypt.compareSync(req.body.password,user.password)){
				Events.find({active:true},function(err,events){
				if(err){
					return res.status(500).json({err:"Something Went Wrong."});
				}
				var token = jwt.issue({username:user.username});
				return res.status(200).json({msg:"LoggedIn Successfully.",events:events,token:token});
			});
			return;
		}
		return res.status(401).json({err:"Invalid Username/Password."});
	});
});

router.post('/processlogin',function(req,res){
	req.session.authenticated=false;
	User.findOne({username:req.body.username},function(err,user){
		if(err || !user){
			return res.status(401).json({err:"Invalid Username/Password."});
		}
		var bcrypt=require('bcrypt-nodejs');
		if(bcrypt.compareSync(req.body.password,user.password)){
			req.session.authenticated=true;
			return res.status(200).json({msg:"LoggedIn Successfully."});
		}
		return res.status(401).json({err:"Invalid Username/Password."});
	});
});

router.post('/processlogout',function(req,res){
	req.session.authenticated=false;
	return res.render('login');
});

router.post('/logout',function(req,res){
	var token = req.headers.authorization.split(' ');
	if(token.length<2 || token[0]!="Bearer"){
		return res.status(409).json({err:"No Authorization Header Was Found."});
	}
	var decoded = jwt.decode(token[1]);
	var username;
	if(jwt.verifySync(token[1])){
		username = decoded.username;
	}
	else{
		username = "";
	}
	User.findOne({username:username},function(err,user){
		if(err || !user){
			console.log(err);
			return res.status(500).json({err:"Something Went Wrong."});
		}
		var exptoken = user.expiredtoken;
		exptoken.forEach(function(data){
			if(jwt.verifySync(data) == 0){	
				var index = user.expiredtoken.indexOf(data);
				delete user.expiredtoken[index];
			}
		});
		if(user.expiredtoken.indexOf(token[1])==-1){
			user.expiredtoken.push(token[1]);
		}
		user.save();
		return res.json(user);
	});
});

module.exports = router;