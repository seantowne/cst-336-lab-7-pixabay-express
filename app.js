var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var fs = require('fs');
var request = require('request');



// set the template engine to ejs
app.set('view engine', 'ejs');

// Tells node to look in public/ for styles
app.use(express.static("public"));

// makes data that comes to the server from the client a json object
app.use(bodyParser.urlencoded({extended: true}));

// route to base domain
app.get("/", async function(req, res){
    res.render("home.ejs", {"data": await handleSearch("otter", "vertical") });
});

/*
// route to base domain
app.get("/home", async function(req, res){
    res.render("home.ejs");
});
*/

app.post("/home", async function(req, res){
    console.log(req.body.searchTerm); 
    console.log(req.body.orientation);
    //var data = await handleSearch(req.body.searchTerm, req.body.orientation);
    //console.log(data.img1.url);
    res.render("home.ejs", {"data": await handleSearch(req.body.searchTerm, req.body.orientation)} );
});


function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function handleSearch(searchTerm, orientation){
    var url = "https://pixabay.com/api/?";
    url += "key=15450334-54c089ab058c7a8209a75c73b";
    //searchTerm = searchTerm.replace(/ /g, '+');
    url += "&q=" + searchTerm;
    url += "&orientation=" + orientation;
    url += "&image_type=photo";
    url += "&per_page=200";
    
    return new Promise( function(resolve, reject){
        request(url, function(error, response, body){
            if ( !error && response.statusCode == 200 ){
                let parsedData = JSON.parse(body);
                
                var picCount = parsedData.hits.length;
                
                resolve({
                    img1: {
                        url: parsedData.hits[getRandomInt(picCount-1)].largeImageURL,
                        likes: parsedData.hits[getRandomInt(picCount-1)].likes
                    },
                    img2: {
                        url: parsedData.hits[getRandomInt(picCount-1)].largeImageURL,
                        likes: parsedData.hits[getRandomInt(picCount-1)].likes
                    },
                    img3: {
                        url: parsedData.hits[getRandomInt(picCount-1)].largeImageURL,
                        likes: parsedData.hits[getRandomInt(picCount-1)].likes
                    },
                    img4: {
                        url: parsedData.hits[getRandomInt(picCount-1)].largeImageURL,
                        likes: parsedData.hits[getRandomInt(picCount-1)].likes
                    }
                });
            } 
            else{
                reject(error);
                console.log(response.statusCode);
                console.log(error);
            }
        });
    });
}

// anything that hasn't matched a defined route is caught here
app.get("/*", function(req, res){
    res.render("error.ejs");
});

// listens for http requests
// port 3000 is for C9, port 8080 is for Heroku
app.listen(process.env.PORT || 3000 || 8080, function(){
    console.log("Server is running");
});
