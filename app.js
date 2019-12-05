const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

let persons = [
    {
      name: "Liam Gallagher",
      number: "54-21-9297364",
      id: 11
    },
    {
      name: "Keanu Reeves",
      number: "23-45-8920932",
      id: 12
    },
    {
      name: "Arto Hellas",
      number: "040-123446",
      id: 1
    },
    {
      name: "Ada Lovelace",
      number: "39-44-3948572",
      id: 2
    }
  ]

// morgan config
morgan.token('body', req => {
  if (req.method === "POST") {
    return JSON.stringify(req.body)
  }
})

app.use(bodyParser.json())
app.use(cors())
app.use(morgan(':method :url :status :response-time :body'))

app.get('/api/persons', (req, res) => {
  res.json(persons)
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

const PORT = 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})