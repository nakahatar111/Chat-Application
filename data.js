
const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

/*
  leave chat
    add message when leave chat - center message and sender = -1
    just delete row user from that chat_id thing
    add row to database - removed                       -add database
  think about implementing time
    if(msg length > 0)
      last time = get last msg - msg.time
      current msg time
      if difference greater than 1 hour
        send admin message to chat with -1 and say the time
    else (very first time)
      say the time when sending message

  add delivered message
    use message add and have isPending thing,
    add 'delivered' at the bottom of last message

  notification                                           -add database
    when msg sent, add 1 to inboxes.notification
    in method, when message.get, inboxes.notification = 0;
    when message is opened, user.notification for chat_id = 0;
    if console
      implement number to side (should be easy)

  last message and time display
    when getMessage, set props.last_msg and props.last_time
    display with gray
  add route for login
*/
const app = express();
//localhost 192.168.1.156
//global 71.105.80.238
const connection = mysql.createConnection({
  host:'localhost',
  user: 'root',
  password: '1234',
  database: 'messenger'
});

connection.connect(err => {
  if(err){
    console.log(err);
    return err;
  }
});

app.use(cors());

app.get('/', (req, res) => {
  res.send('go to /message to see messages or go to /users to see users')
});

app.get('/users',(req, res)=>{
  const SELECT_ALL_USER_QUERY = 'SELECT * FROM users';
  connection.query(SELECT_ALL_USER_QUERY, (err, results)=>{
    if(err){
      return res.send(err)
    }
    else{
      return res.json({
        data: results
      })
    }
  });
});

app.get('/users/get-name',(req, res)=>{
  const {id} = req.query;
  const SELECT_USER_ID_QUERY = `SELECT users.name FROM users WHERE id = '${id}'`;
  connection.query(SELECT_USER_ID_QUERY, (err, results)=>{
    if(err){
      return res.send(err)
    }
    else{
      return res.json({
        data: results[0].name
      })
    }
  })
})

app.get('/users/get-all',(req, res)=>{
  const SELECT_ALL_USER_QUERY = `SELECT id,name FROM users`;
  connection.query(SELECT_ALL_USER_QUERY, (err, results)=>{
    if(err){
      return res.send(err)
    }
    else{
      return res.json({
        data: results
      })
    }
  })
})

app.get('/users/add', (req, res) => {
  const {id, name, email, password} = req.query;
  const INSERT_USERS_QUERY = `INSERT INTO users (id, name, email, password) VALUES(${id},'${name}','${email}','${password}')`;
  connection.query(INSERT_USERS_QUERY, (err, results)=>{
    if(err){
      return res.send(err)
    }
    else{
      return res.send('successfully added users')
    }
  })
});

app.get('/message', (req, res) =>{
  const SELECT_ALL_MESSAGE_QUERY = 'SELECT * FROM chat';
  connection.query(SELECT_ALL_MESSAGE_QUERY, (err, results)=>{
    if(err){
      return res.send(err)
    }
    else{
      return res.json({
        data: results
      })
    }
  }); 
});

app.get('/message/get', (req, res) =>{
  const {chat_id} = req.query;
  const SELECT_CHAT_ID_MESSAGE_QUERY = `SELECT * FROM chat WHERE chat_id = '${chat_id}'`
  connection.query(SELECT_CHAT_ID_MESSAGE_QUERY, (err, results)=>{
    if(err){
      return res.send(err)
    }
    else{
      return res.json({
        data: results
      })
    }
  }); 
});

app.get('/message/add', (req, res) => {
  const {id, sender, msg, chat_id} = req.query;
  const INSERT_MESSAGE_QUERY = `INSERT INTO chat (id, sender, msg, chat_id) VALUES(${id},${sender},'${msg}','${chat_id}')`;
  connection.query(INSERT_MESSAGE_QUERY, (err, results)=>{
    if(err){
      return res.send(err)
    }
    else{
      return res.send('successfully added message')
    }
  })
});

app.get('/chat/create',(req, res) =>{
  const {chat_id,time} = req.query;
  let request = ''
  chat_id.split('_').forEach(user =>{
    request += `(0,${user},'${chat_id}','${time}'),`;
  });
  const INSERT_CHAT_QUERY = `INSERT INTO inboxes (id, user, chat_id, time) VALUES ${request.substring(0,request.length-1)}`;
  connection.query(INSERT_CHAT_QUERY, (err, results)=>{
    if(err){
      return res.send(err)
    }
    else{
      return res.send('successfully added chat')
    }
  })
});


app.get('/inbox', (req, res) =>{
  const SELECT_ALL_INBOX_QUERY = 'SELECT * FROM inboxes';
  connection.query(SELECT_ALL_INBOX_QUERY, (err, results)=>{
    if(err){
      return res.send(err)
    }
    else{
      return res.json({
        data: results
      })
    }
  }); 
});

app.get('/inbox/get-chats',(req, res)=>{
  const {user} = req.query;
  const SELECT_CHAT_ID_QUERY = `SELECT * FROM inboxes WHERE user = ${user}`;
  connection.query(SELECT_CHAT_ID_QUERY, (err, results)=>{
    if(err){
      return res.send(err)
    }
    else{
      return res.json({
        data: results
      })
    }
  })
})

app.get('/time_stamp', (req, res)=>{
  const{chat_id, time} = req.query;
  const UPDATE_TIME_QUERY = `UPDATE inboxes SET time ='${time}' WHERE chat_id = '${chat_id}'`;
  connection.query(UPDATE_TIME_QUERY, (err, results)=>{
    if(err){
      return res.send(err)
    }
    else{
      return res.send('successfully updated time')
    }
  })
})

//UPDATE inboxes SET notification = notification + 1 WHERE chat_id = '1_2_3';

/*
app.listen(4000, ()=> {
  console.log('message server listening on port 4000')
});
*/
const port = process.env.PORT || 4000;
const env = process.env.NODE_ENV || 'production';
app.listen(port, err => {
  if (err) {
    return console.error(err);
  }
  console.info(`Server running on http://localhost:${port} [${env}]`);
});