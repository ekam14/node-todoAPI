require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');  //to get the value from post method//
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');   //connection to the database //
var {todo} = require('./models/todo');
var {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate.js');

var app = express();   //express init//
const port = process.env.PORT;

app.use(bodyParser.json());  // app.use i.e we want to use a method of a module of node.js tells bodyParser to parse only JSON data//

// POST /todos //
app.post('/todos',(req,res) => {   //saving todo to the database //
  var newTodo = new todo({
    text: req.body.text   // sets text equal to the body.text given in body //
  });
  newTodo.save().then((doc) => {  //saves the new Todo to the database //
    res.send(doc);
  },(err) => {
    res.status(400).send(err);   // status(400) is for bad request //
  });
});


// GET /todos //
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

  if(_.isBoolean(body.completed) && body.completed){  // of completed is true then set the completedAt //
    body.completedAt= new Date().getTime();
  }else{
    body.completed= false;
    body.completedAt= null;
  }

  todo.findByIdAndUpdate(id,{$set: body},{new: true}).then((todo) => {  // use the update validators //
    if(!todo){
      return res.status(404).send('No todo was found');
    }
    res.status(200).send({todo});    //todo will be used in test.js //
  }).catch((err) => res.status(400).send(err));
});

// POST /users
app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);  // will be a object containing only email and password properties //
  // console.log(body);
  var user = new User(body);  // will be full but only body properties will be filled //
  user.save().then(() => {
    return user.generateAuthToken();   // generates a new token using jwt.sign() //
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  })
});

// GET /users //
app.get('/users',(req,res) => {
  User.find().then((user) => {
    res.send(user);
  })
});

app.get('/users/me',authenticate,(req,res) => {
  res.send(req.user);
});

//POST /users/login
app.post('/users/login',(req,res) => {
  var body = _.pick(req.body,['email','password']);

  // Model statics for fetching data of the corresponding user //
  User.findByCredentials(body.email,body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth',token).send(user);
    });
  }).catch((err) => {
    res.status(400).send();
  });
});


app.listen(port,() => {
  console.log(`App started on port ${port}`);
});

module.exports = {app};
