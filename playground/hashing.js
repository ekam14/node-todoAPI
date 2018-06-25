const {SHA256} = require('crypto-js');  //SHA256 used for creating the hash value //
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


            // Bcryptjs //
// var pass = '123abc';
// bcrypt.genSalt(10,(err,salt) => {   // 10 is for time waste//
//   bcrypt.hash(pass,salt,(err,hash) =>{
//     console.log(hash);
//   });
// });
//
// var hashedPass = '$2a$10$2iTvuAfeUZcWr/vazYxdhejbbXxf9GEPYgOzn2RRTnmAAPA0.MJYe';
//
// bcrypt.compare(pass,hashedPass,(err,res) => {
//   console.log(res);  //true on same and false on different
// });


              // JWT //
// var data = {
//   id:123
// };
// var token = jwt.sign(data,'123abc');  //123abc is the salt here for the hash//
// var decoded = jwt.verify(token,'123abc');
// console.log(`Token:${token}`);
// console.log('Decoded value:',decoded);

// var message = 'I am number 3';
// var hash = SHA256(message).toString();  //will return now a string //
// console.log(`Message:${message}`);
// console.log(`Hash value:${hash}`);

// var data = {
//   id:4
// };
//
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'salting').toString()
// }
//
// var resultHash = SHA256(JSON.stringify(token.data) + 'salting').toString();
//
// if(resultHash === token.hash){
//   console.log('Data was not changed');
// }else {
//   console.log('Data was changed.Do not trust');
// }
