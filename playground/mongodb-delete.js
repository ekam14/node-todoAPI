//const MongoClient = require('mongodb').MongoClient;
const {MongoClient,ObjectID} = require('mongodb');

// Object Destructuring
// var users = {name:'Ekam',age:20};
// var {name} = users;
// console.log(name);

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,client) => {             //TodoApp is the database
  if(err){
    return console.log('Unable to connect to the MongoDB');
  }
  console.log('Connected to the MongoDB');
  const db = client.db('TodoApp');  //connects to the database

  //deleteMany : deletes all the documents found
  db.collection('users').deleteMany({name:'Ekam'}).then((result) => {
    console.log(result);
  });

  //deleteOne : deletes the first document
  db.collection('users').deleteOne({age:25}).then((result) => {
    console.log(result);
  });

  //findOneAndDelete : first finds the one then deletes that document , will also return the deleted document back
  db.collection('users').findOneAndDelete({_id:new ObjectID("5b295229508ab45870ad1983")}).then((result) => {
    console.log(result);
  });

  //client.close();
});
