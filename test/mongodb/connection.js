const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27018/testdb');
mongoose.connection.once('open', function(){
    console.log('Connection has been made.');
}).on('error', function(error){
    console.log('connection error: ', error);
});