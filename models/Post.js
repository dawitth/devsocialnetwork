const mognoose = require('mongoose')
const Schema = mongoose.Schema

const PostSchema = new SChema({
	user: {
		type: Schema.Types.objectId,
		ref:'user'
	},
	text: {
		type: String,
		required: true,
	},
	name : {
		type: String,
	},
	avatar:{
		type: String,
	},
	likes:[
		{
			user: {
				type: Schema.Types.objectId,
				ref:'user'
			}
		}
	],
	comments: [
		{
			user: {
				type: Schema.Types.objectId,
				ref:'user'
			},
			text: {
				type: String,
				required: true,
			},
			name: {
				type: String,
				
			},

			avatar: {
				type: String,
				
			},
			date: {
				type: Date,
				default: Date.now 
			}
		}
	],
	date: {
			type: Date,
			default: Date.now 
		}

})


module.exports = Post = mongoose.model('post', PostSchema)