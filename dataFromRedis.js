var async = require('async');
module.exports = {
  getData: function(client,cb){
    var result = {};
    async.parallel([
      function(callback){
        client.get('active_user',function(err,data){
          if(err)
            result.active_user = 0;
          else result.active_user = parseInt(data);
          callback();
        })
      },
      function(callback){
        client.get('views',function(err,data){
          if(err)
            result.views = 0;
          else result.views = parseInt(data);
          callback();
        })
      },
      function(callback){
        client.get('watch_time',function(err,data){
          if(err)
            result.watch_time = 0;
          else result.watch_time = parseInt(data);
          callback();
        })
      },function(callback){
        client.get('shares',function(err,data){
          if(err)
            result.shares = 0;
          else result.shares = parseInt(data);
          callback();
        })
      }
    ],function(err){
      if(err) return cb(err);
      cb(undefined,result);
    });
  }
}
