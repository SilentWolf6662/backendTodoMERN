const express = require('express')
const router = express.Router()

// ---- MODEL
// -------------------------------------------------------
const Todo = require('../models/todo.model')

// ---- FORM DATA with multer to support multipart/form-data with file uploads
// -------------------------------------------------------
const multer = require('multer')

const upload = multer({
	storage: multer.diskStorage({
		destination: (request, file, callback) => {
			callback(null, './public/images')
		},
		filename: (request, file, callback) => {
			callback(null, `${Date.now()}-${file.originalname}`)
		},
		fileFilter: (request, file, callback) => {
			if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/gif' || file.mimetype === 'image/svg' || file.mimetype === 'image/webp') {
				callback(null, true)
			} else {
				callback(new Error('File type not supported'), false)
			}
		},
		limits: {files: 1, fileTypes: ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/svg', 'image/webp']}
	})
})

// ---- FORM DATA with express-form-data to support multipart/form-data without files
// -------------------------------------------------------
/* const formData = require('express-form-data')
router.use(formData.parse()) */

// ---- GET all todos
// -------------------------------------------------------
router.get('/', async (request, response) => {
	try {
		const markedDone = request.query.done || null
		const category = request.query.category || null
		console.log(
			`GET request to /todos with query: done = ${
				markedDone || 'null'
			} and category = ${category || 'null'}`
		)

		// No query
		if (markedDone === null && category === null) {
			let todos = await Todo.find()
			if (!todos)
				return response.status(404).json({
					message: 'ERROR: Todos not found',
					todos: null
				})

			return response.status(200).json({
				message: 'Get all todos',
				todos: todos
			})
		}

		// Marked query
		if (category === null && markedDone !== null) {
			let markedTodos = await Todo.find()
				.where('done')
				.equals(markedDone === 'true' ? true : false)
			if (!markedTodos)
				return response.status(404).json({
					message: `ERROR: Todos marked ${
						markedDone === 'true' ? 'Completed' : 'Uncompleted'
					} not found`,
					todos: null
				})

			return response.status(200).json({
				message: `Get all todos marked ${
					markedDone === 'true' ? 'Completed' : 'Uncompleted'
				}`,
				todos: markedTodos
			})
		}

		// Marked and categoried query
		// Category query
		if (markedDone === null && category !== null) {
			let categoriedTodos = await Todo.find()
				.where('category')
				.equals(category)
			if (!categoriedTodos)
				return response.status(404).json({
					message: `ERROR: Todos in category ${category} not found`,
					todos: null
				})

			return response.status(200).json({
				message: `Get all todos in category ${category}`,
				todos: categoriedTodos
			})
		}

		if (markedDone !== null && category !== null) {
			let markedNCategoriedTodos = await Todo.find()
				.where('done')
				.equals(markedDone === 'true' ? true : false)
				.where('category')
				.equals(category)
			if (!markedNCategoriedTodos.length)
				return response.status(404).json({
					message: `ERROR: Todos marked ${
						markedDone === 'true' ? 'Completed' : 'Uncompleted'
					} and in category ${category} not found`,
					todos: null
				})

			return response.status(200).json({
				message: `Get all todos marked ${
					markedDone === 'true' ? 'Completed' : 'Uncompleted'
				} and in category ${category}`,
				todos: markedNCategoriedTodos
			})
		}
	} catch (error) {
		return response
			.status(404)
			.json({ message: `ERROR: ${error.message}`, todos: null })
	}
})

// ---- GET todo by id
// -------------------------------------------------------
router.get('/:id', async (request, response) => {
	try {
		const todoID = request.params.id
		let todo = await Todo.findById(todoID)
		response
			.status(200)
			.json({ message: `Get todo with id: ${todoID}`, todo: todo })
	} catch (error) {
		return response
			.status(400)
			.json({ message: `ERROR: ${error.message}`, todo: null })
	}
})

// ---- POST
// -------------------------------------------------------
router.post('/', upload.single('image' || 'images'), async (request, response) => {
	console.log('POST request to /todos')
	try {
		if (multer.MulterError === 'UNEXPECTED_FILE' || multer.MulterError === 'LIMIT_FILE_SIZE') {
			return response.status(400).json({
				message: 'ERROR: Image file is expected or file size is too large',
				created: null
			})
		}
		let todo = new Todo(request.body)
		todo.image = request.file || ''
		await todo.save()
		response.status(201).json({ message: `Created todo`, created: todo })
	} catch (error) {
		return response
			.status(400)
			.json({ message: `ERROR: ${error.message}`, created: null })
	}
})

// ---- PUT
// -------------------------------------------------------
router.put('/:id', upload.single('image'), async (request, response) => {
	try {
		let todoID = request.params.id
		let todo = await Todo.findByIdAndUpdate(todoID, request.body, {
			new: true
		})

		if (todo === null) {
			return response.status(404).json({
				message: `ERROR: Todo with id: ${todoID} not found`,
				updated: null
			})
		}

		response.status(200).json({
			message: `Updated todo with id: ${todoID}`,
			updated: request.body
		})
	} catch (error) {
		return response
			.status(404)
			.json({ message: `ERROR: ${error.message}`, updated: null })
	}
})

// ---- DELETE
// -------------------------------------------------------
router.delete('/:id', async (request, response) => {
	try {
		let todoID = request.params.id
		let todo = await Todo.findByIdAndDelete(todoID)
		response.status(200).json({ message: `Deleted todo`, deleted: todo })
		if (todo === null) {
			return response.status(404).json({
				message: `ERROR: Todo with id: ${todoID} not found`,
				deleted: null
			})
		}
	} catch (error) {
		return response
			.status(404)
			.json({ message: `ERROR: ${error.message}`, deleted: null })
	}
})

module.exports = router
