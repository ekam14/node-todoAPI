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

  // db.collection('Todos').find().toArray().then((docs) => {
  //   console.log('Todos collection');
  //   console.log(JSON.stringify(docs,undefined,2));
  // },(err) =>{
  //   console.log(`Unable to fetch the data ${err}`);
  // });

  // db.collection('users').find({_id:new ObjectID("5b29468c2037cc16c4e31c12")}).toArray().then((docs) => {
  //   console.log('users collection');
  //   console.log(JSON.stringify(docs,undefined,2));
  // },(err) =>{
  //   console.log(`Unable to fetch the data ${err}`);
  // });
  //
  // db.collection('users').find({name:'Ekam'}).count().then((count) => {
  //   console.log(`users count:${count}`);
  // },(err) =>{
  // });
  //   console.log(`Unable to fetch the data ${err}`);

  //client.close();
});
