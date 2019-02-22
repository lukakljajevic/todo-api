const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
require('./config/config');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');


const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.get('/todos', authenticate, (req, res) => {
  Todo.find({_creator: req.user._id}).then(todos => res.send({todos}), e => res.status(400).send(e));
});

app.post('/todos', authenticate, (req, res) => {
  let todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });
  todo.save().then(doc => {
    res.send(doc);
  }, err => {
    res.status(400).send(err);
  });
});

app.get('/todos/:id', authenticate, (req, res) => {
  let id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send({status: 404, message: 'ID is not valid.'});
  }

  Todo.findOne({_id: id, _creator: req.user._id})
    .then(todo => {
      if (!todo) return res.status(404).send({status: 404, message: 'Todo not found.'});
      res.send({todo});
    }).catch(e => console.log(e));
});

app.delete('/todos/:id', authenticate, (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send({status: 404, message: 'ID is not valid.'});
  }

  Todo.findOneAndRemove({_id:id, _creator: req.user._id})
    .then(todo => {
      if (!todo) return res.status(404).send({status: 404, message: 'Todo not found.'});
      res.status(200).send({todo});
    }).catch(e => res.status(404).send());
});

app.patch('/todos/:id', authenticate, (req, res) => {
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

  Todo.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, {new: true})
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

app.post('/users/login', (req, res) => {
  let body = _.pick(req.body, ['email', 'password']);
  User.findByCredentials(body.email, body.password)
    .then(user => {
      return user.generateAuthToken().then(token => {
        res.header('x-auth', token).send(user);
      });
    })
    .catch(e => {
      res.status(400).send();
    })
});

app.get('/users/me', authenticate,(req, res) => {
  res.send(req.user);
});

app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }).catch(() => {
    res.status(400).send();
  });
});

app.listen(port, () => console.log(`Server started on port ${port}.`));
module.exports = {app};