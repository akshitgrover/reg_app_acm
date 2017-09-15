var mongoose = require('mongoose');
var schema = mongoose.Schema;

var flag = new schema({
	username:{
		type:'string'
	},
	password:{
		type:'string'
	}
});

var user = mongoose.model('user',flag);
module.exports = user;