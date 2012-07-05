
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , config = require('./config')
  , http = require('http')
  , mongoose = require('mongoose');

  var db_uri = process.env.MONGOLAB_URI || process.env.MONGODB_URI || config.default_db_uri;
  
  var db = mongoose.connect(db_uri, function(err) {
    if (err) throw err;
  });

  var Schema = mongoose.Schema;

var User = new Schema({
  name: String,
  title: String
});
var userModel = mongoose.model('User', User);


var user = new userModel();
 
user.name = 'Shilya';
user.title = 'Senior Developer';
user.save(function(err) {
  if (err) throw err;
  console.log('User saved, starting server...');
}); 


var app = express();


app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {layout:true});
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', function(req, res){
 res.contentType('application/json'); 
 console.log('Version: ' + process.version);
 
    userModel.findOne({'name': 'Shilya'}, function(err, user) {
      if (user != null) {
        console.log('Found the User:' + user.username);
        res.send(JSON.stringify(user));
      }
    });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
