const express = require('express');
const bodyParser = require('body-parser');
const app = express();

//configure body-parser for express
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//allow express to access html (index.html) file
app.get('/index.html', function(req, res) {
    res.sendFile(__dirname + "/" + "index.html");
});

//route the GET request to the specified path, "/user". 
//This sends the user information to the path  
app.post('/api/instant-values', function(req, res){
    response =  req.body;

    console.log(response);
    
    //convert the response in JSON format
    res.end(JSON.stringify(response));
});

//This piece of code creates the server  
//and listens to the request at port 8888
//we are also generating a message once the 
//server is created
const server = app.listen(3000, function(){
    const host = server.address().address;
    const port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port);
});