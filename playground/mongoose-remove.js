const {ObjectID} = require('mongodb');

const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');
const {User} = require('../server/models/user');

// Todo.remove({}).then(res => console.log(res));

// Todo.findOneAndRemove
Todo.findByIdAndRemove('5c6c320f2a4876e8439162e9').then(todo => console.log(todo));
// Todo.