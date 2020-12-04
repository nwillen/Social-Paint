require("./database");
const getTime = require('./utils/time')

var express = require('express');
const { dirname } = require('path');
var app = express();
var serv = require('http').Server(app);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client/index.html');
})

app.use('/client', express.static(__dirname + '/client'));

serv.listen(process.env.PORT || 2000);
console.log("Server Started at localhost:2000");

var SOCKET_LIST = {};


var io = require('socket.io')(serv, {})
io.sockets.on('connection', (socket) => {

    // Handle the signing in of the user
    socket.on('signIn', (data) => {
        Database.correctPass(data, (res) => {
            if (res) {
                socket.emit('signInRes', true)
            } else {
                socket.emit('signInRes', false)
            }
        })
    })
    socket.on('signUp', (data) => {
        Database.takenUser(data, (res) => {
            if (res) {
                socket.emit('signUpRes', false)
            } else {
                Database.addUser(data, () => {
                    socket.emit('signUpRes', true);
                });
            }
        })  
    })
    socket.on('rmvAct', (data) => {
        Database.deleteUser(data, (res) => {
            socket.emit('rmvActRes', res)
        });
    })

    //Handle creating a post
    socket.on('saveImg', (data) => {
        Database.takenImgName(data, (res) => {
            if (res) {
                socket.emit('saveImgRes', false)
            } else {
                Database.addImg(data, () => {
                    socket.emit('saveImgRes', true)
                })
            }
        })
    }) 

    //Getting the Image names and sending them back to client
    socket.on('getImgNames', (username) => {
        Database.getImagesByName(username, (res) => {
            socket.emit('sendImgNames', res)
        })
    })

    //Adding posts to the backend data = {username, imgName}
    socket.on('createPost', (data) => {
        Database.getImgURI(data, (res) => {
            if (res) {
                Database.addPost({username:data.username, img:res, time:getTime()}, () => {
                    //emit success
                })
            } else{
                //emit failure
            }   
        })
    })

    //Recieving client request for posts and sending back the post
    socket.on('getPosts', function() {
        Database.getPosts((res) => {
            socket.emit('sendPosts', res)
        })
    })
})