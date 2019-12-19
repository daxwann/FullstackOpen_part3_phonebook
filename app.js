const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const morgan = require('morgan')
const cors = require('cors')

// load env in development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// morgan config
morgan.token('body', req => {
  if (req.method === "POST") {
    return JSON.stringify(req.body)
  }
})

// use middlewares
app.use(bodyParser.json())
app.use(cors())
app.use(morgan(':method :url :status :response-time :body'))
app.use(express.static('build'))

// MongoDB connect
let url = process.env.DB_URL || "mongodb://db:27017/persons";

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Person = mongoose.model('Person', personSchema);

// routes
app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons.map(p => p.toJSON()));
  })
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(person => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).send('Not Found');
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(person => person.id === id);

  if (person) {
    persons = persons.filter(person => person.id !== id);
    res.status(204).send(`${person.name} has been deleted`);
  } else {
    res.status(404).send('Not Found');
  }
})

app.post('/api/persons', (req, res) => {
  const newPerson = req.body;

  if (!newPerson.name) {
    return res.status(400).json({
      error: 'name missing'
    })
  }

  if (!newPerson.number) {
    return res.status(400).json({
      error: 'number missing'
    })
  }

  if (persons.find(person => person.name === newPerson.name)) {
    return res.status(400).json({
      error: 'person already exists'
    })
  }

  const maxId = persons.length > 0
    ? Math.max(...persons.map(p => p.id)) : 0;

  newPerson.id = maxId + 1;

  persons = persons.concat(newPerson)

  res.json(newPerson)
})

app.get('/info', (req, res) => {
  const time = new Date();
  res.send(`<p>Phonebook has info for ${persons.length} people</p>\n<p>${time}</p>`)
})

// middleware for catching requests made to non-existent routes. Use after routes.

const notFound = (req, res) => {
  res.status(404).json({error: 'unknown endpoint'})
}

app.use(notFound)

// app entrypoint

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})