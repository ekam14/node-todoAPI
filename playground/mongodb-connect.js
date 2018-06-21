//const MongoClient = require('mongodb').MongoClient;
const {MongoClient} = require('mongodb');

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

  // db.collection('Todos').insertOne({  //inserts one document in the collection Todos
  //   text: 'Something to do',
  //   completed: false
  // },(err,result) => {
  //   if(err){
  //     return console.log('Unable to insert the data ',err);
  //   }
  //   // console.log(result.ops);    //result.ops contains the data inserted
  //   console.log(JSON.stringify(result.ops,undefined,2));
  // });

  // db.collection('users').insertOne({
  //   name: 'Ekam',
  //   age: 20,
  //   location: 'Indirapuram'
  // },(err,result) => {
  //   if(err){
  //     return console.log('Unable to insert the data ',err);
  //   }
  //   console.log(JSON.stringify(result.ops,undefined,2));
  // });

  client.close();
});
