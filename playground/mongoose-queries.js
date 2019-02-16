const {ObjectID} = require('mongodb');
const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');
const {User} = require('../server/models/user');

// let id = '5c67eda22a46031448962a5e';
let id = '5c67d266f941381f2cec6aaf';

if (!ObjectID.isValid(id)) {
  return console.log('ID not valid.');
}

// Todo.find({
//   _id: id
// }).then(todos => {
//   console.log('Todos', todos);
// });

// Todo.findOne({
//   _id: id
// }).then(todo => {
//   console.log('Todo', todo);
// });

// Todo.findById(id).then(todo => {
//   if (!todo) {
//     return console.log('ID not found.');
//   }
//   console.log('Todo by id', todo);
// }).catch(e => console.log(e));

User.findById(id).then(user => {
  if (!user) return console.log('ID not found.');
  console.log('User:', user);
}).catch(e => console.log(e));