const express = require('express')
const router = express.Router()

// ---- MODEL
// -------------------------------------------------------
const Categories = require('../models/category.model')

// ---- FORM DATA
// -------------------------------------------------------
const formData = require('express-form-data')
router.use(formData.parse())

// ---- GET all categories
// -------------------------------------------------------
router.get('/', async (request, response) => {
	try {
		console.log(`GET request to /categories`)

		// No query
		let todos = await Categories.find()
		if (!todos)
			return response.status(404).json({
				message: 'ERROR: Todos not found',
				todos: null
			})

		return response.status(200).json({
			message: 'Get all todos',
			todos: todos
		})
	} catch (error) {
		return response
			.status(404)
			.json({ message: `ERROR: ${error.message}`, todos: null })
	}
})

// ---- GET category by id
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
router.post('/', async (request, response) => {
	console.log('POST request to /todos')
	try {
		let todo = new Todo(request.body)
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
router.put('/:id', async (request, response) => {
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
