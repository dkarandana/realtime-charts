const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const spreadsheet = require('./spreadsheet_api');
var port = process.env.PORT || 3000;
//configure body-parser for express

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//allow express to access html (index.html) file
app.get('/', function(req, res) {
    res.sendFile(__dirname + "/" + "index.html");
});

//route the GET request to the specified path, "/api". 

app.post('/api/instant-values', function(req, res){
    response =  req.body;

    let jsonValues = JSON.stringify(response);
    //convert the response in JSON format
    
    let arrValues = [ 
        new Date(), //Time
        response.voltage,
        response.current,
        response.watt,
        response.fuel_volume
    ];

    spreadsheet.addInstantRow( arrValues );
    
    res.end(jsonValues);
});

//This piece of code creates the server  
//and listens to the request at port 3000
//we are also generating a message once the 
//server is created

const server = app.listen(port, function(){
    const host = server.address().address;
    const port = server.address().port;
    console.log("Chart app listening at http://%s:%s", host, port);
});

// console.log( spreadsheet.listInstants() );