const mongoose = require('mongoose')
const todoSchema = mongoose.Schema({
	title: {
		type: String,
		required: [true, 'Title is required'],
	},
	description: {
		type: String,
        default: '',
        required: [false, 'Description is optional'],
	},
	category: {
		type: String,
        default: 'General',
        required: [false, 'Category is optional'],
		/* type: mongoose.Schema.Types.ObjectId,
		ref: 'category' */
	},
	image: {
		type: String,
		default: '',
		required: [false, 'Image is optional'],
	},
	done: {
		type: Boolean,
        default: false,
	},
}, { timestamps: true })

module.exports = mongoose.model('Todo', todoSchema, 'todos')
