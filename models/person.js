const mongoose = require('mongoose');

// config
mongoose.set('useFindAndModify', false);

// load env in development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// MongoDB connect
let url = process.env.DB_URL || 'mongodb://db:27017/persons';

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [3, 'Name has to be at least 3 characters'],
    required: 'Name is required'
  },
  number: {
    type: String,
    required: 'Number is required',
    match: [/^(\D?\d){8,}$/, 'Number has to be at least 8 digits']
  }
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const Person = mongoose.model('Person', personSchema);

module.exports = Person;