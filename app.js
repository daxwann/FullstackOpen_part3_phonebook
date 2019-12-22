const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

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

// routes
app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    return res.json(persons.map(p => p.toJSON()));
  })
})

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  Person.findById(id).then(person => {
		return res.json(person.toJSON());
	});
})

app.put('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  Person.findByIdAndUpdate(id, { number: req.body.number }, { new: true }).then(person => {
    return res.json(person.toJSON());
  })
})

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  Person.findByIdAndRemove(id).then(person => {
		return res.status(204).json(person.toJSON());
	});
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

  Person.find({ name: newPerson.name }).then(result => {
		if (result.length > 0) {
			return res.status(400).json({
      	error: 'person already exists'
    	})
		} else {
			Person.create(newPerson).then(person => {
				return res.status(201).json(person.toJSON());
			})
		}
	});
});

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