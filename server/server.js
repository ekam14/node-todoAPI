require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate.js');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());  // app.use i.e we want to use a method of a module of node.js //

app.post('/todos',(req,res) => {   //saving todo to the database //
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

app.patch('/todos/:id',(req,res) => {
  var id = req.params.id;
  var body = _.pick(req.body,['text','completed']);  // will only allow to use the commands given in the brackets //
  if(!ObjectID.isValid(id)){
    return res.status(404).send('Invalid ID');
  }

  if(_.isBoolean(body.completed) && body.completed){
    body.completedAt= new Date().getTime();
  }else{
    body.completed= false;
    body.completedAt= null;
  }

  todo.findByIdAndUpdate(id,{$set: body},{new: true}).then((todo) => {
    if(!todo){
      return res.status(404).send('No todo was found');
    }
    res.status(200).send({todo});    //todo will be used in test.js //
  }).catch((err) => res.status(400).send(err));
});

// POST /users
app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  })
});


app.get('/users/me',authenticate,(req,res) => {
  res.send(req.user);
});

app.listen(port,() => {
  console.log(`App started on port ${port}`);
});

module.exports = {app};
