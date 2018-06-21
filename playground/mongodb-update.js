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

  db.collection('users').findOneAndUpdate({
    _id:new ObjectID('5b295217508ab45870ad197f')
  },{  //update operators
    $inc:{age:1},   //incrementing by the value
    $set:{name:'Ekam'}
  },{
    returnOriginal : false
  }).then((result) => {
    console.log(result);
  });

  //client.close();
});
