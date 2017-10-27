var Events = require('../models/events.js');
var express = require('express');
var router = express.Router();
var schema = require('mongoose').Schema;

router.post('/create',function(req,res){
	if(!req.body.name || !req.body.field || !req.body.unique){
		return res.status(409).json({err:"Incomplete Details."});
	}
	Events.findOne({name:req.body.name},function(err,data){
		if(err){
			return res.status(500).json({err:"Something Went Wrong"});
		}
		if(data){
			return res.status(409).json({err:"Event Already Exists."});
		}
		console.log(req.body);
		Events.create({name:req.body.name},function(err,event){
			if(err){
				return res.status(500).json({err:"Someting Went Wrong."});
			}
			event.active=true;
			var obj;
			event.fields_one = [];
			event.fields_two = [];
			req.body.field.forEach(function(flag){
				obj = {};
				obj["name"] = flag[0];
				obj["type"] = flag[1];
				obj["reqr"] = flag[2];
				obj["form"] = flag[3];
				if(flag[3]==1){
					event.fields_one.push(obj);
				}
				else{
					event.fields_two.push(obj);
				}
			});
			event.values_one = {key:null};
			event.values_two = {key:null};
			event.unique = req.body.unique;
			event.checkedIn = [];
			event.save();
			console.log(event);
			return res.status(200).json({msg:"Success."});
		});
	});
});

router.post('/addfield',function(req,res){
	if(!req.body.name || !req.body.field){
		return res.status(409).json({err:"Incomplete Details."});
	}
	Events.findOne({name:req.body.name},function(err,event){
		if(err || !event){
			return res.status(404).json({err:"Event Not Found."});
		}
		var obj;
		if(!event.fields_one.length>0){
			event.fields_one = [];
		}
		if(!event.fields_two.length>0){
			event.fields_two = [];
		}
		if(req.body.field[0].constructor === Array){
			req.body.field.forEach(function(flag){
				obj = {};
				obj["name"] = flag[0];
				obj["type"] = flag[1];
				obj["reqr"] = flag[2];
				obj["form"] = flag[3];
				if(flag[3]==1){
					event.fields_one.push(obj);
				}
				else{
					event.fields_two.push(obj);
				}
			});
		}
		else{
			obj = {};
			obj["name"] = req.body.field[0];
			obj["type"] = req.body.field[1];
			obj["reqr"] = req.body.field[2];
			obj["form"] = req.body.field[3];
			if(req.body.field[3]==1){
				event.fields_one.push(obj);
			}
			else{
				event.fields_two.push(obj);
			}
		}
		event.save();
		console.log(event);
		return res.status(200).json({msg:"Success."});
	});
});

router.post('/delete',function(req,res){
	if(!req.body.name){
		return res.status(409).json({err:"Incomplete Details."});
	}
	Events.findOne({name:req.body.name},function(err,event){
		if(!event){
			return res.status(404).json({err:"No Such Event Found."});
		}
		event.active = false;
		event.save();
		return res.status(200).json({msg:"Event Deleted Successfully."});
	});
});

router.post('/register',function(req,res){
	if(!req.body.name){
		return res.status(409).json({err:"Incomplete Details."});
	}
	Events.findOne({name:req.body.name},function(err,event){
		if(err){
			return res.status(500).json({err:"Something Went Wrong"});
		}
		if(!event){
			return res.status(404).json({err:"No Such Event Found."});
		}
		var obj = {};
		event.fields_one.forEach(function(data){
			obj[data.name] = req.body[data.name];
		});
		console.log(obj);
		var flag = "";
		event.unique.forEach(function(data){
			flag=flag+'_'+(obj[data]);
		});
		var f = event.values_one; 
		if(f[flag]){
			return res.status(200).json({msg:"Already Registered."});
		}
		f[flag] = obj;
		Events.updateOne({name:req.body.name},{$set:{values_one:f}},function(err,data){
			if(err){
				console.log(err);
				return res.status(500).json({err:"Something Went Wrong."});
			}
			return res.status(200).json({msg:"Registered Successfully."});
		});
	});
});

router.post('/check',function(req,res){
	if(!req.body.name){
		return res.status(409).json({err:"Incomplete Details."});
	}
	Events.findOne({name:req.body.name},function(err,event){
		if(err){

		}
		var flag = "";
		var bool = true;
		event.unique.forEach(function(data){
			if(!req.body[data]){
				bool = false;
			}
			flag = flag + '_' + req.body[data];
		});
		if(bool == false){
			return res.status(409).json({err:"Incomplete Details."});
		}
		if(!event.values_one[flag]){
			return res.status(409).json({err:"Not Registered."});
		}
		if(event.checkedIn.indexOf(flag) == -1){
			event.checkedIn.push(flag);
			event.save();
			var obj = {};
			event.fields_two.forEach(function(dummy){
				obj[dummy.name] = req.body[dummy.name];
			});
			var f = event.values_two;
			f[flag] = obj;
			console.log(f);
			Events.updateOne({name:req.body.name},{$set:{values_two:f}},function(err,f){
				if(err){
					console.log(err);
					return res.status(500).json({err:"Something Went Wrong."});
				}
				return res.status(200).json({msg:"Checked In."});
			});
		}
		else{
			return res.status(200).json({msg:"Already Checked In."});
		}
	});
});

module.exports = router;