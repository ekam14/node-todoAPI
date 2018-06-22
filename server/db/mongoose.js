const mongoose = require('mongoose');
const {ObjectID} = require('mongodb');

mongoose.Promise = global.Promise;  //telling the mongoose that we will use promises instead of callback functions
mongoose.connect(process.env.MONGODB_URI || 'mongodb://<Ekam>:<Ekam1997>@ds115971.mlab.com:15971/todoapp');  //TodoApp is the database

module.exports = {mongoose};
