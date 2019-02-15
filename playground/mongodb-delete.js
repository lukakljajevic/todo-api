// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if (err) return console.log('Unable to connect to MongoDB server');
  console.log('Connected to MongoDB server');

  const db = client.db('TodoApp');

  // deleteMany
  db.collection('Users').deleteMany({name: 'Luka'})
    .then(result => console.log(result));

  // deleteOne
  db.collection('Users').deleteOne({_id: new ObjectID('5c668f3f56312c2f2078bbd2')})
    .then(result => console.log(result));
  
  // findOneAndDelete
  // db.collection('Todos').findOneAndDelete({text: 'Eat lunch'})
  //   .then(result => console.log(result));

  client.close();
});