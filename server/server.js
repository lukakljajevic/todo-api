const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
require('./config/config');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');


const app = express();
const port = process.env.PORT;

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

app.patch('/todos/:id', (req, res) => {
  let id = req.params.id;
  let body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send({status: 404, message: 'ID is not valid.'});
  }

  if (_.isBoolean(body.completed) && body.completed) {
  // if (body.completed === true)
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true})
    .then(todo => {
      if (!todo) return res.status(404).send();
      res.status(200).send({todo});
    })
    .catch(err => res.status(400).send(err));


});

app.post('/users', (req, res) => {
  let body = _.pick(req.body, ['email', 'password']);

  let user = new User(body);
  user.save()
    .then(() => {
      return user.generateAuthToken();
    })
    .then(token => {
      res.header('x-auth', token).send(user);
    })
    .catch(e => {
      res.status(400).send(e);
    });
});

app.listen(port, () => console.log(`Server started on port ${port}.`));
module.exports = {app};