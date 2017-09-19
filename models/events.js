var mongoose = require('mongoose');
var schema = mongoose.Schema;

var flag = new schema({
	name:{
		type:'string'
	},
	active:{
		type:'boolean'
	},
	fields:{
		type:'array',
		defaultsTo:[]
	},
	values:{
		type:'object',
		defaultsTo:{}
	}
});

var events = mongoose.model('events',flag);
module.exports = events;