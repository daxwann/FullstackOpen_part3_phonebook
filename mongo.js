const mongoose = require('mongoose');

if (process.argv.length < 3 || process.argv.length > 4) {
  console.log("usage: node mongo.js password [\"{ name: number [, ...] }\"]");
  process.exit(1);
}

const password = process.argv[2];
let entries = {};

if (process.argv.length === 4) {
  entries = JSON.parse(process.argv[3]);
}

// connect to mongodb
const url = 
  `mongodb+srv://root:${password}@cluster0-a3c1l.mongodb.net/persons?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

// create schema and model
const personSchema = new mongoose.Schema({
  name: String,
  number: String
});

const Person = mongoose.model('Person', personSchema);

// view all persons
if (process.argv.length === 3) {
  Person.find({}).then(result => {
    console.log("phonebook:");
    result.forEach(p => {
      console.log(`${p.name} ${p.number}`);
    })
    mongoose.connection.close();
  }).then(result => {
    process.exit(0);
  })
}

// add persons
const newNames = Object.keys(entries);
let addedMap = {};

for (let n of newNames) {
  if (addedMap[n]) {
    console.log(`${n} has already been added`);
    continue;
  }

  let newPerson = new Person({
    name: n,
    number: entries[n]
  })

  newPerson.save().then(result => {
    console.log(`${n} is saved!`);
    addedMap[n] = true;
    mongoose.connection.close();
  })
}