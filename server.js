const express =require('express');
const app =express();
const mongoose =require('mongoose');
const User = require("./models/User"); 
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const checkToken = require('./auth/checkToken')
const session=require('express-session');
var nodemailer = require('nodemailer');

const port = process.env.PORT || 3000;
//Mongoose Connection
const URL = "mongodb://localhost:27017/Registration";
mongoose.connect(URL);

//bodyParser
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
  
);

//Session
app.use(session({
  secret:"1234567",
  cookie: {maxAge:1000*60*8}
}))

app.get('/',(request,response)=>{
    res.send("Hello");
})
app.get("/token",checkToken, (request, response) => {
  response.send("Token Verify");
});


app.post('/register',(request,response)=>{
var newUser = new User({
    name: request.body.name,
    email: request.body.email,
    password: request.body.password,
    address: request.body.address
})
// Send the email
var transporter = nodemailer.createTransport({ service: 'gmail', auth: { user:'testing141024@gmail.com', pass: 'Qwerty@12345' } });
var mailOptions = { from: 'testing@gmail.com', to: request.body.email, text:"Successfully Register" };
transporter.sendMail(mailOptions, function (err,info) {
    if (err) {
      console.log(err);
    }
    else{
      console.log('Email sent: ' + info.response);
    }
    response.send('email sent' + " " +  'to' + " " +  request.body.to) ;
});
bcrypt.genSalt(10, (err,salt)=>{
bcrypt.hash(newUser.password,salt,(err,hash)=>{
      if (err) throw err
        newUser.password = hash;
        //Save function return promises
newUser.save().then(data=>{
    response.json(data)
})
})
})
})
app.get('/checklogin',(request,response)=>{
  User.findOne({email:request.body.email,password:request.body.password},function (err, result) {
    jwt.sign({ User }, 'privatekey', { expiresIn: '24h' }, (err, token) => {
      if (err) { console.log(err) }
      response.json({ msg: "Logged Token success", token, User, sendStatus: 200 });
    });
    // console.log(result)
        if(result!==null)
        bcrypt.compare('password',result.password,function(err,res){
        if (err)
          response.json({description:err})
          else if(result==null)
          response.json({msg:'Login Fail'})
          else
          response.json({msg:'Login Success'})
        })
      });
      });
  
      app.get('/logout',(request,response)=>{
        request.session.destroy();
        User.find((err, result)=>{
            if(err) throw err;
            else
            {
                response.json({msg:'User Logout'})
            }    
        });
    });
    
app.listen(port,console.log("Server Started"));