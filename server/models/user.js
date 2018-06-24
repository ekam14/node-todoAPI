const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var userSchema = new mongoose.Schema({
  email:{
    type: String,
    required: true,
    trim: true,
    minlength:1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password:{
    type: String,
    required: true,
    minlength: 6
  },
  tokens:[{
    access:{
      type: String,
      required: true
    },
    token:{
      type: String,
      required: true
    }
  }]
});

//It's automatically called when we respond to the express request with res.send. That converts our object to a string by calling JSON.stringify. JSON.stringify is what calls toJSON.

userSchema.methods.toJSON = function(){
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject,['_id','email']); //wants only id and email to be send to the server
};

userSchema.methods.generateAuthToken = function(){   //methods can only funtion on instances i.e schemas
  var user = this;  //will access the current document //
  var access = 'auth';
  var token = jwt.sign({_id:user._id.toHexString(),access},'123abc').toString();  //will generate a token from id and access values//
  //user.tokens = user.tokens.concat([{access,token}]);  //add this into tokens array//
  user.tokens.push({access,token});

  return user.save().then(() => {   //return the promise //
    return token;   //returns the token value//
  });
};

userSchema.statics.findByToken = function(token){
  var User = this;
  var decode;

  try{
    decode = jwt.verify(token,'123abc');
  }catch(e){
    return Promise.reject();
  }

  return User.findOne({
    '_id': decode._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

var User = mongoose.model('User',userSchema);

module.exports = {User};
