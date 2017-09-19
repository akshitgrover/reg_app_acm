var mongoose = require('mongoose');
var schema = mongoose.Schema;

var flag = new schema({
	username:{
		type:'string'
	},
	password:{
		type:'string'
	},
	expiredtoken:{
		type:'array',
	}
});

var user = mongoose.model('user',flag);
module.exports = user;