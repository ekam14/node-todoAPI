var env = process.env.NODE_ENV || 'development';         //by default heroku is in production mode //
console.log('*******env*********:',env);

if(env === 'development' || env === 'test')
{
  var config = require('./config.json');  // will automatically parse the json into object//
  envConfig = config[env];  // will get the apt property //
  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key]; //each value in the object //
  });
}
else if(env === 'production')
{
  process.env.MONGODB_URI = "mongodb://<Ekam>:<EKam1997>@ds117701.mlab.com:17701/node-todo-api-database";
}
