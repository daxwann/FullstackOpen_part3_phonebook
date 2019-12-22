const mongoose = require("mongoose");

// load env in development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

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

module.exports = Person;