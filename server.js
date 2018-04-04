// init project
const express = require('express');
const app = express();
const https = require('https');
const request = require('request');

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// Static Search page
app.get("/", (request, response) => {
  response.sendFile(__dirname + '/views/index.html')
});

// Static API page
app.get("/api", (request, response) => {
  response.sendFile(__dirname + '/views/api.html');
});

/// API ///
var recentQueries = [];

// Returns 60 Galleries with images in them
var fetchGallery = (query, callback) => {
  if(!query || !query.titles) {
    return;
  }
  if(!query.offset || query.offset < 0) {
    query.offset = 0;
  }
  callback = callback || function(){};
  
  var options = {
    url: 'https://api.imgur.com/3/gallery/search/top/year/' + query.offset + '?q=' + query.titles,
    headers: {
      "Authorization": "Client-ID " + process.env.CLIENT_ID
    }
  }
  
  request(options, function (error, res, body) {
    callback(error, res, body);
  });
}

// Returns image data in JSON. Ex: {src:"url", page:"url", alt:"title"}
app.get("/api/search", (req, response) => {
  // Request Defaults: {titles="REQUIRED", offset=0, count=10}
  console.log(req.query);
  
  // Fetch a list of galleries from imgur
  fetchGallery({titles: req.query.titles}, (err, res, result) => {
    result = JSON.parse(result);
    if(err || (!res && res.statusCode) || !result || !result.data) {
      response.status(500).json({error:"Server error. Please try again."});
      return;
    }
    
    recentQueries.push({titles: req.query.titles, offset: req.query.offset, count: req.query.count||10});
    var data = result.data;
    var images = [];
    var count = 0; 
    var offset = parseInt(req.query.offset) || 0;
    var imagesPerPage = req.query.count > 0?req.query.count < 50?req.query.count:50:10;
    var endCount = 10 * (offset + 1);
    
    // For each Gallery...
    for(let i = 0; i < data.length; i++) {
      // For each image in each Gallery...
      for(let k = 0; k < data[i].images_count && count < endCount; k++) {
        if(data[i].images[k] && !/gif|mp4/.test(data[i].images[k].type)) {
          if(count >= offset * imagesPerPage) {
            images.push({src: data[i].images[k].link, page: data[i].link, alt: data[i].title || data[i].description || "image"});
          }
          count++;
        }
      }
    }
    
    // No images? --> offset too high
    if (images.length === 0) {
      response.status(400).json({error: "No images past image #" + count});
    } else {
      response.status(200).json({images: images});
    }
  }); 

});

// Returns a list of recent queries
app.get("/api/search/recent", (req, res) => {
  res.status(200).json({recent_queries:recentQueries});
});

/// END API ///

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`)
});
