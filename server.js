var express = require('express'),
    path = require('path'),
    http = require('http'),
    io = require('socket.io'),
    redis = require('redis'),
    async = require('async');
var dataFromRedis = require('./dataFromRedis');


var app = express();

//Server config
app.set('port', process.env.PORT || 3000); /* 'default', 'short', 'tiny', 'dev' */
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine','ejs');
app.set('views','views');

//Redis connection
var client = redis.createClient();
client.on('connect',function(){
  console.log('Redis is connected');
});


//route page dashboard
app.get('/',function(req,res){
  var active_user;
  dataFromRedis.getData(client,function(err,data){
    res.render('index',data);
  })
});


//server listening
var server = http.createServer(app);
server.listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});


//socket io
io = io.listen(server);
io.on('connection',function(socket){
  console.log('Socket is connected!!');
  dataFromRedis.getData(client,function(err,data_random){
    //loop
    (function loop() {
      setTimeout(function () {
        //random active_user
        data_random.active_user += Math.round(Math.random()*10+1);
        //client.set('active_user',data_random.active_user);
        data_random.views += Math.round(Math.random()*10+1);
        //client.set('views',data_random.views);
        data_random.watch_time += Math.round(Math.random()*10+1);
        //client.set('watch_time',data_random.watch_time);
        data_random.shares += Math.round(Math.random()*10+1);
        //client.set('shares',data_random.shares);


        socket.emit('loadData',data_random);
        loop();

      }, 2000);
    }());
    // end loop
    (function loopchart() {
      setTimeout(function () {
        dataFromRedis.getData(client,function(err,data){
          socket.emit('loadChart',data);
          loopchart();
        })
      }, 5000);
    }());

  });



});
