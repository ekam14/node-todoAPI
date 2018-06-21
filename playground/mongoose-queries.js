const {ObjectID} = require('mongodb')

const {mongoose} = require('../server/db/mongoose.js');
const {todo} = require('../server/models/todo.js');
const {user} = require('../server/models/user.js');

var id = '5b2b49827c9c411eec8b650b';

if(!ObjectID.isValid(id)){
  console.log('Id is not valid');
}

todo.find().then((todos) => {
  console.log('Todos:',todos);
});

todo.findOne().then((todo) => {
  console.log('Todo:',todo);
});

todo.findById(id).then((todo) => {
  if(!todo){
    return console.log('Unable to find any todo');
  }
  console.log('Todo by ID:',todo);
}).catch((e) => console.log(e));


user.find().then((users) => {
  console.log('Users:',users);
});
