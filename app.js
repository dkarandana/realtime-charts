const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const spreadsheet = require('./spreadsheet_api');

//configure body-parser for express
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//allow express to access html (index.html) file
app.get('/', function(req, res) {
    res.sendFile(__dirname + "/" + "index.html");
});

//route the GET request to the specified path, "/user". 
//This sends the user information to the path  
app.post('/api/instant-values', function(req, res){
    response =  req.body;

    let jsonValues = JSON.stringify(response);
    let arrValues = [ new Date(),response.voltage,response.current,response.fuel_volume];

//voltage	current	fuel_volume
    spreadsheet.addInstantRow( arrValues );
   
    //convert the response in JSON format
    res.end(jsonValues);
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

//console.log( spreadsheet.listInstants() );
console.log( spreadsheet.addInstantRow() );
//console.log( spreadsheet.addInstantRow );