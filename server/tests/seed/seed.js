const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {todo} = require('./../../models/todo');
const {User} = require('./../../models/user');


var idOne = new ObjectID();
var idTwo = new ObjectID();

const users = [{
  _id: idOne,
  email: 'ekam123@gmail.com',
  password: 'passone',
  tokens:[{
    access: 'auth',
    token: jwt.sign({_id:idOne,access:'auth'},process.env.JWT_SECRET).toString()
  }]
},{
  _id: idTwo,
  email: 'ekam1234@gmail.com',
  password: 'passtwo',
  tokens:[{
    access: 'auth',
    token: jwt.sign({_id:idTwo,access:'auth'},process.env.JWT_SECRET).toString()
  }]
}];

const todos = [{
  _id: new ObjectID(),
  text: 'First test todo',
  _creator:idOne
}, {
  _id: new ObjectID(),
  text: 'Second test todo',
  completed:true,
  completedAt:333,
  _creator:idTwo
}];

const populateTodo = (done) => {
 todo.remove({}).then(() => {
   return todo.insertMany(todos);
 }).then(() => done());
};


const populateUser = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save();  // we simply add the users into the database we are not generating any token //
    var userTwo = new User(users[1]).save();

    return Promise.all([userOne,userTwo]);
  }).then(() => done());
};

module.exports = {todos,populateTodo,users,populateUser};
