const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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
    minlength: 2
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


userSchema.methods.toJSON = function(){
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject,['_id','email']); //wants only id and email to be send to the server
};

userSchema.methods.generateAuthToken = function(){   //methods can only funtion on instances i.e schemas
  var user = this;  //will access the current document //
  var access = 'auth';
  var token = jwt.sign({_id:user._id.toHexString(),access},process.env.JWT_SECRET).toString();  //will generate a token from id and access values//
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
    decode = jwt.verify(token,process.env.JWT_SECRET);
  }catch(e){
    return Promise.reject();
  }

  return User.findOne({
    '_id': decode._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

userSchema.statics.findByCredentials = function(email,password){
  var User = this;

  return User.findOne({email}).then((user) => {   // returning promise to use .then() there in route handler //
    if(!user){
      return Promise.reject();  // wiil go directly to the catch statement //
    }
    return new Promise((resolve,reject) => {  // making a new promise because bcrypt is does not return a promise //
      bcrypt.compare(password,user.password,(err,res) => {
        if(res){
          resolve(user);  // send the user object back //
        }
        else{
          reject();
        }
      });
    });
  });
};

userSchema.methods.removeToken = function(token){
  var user = this;
  return user.update({
    $pull : {
      tokens: {token}
    }
  });
};

userSchema.pre('save',function(next){
  var user = this;
  if(user.isModified('password')){
    bcrypt.genSalt(10,(err,salt) => {
      bcrypt.hash(user.password,salt,(err,hash) => {
        user.password = hash;
        next();
      });
    });
  }else {
    next();
  }
});

var User = mongoose.model('User',userSchema);

module.exports = {User};
