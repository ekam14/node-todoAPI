var env = process.env.NODE_ENV || 'development';         //by default heroku is in production mode //
console.log('*******env*********:',env);

if(env === 'development' || env === 'test')
{
  var config = require('./config.json');  // will automatically parse the json //
  envConfig = config[env];
  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
  });
}
