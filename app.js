const express = require('express')
const app = express()

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

app.get('/info', (req, res) => {
  const time = new Date();
  res.send(`<p>Phonebook has info for ${persons.length} people</p>\n<p>${time}</p>`)
})

const PORT = 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})