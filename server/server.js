const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose.js');
const {todo} = require('./models/todo.js');
const {user} = require('./models/user.js');

const port = process.env.PORT || 3000;

var app = express();

app.use(bodyParser.json());  // app.use i.e we want to use a method of a module of node.js //

app.post('/todos',(req,res) => {
  var newTodo = new todo({
    text: req.body.text
  });
  newTodo.save().then((doc) => {
    res.send(doc);
  },(err) => {
    res.status(400).send(err);
  });
});

app.get('/todos',(req,res) => {
  todo.find().then((doc) => {
    res.send({doc});  //sending all the todos to the server
  },(err) => {
    res.send(err);
  });
});

app.get('/todos/:id',(req,res) => {           //for getting invidivual todo
  var id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send('Not a valid ID');
  }

  todo.findById(id).then((todo) => {
    if(!todo){
      return res.status(404).send('No todos found');
    }
    res.status(200).send({todo});    //will send the todo object to the server and only this todo can be used later for parsing //
  }).catch((err) => res.status(400).send());
});

app.delete('/todos/:id',(req,res) => {
  var id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send('Not a valid ID');
  }

  todo.findByIdAndRemove(id).then((todo) => {
    if(!todo){
      return res.status(404).send('No todos found');
    }
    res.status(200).send({todo});    //will send the todo object to the server and only this todo can be used later for parsing //
  }).catch((err) => res.status(400).send());
});

app.listen(port,() => {
  console.log(`App started on port ${port}`);
});

module.exports = {app};
