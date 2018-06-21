const {ObjectID} = require('mongodb')

const {mongoose} = require('../server/db/mongoose.js');
const {todo} = require('../server/models/todo.js');
const {user} = require('../server/models/user.js');

const id = new ObjectID('give any id');

todo.remove({}).then((res) => {        //will delete the whole todo collection
  console.log(res);
});

todo.findOneAndRemove({_id:id}).then((res) => {        //will delete the whole todo collection
  console.log(res);
});

todo.findByIdAndRemove({id}).then((res) => {        //will delete the whole todo collection
  console.log(res);
});
