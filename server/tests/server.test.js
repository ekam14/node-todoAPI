const expect = require('expect');
const request = require('supertest');

const {todo} = require('./../models/todo');
const {app} = require('./../server');

const todos = [{
  text: 'First test todo'
}, {
  text: 'Second test todo'
}];

beforeEach((done) => {
 todo.remove({}).then(() => {
 return todo.insertMany(todos, (error, docs) => {
     if(error){
         return done(error);
     }
 });
 }).then(() => done());
});

describe('POST /todos',() => {
  it('should create a new Todo',(done) => {
    var text = 'Test todo text';
    request(app)
    .post('/todos')
    .send({text})
    .expect(200)
    .expect((res) => {
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
