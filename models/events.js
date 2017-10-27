var mongoose = require('mongoose');
var schema = mongoose.Schema;

var flag = new schema({
	name:{
		type:'string'
	},
	active:{
		type:'boolean'
	},
	fields_one:{
		type:'array',
		defaultsTo:[]
	},
	fields_two:{
		type:'array',
		defaultsTo:[]
	},
	values_one:{
		type:'object',
		defaultsTo:{}
	},
	values_two:{
		type:'object',
		defaultsTo:{}
	},
	checkedIn:{
		type:'array',
		defautlsTo:[]
	},
	unique:{
		type:'array'
	}
});

var events = mongoose.model('events',flag);
module.exports = events;