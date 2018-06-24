var env = process.env.NODE_ENV || 'development';         //by default heroku is in production mode //
console.log('*******env*********:',env);

if(env === 'development'){
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';   //if we are in development mode use the TodoApp
}else if(env === 'test'){
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';  ////if we are in development mode use the TodoAppTest
}
