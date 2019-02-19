let express = require('express');
let bodyParser = require('body-parser');
let {ObjectID} = require('mongodb');

let {mongoose} = require('./db/mongoose');
let {Todo} = require('./models/todo');
let {User} = require('./models/user');

let app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/todos', (req, res) => {
  Todo.find({}).then(todos => res.send({todos}), e => res.status(400).send(e));
});

app.post('/todos', (req, res) => {
  console.log(req.body);
  let todo = new Todo({
    text: req.body.text
  });
  todo.save().then(doc => {
    res.send(doc);
  }, err => {
    res.status(400).send(err);
  });
});

app.get('/todos/:id', (req, res) => {
  let id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send({status: 404, message: 'ID is not valid.'});
  }

  Todo.findById(req.params.id)
    .then(todo => {
      if (!todo) return res.status(404).send({status: 404, message: 'Todo not found.'});
      res.send({todo});
    }).catch(e => console.log(e));
});

app.delete('/todos/:id', (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send({status: 404, message: 'ID is not valid.'});
  }

  Todo.findByIdAndRemove(id)
    .then(todo => {
      if (!todo) return res.status(404).send({status: 404, message: 'Todo not found.'});
      res.status(200).send({todo});
    }).catch(e => res.status(404).send());
});

app.listen(port, () => console.log(`Server started on port ${port}.`));
module.exports = {app};