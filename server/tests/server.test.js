const expect = require('expect');
const request = require('supertest');

const {todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {app} = require('./../server');
const {ObjectID} = require('mongodb');
const {todos,populateTodo,users,populateUser} = require('./seed/seed.js');

beforeEach(populateTodo);
beforeEach(populateUser);

describe('POST /todos',() => {
  it('should create a new Todo',(done) => {
    var text = 'Test todo text';
    request(app)
    .post('/todos')
    .send({text})
    .expect(200)
    .expect((res) => {  // all data sent to the server //
      expect(res.body.text).toBe(text);
    })
    .end((err,res) => {
      if(err){
        return done(err);
      }
      todo.find({text}).then((todos) => {
        expect(todos.length).toBe(1);
        expect(todos[0].text).toBe(text);
        done();
      }).catch((err) => done(err));
    });
  });

  it('should not accept any invalid data',(done) =>{
    var text = '';
    request(app)
    .post('/todos')
    .send({text})
    .expect(400)
    .end((err,res) => {
      if(err){
        return done(err);
      }
      todo.find().then((todos) => {
        expect(todos.length).toBe(2);
        done();
      }).catch((e) => done(e));
    })
  });

});

describe('GET /todos',() => {
  it('should GET all todos',(done) => {
    request(app)
    .get('/todos')
    .expect(200)
    .expect((res) => {
      expect(res.body.doc.length).toBe(2);
    })
    .end(done);
  });
});

describe('GET /todos/:id',() => {
  it('should return todo doc',(done) => {
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)  //send a request to the id provided//
    .expect(200)  //status code 200 'OK'//
    .expect((res) => {  //return result//
      expect(res.body.todo.text).toBe(todos[0].text);     //will check by parsing the body object of the app's todo array//
    })
    .end(done);
  });

  it('should return 404 for todo not found',(done) => {
    var hexId = new ObjectID().toHexString(); //creating a new ID which will generate no todo//
    request(app)
    .get(`/todos/${hexId}`)
    .expect(404)
    .expect((res) => {
      expect(res.body).toEqual({});   //toEqual is better than toBe when we have to compare the objects //
    })
    .end(done);
  });

  it('should return 400 for invalid ID',(done) => {
    var id = 1223;
    request(app)
    .get(`/todos/${id}`)
    .expect(404)   //can simply write this and get a 404 status code //
    .end(done);
  });

});


describe('DELETE /todos/:id',() => {
  it('should remove a todo',(done) => {
    var hexId = new ObjectID(todos[1]._id).toHexString();
    request(app)
    .delete(`/todos/${hexId}`)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo._id).toBe(hexId);
    })
    .end((err,res) => {
      if(err){
        return done(err);
      }
      todo.findById(hexId).then((todo) => {
        expect(todo).toNotExist();
        done();
      }).catch((e) => done(e));
    })
  });

  it('should return 404 for todo not found',(done) => {
    var hexId = new ObjectID().toHexString(); //creating a new ID which will generate no todo//
    request(app)
    .delete(`/todos/${hexId}`)
    .expect(404)
    .expect((res) => {
      expect(res.body).toEqual({});   //toEqual is better than toBe when we have to compare the objects //
    })
    .end(done);
  });

  it('should return 400 for invalid ID',(done) => {
    var id = 1223;
    request(app)
    .delete(`/todos/${id}`)
    .expect(404)   //can simply write this and get a 404 status code //
    .end(done);
  });
});


describe('PATCH /todos/:id',() => {
  it('should update the todo',(done) =>{
    var id = todos[0]._id.toHexString();
    var text = 'First update of the todo';
    var completed = true;
    request(app)
    .patch(`/todos/${id}`)
    .send({text,completed})
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(text);
      expect(res.body.todo.completed).toBe(true);
      expect(res.body.todo.completedAt).toBeA('number');
    }).end(done);
  });

  it('should clear completedAt if todo is not completed',(done) => {
    var id = todos[1]._id.toHexString();
    var text = 'Second update of the todo';
    var completed = false;
    request(app)
    .patch(`/todos/${id}`)
    .send({text,completed})
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(text);
      expect(res.body.todo.completed).toBe(false);
      expect(res.body.todo.completedAt).toNotExist();
    }).end(done);
  });
});

describe('GET /users/me',() =>{
  it('should return user if authenticated',(done) => {
    request(app)
    .get('/users/me')
    .set('x-auth',users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body._id).toBe(users[0]._id.toHexString());
      expect(res.body.email).toBe(users[0].email);
    })
    .end(done);
  });

  it('should return 401 if not authenticated',(done) => {
    request(app)
    .get('/users/me')
    .expect(401)
    .expect((res) => {
      expect(res.body).toEqual({});
    })
    .end(done);
  });
});


describe('POST /users',() => {
  it('should create a new user',(done) =>{
    var email = 'ekamsingh@gmail.com';
    var password = '123abc';
    request(app)
    .post('/users')
    .send({email,password})
    .expect(200)
    .expect((res) => {
      expect(res.header['x-auth']).toExist();
      expect(res.body._id).toExist();
      expect(res.body.email).toBe(email);
    }).end((err) => {
      if(err){
        return done(err);
      }
      User.find({email}).then((user) => {
        expect(user).toExist();
        expect(user.password).toNotBe(password);  // hashed pass not equal to given password //
        done();
      });
    })
  });

  it('should return validation errors if request invalid',(done) =>{
    var email = 'w121312';
    var password = '132';
    request(app)
    .post('/users')
    .send({email,password})
    .expect(400)
    .end(done);
  });

  it('should not create if user is already in use',(done) => {
    var email = 'ekam123@gmail.com';
    var password = '123abc';
    request(app)
    .post('/users')
    .send({email,password})
    .expect(400)
    .end((err) => {
      if(err){
        return done(err);
      }
      User.find({email}).then((user) => {
        expect(user.length).toBe(1);
        done();
      });
    });
  });
});


describe('POST /users/login',() => {
  it('should login user and return auth token',(done) =>{
    request(app)
    .post('/users/login')
    .send({
      email:users[1].email,
      password:users[1].password
    })
    .expect(200)
    .expect((res) => {
      expect(res.headers['x-auth']).toExist();
    }).end((err,res) => {
      if(err){
        done(err);
      }
      User.findById(users[1]._id).then((user) => {
        expect(user.tokens[0]).toInclude({
          access: 'auth',
          token: res.headers['x-auth']
        });
        done();
      }).catch((e) => done(e));
    });
  });

  it('should not accept invalid login',(done) =>{
    request(app)
    .post('/users/login')
    .send({
      email:users[1].email+1,
      password:users[1].password+1
    })
    .expect(400)
    .expect((res) => {
      expect(res.headers['x-auth']).toNotExist();
    }).end((err,res) => {
      if(err){
        return done(err);
      }
      User.findById(users[1]._id).then((user) => {
        expect(user.tokens.length).toBe(0);
        done();
      }).catch((e) => done(e));
    });
  });

});


describe('DELETE /users/me/token',() => {
  it('should remove auth token on logout',(done) => {
    request(app)
    .delete('/users/me/token')
    .set('x-auth',users[0].tokens[0].token)
    .expect(200)
    .end((err,res) => {
      if(err){
        return done(err);
      }
      User.findById(users[0]._id).then((user) => {
        expect(user.tokens.length).toBe(0);
        done();
      }).catch((e) => done(e));
    });
  });
});
