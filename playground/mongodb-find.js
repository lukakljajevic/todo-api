// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if (err) return console.log('Unable to connect to MongoDB server');
  console.log('Connected to MongoDB server');

  const db = client.db('TodoApp');

  // db.collection('Todos').find({
  //   _id: new ObjectID('5c643d235a2be0298ca475a8')
  // }).toArray()
  //   .then(docs => {
  //     console.log('Todos');
  //     console.log(JSON.stringify(docs, undefined, 2));
  //   }, err => {
  //     console.log('Unable to fetch todos', err);
  //   });

  db.collection('Users').find({location: 'Belgrade, Serbia'}).toArray()
    .then(users => {
      // console.log(users);
      console.log(JSON.stringify(users, undefined, 2));
    }, err => {
      console.log('Unable to fetch todos', err);
    });

  client.close();
});