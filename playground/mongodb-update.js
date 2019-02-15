// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if (err) return console.log('Unable to connect to MongoDB server');
  console.log('Connected to MongoDB server');

  const db = client.db('TodoApp');

  db.collection('Todos').findOneAndUpdate({
    _id: new ObjectID('5c643d235a2be0298ca475a8')
  }, {
    $set: {
      completed: true
    }
  }, {
    returnOriginal: false
  }).then(result => console.log(result));

  client.close();
});