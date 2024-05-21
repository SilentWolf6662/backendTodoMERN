require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()

// ----- APP
// -------------------------------------------------------
app.use(cors({ origin: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use('/images', express.static('images'));

// ----- DATABASE
// -------------------------------------------------------
const mongoose = require('mongoose')
mongoose.connect(`${process.env.DB_URL}${process.env.DB_NAME}`)

const db = mongoose.connection
db.on('error', error => {
	console.log('----> Database Error:')
	console.error(error)
})

db.once('open', () => {
	console.log('----> Connected to Database')
})

db.on('disconnected', () => {
	console.log('----> Disconnected from Database')
})

db.on('reconnected', () => {
	console.log('----> Reconnected to Database')
})

db.on('reconnectFailed', () => {
	console.log('----> Reconnect to Database Failed')
})

db.on('timeout', () => {
	console.log('----> Database Connection Timeout')
})

db.on('parseError', () => {
	console.log('----> Database Parse Error')
})

db.on('close', () => {
	console.log('----> Connection to Database Closed')
})

// ----- MIDDLEWARE
// -------------------------------------------------------
app.use((request, response, next) => {
	console.log(`----> ${request.method} request to ${request.originalUrl}`)
	next()
})

// ----- GET server ENDPOINT: http://localhost/5000
// -------------------------------------------------------
app.get('/', async (request, response) => {
	console.log('GET request to server endpoint')
	response.status(200).json({
		message: 'Welcome to server endpoint'
	})
})

// ----- ROUTES
// -------------------------------------------------------
app.use('/todos', require('./routes/todo.routes'))

// ----- 404 - Page not found
// -------------------------------------------------------
app.get('*', (request, response) => {
	response.status(404).json({
		message: '404 - Page not found'
	})
})

app.listen(process.env.PORT, () => {
	console.log(`----> Server Started up at port: ${process.env.PORT}`)
})
