const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose.js');
const {todo} = require('./models/todo.js');
const {user} = require('./models/user.js');

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

app.listen(3000,() => {
  console.log('App started on port 3000');
});

module.exports = {app};
